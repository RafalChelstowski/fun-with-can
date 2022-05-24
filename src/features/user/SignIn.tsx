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
          className="text-input"
          name="email"
          type="email"
          value={email}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setFormsState({ ...formState, email: event.target.value })
          }
          placeholder="e-mail"
        />
        <br />
        <input
          className="text-input"
          name="password"
          type="password"
          value={password}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setFormsState({ ...formState, password: event.target.value })
          }
          placeholder="Password"
        />
        <br />
        <div className="my-6 w-full justify-center flex place-content-center">
          <button className="cta" disabled={isInvalid} type="submit">
            Log In
          </button>
        </div>

        <div>{error && <p>{error.message}</p>}</div>
      </form>
    </>
  );
}

export function SignInPage(): JSX.Element {
  return (
    <div className="flex flex-col w-full place-content-center place-items-center">
      <div className="font-semibold text-lg">
        Log in to an existing account:
      </div>
      <SignInForm />
      <PasswordForgetLink />
      <SignUpPageLink />
    </div>
  );
}
