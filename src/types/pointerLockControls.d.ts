import { PointerLockControls } from '@react-three/drei';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      pointerLockControls: ReactThreeFiber.Object3DNode<
        PointerLockControls,
        typeof PointerLockControls
      >;
    }
  }
}
