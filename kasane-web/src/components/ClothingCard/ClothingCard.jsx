import ColorCircle from '../ColorCircle/ColorCircle';
import styles from './ClothingCard.module.css';

export default function ClothingCard({ item, onClick }) {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.imageWrap}>
        <img src={item.imageUrl} alt={item.category} className={styles.image} />
      </div>
      <div className={styles.info}>
        <div className={styles.colors}>
          {item.dominantColors.map((c) => (
            <ColorCircle key={c.hex} hex={c.hex} size="sm" />
          ))}
        </div>
        <span className={styles.category}>{item.category}</span>
      </div>
    </div>
  );
}
