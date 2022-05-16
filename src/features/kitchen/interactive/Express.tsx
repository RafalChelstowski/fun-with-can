import { useRef, useState } from 'react';
import { useEvent } from 'react-use';

import { a, useSpring } from '@react-spring/three';
import { Triplet, useBox } from '@react-three/cannon';
import { useGLTF, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Group } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { degToRad } from 'three/src/math/MathUtils';

// import { Smoke } from '../../../common/components/Smoke';

import { glassMaterial } from '../../../common/materials/materials';
import { getState, setState } from '../../../store/store';
import { InteractiveObjectStatus, PlayerStatus } from '../../../types';

type GLTFResult = GLTF & {
  nodes: {
    NurbsPath011: THREE.Mesh;
    NurbsPath011_1: THREE.Mesh;
    buttons: THREE.Mesh;
    buttons_pressable: THREE.Mesh;
    bake_express: THREE.Mesh;
    grinderGlass: THREE.Mesh;
    NurbsPath018: THREE.Mesh;
    NurbsPath018_1: THREE.Mesh;
    bin: THREE.Mesh;
    bake_grinder: THREE.Mesh;
    coffeeAccesories: THREE.Mesh;
  };
};

const initialPosition: Triplet = [1.65, 1.08, -5.44];
const grinderPosition: Triplet = [2.49, 0.98, -5.52];
const targetRotation = degToRad(-60);
const grinderRotation = degToRad(-41);

export function Express(): JSX.Element {
  const { nodes } = useGLTF('/express.gltf') as unknown as GLTFResult;
  const camera = useThree((state) => state.camera);
  const raycaster = useThree((state) => state.raycaster);
  const scene = useThree((state) => state.scene);
  const texture = useTexture('/elements.jpg');
  const [animated, setAnimated] = useState(false);

  const gripStatus = useRef<InteractiveObjectStatus | undefined>(
    InteractiveObjectStatus.ATTACHED_EXPRESS
  );

  const { rotation, position } = useSpring({
    to: async (next) => {
      if (animated) {
        await next({ rotation: targetRotation, position: 1 });
        await next({
          rotation: targetRotation,
          position: initialPosition[1],
        });
        await next({ rotation: 0, position: initialPosition[1] });
        setAnimated(false);
        gripStatus.current = InteractiveObjectStatus.ATTACHED_EXPRESS;
      }
    },
    from: {
      rotation: targetRotation,
      position: 1,
    },
    reset: true,
  });

  const [ref, api] = useBox<Group>(() => ({
    mass: 3,
    args: [0.1, 0.1, 0.2],
    position: initialPosition,
    allowSleep: false,
    type: 'Dynamic',
  }));

  useEvent('click', () => {
    const { playerStatus } = getState();

    const interaction = raycaster
      .intersectObjects(scene.children)
      .filter(
        (o) =>
          o.object.name.includes('area') ||
          o.object.name.includes('grip') ||
          o.object.name.includes('express') ||
          o.object.name.includes('grinder')
      )?.[0];

    if (interaction?.object.name.includes('grip')) {
      if (
        gripStatus.current === InteractiveObjectStatus.ANIMATED ||
        playerStatus === PlayerStatus.PICKED
      ) {
        return;
      }

      if (interaction.distance < 2) {
        gripStatus.current = InteractiveObjectStatus.PICKED;
        setState({ playerStatus: PlayerStatus.PICKED });

        return;
      }
    }

    if (
      interaction?.object.name.includes('express') &&
      playerStatus === PlayerStatus.PICKED
    ) {
      gripStatus.current = InteractiveObjectStatus.ANIMATED;
      setState({ playerStatus: null });
      setAnimated(true);

      return;
    }

    if (
      interaction?.object.name.includes('grinder') &&
      playerStatus === PlayerStatus.PICKED
    ) {
      gripStatus.current = InteractiveObjectStatus.ATTACHED_GRINDER;
      setState({ playerStatus: null });

      return;
    }

    if (
      gripStatus.current === InteractiveObjectStatus.PICKED &&
      interaction?.distance < 2
    ) {
      const { point } = interaction;

      gripStatus.current = undefined;
      setState({ playerStatus: null });
      api.position.set(point.x, point.y + 0.2, point.z);
    }
  });

  const rotationDirection = new THREE.Vector3();

  useFrame(() => {
    if (gripStatus.current === InteractiveObjectStatus.ATTACHED_EXPRESS) {
      api.position.set(...initialPosition);
      api.velocity.set(0, 0, 0);
      api.rotation.set(0, 0, 0);
    }

    if (gripStatus.current === InteractiveObjectStatus.ATTACHED_GRINDER) {
      api.position.set(...grinderPosition);
      api.velocity.set(0, 0, 0);
      api.rotation.set(0, grinderRotation, 0);
    }

    if (gripStatus.current === InteractiveObjectStatus.PICKED) {
      const zCamVec = new THREE.Vector3(0.15, -0.15, -0.3);
      const playerPosition = camera.localToWorld(zCamVec);
      camera.getWorldDirection(rotationDirection);
      const theta = Math.atan2(rotationDirection.x, rotationDirection.z);

      api.position.set(...playerPosition.toArray());
      api.velocity.set(0, 0, 0);
      api.rotation.set(0, theta + Math.PI, 0);
    }

    if (gripStatus.current === InteractiveObjectStatus.ANIMATED) {
      api.rotation.set(0, rotation.get(), 0);
      api.position.set(initialPosition[0], position.get(), initialPosition[2]);
      api.velocity.set(0, 0, 0);
    }
  });

  return (
    <group dispose={null}>
      <a.group ref={ref}>
        <mesh
          geometry={nodes.NurbsPath011.geometry}
          material={nodes.NurbsPath011.material}
        />
        <mesh
          geometry={nodes.NurbsPath011_1.geometry}
          material={nodes.NurbsPath011_1.material}
        />
        <mesh name="grip" visible={false}>
          <meshStandardMaterial />
          <boxBufferGeometry args={[0.1, 0.15, 0.3]} />
        </mesh>
      </a.group>
      <mesh
        geometry={nodes.buttons.geometry}
        material={nodes.buttons.material}
        position={[1.64, 0.88, -5.5]}
      />
      <mesh
        geometry={nodes.buttons_pressable.geometry}
        material={nodes.buttons_pressable.material}
        position={[1.64, 0.88, -5.5]}
      />
      <mesh
        geometry={nodes.bake_express.geometry}
        position={[1.64, 0.88, -5.5]}
        name="express"
      >
        <meshStandardMaterial
          map={texture}
          // normalMap={normalMap}
          // metalnessMap={metalMap}
          // normalScale={new THREE.Vector2(1, 1)}
          // roughnessMap={roughnessMap}
        />
      </mesh>
      <mesh
        geometry={nodes.grinderGlass.geometry}
        material={glassMaterial}
        position={[2.57, 1.27, -5.59]}
      />
      <group position={[2.49, 0.91, -5.33]}>
        <mesh
          geometry={nodes.NurbsPath018.geometry}
          material={nodes.NurbsPath018.material}
        />
        <mesh
          geometry={nodes.NurbsPath018_1.geometry}
          material={nodes.NurbsPath018_1.material}
        />
      </group>
      <mesh
        geometry={nodes.bin.geometry}
        material={nodes.bin.material}
        position={[2.13, 0.85, -5.39]}
      />
      <mesh
        geometry={nodes.bake_grinder.geometry}
        position={[2.52, 1.05, -5.54]}
        name="grinder"
      >
        <meshStandardMaterial
          map={texture}
          // normalMap={normalMap}
          // metalnessMap={metalMap}
          // normalScale={new THREE.Vector2(1, 1)}
          // roughnessMap={roughnessMap}
        />
      </mesh>
      <mesh
        geometry={nodes.coffeeAccesories.geometry}
        material={nodes.coffeeAccesories.material}
        position={[2.51, 0.89, -5.3]}
      />
      {/* <Smoke isVisible={grip.status === InteractiveObjectStatus.ANIMATED} /> */}
    </group>
  );
}

useGLTF.preload('/express.gltf');
