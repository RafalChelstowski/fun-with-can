import { ChangeEvent, FormEvent, useState } from 'react';

import { Link } from 'wouter';

import { userApi } from '../../api';
import { routes } from '../Nav';

export interface PasswordForgetFormData {
  email: string;
  error: Error | null;
}

const INITIAL_STATE: PasswordForgetFormData = {
  email: '',
  error: null,
};

export function PasswordForgetForm(): JSX.Element {
  const [formState, setFormsState] = useState<PasswordForgetFormData>(
    () => INITIAL_STATE
  );
  const [isPasswordMessageVisible, setIsPasswordMessageVisible] =
    useState(false);
  const { email, error } = formState;
  const isInvalid = email === '';

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await userApi.doPasswordReset(email);

      setIsPasswordMessageVisible(true);
      setFormsState(INITIAL_STATE);
    } catch (err) {
      setFormsState({ ...formState, error: err as Error });
    }
  };

  return (
    <>
      <div className="font-semibold text-lg">Password forget: </div>
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
        <div className="my-6 w-full justify-center flex place-content-center">
          <button className="cta" disabled={isInvalid} type="submit">
            Reset
          </button>
        </div>

        {error && <p>{error.message}</p>}
        {isPasswordMessageVisible && (
          <p>password reset was successfully sent</p>
        )}
      </form>
    </>
  );
}

export function PasswordForgetPage(): JSX.Element {
  return (
    <div className="flex flex-col w-full place-content-center place-items-center">
      <PasswordForgetForm />
    </div>
  );
}

export function PasswordForgetLink(): JSX.Element {
  return (
    <p>
      <Link to={routes.PASSWORD_FORGET}>Forgot Password?</Link>
    </p>
  );
}
