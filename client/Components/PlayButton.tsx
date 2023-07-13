import * as React from 'react';
import { useContext } from 'react';

import DisabledContext from './DisabledContext';

function PlayButton({ isPlaying, togglePlay }: { isPlaying: boolean; togglePlay: () => void }) {
  const disabled = useContext(DisabledContext);

  const buttonClass = 'play-button';
  const toPlayClass = ' to-play';
  const toPauseClass = ' to-pause';

  return (
    <button disabled={disabled} onClick={togglePlay} className={buttonClass + (isPlaying ? toPauseClass : toPlayClass)}>
      {isPlaying ? 'Pause' : 'Play'}
    </button>
  );
}

export default PlayButton;
