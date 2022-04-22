import { UserCredential } from '../types';
import { firebase } from './firebase';

export const auth = firebase.auth();

if (window.location.hostname === 'localhost') {
  auth.useEmulator('http://localhost:9099');
}

const signInTestUser = (): void => {
  const email = process.env.REACT_APP_TEST_EMAIL;
  const password = process.env.REACT_APP_TEST_PASSWORD;

  if (email && password) {
    auth.signInWithEmailAndPassword(email, password);
  }
};

const doCreateUserWithEmailAndPassword = (
  email: string,
  password: string
): Promise<UserCredential> =>
  auth.createUserWithEmailAndPassword(email, password);

const doSignInWithEmailAndPassword = (
  email: string,
  password: string
): Promise<UserCredential> => auth.signInWithEmailAndPassword(email, password);

const doSignOut = (): Promise<void> => auth.signOut();

const doPasswordReset = (email: string): Promise<void> =>
  auth.sendPasswordResetEmail(email);

const doPasswordUpdate = (password: string): Promise<void> | void => {
  if (auth.currentUser) {
    auth.currentUser?.updatePassword(password);
  }
};

const userApi = {
  auth,
  signInTestUser,
  doCreateUserWithEmailAndPassword,
  doSignInWithEmailAndPassword,
  doSignOut,
  doPasswordReset,
  doPasswordUpdate,
};

export { userApi };
