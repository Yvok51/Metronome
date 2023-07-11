import * as React from 'react';
import Beat from '../data/Beat';
import BeatNode from './BeatNode';

function Beats({ beats, increaseBeatLevel }: { beats: Beat[]; increaseBeatLevel: (id: number) => () => void }) {
  return (
    <div>
      {beats.map(beat => (
        <BeatNode key={beat.id} beat={beat} increaseBeatLevel={increaseBeatLevel} />
      ))}
    </div>
  );
}

export default Beats;
