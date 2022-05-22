export enum InteractiveObjectStatus {
  ATTACHED_EXPRESS = 'attachedExpress',
  ATTACHED_GRINDER = 'attachedGrinder',
  PICKED = 'picked',
  ANIMATED = 'animated',
  DROPPED = 'dropped',
  ON = 'on',
  OFF = 'off',
  HIDDEN = 'hidden',
}

export enum PlayerStatus {
  PICKED = 'picked',
  // THROWING = 'throwing',
}

export enum AchievementName {
  FRIDGE = 'fridge',
  HARNAS = 'harnas',
  AT = 'at',
  BO = 'bo',
  CU = 'cu',
  DK = 'dk',
  NEON = 'neon',
  WINDOW = 'window',
}

export interface AchievementDescription {
  description: string;
  fullName: string;
}

export type AchievementDescriptions = Record<
  AchievementName,
  AchievementDescription
>;

export enum AchievementPayloadStatus {
  NEW = 'new',
  VIEWED = 'viewed',
}

export type AchievementPayload = {
  date: string;
  status: AchievementPayloadStatus;
};

export type Achievements = Partial<Record<AchievementName, AchievementPayload>>;

interface Letters {
  t?: boolean;
  o?: boolean;
  u?: boolean;
  k?: boolean;
}

export type State = {
  achievements: Achievements;
  letters: Letters;
  setAchievement: (name: AchievementName, payload: AchievementPayload) => void;
  setAchievements: (obj: Achievements) => void;
  playerStatus: PlayerStatus | null;
  isLocked: boolean;
  pointerSpeed: string;
  toggleIsLocked: () => void;
  setPlayerStatus: (status: PlayerStatus | null) => void;
};
