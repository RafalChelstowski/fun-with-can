import { UseMutateAsyncFunction, useMutation } from 'react-query';

import { set as dbSet } from '../database';

export interface SetMutationParams<T> {
  path: string;
  payload: T;
}

export type MutationFn<T> = UseMutateAsyncFunction<
  T,
  unknown,
  SetMutationParams<T>,
  unknown
>;

export interface SetMutationResults<T> {
  set: MutationFn<T>;
  reset: () => void;
}

export function useSet<T>(): SetMutationResults<T> {
  const { mutateAsync, reset } = useMutation(
    async (params: SetMutationParams<T>) => {
      const { path, payload } = params;
      const result = await dbSet({
        path,
        payload,
      });

      return result;
    }
  );

  const set = async (variables: SetMutationParams<T>) => {
    const result = await mutateAsync(variables);

    return result;
  };

  return { set, reset };
}
