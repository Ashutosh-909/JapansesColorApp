import { useLocation, useNavigate } from 'react-router-dom';
import { Palette, Shirt, User } from 'lucide-react';
import styles from './BottomTabBar.module.css';

const TABS = [
  { path: '/combos', label: 'Combos', icon: Palette },
  { path: '/clothes', label: 'Clothes', icon: Shirt },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function BottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className={styles.bar}>
      {TABS.map(({ path, label, icon: Icon }) => {
        const active = location.pathname.startsWith(path);
        return (
          <button
            key={path}
            className={`${styles.tab} ${active ? styles.active : ''}`}
            onClick={() => navigate(path)}
          >
            <Icon size={22} />
            <span className={styles.label}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
