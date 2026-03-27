import { ChevronDown } from 'lucide-react';
import styles from './CategoryChip.module.css';

export default function CategoryChip({ value, selected = false, onClick }) {
  return (
    <button
      className={`${styles.chip} ${selected ? styles.selected : styles.unselected}`}
      onClick={onClick}
    >
      {value || 'Select type...'}
      <ChevronDown size={14} />
    </button>
  );
}
