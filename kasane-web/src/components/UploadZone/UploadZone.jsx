import { Upload } from 'lucide-react';
import styles from './UploadZone.module.css';

export default function UploadZone() {
  return (
    <div className={styles.zone}>
      <Upload size={48} className={styles.icon} />
      <p className={styles.text}>Tap to upload photos</p>
    </div>
  );
}
