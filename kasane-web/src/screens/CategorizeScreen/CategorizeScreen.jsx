import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import dummyWardrobe from '../../data/dummyWardrobe';
import ColorCircle from '../../components/ColorCircle/ColorCircle';
import Button from '../../components/Button/Button';
import styles from './CategorizeScreen.module.css';

const CATEGORIES = ['Top', 'Bottom', 'Outerwear', 'Dress', 'Accessory', 'Shoes'];

export default function CategorizeScreen() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(() =>
    Object.fromEntries(dummyWardrobe.map((item) => [item.id, item.category || '']))
  );
  const [openDropdown, setOpenDropdown] = useState(null);

  const allCategorized = dummyWardrobe.every((item) => categories[item.id]);

  const handleSelect = (itemId, cat) => {
    setCategories((prev) => ({ ...prev, [itemId]: cat }));
    setOpenDropdown(null);
  };

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Categorize Your Clothes</h1>
        <span className={styles.aiPill}>
          \u2728 Auto-categorize <Lock size={12} />
        </span>
      </div>

      <div className={styles.grid}>
        {dummyWardrobe.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.imageWrap}>
              <img src={item.imageUrl} alt="" className={styles.image} />
            </div>
            <div className={styles.cardInfo}>
              <div className={styles.chipWrap}>
                <button
                  className={`${styles.chip} ${categories[item.id] ? styles.chipSelected : ''}`}
                  onClick={() =>
                    setOpenDropdown(openDropdown === item.id ? null : item.id)
                  }
                >
                  {categories[item.id] || 'Select type...'} \u25BE
                </button>
                {openDropdown === item.id && (
                  <div className={styles.dropdown}>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        className={styles.dropItem}
                        onClick={() => handleSelect(item.id, cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles.dots}>
                {item.dominantColors.map((c) => (
                  <ColorCircle key={c.hex} hex={c.hex} size="sm" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.bottomBar}>
        <Button
          fullWidth
          disabled={!allCategorized}
          onClick={() => navigate('/combos')}
        >
          Go \u2192
        </Button>
      </div>
    </div>
  );
}
