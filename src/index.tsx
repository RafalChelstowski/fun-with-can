/* eslint-disable @typescript-eslint/no-non-null-assertion */
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider, QueryKey } from 'react-query';

import { fetch } from './api/database';
import { App } from './App';

import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container!);

export const defaultQueryFn = async ({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<unknown> => {
  const data = await fetch({ path: queryKey[0] as string });

  return data;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
});

root.render(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  <QueryClientProvider client={queryClient} contextSharing>
    <App />
  </QueryClientProvider>
);
