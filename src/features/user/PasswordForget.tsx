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
    <div className="mt-10">
      <h1>Password forget: </h1>
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

        <button disabled={isInvalid} type="submit">
          Reset
        </button>

        {error && <p>{error.message}</p>}
        {isPasswordMessageVisible && (
          <p>password reset was successfully sent</p>
        )}
      </form>
      {JSON.stringify(formState)}
    </div>
  );
}

export function PasswordForgetPage(): JSX.Element {
  return (
    <div style={{ marginTop: '300px' }}>
      <h1>reset password</h1>
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
