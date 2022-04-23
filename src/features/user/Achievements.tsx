import isEmpty from 'lodash/isEmpty';

import { useSnapshot } from '../../api/hooks/useSnapshot';
import { useStore } from '../../store/store';
import { AchievementDescriptions, AchievementName } from '../../types';

const cellClassName = 'p-6';

export function Achievements(): JSX.Element | null {
  const achievements = useStore((state) => state.achievements);
  const noAchievements = isEmpty(achievements);

  const { data } = useSnapshot<AchievementDescriptions>(
    `achievementDescriptions`,
    {
      enabled: !noAchievements,
    }
  );

  if (!data || noAchievements) {
    return (
      <div className="mt-12 flex justify-center">
        No achievements :( You can create an account to get your first one!
      </div>
    );
  }

  return (
    <div className="mt-12 flex justify-center">
      {Object.entries(achievements).map(([k], i) => {
        const { fullName, description } = data[k as AchievementName];

        return (
          <div key={k} className="flex flex-row w-2/3">
            <div className={`w-1/6 ${cellClassName}`}>{i + 1}</div>
            <div className={`w-2/6 ${cellClassName}`}>{fullName}</div>
            <div className={`w-3/6 ${cellClassName}`}>{description}</div>
          </div>
        );
      })}
    </div>
  );
}
