'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { routes } from '@/shared/lib/routes';

import { initialFormState, type ManagerFormState } from '../_actions/formState';
import styles from '../ManagerPage.module.scss';

type ClientFormAction = (state: ManagerFormState, formData: FormData) => Promise<ManagerFormState>;

type ClientFormProps = {
  action: ClientFormAction;
  defaultValues?: {
    id?: number;
    name?: string;
    phone?: string;
  };
  submitLabel: string;
};

export function ClientForm({ action, defaultValues, submitLabel }: ClientFormProps) {
  const [state, formAction] = useActionState(action, initialFormState);

  return (
    <form action={formAction} className={styles.form}>
      {defaultValues?.id ? <input name="id" type="hidden" value={defaultValues.id} /> : null}

      {state.message ? <p className={styles.formMessage}>{state.message}</p> : null}

      <div className={styles.formGrid}>
        <label className={styles.field}>
          <span>Имя клиента</span>
          <input
            aria-invalid={Boolean(state.errors?.name)}
            defaultValue={defaultValues?.name}
            name="name"
            placeholder="Например, Анна Иванова"
          />
          <FieldError text={state.errors?.name} />
        </label>

        <label className={styles.field}>
          <span>Телефон</span>
          <input
            aria-invalid={Boolean(state.errors?.phone)}
            defaultValue={defaultValues?.phone}
            name="phone"
            placeholder="+7 900 000-00-00"
          />
          <FieldError text={state.errors?.phone} />
        </label>
      </div>

      <div className={styles.formActions}>
        <SubmitButton label={submitLabel} />
        <Link className={styles.secondaryLink} href={routes.managerClients}>
          Отмена
        </Link>
      </div>
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit">
      {pending ? 'Сохраняем...' : label}
    </button>
  );
}

function FieldError({ text }: { text?: string }) {
  return text ? <small className={styles.fieldError}>{text}</small> : null;
}
