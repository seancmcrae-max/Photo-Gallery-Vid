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

// ─────────────────────────────────────────────────────────────────────────────
// MEDIA ITEMS
// Order: [ive 26th videos] → [film scans] → [Throwbizzy party clips+photos]
//        → [prom/OLDIES photos] → [mami bday dance]
//
// Video durationInFrames are estimates at 30fps. Run `ffprobe -v error
// -show_entries format=duration <file>` to get exact durations and multiply
// by 30 to get the correct frame count.
// ─────────────────────────────────────────────────────────────────────────────

type MediaItem = {
  src: string;
  type: "image" | "video";
  durationInFrames: number;
};

export const MEDIA_ITEMS: MediaItem[] = [
  // ── Opening: Ive 26th birthday videos ──────────────────────────────────────
  { src: staticFile("ive 26 bday.MPG"),  type: "video", durationInFrames: 1800 }, // ~60s
  { src: staticFile("Ive 26th pt2.MPG"), type: "video", durationInFrames:  450 }, // ~15s

  // ── Film scans from the party (sorted by roll / frame number) ──────────────
  { src: staticFile("2524mcrae001120-R1-041-19.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("2524mcrae001120-R1-045-21.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("2524mcrae001120-R1-047-22.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("2524mcrae001120-R1-049-23.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("2524mcrae001120-R1-051-24.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("2524mcrae001120-R1-053-25.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("5038mcrae009894-R1-045-21.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("5038mcrae009894-R1-047-22.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("5038mcrae009894-R1-049-23.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("5038mcrae009894-R1-051-24.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("5038mcrae009894-R1-053-25.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("2223mcrae001088-R1-026-11A.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("2223mcrae001088-R1-030-13A.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("2223mcrae001088-R1-032-14A.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("2223mcrae001088-R1-034-15A.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("2223mcrae001088-R1-036-16A.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("2223mcrae001088-R1-038-17A.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("2223mcrae001088-R1-050-23A.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("2223mcrae001088-R1-052-24A.jpg"), type: "image", durationInFrames: 90 },

  // ── Throwbizzy (party photos + clips, newest → oldest) ────────────────────
  { src: staticFile("IMG_3260.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3259.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3258.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3256.m4v"), type: "video", durationInFrames: 450 }, // ~15s
  { src: staticFile("IMG_3253.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3235.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3234.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3233.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3232.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3231.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3230.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3220.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3219.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3218.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3208.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3200.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3197.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3196.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3195.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3193.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3190.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3165.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3164.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3163.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3162.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3161.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3160.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3159.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3157.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3156.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3152.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3151.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3150.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3149.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3148.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3147.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3144.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3143.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3094.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3081.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3080.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3079.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3078.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3077.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3076.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3075.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3074.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3073.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3072.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3071.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3064.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3052.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3048.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3014.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_3013.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2953.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2952.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2951.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2950.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2949.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2947.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2946.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2945.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2944.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2937.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2935.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2934.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2912.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2910.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2909.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2908.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2907.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2906.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2905.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2895.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2890.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2861.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2859.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2808.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2807.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2806.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2804.m4v"), type: "video", durationInFrames: 450 }, // ~15s
  { src: staticFile("IMG_2731.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2686.m4v"), type: "video", durationInFrames: 600 }, // ~20s
  { src: staticFile("IMG_2642.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2641.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2632.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("IMG_2629.jpg"), type: "image", durationInFrames: 90 },
  // ↑ Add any remaining Throwbizzy images (IMG_26xx and below) here ↑

  // ── OLDIES: prom photos ────────────────────────────────────────────────────
  { src: staticFile("prom 4.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("prom 5.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("prom 6.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("prom 7.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("prom 8.jpg"), type: "image", durationInFrames: 90 },
  { src: staticFile("prom 9.jpg"), type: "image", durationInFrames: 90 },

  // ── Closing ────────────────────────────────────────────────────────────────
  { src: staticFile("mami bday dance.m4v"), type: "video", durationInFrames: 600 }, // ~20s
];

const SHUTTER_FRAME_OFFSET = 20;

export const TOTAL_FRAMES = MEDIA_ITEMS.reduce(
  (acc, m) => acc + m.durationInFrames,
  0
);

function getStartFrames(): number[] {
  const starts: number[] = [];
  let cursor = 0;
  for (const item of MEDIA_ITEMS) {
    starts.push(cursor);
    cursor += item.durationInFrames;
  }
  return starts;
}

// ─────────────────────────────────────────────────────────────────────────────
// Shutter flash overlay
// ─────────────────────────────────────────────────────────────────────────────
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
      style={{ background: "white", opacity, zIndex: 100, pointerEvents: "none" }}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Thumbnail (slide-in from bottom, shows image preview)
// The strip only renders the most recent THUMBNAIL_COUNT captures so it
// doesn't overflow with 100+ items.
// ─────────────────────────────────────────────────────────────────────────────
const THUMBNAIL_COUNT = 6;

const Thumbnail: React.FC<{
  item: MediaItem;
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

  // Videos show a plain coloured tile instead of a frame grab
  const isVideo = item.type === "video";

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
        position: "relative",
      }}
    >
      {isVideo ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: "10px solid transparent",
              borderBottom: "10px solid transparent",
              borderLeft: "16px solid rgba(255,255,255,0.6)",
              marginLeft: 4,
            }}
          />
        </div>
      ) : (
        <Img
          src={item.src}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main viewfinder area
// ─────────────────────────────────────────────────────────────────────────────
const MainView: React.FC<{ item: MediaItem; startFrame: number }> = ({
  item,
  startFrame,
}) => {
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
          volume={1}
        />
      )}
      {/* Vignette */}
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

// ─────────────────────────────────────────────────────────────────────────────
// macOS Photo Booth chrome (title bar + bottom bar with shutter button)
// ─────────────────────────────────────────────────────────────────────────────
const PhotoBoothChrome: React.FC = () => (
  <>
    {/* Title bar */}
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

    {/* Bottom toolbar */}
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
      {/* Red shutter button */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, #e53935, #9b0000)",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
          border: "2px solid rgba(255,255,255,0.1)",
        }}
      />
    </div>
  </>
);

// ─────────────────────────────────────────────────────────────────────────────
// Root composition
// ─────────────────────────────────────────────────────────────────────────────
export const PhotoBoothSlideshow: React.FC = () => {
  const frame = useCurrentFrame();
  const starts = getStartFrames();

  const capturedItems = MEDIA_ITEMS.map((item, i) => {
    const shutterFrame =
      starts[i] + MEDIA_ITEMS[i].durationInFrames - SHUTTER_FRAME_OFFSET;
    return { item, index: i, shutterFrame, captured: frame >= shutterFrame };
  });

  // Only show the most recent THUMBNAIL_COUNT captures in the strip
  const visibleThumbnails = capturedItems
    .filter(({ captured }) => captured)
    .slice(-THUMBNAIL_COUNT);

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
          {/* Viewfinder */}
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

          {/* Thumbnail strip — last THUMBNAIL_COUNT captured items */}
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
              overflow: "hidden",
            }}
          >
            {visibleThumbnails.map(({ item, index, shutterFrame }) => (
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

      {/* Shutter flashes */}
      {capturedItems.map(({ shutterFrame, index }) => (
        <ShutterFlash key={index} triggerFrame={shutterFrame} />
      ))}
    </AbsoluteFill>
  );
};
