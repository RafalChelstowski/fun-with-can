import { UseMutateAsyncFunction, useMutation } from 'react-query';

import { remove } from '../database';

export type RemoveFn = UseMutateAsyncFunction<
  unknown,
  unknown,
  string,
  unknown
>;

interface MutationResults {
  remove: RemoveFn;
}

export function useRemove(): MutationResults {
  const { mutateAsync } = useMutation(async (path: string) => {
    const result = await remove(path);
    return result;
  });

  return { remove: mutateAsync };
}
