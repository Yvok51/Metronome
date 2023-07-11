import * as React from 'react';
import { useCallback } from 'react';

interface BeatNodeProps {
  onBPMChange: (newBPM: number) => void;
  bpm: number;
  minBPM?: number;
  maxBPM?: number;
}

function debounce(func: (...args: any[]) => void, wait: number): (...args: any[]) => void {
  let timeout: NodeJS.Timeout;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function BPM({ onBPMChange, bpm, minBPM = 20, maxBPM = 400 }: BeatNodeProps) {
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newBPM = parseInt(e.target.value);
    if (isNaN(newBPM)) {
      return;
    }
    if (newBPM <= 0 || newBPM > maxBPM) {
      return;
    }
    onBPMChange(newBPM);
  }

  // const textOnChange = useCallback(debounce(onChange, 500), [minBPM, maxBPM]);

  function minusBPM() {
    if (bpm > minBPM) {
      onBPMChange(bpm - 1);
    }
  }

  function plusBPM() {
    if (bpm < maxBPM) {
      onBPMChange(bpm + 1);
    }
  }

  return (
    <div>
      <label>
        <input id="bpm" type="text" pattern="[0-9]*" value={bpm} onInput={onChange} /> BPM
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
