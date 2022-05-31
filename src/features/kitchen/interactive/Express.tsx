import { useEffect, useRef, useState } from 'react';
import { useEvent } from 'react-use';

import { a, config, useSpring } from '@react-spring/three';
import { Triplet, useBox } from '@react-three/cannon';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { degToRad } from 'three/src/math/MathUtils';

// import { Smoke } from '../../../common/components/Smoke';

import { useAchievement } from '../../../api/hooks/useAchievement';
import { glassMaterial } from '../../../common/materials/materials';
import { getState, setState } from '../../../store/store';
import {
  AchievementName,
  InteractiveObjectStatus,
  PlayerStatus,
} from '../../../types';
import { useKitchenGltf } from '../useKitchenGltf';

const initialPosition: Triplet = [1.65, 1.08, -5.44];
const grinderPosition: Triplet = [2.49, 0.98, -5.52];
const expressRotation: Triplet = [0, degToRad(-60), 0];
const grinderRotation: Triplet = [0, degToRad(-41), 0];

const grinderTrayPosition: Triplet = [2.51, 0.91, -5.3];
const tamperPosition: Triplet = [2.49, 0.91, -5.33];

const zCamVec = new THREE.Vector3();
const rotationDirection = new THREE.Vector3();

export function Express(): JSX.Element {
  const { nodes, kitchenMaterial } = useKitchenGltf();
  const camera = useThree((state) => state.camera);
  const raycaster = useThree((state) => state.raycaster);
  const scene = useThree((state) => state.scene);
  const { addAchievement } = useAchievement();

  const [animated, setAnimated] = useState<
    'express' | 'grinder' | 'accessories' | 'coffee' | null
  >(null);

  const gripStatus = useRef<InteractiveObjectStatus | undefined>(
    InteractiveObjectStatus.ATTACHED_EXPRESS
  );

  const [ref, api] = useBox<THREE.Group>(() => ({
    mass: 0,
    args: [0.1, 0.1, 0.2],
    position: initialPosition,
    allowSleep: false,
    type: 'Dynamic',
  }));

  const tamperRef = useRef<THREE.Group>(null);
  const gripPosRef = useRef([0, 0, 0]);
  const gripRotRef = useRef([0, 0, 0]);

  useEffect(() => {
    api.position.subscribe((p) => {
      gripPosRef.current = p;
    });
  });

  useEffect(() => {
    api.rotation.subscribe((r) => {
      gripRotRef.current = r;
    });
  });

  const { rotation: gripExpressRotation, position: gripExpressPosition } =
    useSpring({
      to: async (next) => {
        if (animated === 'express') {
          await next({
            rotation: expressRotation,
            position: [
              initialPosition[0],
              initialPosition[1] - 0.05,
              initialPosition[2],
            ],
          });
          await next({ rotation: expressRotation, position: initialPosition });
          await next({
            rotation: expressRotation,
            position: initialPosition,
          });
          await next({ rotation: [0, 0, 0], position: initialPosition });

          setAnimated(null);
          gripStatus.current = InteractiveObjectStatus.ATTACHED_EXPRESS;
          api.position.set(...initialPosition);
          api.rotation.set(0, 0, 0);
          api.mass.set(0);
        }
      },
      from: {
        rotation: gripRotRef.current,
        position: gripPosRef.current,
      },
      reset: true,
    });

  const { rotation: gripGrinderRotation, position: gripGrinderPosition } =
    useSpring({
      to: async (next) => {
        const tempGripPos = structuredClone(gripPosRef.current);
        if (animated === 'grinder') {
          await next({ rotation: grinderRotation, position: grinderPosition });
          await new Promise((res) => {
            setTimeout(res, 2000);
          });
          await next({ position: tempGripPos });

          setAnimated(null);
          gripStatus.current = InteractiveObjectStatus.PICKED;
          setState({
            playerStatus: PlayerStatus.PICKED,
            coffeeState: 'grinded',
          });
        }
      },
      from: {
        rotation: gripRotRef.current,
        position: gripPosRef.current,
      },
      reset: true,
    });

  const {
    rotation: accGrinderRotation,
    position: accGrinderPosition,
    tamperPosition: tamperAnimationPos,
  } = useSpring({
    to: async (next) => {
      const tempGripPos = structuredClone(gripPosRef.current);
      if (animated === 'accessories') {
        await next({
          rotation: [0, 0, 0],
          position: grinderTrayPosition,
          tamperPosition: [
            tamperPosition[0],
            tamperPosition[1] + 0.2,
            tamperPosition[2],
          ],
          config: config.default,
        });
        await next({
          tamperPosition: [
            tamperPosition[0] + 0.01,
            tamperPosition[1] + 0.05,
            tamperPosition[2] + 0.04,
          ],
          config: config.default,
        });

        await next({
          tamperPosition: [
            tamperPosition[0] + 0.01,
            tamperPosition[1] + 0.06,
            tamperPosition[2] + 0.04,
          ],
          config: config.wobbly,
        });

        await next({
          tamperPosition: [
            tamperPosition[0] + 0.01,
            tamperPosition[1] + 0.05,
            tamperPosition[2] + 0.04,
          ],
          config: config.default,
        });

        await next({
          tamperPosition,
          position: tempGripPos,
          config: config.default,
        });

        setAnimated(null);
        gripStatus.current = InteractiveObjectStatus.PICKED;
        setState({
          playerStatus: PlayerStatus.PICKED,
          coffeeState: 'tempered',
        });
      }
    },
    from: {
      rotation: gripRotRef.current,
      position: gripPosRef.current,
      tamperPosition,
    },
    reset: true,
  });

  useEvent('click', (event: Event) => {
    event.stopPropagation();
    const { playerStatus } = getState();

    if (animated !== null) {
      return;
    }

    if (playerStatus === null) {
      const expressButtonObj = scene.getObjectByName('btn')?.children || [];
      const gripObj = scene.getObjectByName('int-grip')?.children || [];
      const x = raycaster.intersectObjects([...expressButtonObj, ...gripObj]);

      if (!x[0]) {
        return;
      }

      if (
        x[0].distance < 2 &&
        x[0].object.name.includes('grip') &&
        getState().coffeeState !== 'tempered'
      ) {
        gripStatus.current = InteractiveObjectStatus.PICKED;
        setState({ playerStatus: PlayerStatus.PICKED });

        return;
      }

      if (
        x[0] &&
        x[0].distance < 2 &&
        x[0].object.name.includes('button') &&
        getState().coffeeState === 'cupReady'
      ) {
        setState({ coffeeState: 'ready' });
        addAchievement(AchievementName.COFFEE);

        return;
      }

      return;
    }

    if (
      playerStatus === PlayerStatus.PICKED &&
      gripStatus.current === InteractiveObjectStatus.PICKED
    ) {
      const expressSceneObj = scene.getObjectByName('express')?.children || [];
      const accSceneObj = scene.getObjectByName('accessories')?.children || [];
      const nonInteractiveSceneObj =
        scene.getObjectByName('nonInteractive')?.children || [];

      const x = raycaster.intersectObjects([
        ...expressSceneObj,
        ...accSceneObj,
        ...nonInteractiveSceneObj,
      ]);

      if (x[0] && x[0].distance < 2 && x[0].object.name.includes('express')) {
        gripStatus.current = InteractiveObjectStatus.ANIMATED_EXPRESS;
        setState({ playerStatus: null });
        setAnimated('express');

        return;
      }

      if (
        x[0] &&
        x[0].distance < 2 &&
        x[0].object.name.includes('grinder') &&
        getState().coffeeState === null
      ) {
        gripStatus.current = InteractiveObjectStatus.ANIMATED_GRINDER;
        setState({ playerStatus: null });
        setAnimated('grinder');

        return;
      }

      if (
        x[0] &&
        x[0].distance < 2 &&
        x[0].object.name.includes('accessories') &&
        getState().coffeeState === 'grinded'
      ) {
        gripStatus.current = InteractiveObjectStatus.ANIMATED_ACCESSORIES;
        setState({ playerStatus: null });
        setAnimated('accessories');

        return;
      }

      if (x[0] && x[0].distance < 2 && x[0].object.name.includes('area')) {
        const { point } = x[0];
        api.mass.set(3);
        api.position.set(point.x, point.y + 0.2, point.z);
        gripStatus.current = undefined;
        setState({ playerStatus: null });
      }
    }
  });

  useFrame(() => {
    if (gripStatus.current === InteractiveObjectStatus.ANIMATED_EXPRESS) {
      api.rotation.set(...(gripExpressRotation.get() as Triplet));
      api.position.set(...(gripExpressPosition.get() as Triplet));
      api.mass.set(0);
    }

    if (gripStatus.current === InteractiveObjectStatus.ATTACHED_EXPRESS) {
      api.rotation.set(0, 0, 0);
      api.velocity.set(0, 0, 0);
      api.mass.set(0);
    }

    if (gripStatus.current === InteractiveObjectStatus.ANIMATED_GRINDER) {
      const [rX, rY, rZ] = gripGrinderRotation.get();
      const [pX, pY, pZ] = gripGrinderPosition.get();
      api.rotation.set(rX, rY, rZ);
      api.position.set(pX, pY, pZ);
      api.mass.set(0);
    }

    if (gripStatus.current === InteractiveObjectStatus.ANIMATED_ACCESSORIES) {
      const [rX, rY, rZ] = accGrinderRotation.get();
      const [pX, pY, pZ] = accGrinderPosition.get();
      const [tpX, tpY, tpZ] = tamperAnimationPos.get();
      api.rotation.set(rX, rY, rZ);
      api.position.set(pX, pY, pZ);
      api.mass.set(0);
      tamperRef.current?.position.set(tpX, tpY, tpZ);
    }

    if (gripStatus.current === InteractiveObjectStatus.PICKED) {
      zCamVec.set(0.15, -0.15, -0.3);
      const playerPosition = camera.localToWorld(zCamVec);
      camera.getWorldDirection(rotationDirection);
      const theta = Math.atan2(rotationDirection.x, rotationDirection.z);

      api.position.set(...playerPosition.toArray());
      api.mass.set(0);
      api.rotation.set(0, theta + Math.PI, 0);
    }
  });

  return (
    <group dispose={null}>
      <a.group name="int-grip" ref={ref}>
        <mesh
          name="grip-body"
          geometry={nodes.NurbsPath011.geometry}
          material={nodes.NurbsPath011.material}
        />
        <mesh
          name="grip-metal"
          geometry={nodes.NurbsPath011_1.geometry}
          material={nodes.NurbsPath011_1.material}
        />
        <mesh name="grip-dummy" visible={false}>
          <meshStandardMaterial />
          <boxBufferGeometry args={[0.1, 0.15, 0.3]} />
        </mesh>
      </a.group>
      <group name="express">
        <mesh
          geometry={nodes.bake_express.geometry}
          position={[1.64, 0.88, -5.5]}
          name="express-body"
        >
          {kitchenMaterial}
        </mesh>
        <mesh
          geometry={nodes.bake_grinder.geometry}
          position={[2.52, 1.05, -5.54]}
          name="grinder-body"
        >
          {kitchenMaterial}
        </mesh>
      </group>
      <group name="btn">
        <mesh
          geometry={nodes.buttons.geometry}
          material={nodes.buttons.material}
          position={[1.64, 0.88, -5.5]}
        />
        <mesh
          name="button-make"
          geometry={nodes.buttons_pressable.geometry}
          material={nodes.buttons_pressable.material}
          position={[1.64, 0.88, -5.5]}
        />
      </group>

      <mesh
        geometry={nodes.grinderGlass.geometry}
        material={glassMaterial}
        position={[2.57, 1.27, -5.59]}
      />
      <mesh
        geometry={nodes.bin.geometry}
        material={nodes.bin.material}
        position={[2.13, 0.85, -5.39]}
      />
      <group name="accessories">
        <mesh
          name="accessories-tray"
          geometry={nodes.coffeeAccesories.geometry}
          material={nodes.coffeeAccesories.material}
          position={[2.51, 0.89, -5.3]}
        />
        <group
          ref={tamperRef}
          name="accessories-tamper"
          position={tamperPosition}
        >
          <mesh
            geometry={nodes.NurbsPath018.geometry}
            material={nodes.NurbsPath018.material}
          />
          <mesh
            geometry={nodes.NurbsPath018_1.geometry}
            material={nodes.NurbsPath018_1.material}
          />
        </group>
      </group>

      {/* <Smoke isVisible={grip.status === InteractiveObjectStatus.ANIMATED} /> */}
    </group>
  );
}
