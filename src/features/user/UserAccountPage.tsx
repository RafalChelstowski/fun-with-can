import { PasswordChangeForm } from './PasswordChange';
import { PasswordForgetForm } from './PasswordForget';

export function UserAccountPage(): JSX.Element {
  return (
    <>
      <PasswordForgetForm />
      <PasswordChangeForm />
    </>
  );
}
