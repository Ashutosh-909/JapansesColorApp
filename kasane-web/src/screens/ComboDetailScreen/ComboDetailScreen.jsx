import { useParams } from 'react-router-dom';
import styles from './ComboDetailScreen.module.css';

export default function ComboDetailScreen() {
  const { id } = useParams();

  return (
    <div className={styles.screen}>
      <h1 className={styles.heading}>Combo Detail</h1>
      <p className={styles.stub}>Viewing combo: {id}</p>
    </div>
  );
}
