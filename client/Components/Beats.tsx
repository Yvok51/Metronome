import * as React from 'react';
import Beat from '../data/Beat';
import BeatNode from './BeatNode';

function Beats({
  beats,
  increaseBeatLevel,
  highlightedIdx,
}: {
  beats: Beat[];
  increaseBeatLevel: (id: number) => () => void;
  highlightedIdx?: number;
}) {
  return (
    <div className="beat-collection">
      {beats.map((beat, i) => (
        <BeatNode key={beat.id} beat={beat} increaseBeatLevel={increaseBeatLevel} highlighted={highlightedIdx === i} />
      ))}
    </div>
  );
}

export default Beats;
