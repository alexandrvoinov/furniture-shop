'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import type { Order } from '@/entities/workshop';
import { routes } from '@/shared/lib/routes';

import { initialFormState, type ManagerFormState } from '../_actions/formState';
import styles from '../ManagerPage.module.scss';

type PaymentFormAction = (state: ManagerFormState, formData: FormData) => Promise<ManagerFormState>;

type PaymentFormValues = {
  amount?: number;
  id?: number;
  order_id?: number;
  status?: null | string;
};

type PaymentFormProps = {
  action: PaymentFormAction;
  defaultValues?: PaymentFormValues;
  mode: 'create' | 'edit';
  orders: Order[];
  statuses: string[];
  submitLabel: string;
};

export function PaymentForm({
  action,
  defaultValues,
  mode,
  orders,
  statuses,
  submitLabel,
}: PaymentFormProps) {
  const [state, formAction] = useActionState(action, initialFormState);
  const selectedOrderId = defaultValues?.order_id ? String(defaultValues.order_id) : '';
  const orderOptions =
    selectedOrderId && !orders.some((order) => String(order.id) === selectedOrderId)
      ? [
          {
            client_id: 0,
            color: '',
            created_at: null,
            financials: {
              balance_amount: null,
              cancelled_amount: '0.00',
              needs_review: false,
              overpaid_amount: null,
              paid_amount: '0.00',
              payment_status: '',
              pending_amount: '0.00',
              total_amount: '0.00',
              unclassified_payments_count: 0,
            },
            id: Number(selectedOrderId),
            material: '',
            price: 0,
            product_name: `Заказ #${selectedOrderId}`,
            quantity: 1,
            status: '',
          },
          ...orders,
        ]
      : orders;

  return (
    <form action={formAction} className={styles.form}>
      {defaultValues?.id ? <input name="id" type="hidden" value={defaultValues.id} /> : null}

      {state.message ? <p className={styles.formMessage}>{state.message}</p> : null}

      <div className={styles.formGrid}>
        <label className={styles.field}>
          <span>Заказ</span>
          <select
            aria-invalid={Boolean(state.errors?.order_id)}
            defaultValue={selectedOrderId}
            disabled={mode === 'edit'}
            name="order_id"
          >
            <option value="">Выберите заказ</option>
            {orderOptions.map((order) => (
              <option key={order.id} value={order.id}>
                #{order.id} · {order.product_name}
              </option>
            ))}
          </select>
          {mode === 'edit' ? (
            <small className={styles.fieldHint}>Заказ оплаты не меняется через эту форму.</small>
          ) : null}
          <FieldError text={state.errors?.order_id} />
        </label>

        <label className={styles.field}>
          <span>Статус</span>
          <select
            aria-invalid={Boolean(state.errors?.status)}
            defaultValue={defaultValues?.status ?? ''}
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

        <label className={styles.field}>
          <span>Сумма</span>
          <input
            aria-invalid={Boolean(state.errors?.amount)}
            defaultValue={defaultValues?.amount}
            inputMode="decimal"
            min={0}
            name="amount"
            placeholder="0"
            step="0.01"
            type="number"
          />
          <FieldError text={state.errors?.amount} />
        </label>
      </div>

      <div className={styles.formActions}>
        <SubmitButton label={submitLabel} />
        <Link className={styles.secondaryLink} href={routes.managerPayments}>
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
