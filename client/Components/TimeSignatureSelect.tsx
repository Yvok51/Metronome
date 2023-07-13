import * as React from 'react';
import { useContext } from 'react';

import DisabledContext from './DisabledContext';

type TimeSignature = { top: number; bottom: number };
type TimeSignatureChange = (timeSignature: TimeSignature) => void;

interface TimeSignatureProps {
  signature: TimeSignature;
  onSignatureChange: TimeSignatureChange;
  maxUpper?: number;
  maxLowerPower?: number;
}

function TimeSignatureSelect({ signature, onSignatureChange, maxUpper = 16, maxLowerPower = 3 }: TimeSignatureProps) {
  const disabled = useContext(DisabledContext);

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
    <div className="time-signature">
      <select
        id="upper-time-signature"
        value={signature.top}
        onChange={onChange(val => ({ top: val, bottom: signature.bottom }))}
        disabled={disabled}>
        {upperOptions}
      </select>
      <select
        id="lower-time-signature"
        value={signature.bottom}
        onChange={onChange(val => ({ top: signature.top, bottom: val }))}
        disabled={disabled}>
        {lowerOptions}
      </select>
    </div>
  );
}

export { TimeSignatureSelect, TimeSignatureProps, TimeSignature, TimeSignatureChange };
