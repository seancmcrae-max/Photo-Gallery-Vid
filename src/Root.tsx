import { Composition } from "remotion";
import { PhotoBoothSlideshow, TOTAL_FRAMES } from "./PhotoBooth";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PhotoBoothSlideshow"
        component={PhotoBoothSlideshow}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
