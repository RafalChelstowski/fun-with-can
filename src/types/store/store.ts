export enum InteractiveObjectStatus {
  ATTACHED_EXPRESS = 'attachedExpress',
  ATTACHED_GRINDER = 'attachedGrinder',
  PICKED = 'picked',
  ANIMATED = 'animated',
  DROPPED = 'dropped',
  ON = 'on',
  OFF = 'off',
}

export enum PlayerStatus {
  PICKED = 'picked',
  // THROWING = 'throwing',
}

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
  pointerSpeed: string;
  toggleIsLocked: () => void;
  setPlayerStatus: (status: PlayerStatus | null) => void;
};
