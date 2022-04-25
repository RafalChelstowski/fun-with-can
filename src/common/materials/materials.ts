import * as THREE from 'three';

export const glassMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 0,
  roughness: 0.07,
  transmission: 0.8,
  ior: 2.33,
});

export const ikeaGlassMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 0,
  roughness: 0.2,
  transmission: 0.4,
  ior: 1,
  opacity: 1,
  clearcoat: 1,
  reflectivity: 0.5,
  sheen: 1,
});

export const disabledNeonMaterial = new THREE.MeshStandardMaterial({
  color: 'lightGray',
});
