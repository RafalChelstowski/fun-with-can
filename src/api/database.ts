import { firebase } from './firebase';

// 403 from firebase
// const PERMISSION_DENIED_STATUS_CODE = 'PERMISSION_DENIED';

export type FirebaseError = firebase.FirebaseError;
export type FirebaseSnapshot = firebase.database.DataSnapshot;

export interface FetchParams {
  path: string;
}

export interface UpdateParams<T> {
  path: string;
  payload: T;
}

export interface RealTimeSubscribeParams<T> {
  path: string;
  event?: firebase.database.EventType;
  callback: (value: T) => void;
}

export interface RealTimeUnsubscribeParams {
  path: string;
  event?: firebase.database.EventType;
}

const database = firebase.database();

if (window.location.hostname === 'localhost') {
  database.useEmulator('localhost', 9000);
}

function handleAuthenticationErrors(error: FirebaseError) {
  if (error) {
    throw new Error(error.message);

    // handle logout
  }
}

export async function fetch<T>({ path }: FetchParams): Promise<T> {
  const snapshot = await database
    .ref(path)
    .once('value', () => new Promise<T>(() => {}), handleAuthenticationErrors);
  return snapshot.val();
}

export async function update<T>({
  path,
  payload,
}: UpdateParams<T>): Promise<T> {
  await database
    .ref(path)
    .update(payload, (err) => handleAuthenticationErrors(err as FirebaseError));

  const d = await fetch<T>({ path });

  return d;
}

export async function set<T>({ path, payload }: UpdateParams<T>): Promise<T> {
  await database.ref(path).set(payload);

  const d = await fetch<T>({ path });

  return d;
}

export async function remove<T>(path: string): Promise<T> {
  await database.ref(path).remove();

  const d = await fetch<T>({ path });

  return d;
}

export function subscribe<T>({
  path,
  callback,
  event = 'value',
}: RealTimeSubscribeParams<T>): () => void {
  const ref = database.ref(path);
  const cb = (snapshot: FirebaseSnapshot) => {
    callback(snapshot.val() as T);
  };

  ref.on(event, cb, handleAuthenticationErrors);

  return () => ref.off(event, cb);
}

export function unsubscribe({
  path,
  event = 'value',
}: RealTimeUnsubscribeParams): void {
  database.ref(path).off(event);
}
