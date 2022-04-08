export type State = {
  isLocked: boolean;
  toggleIsLocked: () => void;
  clickedPoint: THREE.Vector3 | null;
  pickedObject: boolean;
};
