import type { ReactNode } from 'react';

import styles from '../ManagerPage.module.scss';

export function PageTitle({
  action,
  eyebrow,
  title,
}: {
  action?: ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <header className={styles.pageHeader}>
      <div>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      {action ? <div className={styles.pageAction}>{action}</div> : null}
    </header>
  );
}

export function ApiNotice({ errors }: { errors: string[] }) {
  if (errors.length === 0) {
    return null;
  }

  return (
    <div className={styles.notice} role="status">
      <span aria-hidden="true">!</span>
      <p>
        Не удалось загрузить: {errors.join(', ')}. Проверьте backend и переменную
        NEXT_PUBLIC_API_URL.
      </p>
    </div>
  );
}

export function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <article className={styles.statCard}>
      <span className={styles.statIcon}>{icon}</span>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

export function PanelTitle({
  action,
  eyebrow = 'Список',
  title,
  total,
}: {
  action?: ReactNode;
  eyebrow?: string;
  title: string;
  total?: number;
}) {
  return (
    <div className={styles.panelHeader}>
      <div>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <div className={styles.panelMeta}>
        {typeof total === 'number' ? <span>Всего: {total}</span> : null}
        {action}
      </div>
    </div>
  );
}

export function StatusBadge({ label, muted = false }: { label: string; muted?: boolean }) {
  return (
    <span className={muted ? `${styles.badge} ${styles.badgeMuted}` : styles.badge}>{label}</span>
  );
}

export function EmptyState({ text }: { text: string }) {
  return <div className={styles.empty}>{text}</div>;
}
