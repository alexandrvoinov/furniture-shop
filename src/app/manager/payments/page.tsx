import { Receipt } from 'lucide-react';
import Link from 'next/link';

import { workshopApi, type Payment } from '@/entities/workshop';
import { formatDateTime, formatPrice } from '@/shared/lib/formatters';
import { managerPaymentEditRoute, routes } from '@/shared/lib/routes';

import { deletePaymentAction } from '../_actions/deleteActions';
import { AutoFilterForm } from '../_components/AutoFilterForm';
import { ConfirmDeleteForm } from '../_components/ConfirmDeleteForm';
import {
  ApiNotice,
  EmptyState,
  PageTitle,
  PanelTitle,
  StatCard,
  StatusBadge,
} from '../_components/ManagerUi';
import {
  emptyList,
  getParam,
  getPositiveNumberParam,
  pickResult,
  type ManagerSearchParams,
} from '../_lib/managerData';
import styles from '../ManagerPage.module.scss';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type PaymentsPageProps = {
  searchParams?: Promise<ManagerSearchParams>;
};

export default async function ManagerPaymentsPage({ searchParams }: PaymentsPageProps) {
  const params = (await searchParams) ?? {};
  const orderIdInput = getParam(params, 'order_id');
  const orderId = getPositiveNumberParam(params, 'order_id');
  const results = await Promise.allSettled([
    workshopApi.listPayments({ limit: 20, offset: 0, order_id: orderId }),
  ]);

  const errors: string[] = [];
  const payments = pickResult(results[0], emptyList<Payment>(), 'payments', errors);
  const totalAmount = payments.items.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <main className={styles.page}>
      <PageTitle
        action={
          <Link className={styles.actionLink} href={routes.managerPaymentNew}>
            Новая оплата
          </Link>
        }
        eyebrow="Финансы"
        title="Оплаты"
      />
      <ApiNotice errors={errors} />

      <section className={`${styles.statsGrid} ${styles.statsGridCompact}`}>
        <StatCard
          icon={<Receipt size={23} strokeWidth={1.6} aria-hidden="true" />}
          label="Найдено оплат"
          value={String(payments.total)}
        />
        <StatCard
          icon={<Receipt size={23} strokeWidth={1.6} aria-hidden="true" />}
          label="Показано на странице"
          value={String(payments.items.length)}
        />
        <StatCard
          icon={<Receipt size={23} strokeWidth={1.6} aria-hidden="true" />}
          label="Сумма на странице"
          value={formatPrice(totalAmount)}
        />
      </section>

      <section className={styles.panel}>
        <PanelTitle title="Список оплат" total={payments.total} />

        <AutoFilterForm className={`${styles.filters} ${styles.filtersTwo}`}>
          <label>
            <span>Номер заказа</span>
            <input
              defaultValue={orderIdInput}
              inputMode="numeric"
              name="order_id"
              placeholder="Например, 12"
            />
          </label>

          <button type="submit">Применить</button>
        </AutoFilterForm>

        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>Заказ</th>
                <th>Сумма</th>
                <th>Статус</th>
                <th>Дата</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {payments.items.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>#{payment.order_id}</td>
                  <td>{formatPrice(payment.amount)}</td>
                  <td>
                    <StatusBadge label={payment.status ?? 'Без статуса'} />
                  </td>
                  <td>{formatDateTime(payment.payment_date)}</td>
                  <td>
                    <div className={styles.rowActions}>
                      <Link href={managerPaymentEditRoute(payment.id)}>Редактировать</Link>
                      <ConfirmDeleteForm
                        action={deletePaymentAction}
                        confirmText="Удалить оплату? Финансовые итоги заказа будут пересчитаны."
                        id={payment.id}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {payments.items.length === 0 ? (
            <EmptyState text="Оплаты по текущим фильтрам не найдены" />
          ) : null}
        </div>
      </section>
    </main>
  );
}
