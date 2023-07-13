import * as React from 'react';
import { useState, useReducer, useEffect, useRef, useSyncExternalStore } from 'react';

import { TimeSignatureSelect } from './TimeSignatureSelect';
import { beatReducer } from './BeatReducer';
import BeatPlayer from '../data/BeatPlayer';
import loadSounds from '../data/LoadSounds';
import Beat from '../data/Beat';
import PlayButton from './PlayButton';
import Beats from './Beats';
import BPM from './BPM';
import DisabledContext from './DisabledContext';

const defaultBeats: Beat[] = [Beat.newBeat(0), Beat.newBeat(1), Beat.newBeat(2), Beat.newBeat(3)];

function Metronome() {
  const [playing, setPlaying] = useState(false);
  const [soundsLoaded, setSoundsLoaded] = useState(false);
  const [soundsFailed, setSoundsFailed] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [bottomSignature, setBottomSignature] = useState(4);
  const [beats, beatDispatch] = useReducer(beatReducer, defaultBeats);
  const player = useRef<BeatPlayer>(new BeatPlayer(beats, bpm));
  const beatIndex = useSyncExternalStore(
    player.current.subscribe.bind(player.current),
    player.current.beatIndexSnapshot.bind(player.current),
  );

  useEffect(() => {
    const abortController = new AbortController();
    loadSounds(BeatPlayer.audioContext, abortController.signal)
      .then(s => player.current.setSounds(s))
      .then(() => {
        setSoundsLoaded(true);
        setSoundsFailed(false);
      })
      .catch(e => {
        setSoundsLoaded(false);
        setSoundsFailed(true);
        console.log(e);
      });
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (!player.current) {
      return;
    }
    if (playing) {
      player.current.start();
    } else {
      player.current.stop();
    }
  }, [playing]);

  useEffect(() => {
    if (player.current) {
      player.current.setBeats(beats);
    }
  }, [beats]);

  useEffect(() => {
    if (player.current) {
      player.current.setBPM(bpm);
    }
  }, [bpm]);

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
    <div className="metronome">
      <DisabledContext.Provider value={!soundsLoaded || soundsFailed}>
        <Beats beats={beats} increaseBeatLevel={onBeatClick} highlightedIdx={playing ? beatIndex : undefined} />
        <BPM bpm={bpm} onBPMChange={onBPMChange} />
        <TimeSignatureSelect
          signature={{ top: beats.length, bottom: bottomSignature }}
          onSignatureChange={onSignatureChange}
        />
        <PlayButton isPlaying={playing} togglePlay={onPlayClick} />
      </DisabledContext.Provider>
      {soundsFailed ? <p className="error-message">Sounds failed to load</p> : null}
    </div>
  );
}

export default Metronome;
