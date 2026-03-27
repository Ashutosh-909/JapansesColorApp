import styles from './ProgressBar.module.css';

export default function ProgressBar({ owned, total }) {
  const pct = total > 0 ? (owned / total) * 100 : 0;
  const variant = owned >= total ? 'complete' : 'partial';

  return (
    <div className={styles.track}>
      <div
        className={`${styles.fill} ${styles[variant]}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
