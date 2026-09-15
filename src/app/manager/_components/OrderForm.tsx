'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import type { Client } from '@/entities/workshop';
import { routes } from '@/shared/lib/routes';

import { initialFormState, type ManagerFormState } from '../_actions/formState';
import styles from '../ManagerPage.module.scss';

type OrderFormAction = (state: ManagerFormState, formData: FormData) => Promise<ManagerFormState>;

type OrderFormValues = {
  client_id?: number;
  color?: string;
  id?: number;
  material?: string;
  price?: number;
  product_name?: string;
  quantity?: number;
  status?: string;
};

type OrderFormProps = {
  action: OrderFormAction;
  clients: Client[];
  defaultValues?: OrderFormValues;
  mode: 'create' | 'edit';
  statuses: string[];
  submitLabel: string;
};

export function OrderForm({
  action,
  clients,
  defaultValues,
  mode,
  statuses,
  submitLabel,
}: OrderFormProps) {
  const [state, formAction] = useActionState(action, initialFormState);
  const selectedClientId = defaultValues?.client_id ? String(defaultValues.client_id) : '';
  const clientOptions =
    selectedClientId && !clients.some((client) => String(client.id) === selectedClientId)
      ? [
          {
            created_at: null,
            id: Number(selectedClientId),
            name: `Клиент #${selectedClientId}`,
            phone: 'не найден в текущей выдаче',
          },
          ...clients,
        ]
      : clients;

  return (
    <form action={formAction} className={styles.form}>
      {defaultValues?.id ? <input name="id" type="hidden" value={defaultValues.id} /> : null}

      {state.message ? <p className={styles.formMessage}>{state.message}</p> : null}

      <div className={styles.formGrid}>
        <label className={styles.field}>
          <span>Клиент</span>
          <select
            aria-invalid={Boolean(state.errors?.client_id)}
            defaultValue={selectedClientId}
            disabled={mode === 'edit'}
            name="client_id"
          >
            <option value="">Выберите клиента</option>
            {clientOptions.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} · {client.phone}
              </option>
            ))}
          </select>
          {mode === 'edit' ? (
            <small className={styles.fieldHint}>Клиент заказа не меняется через эту форму.</small>
          ) : null}
          <FieldError text={state.errors?.client_id} />
        </label>

        {mode === 'edit' ? (
          <label className={styles.field}>
            <span>Статус</span>
            <select
              aria-invalid={Boolean(state.errors?.status)}
              defaultValue={defaultValues?.status}
              name="status"
            >
              <option value="">Выберите статус</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <FieldError text={state.errors?.status} />
          </label>
        ) : null}

        <label className={styles.field}>
          <span>Изделие</span>
          <input
            aria-invalid={Boolean(state.errors?.product_name)}
            defaultValue={defaultValues?.product_name}
            name="product_name"
            placeholder="Кухня, шкаф, гардеробная"
          />
          <FieldError text={state.errors?.product_name} />
        </label>

        <label className={styles.field}>
          <span>Материал</span>
          <input
            aria-invalid={Boolean(state.errors?.material)}
            defaultValue={defaultValues?.material}
            name="material"
            placeholder="МДФ, ЛДСП, шпон"
          />
          <FieldError text={state.errors?.material} />
        </label>

        <label className={styles.field}>
          <span>Цвет</span>
          <input
            aria-invalid={Boolean(state.errors?.color)}
            defaultValue={defaultValues?.color}
            name="color"
            placeholder="Молочный, графит, орех"
          />
          <FieldError text={state.errors?.color} />
        </label>

        <label className={styles.field}>
          <span>Количество</span>
          <input
            aria-invalid={Boolean(state.errors?.quantity)}
            defaultValue={defaultValues?.quantity ?? 1}
            inputMode="numeric"
            min={1}
            name="quantity"
            step={1}
            type="number"
          />
          <FieldError text={state.errors?.quantity} />
        </label>

        <label className={styles.field}>
          <span>Стоимость</span>
          <input
            aria-invalid={Boolean(state.errors?.price)}
            defaultValue={defaultValues?.price}
            inputMode="decimal"
            min={0}
            name="price"
            placeholder="0"
            step="0.01"
            type="number"
          />
          <FieldError text={state.errors?.price} />
        </label>
      </div>

      <div className={styles.formActions}>
        <SubmitButton label={submitLabel} />
        <Link className={styles.secondaryLink} href={routes.managerOrders}>
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
