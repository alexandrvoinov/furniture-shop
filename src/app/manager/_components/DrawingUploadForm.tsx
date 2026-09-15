'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import type { Order } from '@/entities/workshop';
import { routes } from '@/shared/lib/routes';

import { initialFormState, type ManagerFormState } from '../_actions/formState';
import styles from '../ManagerPage.module.scss';

type DrawingUploadAction = (
  state: ManagerFormState,
  formData: FormData,
) => Promise<ManagerFormState>;

type DrawingUploadFormProps = {
  action: DrawingUploadAction;
  defaultOrderId?: number;
  orders: Order[];
};

export function DrawingUploadForm({ action, defaultOrderId, orders }: DrawingUploadFormProps) {
  const [state, formAction] = useActionState(action, initialFormState);

  return (
    <form action={formAction} className={styles.form}>
      {state.message ? <p className={styles.formMessage}>{state.message}</p> : null}

      <div className={styles.formGrid}>
        <label className={styles.field}>
          <span>Заказ</span>
          <select
            aria-invalid={Boolean(state.errors?.order_id)}
            defaultValue={defaultOrderId ? String(defaultOrderId) : ''}
            name="order_id"
          >
            <option value="">Выберите заказ</option>
            {orders.map((order) => (
              <option key={order.id} value={order.id}>
                #{order.id} · {order.product_name}
              </option>
            ))}
          </select>
          <FieldError text={state.errors?.order_id} />
        </label>

        <label className={styles.field}>
          <span>Файл</span>
          <input
            accept=".pdf,.png,.jpg,.jpeg,.webp,.dxf,.dwg"
            aria-invalid={Boolean(state.errors?.file)}
            name="file"
            type="file"
          />
          <small className={styles.fieldHint}>PDF, PNG, JPG, WEBP, DXF или DWG.</small>
          <FieldError text={state.errors?.file} />
        </label>
      </div>

      <div className={styles.formActions}>
        <SubmitButton />
        <Link className={styles.secondaryLink} href={routes.managerDrawings}>
          Отмена
        </Link>
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit">
      {pending ? 'Загружаем...' : 'Загрузить чертеж'}
    </button>
  );
}

function FieldError({ text }: { text?: string }) {
  return text ? <small className={styles.fieldError}>{text}</small> : null;
}
