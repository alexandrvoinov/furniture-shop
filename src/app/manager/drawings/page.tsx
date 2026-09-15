import { FileText } from 'lucide-react';
import Link from 'next/link';

import { workshopApi, type Drawing } from '@/entities/workshop';
import { API_BASE_URL } from '@/shared/api/config';
import { formatDateTime } from '@/shared/lib/formatters';
import { routes } from '@/shared/lib/routes';

import { deleteDrawingAction } from '../_actions/deleteActions';
import { AutoFilterForm } from '../_components/AutoFilterForm';
import { ConfirmDeleteForm } from '../_components/ConfirmDeleteForm';
import { ApiNotice, EmptyState, PageTitle, PanelTitle, StatCard } from '../_components/ManagerUi';
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

type DrawingsPageProps = {
  searchParams?: Promise<ManagerSearchParams>;
};

export default async function ManagerDrawingsPage({ searchParams }: DrawingsPageProps) {
  const params = (await searchParams) ?? {};
  const orderIdInput = getParam(params, 'order_id');
  const orderId = getPositiveNumberParam(params, 'order_id');
  const results = await Promise.allSettled([
    workshopApi.listDrawings({ limit: 20, offset: 0, order_id: orderId }),
  ]);

  const errors: string[] = [];
  const drawings = pickResult(results[0], emptyList<Drawing>(), 'drawings', errors);

  return (
    <main className={styles.page}>
      <PageTitle
        action={
          <Link className={styles.actionLink} href={routes.managerDrawingUpload}>
            Загрузить чертеж
          </Link>
        }
        eyebrow="Производство"
        title="Чертежи"
      />
      <ApiNotice errors={errors} />

      <section className={`${styles.statsGrid} ${styles.statsGridCompact}`}>
        <StatCard
          icon={<FileText size={23} strokeWidth={1.6} aria-hidden="true" />}
          label="Найдено файлов"
          value={String(drawings.total)}
        />
        <StatCard
          icon={<FileText size={23} strokeWidth={1.6} aria-hidden="true" />}
          label="Показано на странице"
          value={String(drawings.items.length)}
        />
        <StatCard
          icon={<FileText size={23} strokeWidth={1.6} aria-hidden="true" />}
          label="Лимит выдачи"
          value="20"
        />
      </section>

      <section className={styles.panel}>
        <PanelTitle title="Файлы чертежей" total={drawings.total} />

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

        {drawings.items.length > 0 ? (
          <div className={styles.filesGrid}>
            {drawings.items.map((drawing) => (
              <article className={styles.fileCard} key={drawing.id}>
                <FileText size={24} strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <strong>Чертеж #{drawing.id}</strong>
                  <span>Заказ #{drawing.order_id}</span>
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
                />
              </article>
            ))}
          </div>
        ) : (
          <EmptyState text="Чертежи по текущим фильтрам не найдены" />
        )}
      </section>
    </main>
  );
}

function getFileUrl(fileUrl: string) {
  if (/^https?:\/\//i.test(fileUrl)) {
    return fileUrl;
  }

  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
  return new URL(fileUrl.replace(/^\//, ''), baseUrl).toString();
}
