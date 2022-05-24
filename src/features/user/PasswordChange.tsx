import { ChangeEvent, FormEvent, useState } from 'react';

import { userApi } from '../../api';

export interface PasswordChangeFormData {
  passwordOne: string;
  passwordTwo: string;
  error: Error | null;
}

const INITIAL_STATE: PasswordChangeFormData = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

export function PasswordChangeForm(): JSX.Element {
  const [formState, setFormsState] = useState<PasswordChangeFormData>(
    () => INITIAL_STATE
  );
  const { passwordOne, passwordTwo, error } = formState;
  const [isPasswordChangeMessageVisible, setIsPasswordChangeMessageVisible] =
    useState(false);
  const isInvalid =
    passwordOne !== passwordTwo || passwordOne === '' || passwordTwo === '';

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await userApi.doPasswordUpdate(passwordOne);

      setFormsState(INITIAL_STATE);
      setIsPasswordChangeMessageVisible(true);
    } catch (err) {
      setFormsState({ ...formState, error: err as Error });
    }
  };

  return (
    <>
      <div className="font-semibold text-lg">Password change:</div>
      <form onSubmit={onSubmit}>
        <input
          className="text-input"
          name="passwordOne"
          type="password"
          value={passwordOne}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setFormsState({ ...formState, passwordOne: event.target.value })
          }
          placeholder="Password"
        />
        <br />
        <input
          className="text-input"
          name="passwordTwo"
          type="password"
          value={passwordTwo}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setFormsState({ ...formState, passwordTwo: event.target.value })
          }
          placeholder="Confirm Password"
        />
        <br />
        <div className="my-6 w-full justify-center flex place-content-center">
          <button className="cta" disabled={isInvalid} type="submit">
            Change Password
          </button>
        </div>

        {error && <p>{error.message}</p>}
        {isPasswordChangeMessageVisible && <p>successfully changed password</p>}
      </form>
    </>
  );
}
