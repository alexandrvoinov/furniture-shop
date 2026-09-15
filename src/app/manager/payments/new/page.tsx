import Link from 'next/link';

import { workshopApi, type MetadataResponse, type Order } from '@/entities/workshop';
import { routes } from '@/shared/lib/routes';

import { createPaymentAction } from '../../_actions/paymentActions';
import { ApiNotice, EmptyState, PageTitle, PanelTitle } from '../../_components/ManagerUi';
import { PaymentForm } from '../../_components/PaymentForm';
import {
  emptyList,
  getPositiveNumberParam,
  pickResult,
  type ManagerSearchParams,
} from '../../_lib/managerData';
import styles from '../../ManagerPage.module.scss';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const emptyMetadata: MetadataResponse = {
  order_statuses: [],
  payment_states: [],
  payment_statuses: [],
};

type NewPaymentPageProps = {
  searchParams?: Promise<ManagerSearchParams>;
};

export default async function NewPaymentPage({ searchParams }: NewPaymentPageProps) {
  const params = (await searchParams) ?? {};
  const orderId = getPositiveNumberParam(params, 'order_id');
  const results = await Promise.allSettled([
    workshopApi.getMetadata(),
    workshopApi.listOrders({ limit: 100, offset: 0, sort_by: 'created_at', sort_order: 'desc' }),
  ]);
  const errors: string[] = [];
  const metadata = pickResult(results[0], emptyMetadata, 'metadata', errors);
  const orders = pickResult(results[1], emptyList<Order>(), 'orders', errors);

  return (
    <main className={styles.page}>
      <PageTitle eyebrow="Новая оплата" title="Добавить оплату" />
      <ApiNotice errors={errors} />

      <section className={styles.panel}>
        <PanelTitle
          action={<Link href={routes.managerOrderNew}>Создать заказ</Link>}
          eyebrow="Финансы"
          title="Данные оплаты"
        />
        {orders.items.length > 0 ? (
          <PaymentForm
            action={createPaymentAction}
            defaultValues={{ order_id: orderId }}
            mode="create"
            orders={orders.items}
            statuses={metadata.payment_statuses}
            submitLabel="Добавить оплату"
          />
        ) : (
          <EmptyState text="Сначала создайте заказ, чтобы добавить оплату" />
        )}
      </section>
    </main>
  );
}
