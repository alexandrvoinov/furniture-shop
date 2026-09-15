import styles from './ManagerPage.module.scss';

export default function ManagerLoading() {
  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Кабинет менеджера</p>
          <h1>Загружаем данные цеха</h1>
        </div>
      </header>
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.skeletonLine} />
        </div>
        <div className={styles.statCard}>
          <div className={styles.skeletonLine} />
        </div>
        <div className={styles.statCard}>
          <div className={styles.skeletonLine} />
        </div>
      </section>
      <section className={styles.panel}>
        <div className={styles.panelBody}>
          <div className={styles.skeleton}>
            <div className={styles.skeletonLine} />
            <div className={styles.skeletonLine} />
            <div className={styles.skeletonLine} />
          </div>
        </div>
      </section>
    </main>
  );
}
