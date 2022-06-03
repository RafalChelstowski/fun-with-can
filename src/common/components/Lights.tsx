import { useEffect, useMemo } from 'react';

import { Environment, Sky } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function Lights(): JSX.Element {
  const scene = useThree((state) => state.scene);

  const targetObject = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    targetObject.position.set(12, 0, 4);
    scene.add(targetObject);
  }, [scene, targetObject]);

  return (
    <>
      <ambientLight />
      <directionalLight intensity={0.7} target={targetObject} />
      <Environment files="touk.hdr" background={false} resolution={64} />
      <Sky />
    </>
  );
}
