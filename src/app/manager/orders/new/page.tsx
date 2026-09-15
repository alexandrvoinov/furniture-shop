import Link from 'next/link';

import { workshopApi, type Client } from '@/entities/workshop';
import { routes } from '@/shared/lib/routes';

import { createOrderAction } from '../../_actions/orderActions';
import { OrderForm } from '../../_components/OrderForm';
import { ApiNotice, EmptyState, PageTitle, PanelTitle } from '../../_components/ManagerUi';
import { emptyList, pickResult } from '../../_lib/managerData';
import styles from '../../ManagerPage.module.scss';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function NewOrderPage() {
  const results = await Promise.allSettled([workshopApi.listClients({ limit: 100, offset: 0 })]);
  const errors: string[] = [];
  const clients = pickResult(results[0], emptyList<Client>(), 'clients', errors);

  return (
    <main className={styles.page}>
      <PageTitle eyebrow="Новый проект" title="Создать заказ" />
      <ApiNotice errors={errors} />

      <section className={styles.panel}>
        <PanelTitle
          eyebrow="Карточка"
          title="Данные заказа"
          action={<Link href={routes.managerClientNew}>Добавить клиента</Link>}
        />
        {clients.items.length > 0 ? (
          <OrderForm
            action={createOrderAction}
            clients={clients.items}
            mode="create"
            statuses={[]}
            submitLabel="Создать заказ"
          />
        ) : (
          <EmptyState text="Сначала добавьте клиента, чтобы создать заказ" />
        )}
      </section>
    </main>
  );
}
