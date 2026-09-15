import { CircleDollarSign, ClipboardList, FileText, Receipt } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { type ClientFull, workshopApi } from '@/entities/workshop';
import { API_BASE_URL } from '@/shared/api/config';
import { formatDateTime, formatMoney, formatPrice } from '@/shared/lib/formatters';
import { managerOrderEditRoute, routes } from '@/shared/lib/routes';

import {
  deleteDrawingAction,
  deleteOrderAction,
  deletePaymentAction,
} from '../../_actions/deleteActions';
import { ConfirmDeleteForm } from '../../_components/ConfirmDeleteForm';
import {
  EmptyState,
  PageTitle,
  PanelTitle,
  StatCard,
  StatusBadge,
} from '../../_components/ManagerUi';
import styles from '../../ManagerPage.module.scss';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const orderId = Number((await params).id);

  if (!Number.isInteger(orderId) || orderId <= 0) {
    notFound();
  }

  const order = await getOrderOrNotFound(orderId);
  const client = await getClient(order.client_id);
  const orderHref = `/manager/orders/${order.id}`;

  return (
    <main className={styles.page}>
      <PageTitle
        action={
          <div className={styles.rowActions}>
            <Link className={styles.actionLink} href={managerOrderEditRoute(order.id)}>
              Редактировать
            </Link>
            <ConfirmDeleteForm
              action={deleteOrderAction}
              confirmText="Удалить заказ? Если у заказа есть оплаты или чертежи, backend может отклонить удаление."
              id={order.id}
            />
          </div>
        }
        eyebrow="Карточка заказа"
        title={`Заказ #${order.id}`}
      />

      <section className={`${styles.statsGrid} ${styles.statsGridCompact}`}>
        <StatCard
          icon={<CircleDollarSign size={23} strokeWidth={1.6} aria-hidden="true" />}
          label="Стоимость"
          value={formatPrice(order.price)}
        />
        <StatCard
          icon={<Receipt size={23} strokeWidth={1.6} aria-hidden="true" />}
          label="Оплачено"
          value={formatMoney(order.financials.paid_amount)}
        />
        <StatCard
          icon={<CircleDollarSign size={23} strokeWidth={1.6} aria-hidden="true" />}
          label="Баланс"
          value={formatMoney(order.financials.balance_amount)}
        />
      </section>

      <div className={styles.detailGrid}>
        <section className={styles.panel}>
          <PanelTitle
            action={<StatusBadge label={order.status} />}
            eyebrow="Проект"
            title={order.product_name}
          />
          <div className={styles.panelBody}>
            <dl className={styles.definitionList}>
              <div>
                <dt>Клиент</dt>
                <dd>
                  {client ? `${client.name} · ${client.phone}` : `Клиент #${order.client_id}`}
                </dd>
              </div>
              <div>
                <dt>Материал</dt>
                <dd>{order.material}</dd>
              </div>
              <div>
                <dt>Цвет</dt>
                <dd>{order.color}</dd>
              </div>
              <div>
                <dt>Количество</dt>
                <dd>{order.quantity}</dd>
              </div>
              <div>
                <dt>Дата создания</dt>
                <dd>{formatDateTime(order.created_at)}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className={styles.panel}>
          <PanelTitle
            action={
              <StatusBadge
                label={order.financials.payment_status}
                muted={order.financials.needs_review}
              />
            }
            eyebrow="Финансы"
            title="Состояние оплаты"
          />
          <div className={styles.panelBody}>
            <dl className={styles.definitionList}>
              <div>
                <dt>Сумма заказа</dt>
                <dd>{formatMoney(order.financials.total_amount)}</dd>
              </div>
              <div>
                <dt>Ожидается</dt>
                <dd>{formatMoney(order.financials.pending_amount)}</dd>
              </div>
              <div>
                <dt>Переплата</dt>
                <dd>{formatMoney(order.financials.overpaid_amount)}</dd>
              </div>
              <div>
                <dt>Отменено</dt>
                <dd>{formatMoney(order.financials.cancelled_amount)}</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>

      <section className={styles.panel}>
        <PanelTitle
          action={
            <Link href={`${routes.managerPaymentNew}?order_id=${order.id}`}>Добавить оплату</Link>
          }
          eyebrow="Финансы"
          title="Оплаты"
          total={order.payments.length}
        />
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>Сумма</th>
                <th>Статус</th>
                <th>Дата</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {order.payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{formatPrice(payment.amount)}</td>
                  <td>
                    <StatusBadge label={payment.status ?? 'Без статуса'} />
                  </td>
                  <td>{formatDateTime(payment.payment_date)}</td>
                  <td>
                    <div className={styles.rowActions}>
                      <Link href={`/manager/payments/${payment.id}/edit`}>Редактировать</Link>
                      <ConfirmDeleteForm
                        action={deletePaymentAction}
                        confirmText="Удалить оплату? Финансовые итоги заказа будут пересчитаны."
                        id={payment.id}
                        returnTo={orderHref}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {order.payments.length === 0 ? <EmptyState text="Оплат по заказу пока нет" /> : null}
        </div>
      </section>

      <section className={styles.panel}>
        <PanelTitle
          action={
            <Link href={`${routes.managerDrawingUpload}?order_id=${order.id}`}>
              Загрузить чертеж
            </Link>
          }
          eyebrow="Производство"
          title="Чертежи"
          total={order.drawings.length}
        />
        {order.drawings.length > 0 ? (
          <div className={styles.filesGrid}>
            {order.drawings.map((drawing) => (
              <article className={styles.fileCard} key={drawing.id}>
                <FileText size={24} strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <strong>Чертеж #{drawing.id}</strong>
                  <span>{formatDateTime(drawing.created_at)}</span>
                </div>
                <a
                  className={styles.fileLink}
                  href={getFileUrl(drawing.file_url)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Открыть файл
                </a>
                <ConfirmDeleteForm
                  action={deleteDrawingAction}
                  confirmText="Удалить чертеж? Файл также будет удален, если он хранится через backend upload."
                  id={drawing.id}
                  returnTo={orderHref}
                />
              </article>
            ))}
          </div>
        ) : (
          <EmptyState text="Чертежей по заказу пока нет" />
        )}
      </section>

      <section className={styles.panel}>
        <PanelTitle eyebrow="Навигация" title="Быстрые переходы" />
        <div className={styles.panelBody}>
          <div className={styles.rowActions}>
            <Link href={routes.managerOrders}>
              <ClipboardList size={16} strokeWidth={1.7} aria-hidden="true" /> Все заказы
            </Link>
            <Link href={routes.managerPayments}>
              <Receipt size={16} strokeWidth={1.7} aria-hidden="true" /> Все оплаты
            </Link>
            <Link href={routes.managerDrawings}>
              <FileText size={16} strokeWidth={1.7} aria-hidden="true" /> Все чертежи
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

async function getOrderOrNotFound(orderId: number) {
  try {
    return await workshopApi.getOrder(orderId);
  } catch {
    notFound();
  }
}

async function getClient(clientId: number): Promise<ClientFull | null> {
  try {
    return await workshopApi.getClient(clientId);
  } catch {
    return null;
  }
}

function getFileUrl(fileUrl: string) {
  if (/^https?:\/\//i.test(fileUrl)) {
    return fileUrl;
  }

  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
  return new URL(fileUrl.replace(/^\//, ''), baseUrl).toString();
}
