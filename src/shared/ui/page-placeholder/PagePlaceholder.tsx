import styles from './PagePlaceholder.module.scss';

type PagePlaceholderProps = {
  description: string;
  eyebrow: string;
  title: string;
};

export function PagePlaceholder({ description, eyebrow, title }: PagePlaceholderProps) {
  return (
    <main className={styles.root}>
      <section className={styles.content}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </section>
    </main>
  );
}
