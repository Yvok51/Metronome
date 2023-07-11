import * as React from 'react';

function PlayButton({ isPlaying, togglePlay }: { isPlaying: boolean; togglePlay: () => void }) {
  const playButtonClass = 'play-button';
  const pauseButtonClass = 'pause-button';

  return (
    <button onClick={togglePlay} className={isPlaying ? pauseButtonClass : playButtonClass}>
      {isPlaying ? 'Pause' : 'Play'}
    </button>
  );
}

export default PlayButton;
