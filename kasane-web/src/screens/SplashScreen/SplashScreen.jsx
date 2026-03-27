import { useNavigate } from 'react-router-dom';
import styles from './SplashScreen.module.css';

const ACCENT_COLORS = [
  { hex: '#e9e4d4', name: '灰白' },
  { hex: '#bbbcde', name: '藤色' },
  { hex: '#4c6cb3', name: '群青' },
  { hex: '#ef4523', name: '朱色' },
  { hex: '#f8b500', name: '山吹色' },
  { hex: '#928178', name: '丁子色' },
  { hex: '#a8d8cb', name: '青磁色' },
  { hex: '#eb6ea5', name: '撫子色' },
];

export default function SplashScreen() {
  const navigate = useNavigate();

  return (
    <div className={styles.screen} onClick={() => navigate('/upload')}>
      <div className={styles.content}>
        <h1 className={styles.title}>Kasane</h1>
        <p className={styles.subtitle}>重 ね</p>

        <div className={styles.colors}>
          {ACCENT_COLORS.map((c) => (
            <span
              key={c.name}
              className={styles.dot}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>

        <p className={styles.tap}>TAP TO BEGIN</p>
      </div>
    </div>
  );
}
