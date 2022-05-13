import { ReactNode, RefObject, useEffect } from 'react';

import { a, useSpring } from '@react-spring/three';
import { Triplet, useBox } from '@react-three/cannon';
import { useGLTF, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { degToRad } from 'three/src/math/MathUtils';

// import { Smoke } from '../../../common/components/Smoke';
import { glassMaterial } from '../../../common/materials/materials';
import { useStore } from '../../../store/store';
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
  const texture = useTexture('/elements.jpg');
  const { playerStatus, setPlayerStatus, grip, setInteractiveObject, point } =
    useStore((state) => ({
      grip: state.interactiveObjects.grip,
      setInteractiveObject: state.setInteractiveObject,
      playerStatus: state.playerStatus,
      setPlayerStatus: state.setPlayerStatus,
      point: state.point,
    }));

  const { rotation, position } = useSpring({
    to: async (next) => {
      if (grip.status === InteractiveObjectStatus.ANIMATED) {
        await next({ rotation: targetRotation, position: 1 });
        await next({
          rotation: targetRotation,
          position: initialPosition[1],
        });
        await next({ rotation: 0, position: initialPosition[1] });
        setInteractiveObject('grip', {
          status: InteractiveObjectStatus.ATTACHED_EXPRESS,
        });
      }
    },
    from: {
      rotation: targetRotation,
      position: 1,
    },
    reset: true,
  });
  const [ref, api] = useBox(() => ({
    mass: 3,
    args: [0.1, 0.1, 0.2],
    position: initialPosition,
    allowSleep: false,
    type: 'Dynamic',
  }));

  useEffect(() => {
    if (grip.status === InteractiveObjectStatus.DROPPED && point) {
      api.position.set(point.x, point.y + 0.05, point.z);
    }
  }, [api.position, grip.status, point]);

  const rotationDirection = new THREE.Vector3();

  useFrame(() => {
    if (grip.status === InteractiveObjectStatus.ATTACHED_EXPRESS) {
      api.position.set(...initialPosition);
      api.velocity.set(0, 0, 0);
      api.rotation.set(0, 0, 0);
    }

    if (grip.status === InteractiveObjectStatus.ATTACHED_GRINDER) {
      api.position.set(...grinderPosition);
      api.velocity.set(0, 0, 0);
      api.rotation.set(0, grinderRotation, 0);
    }

    if (grip.status === InteractiveObjectStatus.PICKED) {
      const zCamVec = new THREE.Vector3(0.15, -0.15, -0.3);
      const playerPosition = camera.localToWorld(zCamVec);
      camera.getWorldDirection(rotationDirection);
      const theta = Math.atan2(rotationDirection.x, rotationDirection.z);

      api.position.set(...playerPosition.toArray());
      api.velocity.set(0, 0, 0);
      api.rotation.set(0, theta + Math.PI, 0);
    }

    if (grip.status === InteractiveObjectStatus.ANIMATED) {
      api.rotation.set(0, rotation.get(), 0);
      api.position.set(initialPosition[0], position.get(), initialPosition[2]);
      api.velocity.set(0, 0, 0);
    }
  });

  return (
    <group dispose={null}>
      <a.group
        ref={ref as unknown as RefObject<ReactNode>}
        onClick={(e) => {
          e.stopPropagation();

          if (playerStatus === PlayerStatus.PICKED) {
            return;
          }
          setInteractiveObject('grip', {
            status: InteractiveObjectStatus.PICKED,
          });
          setPlayerStatus(PlayerStatus.PICKED);
        }}
      >
        <mesh
          geometry={nodes.NurbsPath011.geometry}
          material={nodes.NurbsPath011.material}
        />
        <mesh
          geometry={nodes.NurbsPath011_1.geometry}
          material={nodes.NurbsPath011_1.material}
        />
        <mesh name="boundary extension" visible={false}>
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
        onClick={(e) => {
          e.stopPropagation();
          if (
            grip.status === InteractiveObjectStatus.ATTACHED_EXPRESS &&
            playerStatus === null
          ) {
            setInteractiveObject('grip', {
              status: InteractiveObjectStatus.PICKED,
            });
            setPlayerStatus(PlayerStatus.PICKED);
          }

          if (grip.status === InteractiveObjectStatus.PICKED) {
            setInteractiveObject('grip', {
              status: InteractiveObjectStatus.ANIMATED,
            });
            setPlayerStatus(null);
          }
        }}
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
        onClick={(e) => {
          e.stopPropagation();
          if (
            grip.status === InteractiveObjectStatus.ATTACHED_GRINDER &&
            playerStatus === null
          ) {
            setInteractiveObject('grip', {
              status: InteractiveObjectStatus.PICKED,
            });
            setPlayerStatus(PlayerStatus.PICKED);
          }

          if (grip.status === InteractiveObjectStatus.PICKED) {
            setInteractiveObject('grip', {
              status: InteractiveObjectStatus.ATTACHED_GRINDER,
            });
            setPlayerStatus(null);
          }
        }}
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
