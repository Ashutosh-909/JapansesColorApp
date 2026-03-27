import { useNavigate } from 'react-router-dom';
import { Camera, Image, Plus } from 'lucide-react';
import UploadZone from '../../components/UploadZone/UploadZone';
import Button from '../../components/Button/Button';
import styles from './UploadScreen.module.css';

const DUMMY_THUMBS = [
  '#ef4523', '#a8d8cb', '#f8b500', '#223a70',
];

export default function UploadScreen() {
  const navigate = useNavigate();

  return (
    <div className={styles.screen}>
      <h1 className={styles.heading}>
        Upload your clothes to discover your color combinations
      </h1>

      <UploadZone />

      <div className={styles.actionRow}>
        <Button variant="secondary" className={styles.halfBtn}>
          <Camera size={18} /> Take Photo
        </Button>
        <Button variant="secondary" className={styles.halfBtn}>
          <Image size={18} /> Gallery
        </Button>
      </div>

      <p className={styles.caption}>
        No account needed — upload and see your combos instantly
      </p>

      <div className={styles.thumbRow}>
        {DUMMY_THUMBS.map((hex) => (
          <div
            key={hex}
            className={styles.thumb}
            style={{ backgroundColor: hex }}
          />
        ))}
        <button className={styles.addThumb}>
          <Plus size={20} />
        </button>
      </div>

      <Button fullWidth onClick={() => navigate('/categorize')}>
        Continue
      </Button>

      <div className={styles.divider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerText}>or</span>
        <span className={styles.dividerLine} />
      </div>

      <p className={styles.loginHint}>Already have an account?</p>

      <button className={styles.googleBtn}>
        <span className={styles.googleG}>G</span>
        Continue with Google
      </button>

      <button className={styles.appleBtn}>
        <span className={styles.appleIcon}></span>
        Continue with Apple
      </button>

      <p className={styles.caption}>
        Log in to see your saved combinations
      </p>
    </div>
  );
}
