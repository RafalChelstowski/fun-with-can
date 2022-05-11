export type ControlsLock = {
  isLocked: boolean;
  lock: () => void;
  getDirection: (target: THREE.Vector3) => THREE.Vector3;
  pointerSpeed: number;
};
