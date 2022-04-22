import { useEffect } from 'react';
import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from 'react-query';

import { subscribe } from '../database';

export function useRealtimeQuery<T>(
  path: string,
  options: UseQueryOptions<T, unknown, T, string> = {}
): UseQueryResult<T, unknown> {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = subscribe<T>({
      path,
      callback: (val) => {
        queryClient.setQueryData(path, val);
      },
    });

    return () => unsubscribe();
  }, [queryClient, path]);

  return useQuery(path, () => new Promise<T>(() => {}), options);
}
