import * as React from 'react';

type TimeSignature = { top: number; bottom: number };
type TimeSignatureChange = (timeSignature: TimeSignature) => void;

interface TimeSignatureProps {
  signature: TimeSignature;
  onSignatureChange: TimeSignatureChange;
  maxUpper?: number;
  maxLowerPower?: number;
}

function TimeSignatureSelect({ signature, onSignatureChange, maxUpper = 16, maxLowerPower = 3 }: TimeSignatureProps) {
  const upperOptions = Array.from(Array(maxUpper).keys()).map(i => (
    <option key={i} value={i + 1}>
      {i + 1}
    </option>
  ));
  const lowerOptions = Array.from(Array(maxLowerPower + 1).keys()).map(i => (
    <option key={i} value={2 ** i}>
      {2 ** i}
    </option>
  ));

  function onChange(newSignature: (val: number) => TimeSignature) {
    return (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = parseInt(e.target.value);
      if (isNaN(newValue)) {
        return;
      }
      onSignatureChange(newSignature(newValue));
    };
  }

  return (
    <div>
      <select
        id="upper-time-signature"
        value={signature.top}
        onChange={onChange(val => ({ top: val, bottom: signature.bottom }))}>
        {upperOptions}
      </select>
      <select
        id="lower-time-signature"
        value={signature.bottom}
        onChange={onChange(val => ({ top: signature.top, bottom: val }))}>
        {lowerOptions}
      </select>
    </div>
  );
}

export { TimeSignatureSelect, TimeSignatureProps, TimeSignature, TimeSignatureChange };
