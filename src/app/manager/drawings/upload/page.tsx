import Link from 'next/link';

import { workshopApi, type Order } from '@/entities/workshop';
import { routes } from '@/shared/lib/routes';

import { uploadDrawingAction } from '../../_actions/drawingActions';
import { DrawingUploadForm } from '../../_components/DrawingUploadForm';
import { ApiNotice, EmptyState, PageTitle, PanelTitle } from '../../_components/ManagerUi';
import {
  emptyList,
  getPositiveNumberParam,
  pickResult,
  type ManagerSearchParams,
} from '../../_lib/managerData';
import styles from '../../ManagerPage.module.scss';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type UploadDrawingPageProps = {
  searchParams?: Promise<ManagerSearchParams>;
};

export default async function UploadDrawingPage({ searchParams }: UploadDrawingPageProps) {
  const params = (await searchParams) ?? {};
  const orderId = getPositiveNumberParam(params, 'order_id');
  const results = await Promise.allSettled([
    workshopApi.listOrders({ limit: 100, offset: 0, sort_by: 'created_at', sort_order: 'desc' }),
  ]);
  const errors: string[] = [];
  const orders = pickResult(results[0], emptyList<Order>(), 'orders', errors);

  return (
    <main className={styles.page}>
      <PageTitle eyebrow="Файл производства" title="Загрузить чертеж" />
      <ApiNotice errors={errors} />

      <section className={styles.panel}>
        <PanelTitle
          action={<Link href={routes.managerOrderNew}>Создать заказ</Link>}
          eyebrow="Чертеж"
          title="Файл и заказ"
        />
        {orders.items.length > 0 ? (
          <DrawingUploadForm
            action={uploadDrawingAction}
            defaultOrderId={orderId}
            orders={orders.items}
          />
        ) : (
          <EmptyState text="Сначала создайте заказ, чтобы загрузить чертеж" />
        )}
      </section>
    </main>
  );
}
