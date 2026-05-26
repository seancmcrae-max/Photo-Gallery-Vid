import React from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  Video,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// ── Configure your media here ──────────────────────────────────────────────
// Drop files into /public and list them below.
export const MEDIA_ITEMS: Array<{
  src: string;
  type: 'image' | 'video';
  durationInFrames: number; // 90 = 3 s at 30 fps
}> = [
  {src: staticFile('photo1.jpg'), type: 'image', durationInFrames: 120},
  {src: staticFile('photo2.jpg'), type: 'image', durationInFrames: 120},
  {src: staticFile('photo3.jpg'), type: 'image', durationInFrames: 120},
  {src: staticFile('photo4.jpg'), type: 'image', durationInFrames: 120},
];

// Frames before the end of each slot when the shutter fires
export const SHUTTER_FRAME_OFFSET = 10;

// ── Layout constants ───────────────────────────────────────────────────────
const FILMSTRIP_H = 130;
const THUMB_W = 100;
const THUMB_H = 75;
const THUMB_GAP = 10;
const THUMB_PADDING = 20;

// ── Precompute slot timing ─────────────────────────────────────────────────
type Slot = {startFrame: number; endFrame: number; shutterFrame: number};

export const SLOTS: Slot[] = MEDIA_ITEMS.reduce<Slot[]>((acc, item, i) => {
  const start = i === 0 ? 0 : acc[i - 1].endFrame;
  acc.push({
    startFrame: start,
    endFrame: start + item.durationInFrames,
    shutterFrame: start + item.durationInFrames - SHUTTER_FRAME_OFFSET,
  });
  return acc;
}, []);

export const TOTAL_DURATION =
  SLOTS.length > 0 ? SLOTS[SLOTS.length - 1].endFrame : 150;

// ── Shutter flash ──────────────────────────────────────────────────────────
// Used inside a <Sequence> so frame=0 maps to the moment the shutter fires.
const ShutterFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 2, 22], [1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <AbsoluteFill style={{backgroundColor: 'white', opacity}} />;
};

// ── Countdown overlay ──────────────────────────────────────────────────────
// Used inside a <Sequence> so frame is relative to slot start.
const CountdownOverlay: React.FC<{durationInFrames: number}> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const shutterRel = durationInFrames - SHUTTER_FRAME_OFFSET;

  const steps = [
    {label: '3', start: shutterRel - 90, end: shutterRel - 60},
    {label: '2', start: shutterRel - 60, end: shutterRel - 30},
    {label: '1', start: shutterRel - 30, end: shutterRel},
  ];

  for (const {label, start, end} of steps) {
    if (start < 0 || frame < start || frame >= end) continue;

    const rel = frame - start;
    const dur = end - start;
    const opacity = interpolate(rel, [0, 4, dur - 4, dur], [0, 1, 1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const scale = interpolate(rel, [0, dur * 0.3, dur], [1.4, 1, 0.85], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    return (
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontSize: 140,
            fontWeight: 700,
            color: 'white',
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
            textShadow:
              '0 0 60px rgba(0,0,0,0.9), 0 2px 12px rgba(0,0,0,0.8)',
            opacity,
            transform: `scale(${scale})`,
            userSelect: 'none',
          }}
        >
          {label}
        </div>
      </AbsoluteFill>
    );
  }

  return null;
};

// ── Filmstrip thumbnail ────────────────────────────────────────────────────
// Rendered at the root level so it can animate across the main-view/filmstrip
// boundary. Uses absolute frame coordinates.
const FilmstripThumb: React.FC<{
  item: (typeof MEDIA_ITEMS)[0];
  index: number;
  shutterFrame: number;
}> = ({item, index, shutterFrame}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const relFrame = frame - shutterFrame;
  if (relFrame < 0) return null;

  const mainH = height - FILMSTRIP_H;

  const finalX = THUMB_PADDING + index * (THUMB_W + THUMB_GAP);
  const finalY = mainH + (FILMSTRIP_H - THUMB_H) / 2;
  const startX = (width - THUMB_W) / 2;
  const startY = (mainH - THUMB_H) / 2;

  const progress = spring({
    frame: relFrame,
    fps,
    config: {damping: 22, stiffness: 130, mass: 0.5},
  });

  const x = interpolate(progress, [0, 1], [startX, finalX]);
  const y = interpolate(progress, [0, 1], [startY, finalY]);
  const scale = interpolate(progress, [0, 0.5, 1], [1.4, 1.05, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: THUMB_W,
        height: THUMB_H,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        borderRadius: 4,
        overflow: 'hidden',
        border: '2px solid rgba(255,255,255,0.4)',
        boxShadow: '0 3px 16px rgba(0,0,0,0.8)',
      }}
    >
      {item.type === 'image' ? (
        <Img
          src={item.src}
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      ) : (
        <Video
          src={item.src}
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
          startFrom={0}
          endAt={1}
        />
      )}
    </div>
  );
};

// ── Main composition ───────────────────────────────────────────────────────
export const PhotoBooth: React.FC = () => {
  const {height} = useVideoConfig();
  const mainH = height - FILMSTRIP_H;

  return (
    <AbsoluteFill style={{backgroundColor: '#1c1c1e'}}>
      {/* ── Main camera view ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: mainH,
          backgroundColor: '#000',
          overflow: 'hidden',
        }}
      >
        {/* Media slots */}
        {MEDIA_ITEMS.map((item, i) => (
          <Sequence
            key={i}
            from={SLOTS[i].startFrame}
            durationInFrames={item.durationInFrames}
          >
            <AbsoluteFill>
              {item.type === 'image' ? (
                <Img
                  src={item.src}
                  style={{width: '100%', height: '100%', objectFit: 'cover'}}
                />
              ) : (
                <Video
                  src={item.src}
                  style={{width: '100%', height: '100%', objectFit: 'cover'}}
                />
              )}
              <CountdownOverlay durationInFrames={item.durationInFrames} />
            </AbsoluteFill>
          </Sequence>
        ))}

        {/* Shutter flash per slot */}
        {SLOTS.map((slot, i) => (
          <Sequence key={i} from={slot.shutterFrame} durationInFrames={25}>
            <ShutterFlash />
          </Sequence>
        ))}

        {/* Vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ── Filmstrip bar ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: FILMSTRIP_H,
          background: 'linear-gradient(180deg, #2c2c2e 0%, #111 100%)',
          borderTop: '1px solid #3a3a3c',
        }}
      >
        {/* Ghost placeholder boxes */}
        {MEDIA_ITEMS.map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: THUMB_PADDING + i * (THUMB_W + THUMB_GAP),
              top: (FILMSTRIP_H - THUMB_H) / 2,
              width: THUMB_W,
              height: THUMB_H,
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(255,255,255,0.03)',
            }}
          />
        ))}
      </div>

      {/* ── Thumbnails (animated over the whole frame) ── */}
      {MEDIA_ITEMS.map((item, i) => (
        <FilmstripThumb
          key={i}
          item={item}
          index={i}
          shutterFrame={SLOTS[i].shutterFrame}
        />
      ))}
    </AbsoluteFill>
  );
};
