import { ReactNode, RefObject, useEffect, useState } from 'react';

import { a, useSpring } from '@react-spring/three';
import { Triplet, useBox } from '@react-three/cannon';
import { useGLTF, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { degToRad } from 'three/src/math/MathUtils';

import { useStore } from '../../../store/store';

type GLTFResult = GLTF & {
  nodes: {
    NurbsPath011: THREE.Mesh;
    NurbsPath011_1: THREE.Mesh;
    buttons: THREE.Mesh;
    buttons_pressable: THREE.Mesh;
    bake_express: THREE.Mesh;
  };
};

const initialPosition: Triplet = [1.65, 1.06, -5.4];
const targetRotation = degToRad(-53);

export function Express(): JSX.Element {
  const { nodes } = useGLTF('/express.gltf') as unknown as GLTFResult;
  const point = useStore((state) => state.clickedPoint);
  const camera = useThree((state) => state.camera);
  const texture = useTexture('/elements.jpg');
  const [gripStatus, setGripStatus] = useState<
    'attached' | 'picked' | 'animated' | 'dropped'
  >('attached');
  // console.log(gripStatus);

  // const [picked, setPicked] = useState(false);
  // const [attached, setAttached] = useState(true);
  // const pickedRef = useRef(false);

  // const [animating, setAnimating] = useState(false);

  const { rotation, position } = useSpring({
    // to: useCallback(
    //   async (next) => {
    //     if (gripStatus === 'animated') {
    //       await next({ rotation: targetRotation, position: 1 });
    //       await next({
    //         rotation: targetRotation,
    //         position: initialPosition[1],
    //       });
    //       await next({ rotation: 0, position: initialPosition[1] });
    //       setGripStatus('attached');
    //     }
    //   },
    //   [gripStatus]
    // ),
    from: {
      rotation: targetRotation,
      position: 1,
    },
  });
  const [ref, api] = useBox(() => ({
    mass: 1,
    args: [0.1, 0.1, 0.1],
    position: initialPosition,
    allowSleep: true,
    type: 'Dynamic',
  }));

  useEffect(() => {
    if (gripStatus === 'dropped' && point) {
      api.position.set(point.x, point.y + 0.05, point.z);
      // setPicked(false);
      // pickedRef.current = false;
    }
  }, [api.position, gripStatus, point]);

  useFrame(() => {
    if (gripStatus === 'attached') {
      api.position.set(...initialPosition);
      api.velocity.set(0, 0, 0);
      api.mass.set(0);
    }

    if (gripStatus === 'picked') {
      const zCamVec = new THREE.Vector3(0.15, -0.15, -0.3);
      const playerPosition = camera.localToWorld(zCamVec);

      api.position.set(...playerPosition.toArray());
      api.velocity.set(0, 0, 0);
      api.rotation.set(0, 0, 0);
    }

    if (gripStatus === 'animated') {
      // api.position.set(...playerPosition.toArray());
      api.rotation.set(0, rotation.get(), 0);
      api.position.set(initialPosition[0], position.get(), initialPosition[2]);
    }
  });

  return (
    <group dispose={null}>
      <a.group
        ref={ref as unknown as RefObject<ReactNode>}
        onClick={(e) => {
          e.stopPropagation();

          setGripStatus('picked');
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
          if (gripStatus === 'picked') {
            setGripStatus('animated');
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
    </group>
  );
}
