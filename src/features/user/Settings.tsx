import { setState, useStore } from '../../store/store';
import { GfxSettings } from '../../types';

const LOW_PRESET: GfxSettings = {
  surroundings: false,
  lights: 1,
  glass: false,
};

const MEDIUM_PRESET: GfxSettings = {
  surroundings: true,
  lights: 2,
  glass: true,
};

const HIGH_PRESET: GfxSettings = {
  surroundings: true,
  lights: 3,
  glass: true,
};

export function SettingsPage(): JSX.Element {
  const surroundings = useStore((state) => state.gfxSettings.surroundings);
  const lights = useStore((state) => state.gfxSettings.lights);
  const glass = useStore((state) => state.gfxSettings.glass);

  const setLowPreset = () => {
    setState({
      gfxSettings: LOW_PRESET,
    });
  };

  const setMediumPreset = () => {
    setState({
      gfxSettings: MEDIUM_PRESET,
    });
  };

  const setHighPreset = () => {
    setState({
      gfxSettings: HIGH_PRESET,
    });
  };

  return (
    <div className="flex flex-col w-full place-content-center place-items-center">
      <h3 className="font-black text-xl my-3 mt-10">Graphics - presets:</h3>
      <div className="flex flex-row">
        <div className="m-4">
          <button
            className="cta text-sm"
            type="button"
            name="low preset"
            onClick={setLowPreset}
          >
            Low
          </button>
        </div>
        <div className="m-4">
          <button
            className="cta text-sm"
            type="button"
            name="medium preset"
            onClick={setMediumPreset}
          >
            Medium
          </button>
        </div>
        <div className="m-4">
          <button
            className="cta text-sm"
            type="button"
            name="medium preset"
            onClick={setHighPreset}
          >
            High
          </button>
        </div>
      </div>

      <h3 className="font-black text-xl my-6">
        Graphics - individual settings:
      </h3>

      <div className="font-black text-2xl mr-14 mb-6">
        <label htmlFor="surroundings">
          Surroundings:
          <input
            className="ml-6"
            id="surroundings"
            name="surroundings"
            type="checkbox"
            checked={surroundings}
            onChange={(e) =>
              setState((state) => ({
                gfxSettings: {
                  ...state.gfxSettings,
                  surroundings: e.target.checked,
                },
              }))
            }
          />
        </label>
      </div>

      <div className="font-black text-2xl mr-14 mb-6">
        <label htmlFor="lights">
          Lights
          <select
            className="ml-6 placeholder-gray-700 text-black text-xl p-2 w-40"
            id="lights"
            name="lights"
            value={lights}
            onChange={(e) =>
              setState((state) => ({
                gfxSettings: {
                  ...state.gfxSettings,
                  lights: Number(e.target.value),
                },
              }))
            }
          >
            <option value={1}>low</option>
            <option value={2}>medium</option>
            <option value={3}>high</option>
          </select>
        </label>
      </div>

      <div className="font-black text-2xl mr-14 mb-6">
        <label htmlFor="glass">
          Glass
          <input
            className="ml-6"
            id="glass"
            name="glass"
            type="checkbox"
            checked={glass}
            onChange={(e) =>
              setState((state) => ({
                gfxSettings: {
                  ...state.gfxSettings,
                  glass: e.target.checked,
                },
              }))
            }
          />
        </label>
      </div>
    </div>
  );
}
