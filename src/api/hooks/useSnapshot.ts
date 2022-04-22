import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';

import { fetch } from '../database';

export function useSnapshot<T>(
  firebasePathKey: string,
  options: UseQueryOptions<T, unknown, T, string> = {}
): UseQueryResult<T, unknown> {
  return useQuery(
    firebasePathKey,
    () => fetch<T>({ path: firebasePathKey }),
    options
  );
}
