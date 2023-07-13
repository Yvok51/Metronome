import * as React from 'react';
import { useContext } from 'react';
import Beat from '../data/Beat';
import DisabledContext from './DisabledContext';

function BeatNode({ beat, increaseBeatLevel }: { beat: Beat; increaseBeatLevel: (id: number) => () => void }) {
  const disabled = useContext(DisabledContext);

  const fullBeatNodeClass = 'beat-node beat-node-full';
  const emptyBeatNodeClass = 'beat-node beat-node-empty';

  let rows = [];
  for (let i = Beat.MAX_LEVEL; i > 0; i--) {
    rows.push(
      <tr key={`${beat.level}-${i}`} onClick={disabled ? () => {} : increaseBeatLevel(beat.id)}>
        <td className={beat.level >= i ? fullBeatNodeClass : emptyBeatNodeClass}>
          {beat.level >= i ? 'full' : 'empty'}
        </td>
      </tr>,
    );
  }

  return <table>{rows}</table>;
}

export default BeatNode;
