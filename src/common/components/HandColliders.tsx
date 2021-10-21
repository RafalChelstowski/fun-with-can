/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useEffect, useMemo, useState } from 'react';

import { useBox } from '@react-three/cannon';
import { useFrame, useThree } from '@react-three/fiber';
import { useController } from '@react-three/xr';
import * as THREE from 'three';

const joints = [
  'wrist',
  'thumb-metacarpal',
  'thumb-phalanx-proximal',
  'thumb-phalanx-distal',
  'thumb-tip',
  'index-finger-metacarpal',
  'index-finger-phalanx-proximal',
  'index-finger-phalanx-intermediate',
  'index-finger-phalanx-distal',
  'index-finger-tip',
  'middle-finger-metacarpal',
  'middle-finger-phalanx-proximal',
  'middle-finger-phalanx-intermediate',
  'middle-finger-phalanx-distal',
  'middle-finger-tip',
  'ring-finger-metacarpal',
  'ring-finger-phalanx-proximal',
  'ring-finger-phalanx-intermediate',
  'ring-finger-phalanx-distal',
  'ring-finger-tip',
  'pinky-finger-metacarpal',
  'pinky-finger-phalanx-proximal',
  'pinky-finger-phalanx-intermediate',
  'pinky-finger-phalanx-distal',
  'pinky-finger-tip',
];
function JointCollider({ index, hand }: { index: number; hand: number }) {
  const { gl } = useThree();
  const handObj = (gl.xr as any).getHand(hand);
  const joint = handObj.joints[joints[index]] as any;
  const size: number = joint.jointRadius ?? 0.0001;
  const args: [x: number, y: number, z: number] = useMemo(
    () => [size * 1.5, size, size * 1.5],
    [size]
  );

  const [tipRef, api] = useBox(() => ({
    args,
    position: [-1, 0, 0],
  }));

  useFrame(() => {
    if (joint === undefined) {
      return;
    }

    api.position.set(joint.position.x, joint.position.y, joint.position.z);
  });

  return (
    <mesh ref={tipRef}>
      <boxBufferGeometry args={args} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

export function HandsColliders(): JSX.Element {
  return (
    <>
      {[...Array(25)].map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={i}>
          <JointCollider index={i} hand={0} />
          <JointCollider index={i} hand={1} />
        </Fragment>
      ))}
    </>
  );
}

const rightPos = new THREE.Vector3();
const leftPos = new THREE.Vector3();
const rightRot = new THREE.Euler();
const leftRot = new THREE.Euler();

export function ControllerColliders(): JSX.Element {
  const rightController = useController('right');
  const leftController = useController('left');
  const [rightHandRef, rightHandApi] = useBox(() => ({
    type: 'Static',
    mass: 1,
    args: [0.05, 0.1, 0.1],
  }));
  const [leftHandRef, leftHandApi] = useBox(() => ({
    type: 'Static',
    mass: 1,
    args: [0.05, 0.1, 0.1],
  }));

  useFrame(() => {
    if (rightController) {
      const rp = rightPos.setFromMatrixPosition(
        rightController.controller.matrixWorld
      );
      const rr = rightRot.setFromRotationMatrix(
        rightController.controller.matrixWorld
      );
      rightHandApi.position.set(...rp.toArray());
      rightHandApi.rotation.set(...rr.toVector3().toArray());
    }

    if (leftController) {
      const lp = leftPos.setFromMatrixPosition(
        leftController.controller.matrixWorld
      );
      const lr = leftRot.setFromRotationMatrix(
        leftController.controller.matrixWorld
      );
      leftHandApi.position.set(...lp.toArray());
      leftHandApi.rotation.set(...lr.toVector3().toArray());
    }
  });

  return (
    <>
      <mesh name="rightHand" ref={rightHandRef} visible={false}>
        <boxBufferGeometry args={[0.05, 0.1, 0.1]} />
      </mesh>
      <mesh name="leftHand" ref={leftHandRef} visible={false}>
        <boxBufferGeometry args={[0.05, 0.01, 0.1]} />
      </mesh>
    </>
  );
}

export function Colliders(): JSX.Element | null {
  const [ready, setReady] = useState(false);
  const { gl } = useThree();

  useEffect(() => {
    if (ready) {
      return;
    }

    const joint = (gl.xr as any).getHand(0).joints['index-finger-tip'];

    if (joint?.jointRadius !== undefined) {
      return;
    }

    const id = setInterval(() => {
      const j = (gl.xr as any).getHand(0).joints['index-finger-tip'];
      if (j?.jointRadius !== undefined) {
        setReady(true);
      }
    }, 500);

    return () => clearInterval(id);
  }, [gl, ready]);

  return ready ? <HandsColliders /> : <ControllerColliders />;
}
