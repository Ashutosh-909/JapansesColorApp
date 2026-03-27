import ColorCircle from '../ColorCircle/ColorCircle';
import CompletionBadge from '../CompletionBadge/CompletionBadge';
import SeasonBadge from '../SeasonBadge/SeasonBadge';
import styles from './ComboCard.module.css';

export default function ComboCard({ combo, onClick }) {
  const { colors, nameJp, nameEn, season, completionOwned, completionTotal } = combo;
  const ratio = completionOwned / completionTotal;
  const borderVar =
    ratio >= 1 ? 'complete' : ratio >= 0.5 ? 'partial' : 'low';

  return (
    <div
      className={`${styles.card} ${styles[borderVar]}`}
      onClick={onClick}
    >
      <div className={styles.badgeWrap}>
        <CompletionBadge owned={completionOwned} total={completionTotal} />
      </div>

      <div className={styles.circles}>
        {colors.map((c, i) => {
          const owned = i < completionOwned;
          return (
            <div key={c.hex + i} className={styles.colorItem}>
              <ColorCircle hex={c.hex} size="md" missing={!owned} />
              <span className={styles.colorName}>{c.nameJp}</span>
            </div>
          );
        })}
      </div>

      <h3 className={styles.titleJp}>{nameJp}</h3>
      <p className={styles.titleEn}>{nameEn}</p>

      <SeasonBadge season={season} />
    </div>
  );
}
