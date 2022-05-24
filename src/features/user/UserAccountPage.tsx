import { PasswordChangeForm } from './PasswordChange';
import { PasswordForgetForm } from './PasswordForget';

export function UserAccountPage(): JSX.Element {
  return (
    <div className="flex flex-row w-full">
      <div className="flex flex-col place-content-center place-items-start w-1/2">
        <PasswordForgetForm />
      </div>
      <div className="flex flex-col place-content-center place-items-start w-1/2">
        <PasswordChangeForm />
      </div>
    </div>
  );
}
