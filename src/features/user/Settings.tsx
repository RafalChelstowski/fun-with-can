import { PointerSpeedSlider } from '../../common/components/PointerSpeedSlider';

export function SettingsPage(): JSX.Element {
  return (
    <div className="flex flex-col w-full place-content-center place-items-center">
      <PointerSpeedSlider />
    </div>
  );
}
