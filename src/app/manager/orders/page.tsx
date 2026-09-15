import { ClipboardList } from 'lucide-react';
import Link from 'next/link';

import { workshopApi, type MetadataResponse, type Order } from '@/entities/workshop';
import { formatDateTime, formatPrice } from '@/shared/lib/formatters';
import { managerOrderEditRoute, managerOrderRoute, routes } from '@/shared/lib/routes';

import { deleteOrderAction } from '../_actions/deleteActions';
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
  loadAllPages,
  normalizeSearch,
  pickResult,
  toVisibleList,
  type ManagerSearchParams,
} from '../_lib/managerData';
import styles from '../ManagerPage.module.scss';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type OrdersPageProps = {
  searchParams?: Promise<ManagerSearchParams>;
};

const emptyMetadata: MetadataResponse = {
  order_statuses: [],
  payment_states: [],
  payment_statuses: [],
};

export default async function ManagerOrdersPage({ searchParams }: OrdersPageProps) {
  const params = (await searchParams) ?? {};
  const q = getParam(params, 'q');
  const status = getParam(params, 'status');
  const material = getParam(params, 'material');
  const hasLocalTextFilter = Boolean(q || material);

  const results = await Promise.allSettled([
    workshopApi.getMetadata(),
    hasLocalTextFilter
      ? loadAllPages((pagination) =>
          workshopApi.listOrders({
            ...pagination,
            sort_by: 'created_at',
            sort_order: 'desc',
            status: status || undefined,
          }),
        )
      : workshopApi.listOrders({
          limit: 20,
          offset: 0,
          sort_by: 'created_at',
          sort_order: 'desc',
          status: status || undefined,
        }),
  ]);

  const errors: string[] = [];
  const metadata = pickResult(results[0], emptyMetadata, 'metadata', errors);
  const rawOrders = pickResult(results[1], emptyList<Order>(), 'orders', errors);
  const orders = hasLocalTextFilter ? filterOrders(rawOrders.items, { material, q }) : rawOrders;

  return (
    <main className={styles.page}>
      <PageTitle
        action={
          <Link className={styles.actionLink} href={routes.managerOrderNew}>
            Новый заказ
          </Link>
        }
        eyebrow="Проекты"
        title="Заказы"
      />
      <ApiNotice errors={errors} />

      <section className={`${styles.statsGrid} ${styles.statsGridCompact}`}>
        <StatCard
          icon={<ClipboardList size={23} strokeWidth={1.6} aria-hidden="true" />}
          label="Найдено заказов"
          value={String(orders.total)}
        />
        <StatCard
          icon={<ClipboardList size={23} strokeWidth={1.6} aria-hidden="true" />}
          label="Показано на странице"
          value={String(orders.items.length)}
        />
        <StatCard
          icon={<ClipboardList size={23} strokeWidth={1.6} aria-hidden="true" />}
          label="Лимит выдачи"
          value="20"
        />
      </section>

      <section className={styles.panel}>
        <PanelTitle title="Список заказов" total={orders.total} />

        <AutoFilterForm className={styles.filters}>
          <label>
            <span>Поиск</span>
            <input defaultValue={q} name="q" placeholder="Кухня, шкаф, гардеробная" />
          </label>

          <label>
            <span>Статус</span>
            <select defaultValue={status} name="status">
              <option value="">Все статусы</option>
              {metadata.order_statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Материал</span>
            <input defaultValue={material} name="material" placeholder="МДФ, ЛДСП, шпон" />
          </label>

          <button type="submit">Применить</button>
        </AutoFilterForm>

        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>Изделие</th>
                <th>Материал</th>
                <th>Количество</th>
                <th>Статус</th>
                <th>Оплата</th>
                <th>Стоимость</th>
                <th>Дата</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {orders.items.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    <strong>
                      <Link href={managerOrderRoute(order.id)}>{order.product_name}</Link>
                    </strong>
                    <span>{order.color}</span>
                  </td>
                  <td>{order.material}</td>
                  <td>{order.quantity}</td>
                  <td>
                    <StatusBadge label={order.status} />
                  </td>
                  <td>
                    <StatusBadge
                      label={order.financials.payment_status}
                      muted={order.financials.needs_review}
                    />
                  </td>
                  <td>{formatPrice(order.price)}</td>
                  <td>{formatDateTime(order.created_at)}</td>
                  <td>
                    <div className={styles.rowActions}>
                      <Link href={managerOrderRoute(order.id)}>Открыть</Link>
                      <Link href={managerOrderEditRoute(order.id)}>Редактировать</Link>
                      <ConfirmDeleteForm
                        action={deleteOrderAction}
                        confirmText="Удалить заказ? Backend отклонит удаление, если у заказа есть оплаты или чертежи."
                        id={order.id}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.items.length === 0 ? (
            <EmptyState text="Заказы по текущим фильтрам не найдены" />
          ) : null}
        </div>
      </section>
    </main>
  );
}

function filterOrders(orders: Order[], filters: { material: string; q: string }) {
  const query = normalizeSearch(filters.q);
  const material = normalizeSearch(filters.material);
  const filtered = orders.filter((order) => {
    const matchesQuery =
      !query ||
      [order.id, order.product_name, order.material, order.color, order.status].some((value) =>
        normalizeSearch(value).includes(query),
      );

    const matchesMaterial = !material || normalizeSearch(order.material).includes(material);

    return matchesQuery && matchesMaterial;
  });

  return toVisibleList(filtered);
}
