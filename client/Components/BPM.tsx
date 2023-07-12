import * as React from 'react';
import { useRef, useEffect } from 'react';

interface BeatNodeProps {
  onBPMChange: (newBPM: number) => void;
  bpm: number;
  minBPM?: number;
  maxBPM?: number;
}

function clip(val: number, min: number, max: number) {
  if (val < min) return min;
  if (val > max) return max;
  return val;
}

function BPM({ onBPMChange, bpm, minBPM = 20, maxBPM = 400 }: BeatNodeProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = bpm.toString();
    }
  }, [bpm]);

  function newBPM(newBPM: number) {
    if (isNaN(newBPM)) {
      return;
    }
    onBPMChange(clip(newBPM, minBPM, maxBPM));
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseInt(e.target.value);
    newBPM(val);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const val = parseInt(e.currentTarget.value);
      e.currentTarget.blur();
      newBPM(val);
    }
  }

  function onBlur(e: React.FocusEvent<HTMLInputElement>) {
    const val = parseInt(e.target.value);
    newBPM(val);
  }

  function minusBPM() {
    newBPM(bpm - 1);
  }

  function plusBPM() {
    newBPM(bpm + 1);
  }

  return (
    <div>
      <label>
        <input
          id="bpm"
          type="text"
          pattern="[0-9]*"
          ref={inputRef}
          defaultValue={bpm}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
        />{' '}
        BPM
      </label>
      <button id="minus-bpm-button" onClick={minusBPM}>
        -
      </button>
      <input id="bpm-slider" type="range" min={minBPM} max={maxBPM} step="1" value={bpm} onChange={onChange} />
      <button id="plus-bpm-button" onClick={plusBPM}>
        +
      </button>
    </div>
  );
}

export default BPM;
