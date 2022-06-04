import { useEffect, useMemo } from 'react';

import { Environment, Sky } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { useStore } from '../../store/store';

export function Lights(): JSX.Element {
  const scene = useThree((state) => state.scene);
  const lights = useStore((state) => state.gfxSettings.lights);

  const targetObject = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    targetObject.position.set(12, 0, 4);
    scene.add(targetObject);
  }, [scene, targetObject]);

  return (
    <>
      {lights <= 2 ? <ambientLight /> : null}

      {lights >= 1 ? (
        <Environment
          files="touk.hdr"
          background={false}
          resolution={lights >= 2 ? 256 : 32}
        />
      ) : null}

      {lights >= 2 ? <Sky /> : null}

      {lights >= 2 ? (
        <directionalLight intensity={0.7} target={targetObject} />
      ) : null}

      {lights === 3 ? (
        <>
          <pointLight
            castShadow
            intensity={0.5}
            position={[-1.26, 2.1, -2.63]}
          />
          <pointLight
            castShadow
            intensity={0.5}
            position={[-1.26, 2.1, -2.63]}
          />
          <pointLight intensity={0.5} position={[0.97, 2.1, -2.63]} />
          <pointLight intensity={0.5} position={[-1.26, 2.1, -0.99]} />
          <pointLight
            castShadow
            intensity={0.5}
            position={[0.97, 2.1, -0.99]}
          />
          <pointLight
            castShadow
            intensity={0.5}
            position={[-1.26, 2.1, 1.52]}
          />
          <pointLight intensity={0.5} position={[0.97, 2.1, 1.52]} />
          <pointLight intensity={0.5} position={[-1.26, 2.1, 3.11]} />
          <pointLight intensity={0.5} position={[0.97, 2.1, 3.11]} />
          5
          <pointLight intensity={0.5} position={[-0.84, 1.65, -3.59]} />
          <pointLight intensity={0.5} position={[-0.18, 1.65, -3.59]} />
          <pointLight intensity={0.5} position={[0.68, 1.65, -3.59]} />
          5
          <pointLight
            castShadow
            intensity={0.5}
            position={[-1.12, 2.18, -4.58]}
          />
          <pointLight intensity={0.5} position={[0.45, 2.18, -4.58]} />
        </>
      ) : null}
    </>
  );
}
