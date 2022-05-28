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
    <div className="flex place-content-center place-items-center">
      <div className="font-black text-3xl mr-14">
        <label htmlFor="pointerSpeedSlider">
          controls sensitivity:
          <span className="pl-2">{Number(value).toFixed(2)}</span>
        </label>
      </div>

      <div className="bg-white rounded-lg px-6 py-3">
        <input
          className="w-80"
          type="range"
          min="0.01"
          max="1"
          step="0.01"
          value={value}
          id="pointerSpeedSlider"
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  );
}
