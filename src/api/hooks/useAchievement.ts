import { useIsMutating } from 'react-query';
import { toast } from 'react-toastify';

import { useStore } from '../../store/store';
import { AchievementName } from '../../types';
import { useSet } from './useSet';
import { useUser } from './useUser';

export function useAchievement(): {
  addAchievement: (name: AchievementName) => Promise<void>;
} {
  const mutations = useIsMutating();
  const achievements = useStore((state) => state.achievements);
  const setAchievement = useStore((state) => state.setAchievement);
  const { uid } = useUser();
  const { set } = useSet();

  const addAchievement = async (name: AchievementName) => {
    if (achievements[name] === true) {
      return;
    }

    setAchievement(name);
    toast.success('New achievement!');

    if (mutations > 0 || !uid) {
      return;
    }

    try {
      await set({
        path: `users/${uid}/achievements/${name}`,
        payload: true,
      });
    } catch (err) {
      toast.error(
        'You have earned a new achievement but there was an error saving it to the db, sorry :('
      );
    }
  };

  return { addAchievement };
}
