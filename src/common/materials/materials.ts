import * as THREE from 'three';

export const glassMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 0,
  roughness: 0.1,
  transmission: 1,
  ior: 1.5,
  opacity: 1,
  clearcoat: 1,
  reflectivity: 0.5,
});
