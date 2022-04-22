import { ChangeEvent, FormEvent, useState } from 'react';

import { userApi } from '../../api';
import { PasswordForgetLink } from './PasswordForget';
import { SignUpPageLink } from './SignUp';

export interface SignInFormData {
  email: string;
  password: string;
  error: Error | null;
}

const INITIAL_STATE: SignInFormData = {
  email: '',
  password: '',
  error: null,
};

function SignInForm(): JSX.Element {
  const [formState, setFormsState] = useState<SignInFormData>(
    () => INITIAL_STATE
  );
  const { email, password, error } = formState;
  const isInvalid = password === '' || email === '';

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await userApi.doSignInWithEmailAndPassword(email, password);
    } catch (err) {
      setFormsState({ ...formState, error: err as Error });
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
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
          name="password"
          type="password"
          value={password}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setFormsState({ ...formState, password: event.target.value })
          }
          placeholder="Password"
        />

        <button disabled={isInvalid} type="submit">
          Sign In
        </button>

        {error && <p>{error.message}</p>}
      </form>
      {JSON.stringify(formState)}
    </>
  );
}

export function SignInPage(): JSX.Element {
  return (
    <div style={{ marginTop: '300px' }}>
      <h1>sign in:</h1>
      <SignInForm />
      <PasswordForgetLink />
      <SignUpPageLink />
    </div>
  );
}
