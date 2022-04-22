import { ChangeEvent, FormEvent, useState } from 'react';

import { Link } from 'wouter';

import { userApi } from '../../api';
import { useSet } from '../../api/hooks/useSet';
// import { useSnapshot } from '../../api/hooks/useSnapshot';
import { routes } from '../Ui';

export interface SignUpFormData {
  username: string;
  email: string;
  passwordOne: string;
  passwordTwo: string;
  error: Error | null;
}

const INITIAL_STATE: SignUpFormData = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

function SignUpForm(): JSX.Element {
  const [formState, setFormsState] = useState<SignUpFormData>(
    () => INITIAL_STATE
  );
  const { username, email, passwordOne, passwordTwo, error } = formState;
  const { set } = useSet();
  // const { data: initialUnit } = useSnapshot<Unit>(`units/initialUnit`);

  const isInvalid =
    passwordOne !== passwordTwo ||
    passwordOne === '' ||
    email === '' ||
    username === '';

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const newUser = await userApi.doCreateUserWithEmailAndPassword(
        email,
        passwordOne
      );

      await new Promise((resolve) => {
        if (!newUser.user) {
          throw new Error('something went wrong while adding initial unit');
        }

        set(
          {
            path: `users/${newUser.user.uid}`,
            payload: { lol: 'lol' },
          },
          {
            onSuccess: (res) => {
              resolve(res);
            },
          }
        );
      });
    } catch (err) {
      setFormsState({ ...formState, error: err as Error });
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          name="username"
          type="text"
          value={username}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setFormsState({ ...formState, username: event.target.value })
          }
          placeholder="Username"
        />
        <input
          name="email"
          type="email"
          value={email}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setFormsState({ ...formState, email: event.target.value })
          }
          placeholder="e-mail"
        />
        <input
          name="passwordOne"
          type="password"
          value={passwordOne}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setFormsState({ ...formState, passwordOne: event.target.value })
          }
          placeholder="Password"
        />
        <input
          name="passwordTwo"
          type="password"
          value={passwordTwo}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setFormsState({ ...formState, passwordTwo: event.target.value })
          }
          placeholder="Confirm Password"
        />

        <button disabled={isInvalid} type="submit">
          Sign Up
        </button>

        {error && <p>{error.message}</p>}
      </form>
      {JSON.stringify(formState)}
    </>
  );
}

export function SignUpPage(): JSX.Element {
  return (
    <div style={{ marginTop: '300px' }}>
      <h1>sign up:</h1>
      <SignUpForm />
    </div>
  );
}

export function SignUpPageLink(): JSX.Element {
  return (
    <p>
      <Link to={routes.SIGN_UP}>Sign Up</Link>
    </p>
  );
}
