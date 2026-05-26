import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  staticFile,
  Img,
  Video,
} from "remotion";

export const MEDIA_ITEMS: {
  src: string;
  type: "image" | "video";
  durationInFrames: number;
}[] = [
  { src: staticFile("photo1.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("photo2.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("photo3.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("clip1.mp4"), type: "video", durationInFrames: 150 },
];

const SHUTTER_FRAME_OFFSET = 20;

export const TOTAL_FRAMES = MEDIA_ITEMS.reduce(
  (acc, m) => acc + m.durationInFrames,
  0
);

function getStartFrames() {
  const starts: number[] = [];
  let cursor = 0;
  for (const item of MEDIA_ITEMS) {
    starts.push(cursor);
    cursor += item.durationInFrames;
  }
  return starts;
}

const ShutterFlash: React.FC<{ triggerFrame: number }> = ({ triggerFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - triggerFrame;
  if (localFrame < 0 || localFrame > 20) return null;
  const opacity = interpolate(localFrame, [0, 3, 20], [0, 0.95, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: "white",
        opacity,
        zIndex: 100,
        pointerEvents: "none",
      }}
    />
  );
};

const Thumbnail: React.FC<{
  item: (typeof MEDIA_ITEMS)[0];
  capturedAtFrame: number;
  index: number;
}> = ({ item, capturedAtFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - capturedAtFrame;
  const slideIn = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
    from: 80,
    to: 0,
  });
  const opacity = interpolate(localFrame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  if (localFrame < 0) return null;
  return (
    <div
      style={{
        width: 90,
        height: 68,
        borderRadius: 6,
        overflow: "hidden",
        border: "2px solid rgba(255,255,255,0.25)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.6)",
        flexShrink: 0,
        transform: `translateY(${slideIn}px)`,
        opacity,
        background: "#111",
      }}
    >
      <Img
        src={item.src}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};

const MainView: React.FC<{
  item: (typeof MEDIA_ITEMS)[0];
  startFrame: number;
}> = ({ item, startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  const fadeIn = interpolate(localFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        opacity: fadeIn,
        position: "relative",
        borderRadius: 4,
        overflow: "hidden",
        background: "#000",
      }}
    >
      {item.type === "image" ? (
        <Img
          src={item.src}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <Video
          src={item.src}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          startFrom={0}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.45) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

const PhotoBoothChrome: React.FC = () => (
  <>
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 44,
        background: "linear-gradient(180deg, #4a4a4a 0%, #2e2e2e 100%)",
        borderBottom: "1px solid #1a1a1a",
        display: "flex",
        alignItems: "center",
        paddingLeft: 16,
        gap: 8,
        zIndex: 10,
      }}
    >
      {["#ff5f57", "#febc2e", "#28c840"].map((color) => (
        <div
          key={color}
          style={{
            width: 13,
            height: 13,
            borderRadius: "50%",
            background: color,
            boxShadow: "0 0 0 0.5px rgba(0,0,0,0.3)",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.75)",
          fontSize: 13,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
          fontWeight: 500,
        }}
      >
        Photo Booth
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 56,
        background: "linear-gradient(180deg, #2a2a2a 0%, #1e1e1e 100%)",
        borderTop: "1px solid #111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, #e53935, #9b0000)",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
          border: "2px solid rgba(255,255,255,0.1)",
        }}
      />
    </div>
  </>
);

export const PhotoBoothSlideshow: React.FC = () => {
  const frame = useCurrentFrame();
  const starts = getStartFrames();
  const capturedItems = MEDIA_ITEMS.map((item, i) => {
    const shutterFrame =
      starts[i] + MEDIA_ITEMS[i].durationInFrames - SHUTTER_FRAME_OFFSET;
    return { item, index: i, shutterFrame, captured: frame >= shutterFrame };
  });

  return (
    <AbsoluteFill
      style={{
        background: "#1c1c1e",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 40,
          background: "#1e1e1e",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <PhotoBoothChrome />
        <div
          style={{
            position: "absolute",
            top: 44,
            left: 0,
            right: 0,
            bottom: 56,
            background: "#111",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flex: 1, padding: 12, position: "relative" }}>
            {MEDIA_ITEMS.map((item, i) => (
              <Sequence
                key={i}
                from={starts[i]}
                durationInFrames={MEDIA_ITEMS[i].durationInFrames}
              >
                <MainView item={item} startFrame={starts[i]} />
              </Sequence>
            ))}
          </div>
          <div
            style={{
              height: 100,
              background: "rgba(0,0,0,0.6)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              paddingLeft: 12,
              paddingRight: 12,
              overflowX: "hidden",
            }}
          >
            {capturedItems.map(({ item, index, shutterFrame }) => (
              <Thumbnail
                key={index}
                item={item}
                capturedAtFrame={shutterFrame}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
      {capturedItems.map(({ shutterFrame, index }) => (
        <ShutterFlash key={index} triggerFrame={shutterFrame} />
      ))}
    </AbsoluteFill>
  );
};
