import { useState } from 'react';
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
  Achievements as AchievementsType,
} from '../../types';

const cellClassName = 'p-6';

type AchievementMode = 'player' | 'global';

interface UsersAchievementsQueryData {
  displayName: string | undefined;
  achievements: AchievementsType;
}

interface PlayerAchievementsProps {
  achievements: Partial<Record<AchievementName, AchievementPayload>>;
  achievementsDescriptions: AchievementDescriptions;
}

export function PlayerAchievements({
  achievements,
  achievementsDescriptions,
}: PlayerAchievementsProps): JSX.Element {
  const queryClient = useQueryClient();
  const mutations = useIsMutating();
  const { uid } = useUser();
  const { update } = useUpdate<AchievementPayload>();

  return (
    <>
      {Object.entries(achievements).map(([k], i) => {
        const name = k as AchievementName;
        const { fullName, description } = achievementsDescriptions[name];
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
            className={`flex flex-row font-semibold text-lg transition-colors duration-1000 ${
              isNew && uid ? 'text-tGreen' : 'text-white'
            }`}
          >
            <div className={`w-1/6 ${cellClassName}`}>{`${i + 1}.`}</div>
            <div className={`w-1/6 font-black ${cellClassName}`}>
              {fullName}
            </div>
            <div className={`w-3/6 ${cellClassName}`}>{description}</div>
            <div className={`w-1/6 ${cellClassName}`}>{date}</div>
          </div>
        );
      })}
    </>
  );
}

function GlobalAchievements() {
  const { data: usersAchievements, isFetching } =
    useSnapshot<Record<string, UsersAchievementsQueryData>>(`users`);

  if (!usersAchievements) {
    return null;
  }

  if (isFetching) {
    return (
      <div className="flex-col items-center w-full mt-10 font-semibold text-lg">
        Loading...
      </div>
    );
  }

  const achArr = Object.entries(usersAchievements)
    .map((entry) => {
      const [userId, userAchievementsQueryData] = entry;
      return {
        id: userId,
        name: userAchievementsQueryData?.displayName || 'mysterious user',
        achievementsNumber: userAchievementsQueryData.achievements
          ? Object.entries(userAchievementsQueryData.achievements)?.length
          : 0,
      };
    })
    .sort((a, b) => b.achievementsNumber - a.achievementsNumber);

  return (
    <div className="h-4/5 overflow-hidden mt-8">
      <div className="flex flex-row font-black text-lg mb-5">
        <div className="w-1/2 text-center">User name: </div>
        <div className="w-1/2 text-center">Achievements found:</div>
      </div>

      <div className="h-full overflow-y-auto my-7">
        {achArr.map((entry) => {
          return (
            <div
              key={entry.id}
              className="flex flex-row font-semibold text-lg text-center"
            >
              <div className="w-1/2 p-4">{entry.name}</div>
              <div className="w-1/2 p-4 text-center">
                {entry.achievementsNumber}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Achievements(): JSX.Element {
  const achievements = useStore((state) => state.achievements);
  const noAchievements = isEmpty(achievements);
  const user = useUser();
  const [achievementsView, setAchievementsView] =
    useState<AchievementMode>('player');

  const { data: achievementsDescriptions, isFetching } =
    useSnapshot<AchievementDescriptions>(`achievementDescriptions`, {
      enabled: !noAchievements,
    });

  if (!achievementsDescriptions || noAchievements || isFetching) {
    return (
      <div className="flex-col items-center w-full mt-10 font-semibold text-lg">
        {isFetching ? 'Loading...' : 'No achievements...'}
      </div>
    );
  }

  return (
    <div className="flex-col items-center w-full my-10 overflow-y-auto">
      <div className="flex flex-row">
        <div className="flex w-1/2">
          <div className="text-lg font-black p-6">
            {isFetching
              ? 'Loading...'
              : `Achievements collected: ${
                  Object.entries(achievements).length
                }/${Object.entries(achievementsDescriptions).length}`}
          </div>
        </div>
        <div className="flex w-1/2 place-items-center">
          {user.uid ? (
            <button
              className="bg-tGreen font-semibold text-sm py-1 px-10 h-10"
              type="button"
              name="toggle achievements mode"
              onClick={() =>
                setAchievementsView(
                  achievementsView === 'player' ? 'global' : 'player'
                )
              }
            >
              {achievementsView === 'player' ? 'Global' : 'Local'}
            </button>
          ) : null}
        </div>
      </div>
      {achievementsView === 'player' ? (
        <PlayerAchievements
          achievements={achievements}
          achievementsDescriptions={achievementsDescriptions}
        />
      ) : (
        <GlobalAchievements />
      )}
    </div>
  );
}
