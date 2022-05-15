import { useEffect } from 'react';
import { useLocalStorage } from 'react-use';

import { getState, setState } from '../../store/store';

export function PointerSpeedSlider(): JSX.Element {
  const [value, setValue] = useLocalStorage('pointerSpeedSlider', '0.2');

  useEffect(() => {
    const { pointerSpeed } = getState();
    if (value && value !== pointerSpeed) {
      setState({ pointerSpeed: value });
    }
  }, [value]);

  return (
    <div className="flex x w-80 h-10 z-50 bg-gray-50">
      <input
        type="range"
        min="0.01"
        max="1"
        step="0.01"
        value={value}
        id="pointerSpeedSlider"
        onChange={(e) => setValue(e.target.value)}
      />
      <p className="ml-4">sensitivity: {value}</p>
    </div>
  );
}
