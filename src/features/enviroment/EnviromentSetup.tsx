import { Environment } from '@react-three/drei';
import { useXR } from '@react-three/xr';

export function EnviromentSetup(): JSX.Element | null {
  const { isPresenting } = useXR();
  if (isPresenting) {
    return null;
  }

  return (
    <group>
      <Environment background files="/touk.hdr" />
    </group>
  );
}
