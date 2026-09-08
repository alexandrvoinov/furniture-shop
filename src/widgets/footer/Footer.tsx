import styles from './Footer.module.scss';

export function Footer() {
  return (
    <footer className={styles.root}>
      <div className={styles.inner}>
        <span>Mebel Shop</span>
        <span>Frontend foundation</span>
      </div>
    </footer>
  );
}
