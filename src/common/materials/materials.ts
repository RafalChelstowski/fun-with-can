import * as THREE from 'three';

export const testMaterial = new THREE.MeshStandardMaterial({
  color: 'fuchsia',
});

export const glassMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 0,
  roughness: 0.07,
  transmission: 0.8,
  ior: 2.33,
});

export const disabledNeonMaterial = new THREE.MeshStandardMaterial({
  color: 'lightGray',
});
