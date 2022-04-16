import { ThreeEvent } from '@react-three/fiber';

export enum InteractiveObjectStatus {
  ATTACHED_EXPRESS = 'attachedExpress',
  ATTACHED_GRINDER = 'attachedGrinder',
  PICKED = 'picked',
  ANIMATED = 'animated',
  DROPPED = 'dropped',
}

export enum PlayerStatus {
  PICKED = 'picked',
}

export interface InteractiveObject {
  status: InteractiveObjectStatus;
}

export interface InteractiveObjectInstance extends InteractiveObject {
  instanceId?: number;
}

export interface InteractiveObjects {
  grip: InteractiveObject;
  mugs: InteractiveObjectInstance;
  mugs2: InteractiveObjectInstance;
}

export type State = {
  playerStatus: PlayerStatus | null;
  isLocked: boolean;
  toggleIsLocked: () => void;
  clickedPoint: THREE.Vector3 | null;
  interactiveObjects: InteractiveObjects;
  setInteractiveObject: (
    key: keyof InteractiveObjects,
    obj: Partial<InteractiveObject> | Partial<InteractiveObjectInstance>
  ) => void;
  setPlayerStatus: (status: PlayerStatus | null) => void;
  handleEvent: (event: ThreeEvent<MouseEvent>) => void;
};
