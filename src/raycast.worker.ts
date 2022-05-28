// const createWorker = () =>
//   new Worker('../../raycast.worker.ts', { type: 'module' });

import { exposeWorker } from 'react-hooks-worker';

const fn = () => {
  const num = 1;

  return num;
};

exposeWorker(fn);
