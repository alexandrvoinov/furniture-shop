'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { initialFormState, type ManagerFormState } from '../_actions/formState';
import styles from '../ManagerPage.module.scss';

type DeleteAction = (state: ManagerFormState, formData: FormData) => Promise<ManagerFormState>;

type ConfirmDeleteFormProps = {
  action: DeleteAction;
  confirmText: string;
  id: number;
  label?: string;
  returnTo?: string;
};

export function ConfirmDeleteForm({
  action,
  confirmText,
  id,
  label = 'Удалить',
  returnTo,
}: ConfirmDeleteFormProps) {
  const [state, formAction] = useActionState(action, initialFormState);

  return (
    <form
      action={formAction}
      className={styles.deleteForm}
      onSubmit={(event) => {
        if (!window.confirm(confirmText)) {
          event.preventDefault();
        }
      }}
    >
      <input name="id" type="hidden" value={id} />
      {returnTo ? <input name="return_to" type="hidden" value={returnTo} /> : null}
      <DeleteButton label={label} />
      {state.message ? <small className={styles.deleteError}>{state.message}</small> : null}
    </form>
  );
}

function DeleteButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button className={styles.dangerButton} disabled={pending} type="submit">
      {pending ? 'Удаляем...' : label}
    </button>
  );
}
