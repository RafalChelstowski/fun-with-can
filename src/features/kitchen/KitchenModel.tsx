import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, unknown>;
};

export function KitchenModel(): JSX.Element {
  const texture = useTexture('/elements.jpg');
  texture.flipY = false;
  texture.encoding = THREE.sRGBEncoding;
  // const normalMap = useTexture('/elements_normal.jpg');
  // normalMap.flipY = false;

  // const metalMap = useTexture('/elements_metalness.jpg');
  // metalMap.flipY = false;

  // const roughnessMap = useTexture('/elements_roughness.jpg');
  // roughnessMap.flipY = false;

  const { nodes } = useGLTF('/kitchen.gltf') as unknown as GLTFResult;

  return (
    <>
      {Object.entries(nodes)
        .filter(
          (mesh) =>
            mesh[1].type === 'Mesh' && !mesh[1].name.includes('interactive')
        )
        .map((node) => {
          const [key, mesh] = node;
          // console.log(mesh.name);

          return (
            <mesh
              key={key}
              position={mesh.position}
              rotation={mesh.rotation}
              geometry={mesh.geometry}
              scale={mesh.scale}
              name={`area-${mesh.name}`}
            >
              <meshStandardMaterial
                map={texture}
                // normalMap={normalMap}
                // metalnessMap={metalMap}
                // normalScale={new THREE.Vector2(1, 1)}
                // roughnessMap={roughnessMap}
              />
            </mesh>
          );
        })}
    </>
  );
}

useGLTF.preload('/kitchen.gltf');
