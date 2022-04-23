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
  THROWING = 'throwing',
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
  ikeaGlass: InteractiveObjectInstance;
  ikeaMug1: InteractiveObjectInstance;
  ikeaMug2: InteractiveObjectInstance;
}

export const isInteractiveObjectInstance = (
  obj: InteractiveObject | InteractiveObjectInstance
): obj is InteractiveObjectInstance => {
  return (obj as InteractiveObjectInstance).instanceId !== undefined;
};

export enum AchievementName {
  TEST = 'test',
}

export interface AchievementDescription {
  description: string;
  fullName: string;
}

export type AchievementDescriptions = Record<
  AchievementName,
  AchievementDescription
>;

export type Achievements = Partial<Record<AchievementName, boolean>>;

export type State = {
  achievements: Achievements;
  setAchievement: (name: AchievementName) => void;
  setAchievements: (obj: Achievements) => void;
  playerStatus: PlayerStatus | null;
  isLocked: boolean;
  toggleIsLocked: () => void;
  interactiveObjects: InteractiveObjects;
  setInteractiveObject: (
    key: keyof InteractiveObjects,
    obj: Partial<InteractiveObject> | Partial<InteractiveObjectInstance>
  ) => void;
  setPlayerStatus: (status: PlayerStatus | null) => void;
  handleEvent: (event: ThreeEvent<MouseEvent>) => void;
  point: THREE.Vector3 | null;
};
