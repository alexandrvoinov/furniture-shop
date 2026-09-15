import {
  AlertCircle,
  CircleDollarSign,
  ClipboardList,
  FileText,
  Receipt,
  Users,
} from 'lucide-react';
import Link from 'next/link';

import {
  workshopApi,
  type Client,
  type Drawing,
  type Order,
  type Payment,
} from '@/entities/workshop';
import { formatDateTime, formatMoney, formatPrice } from '@/shared/lib/formatters';
import { managerOrderRoute, routes } from '@/shared/lib/routes';

import {
  ApiNotice,
  EmptyState,
  PageTitle,
  PanelTitle,
  StatCard,
  StatusBadge,
} from './_components/ManagerUi';
import { defaultDashboard, emptyList, pickResult } from './_lib/managerData';
import styles from './ManagerPage.module.scss';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ManagerDashboardPage() {
  const results = await Promise.allSettled([
    workshopApi.getDashboard(),
    workshopApi.listOrders({ limit: 5, offset: 0, sort_by: 'created_at', sort_order: 'desc' }),
    workshopApi.listClients({ limit: 5, offset: 0 }),
    workshopApi.listPayments({ limit: 5, offset: 0 }),
    workshopApi.listDrawings({ limit: 6, offset: 0 }),
  ]);

  const errors: string[] = [];
  const dashboard = pickResult(results[0], defaultDashboard, 'dashboard', errors);
  const orders = pickResult(results[1], emptyList<Order>(), 'orders', errors);
  const clients = pickResult(results[2], emptyList<Client>(), 'clients', errors);
  const payments = pickResult(results[3], emptyList<Payment>(), 'payments', errors);
  const drawings = pickResult(results[4], emptyList<Drawing>(), 'drawings', errors);
  const statusTotal = dashboard.orders_by_status.reduce((sum, item) => sum + item.count, 0);

  return (
    <main className={styles.page}>
      <PageTitle eyebrow="Обзор цеха" title="Кабинет менеджера" />
      <ApiNotice errors={errors} />

      <section className={styles.statsGrid}>
        <StatCard
          icon={<Users size={23} strokeWidth={1.6} aria-hidden="true" />}
          label="Клиенты"
          value={String(dashboard.clients_count)}
        />
        <StatCard
          icon={<ClipboardList size={23} strokeWidth={1.6} aria-hidden="true" />}
          label="Заказы"
          value={String(dashboard.orders_count)}
        />
        <StatCard
          icon={<CircleDollarSign size={23} strokeWidth={1.6} aria-hidden="true" />}
          label="Сумма заказов"
          value={formatMoney(dashboard.financials.total_order_amount)}
        />
        <StatCard
          icon={<Receipt size={23} strokeWidth={1.6} aria-hidden="true" />}
          label="Оплачено"
          value={formatMoney(dashboard.financials.paid_amount)}
        />
      </section>

      <section className={`${styles.statsGrid} ${styles.statsGridCompact}`}>
        <StatCard
          icon={<CircleDollarSign size={23} strokeWidth={1.6} aria-hidden="true" />}
          label="Остаток к оплате"
          value={formatMoney(dashboard.financials.outstanding_amount)}
        />
        <StatCard
          icon={<CircleDollarSign size={23} strokeWidth={1.6} aria-hidden="true" />}
          label="Переплата"
          value={formatMoney(dashboard.financials.overpaid_amount)}
        />
        <StatCard
          icon={<AlertCircle size={23} strokeWidth={1.6} aria-hidden="true" />}
          label="Требуют проверки"
          value={String(dashboard.financials.review_orders_count)}
        />
      </section>

      <div className={styles.gridPanels}>
        <section className={styles.panel}>
          <PanelTitle
            action={<Link href={routes.managerOrders}>Открыть</Link>}
            eyebrow="Статусы"
            title="Заказы по статусам"
          />
          <div className={styles.panelBody}>
            {dashboard.orders_by_status.length > 0 ? (
              <ul className={styles.statusList}>
                {dashboard.orders_by_status.map((item) => {
                  const percent =
                    statusTotal > 0 ? Math.max((item.count / statusTotal) * 100, 4) : 0;

                  return (
                    <li key={item.status ?? 'empty'}>
                      <div className={styles.statusRow}>
                        <span>{item.status ?? 'Без статуса'}</span>
                        <strong>{item.count}</strong>
                      </div>
                      <div className={styles.statusTrack}>
                        <span style={{ width: `${percent}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <EmptyState text="Заказов пока нет" />
            )}
          </div>
        </section>

        <section className={styles.panel}>
          <PanelTitle
            action={<Link href={routes.managerClients}>Открыть</Link>}
            eyebrow="Новые контакты"
            title="Клиенты"
            total={clients.total}
          />
          <div className={styles.panelBody}>
            {clients.items.length > 0 ? (
              <ul className={styles.compactList}>
                {clients.items.map((client) => (
                  <li key={client.id}>
                    <strong>{client.name}</strong>
                    <small>
                      {client.phone} · {formatDateTime(client.created_at)}
                    </small>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState text="Клиентов пока нет" />
            )}
          </div>
        </section>
      </div>

      <section className={styles.panel}>
        <PanelTitle
          action={<Link href={routes.managerOrders}>Все заказы</Link>}
          eyebrow="Последние проекты"
          title="Заказы"
          total={orders.total}
        />
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>Изделие</th>
                <th>Материал</th>
                <th>Статус</th>
                <th>Оплата</th>
                <th>Стоимость</th>
                <th>Дата</th>
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
                </tr>
              ))}
            </tbody>
          </table>
          {orders.items.length === 0 ? <EmptyState text="Заказы пока не найдены" /> : null}
        </div>
      </section>

      <div className={styles.gridPanels}>
        <section className={styles.panel}>
          <PanelTitle
            action={<Link href={routes.managerPayments}>Открыть</Link>}
            eyebrow="Финансы"
            title="Последние оплаты"
            total={payments.total}
          />
          <div className={styles.panelBody}>
            {payments.items.length > 0 ? (
              <ul className={styles.compactList}>
                {payments.items.map((payment) => (
                  <li key={payment.id}>
                    <strong>{formatPrice(payment.amount)}</strong>
                    <small>
                      Заказ #{payment.order_id} · {payment.status ?? 'Без статуса'} ·{' '}
                      {formatDateTime(payment.payment_date)}
                    </small>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState text="Оплат пока нет" />
            )}
          </div>
        </section>

        <section className={styles.panel}>
          <PanelTitle
            action={<Link href={routes.managerDrawings}>Открыть</Link>}
            eyebrow="Файлы"
            title="Чертежи"
            total={drawings.total}
          />
          <div className={styles.panelBody}>
            {drawings.items.length > 0 ? (
              <ul className={styles.compactList}>
                {drawings.items.map((drawing) => (
                  <li key={drawing.id}>
                    <strong>
                      <FileText size={16} strokeWidth={1.6} aria-hidden="true" /> Чертеж #
                      {drawing.id}
                    </strong>
                    <small>
                      Заказ #{drawing.order_id} · {formatDateTime(drawing.created_at)}
                    </small>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState text="Чертежей пока нет" />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
