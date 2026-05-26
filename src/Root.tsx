import React from 'react';
import {Composition} from 'remotion';
import {PhotoBooth, TOTAL_DURATION} from './PhotoBooth';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PhotoBoothSlideshow"
      component={PhotoBooth}
      durationInFrames={TOTAL_DURATION}
      fps={30}
      width={1280}
      height={720}
    />
  );
};
