import { Check } from 'lucide-react';
import styles from './CompletionBadge.module.css';

export default function CompletionBadge({ owned, total }) {
  const ratio = owned / total;
  const variant = ratio >= 1 ? 'complete' : ratio >= 0.5 ? 'partial' : 'low';

  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {owned}/{total}
      {ratio >= 1 && <Check size={12} className={styles.check} />}
    </span>
  );
}
