import { useIsMutating, useQueryClient } from 'react-query';

import isEmpty from 'lodash/isEmpty';

import { useUpdate } from '../../api/hooks/useSet';
import { useSnapshot } from '../../api/hooks/useSnapshot';
import { useUser } from '../../api/hooks/useUser';
import { useStore } from '../../store/store';
import {
  AchievementDescriptions,
  AchievementName,
  AchievementPayload,
  AchievementPayloadStatus,
} from '../../types';

const cellClassName = 'p-6';

export function Achievements(): JSX.Element {
  const queryClient = useQueryClient();
  const mutations = useIsMutating();
  const achievements = useStore((state) => state.achievements);
  const noAchievements = isEmpty(achievements);
  const { uid } = useUser();

  const { update } = useUpdate<AchievementPayload>();
  const { data, isFetching } = useSnapshot<AchievementDescriptions>(
    `achievementDescriptions`,
    {
      enabled: !noAchievements,
    }
  );

  if (isFetching) {
    return <>loading...</>;
  }

  if (!data || noAchievements) {
    return (
      <div className="flex-col items-center w-2/3 mt-40">
        No achievements :( You can create an account to get your first one!
      </div>
    );
  }

  return (
    <div className="flex-col items-center w-2/3 mt-40">
      {Object.entries(achievements).map(([k], i) => {
        const name = k as AchievementName;
        const { fullName, description } = data[name];
        const { date, status } = achievements[name] || {
          date: '-',
          status: AchievementPayloadStatus.VIEWED,
        };
        const isNew = status === AchievementPayloadStatus.NEW;

        return (
          // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
          <div
            onMouseOver={async () => {
              if (uid && isNew && mutations === 0) {
                await update({
                  path: `users/${uid}/achievements/${name}`,
                  payload: {
                    date,
                    status: AchievementPayloadStatus.VIEWED,
                  },
                });
                queryClient.refetchQueries([`users/${uid}/achievements`]);
              }
            }}
            key={k}
            className={`flex flex-row ${
              isNew && uid ? 'bg-yellow-200' : 'bg-white'
            }`}
          >
            <div className={`w-1/6 ${cellClassName}`}>
              {isNew ? 'NEW!' : i + 1}
            </div>
            <div className={`w-2/6 ${cellClassName}`}>{fullName}</div>
            <div className={`w-2/6 ${cellClassName}`}>{description}</div>
            <div className={`w-1/6 ${cellClassName}`}>{date}</div>
          </div>
        );
      })}
    </div>
  );
}
