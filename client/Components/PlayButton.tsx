import * as React from 'react';
import { useContext } from 'react';

import DisabledContext from './DisabledContext';

function PlayButton({ isPlaying, togglePlay }: { isPlaying: boolean; togglePlay: () => void }) {
  const disabled = useContext(DisabledContext);

  const playButtonClass = 'play-button';
  const pauseButtonClass = 'pause-button';

  return (
    <button disabled={disabled} onClick={togglePlay} className={isPlaying ? pauseButtonClass : playButtonClass}>
      {isPlaying ? 'Pause' : 'Play'}
    </button>
  );
}

export default PlayButton;
