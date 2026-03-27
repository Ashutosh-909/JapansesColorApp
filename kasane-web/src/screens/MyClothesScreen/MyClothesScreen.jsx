import { useState } from 'react';
import { Plus } from 'lucide-react';
import dummyWardrobe from '../../data/dummyWardrobe';
import ClothingCard from '../../components/ClothingCard/ClothingCard';
import BottomTabBar from '../../components/BottomTabBar/BottomTabBar';
import styles from './MyClothesScreen.module.css';

const FILTERS = ['All', 'Top', 'Bottom', 'Outerwear', 'Dress', 'Accessory', 'Shoes'];

export default function MyClothesScreen() {
  const [active, setActive] = useState('All');

  const filtered =
    active === 'All'
      ? dummyWardrobe
      : dummyWardrobe.filter((item) => item.category === active);

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <h1 className={styles.heading}>My Clothes ({filtered.length})</h1>
        <button className={styles.addBtn}>
          <Plus size={18} />
        </button>
      </div>

      <div className={styles.chips}>
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`${styles.chip} ${active === f ? styles.chipActive : ''}`}
            onClick={() => setActive(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map((item) => (
          <ClothingCard key={item.id} item={item} />
        ))}
      </div>

      <BottomTabBar />
    </div>
  );
}
