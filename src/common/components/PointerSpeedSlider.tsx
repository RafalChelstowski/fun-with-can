import { useState } from 'react';

export function PointerSpeedSlider(): JSX.Element {
  const [sliderValue, setSliderValue] = useState(0.2);

  return (
    <div className="flex place-content-center place-items-center">
      <div className="font-black text-2xl mr-14">
        <label htmlFor="pointerSpeedSlider">
          controls sensitivity:
          <span className="pl-2">{Number(sliderValue).toFixed(2)}</span>
        </label>
      </div>

      <div className="bg-white rounded-lg px-4 py-2">
        <input
          className="w-40"
          type="range"
          min="0.01"
          max="1"
          step="0.01"
          value={sliderValue}
          id="pointerSpeedSlider"
          onChange={(e) => setSliderValue(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
