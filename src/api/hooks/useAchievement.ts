import { useIsMutating } from 'react-query';
import { toast } from 'react-toastify';

import isUndefined from 'lodash/isUndefined';

import { getState, setState } from '../../store/store';
import { AchievementName, AchievementPayloadStatus } from '../../types';
import { useSet } from './useSet';
import { useUser } from './useUser';

export function useAchievement(): {
  addAchievement: (name: AchievementName) => Promise<void>;
} {
  const mutations = useIsMutating();
  const { uid } = useUser();
  const { set } = useSet();

  const addAchievement = async (name: AchievementName) => {
    const { achievements } = getState();

    if (!isUndefined(achievements[name])) {
      return;
    }

    const payload = {
      date: new Date().toDateString(),
      status: AchievementPayloadStatus.NEW,
    };

    setState({ achievements: { ...achievements, [name]: payload } });
    toast.success('New achievement!');

    if (mutations > 0 || !uid) {
      return;
    }

    try {
      await set({
        path: `users/${uid}/achievements/${name}`,
        payload,
      });
    } catch (err) {
      toast.error(
        'You have earned a new achievement but there was an error saving it to the db, sorry :('
      );
    }
  };

  return { addAchievement };
}
