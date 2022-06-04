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
      <ambientLight />

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
    </>
  );
}
