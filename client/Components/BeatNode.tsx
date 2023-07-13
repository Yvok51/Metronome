import * as React from 'react';
import { useContext } from 'react';
import Beat from '../data/Beat';
import DisabledContext from './DisabledContext';

function BeatNode({
  beat,
  increaseBeatLevel,
  highlighted,
}: {
  beat: Beat;
  increaseBeatLevel: (id: number) => () => void;
  highlighted: boolean;
}) {
  const disabled = useContext(DisabledContext);

  const fullRowClass = 'beat-row beat-row-full';
  const emptyRowClass = 'beat-row beat-row-empty';
  const nodeClass = 'beat-node' + (highlighted ? ' beat-highlighted' : '');

  let rows = [];
  for (let i = Beat.MAX_LEVEL; i > 0; i--) {
    rows.push(<div className={beat.level >= i ? fullRowClass : emptyRowClass} key={`${beat.level}-${i}`}></div>);
  }

  return (
    <div className={nodeClass} onClick={disabled ? () => {} : increaseBeatLevel(beat.id)}>
      {rows}
    </div>
  );
}

export default BeatNode;
