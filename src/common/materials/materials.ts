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
