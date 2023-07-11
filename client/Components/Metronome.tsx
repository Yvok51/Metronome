import * as React from 'react';
import { useState, useReducer } from 'react';

import { TimeSignatureSelect } from './TimeSignatureSelect';
import { beatReducer } from './BeatReducer';
import Beat from '../data/Beat';
import PlayButton from './PlayButton';
import Beats from './Beats';
import BPM from './BPM';

const defaultBeats: Beat[] = [Beat.newBeat(0), Beat.newBeat(1), Beat.newBeat(2), Beat.newBeat(3)];

function Metronome() {
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [bottomSignature, setBottomSignature] = useState(4);
  const [beats, beatDispatch] = useReducer(beatReducer, defaultBeats);

  function onSignatureChange({ top, bottom }: { top: number; bottom: number }) {
    if (bottom !== bottomSignature) {
      setBottomSignature(bottom);
    }
    if (top !== beats.length) {
      beatDispatch({ type: 'new-total', newTotal: top });
    }
  }

  function onBPMChange(newBpm: number) {
    setBpm(newBpm);
  }

  function onBeatClick(id: number) {
    return () => {
      beatDispatch({ type: 'increase', id });
    };
  }

  function onPlayClick() {
    setPlaying(!playing);
  }

  return (
    <div>
      <Beats beats={beats} increaseBeatLevel={onBeatClick} />
      <BPM bpm={bpm} onBPMChange={onBPMChange} />
      <TimeSignatureSelect
        signature={{ top: beats.length, bottom: bottomSignature }}
        onSignatureChange={onSignatureChange}
      />
      <PlayButton isPlaying={playing} togglePlay={onPlayClick} />
    </div>
  );
}

export default Metronome;
