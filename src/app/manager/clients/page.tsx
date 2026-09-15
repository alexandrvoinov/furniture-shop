import { Users } from 'lucide-react';
import Link from 'next/link';

import { workshopApi, type Client } from '@/entities/workshop';
import { formatDateTime } from '@/shared/lib/formatters';
import { managerClientEditRoute, routes } from '@/shared/lib/routes';

import { deleteClientAction } from '../_actions/deleteActions';
import { AutoFilterForm } from '../_components/AutoFilterForm';
import { ConfirmDeleteForm } from '../_components/ConfirmDeleteForm';
import { ApiNotice, EmptyState, PageTitle, PanelTitle, StatCard } from '../_components/ManagerUi';
import {
  emptyList,
  getParam,
  loadAllPages,
  normalizeDigits,
  normalizeSearch,
  pickResult,
  toVisibleList,
  type ManagerSearchParams,
} from '../_lib/managerData';
import styles from '../ManagerPage.module.scss';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type ClientsPageProps = {
  searchParams?: Promise<ManagerSearchParams>;
};

export default async function ManagerClientsPage({ searchParams }: ClientsPageProps) {
  const params = (await searchParams) ?? {};
  const q = getParam(params, 'q');
  const results = await Promise.allSettled([
    q
      ? loadAllPages((pagination) => workshopApi.listClients(pagination))
      : workshopApi.listClients({ limit: 20, offset: 0 }),
  ]);

  const errors: string[] = [];
  const rawClients = pickResult(results[0], emptyList<Client>(), 'clients', errors);
  const clients = q ? filterClients(rawClients.items, q) : rawClients;

  return (
    <main className={styles.page}>
      <PageTitle
        action={
          <Link className={styles.actionLink} href={routes.managerClientNew}>
            Новый клиент
          </Link>
        }
        eyebrow="Контакты"
        title="Клиенты"
      />
      <ApiNotice errors={errors} />

      <section className={`${styles.statsGrid} ${styles.statsGridCompact}`}>
        <StatCard
          icon={<Users size={23} strokeWidth={1.6} aria-hidden="true" />}
          label="Найдено клиентов"
          value={String(clients.total)}
        />
        <StatCard
          icon={<Users size={23} strokeWidth={1.6} aria-hidden="true" />}
          label="Показано на странице"
          value={String(clients.items.length)}
        />
        <StatCard
          icon={<Users size={23} strokeWidth={1.6} aria-hidden="true" />}
          label="Лимит выдачи"
          value="20"
        />
      </section>

      <section className={styles.panel}>
        <PanelTitle title="Список клиентов" total={clients.total} />

        <AutoFilterForm className={`${styles.filters} ${styles.filtersTwo}`}>
          <label>
            <span>Поиск</span>
            <input defaultValue={q} name="q" placeholder="Имя или телефон" />
          </label>

          <button type="submit">Применить</button>
        </AutoFilterForm>

        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>Имя</th>
                <th>Телефон</th>
                <th>Дата</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {clients.items.map((client) => (
                <tr key={client.id}>
                  <td>{client.id}</td>
                  <td>
                    <strong>{client.name}</strong>
                  </td>
                  <td>{client.phone}</td>
                  <td>{formatDateTime(client.created_at)}</td>
                  <td>
                    <div className={styles.rowActions}>
                      <Link href={managerClientEditRoute(client.id)}>Редактировать</Link>
                      <ConfirmDeleteForm
                        action={deleteClientAction}
                        confirmText="Удалить клиента? Backend отклонит удаление, если у клиента есть заказы."
                        id={client.id}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {clients.items.length === 0 ? (
            <EmptyState text="Клиенты по текущим фильтрам не найдены" />
          ) : null}
        </div>
      </section>
    </main>
  );
}

function filterClients(clients: Client[], query: string) {
  const normalizedQuery = normalizeSearch(query);
  const queryDigits = normalizeDigits(query);
  const filtered = clients.filter((client) => {
    const phoneDigits = normalizeDigits(client.phone);

    return (
      normalizeSearch(client.name).includes(normalizedQuery) ||
      normalizeSearch(client.phone).includes(normalizedQuery) ||
      Boolean(queryDigits && phoneDigits.includes(queryDigits))
    );
  });

  return toVisibleList(filtered);
}
