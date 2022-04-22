import firebase from 'firebase';

export type FirebaseApp = typeof firebase;
export type UserCredential = firebase.auth.UserCredential;

export type User = firebase.User;
