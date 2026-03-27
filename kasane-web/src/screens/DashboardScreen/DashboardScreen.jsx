import { useNavigate } from 'react-router-dom';
import { Plus, Lock } from 'lucide-react';
import dummyCombinations from '../../data/dummyCombinations';
import ComboCard from '../../components/ComboCard/ComboCard';
import Button from '../../components/Button/Button';
import BottomTabBar from '../../components/BottomTabBar/BottomTabBar';
import styles from './DashboardScreen.module.css';

export default function DashboardScreen() {
  const navigate = useNavigate();

  /* First 5 combos are free; rest would be behind paywall */
  const freeCombos = dummyCombinations.slice(0, 5);
  const lockedCombos = dummyCombinations.slice(5);

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Your Combinations</h1>
        <button className={styles.addBtn}>
          <Plus size={18} />
        </button>
      </div>

      <div className={styles.grid}>
        {freeCombos.map((combo) => (
          <ComboCard
            key={combo.id}
            combo={combo}
            onClick={() => navigate(`/combos/${combo.id}`)}
          />
        ))}
      </div>

      {/* Paywall section */}
      <div className={styles.paywall}>
        <div className={styles.paywallBlur}>
          <div className={styles.grid}>
            {lockedCombos.map((combo) => (
              <ComboCard key={combo.id} combo={combo} />
            ))}
          </div>
        </div>
        <div className={styles.paywallOverlay}>
          <Lock size={28} />
          <h2 className={styles.paywallTitle}>Unlock all 200+ combinations</h2>
          <p className={styles.paywallSub}>
            See every Japanese color harmony in your wardrobe
          </p>
          <Button>Go Premium</Button>
        </div>
      </div>

      {/* Buy suggestion paywall */}
      <div className={styles.suggestionCard}>
        <div className={styles.suggestionHeader}>
          <Lock size={18} />
          <h2 className={styles.suggestionTitle}>What Should I Buy Next?</h2>
        </div>
        <p className={styles.suggestionBlur}>
          Buy a \u85e4\u8272 (Wisteria) top \u2192 completes 4 combinations
        </p>
        <Button>Unlock Buy Suggestions</Button>
      </div>

      <BottomTabBar />
    </div>
  );
}
