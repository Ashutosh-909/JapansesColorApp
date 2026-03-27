import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';
import dummyCombinations from '../../data/dummyCombinations';
import dummyWardrobe from '../../data/dummyWardrobe';
import ColorCircle from '../../components/ColorCircle/ColorCircle';
import SeasonBadge from '../../components/SeasonBadge/SeasonBadge';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import ClothingCard from '../../components/ClothingCard/ClothingCard';
import styles from './ComboDetailScreen.module.css';

export default function ComboDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const combo = dummyCombinations.find((c) => c.id === id);

  if (!combo) {
    return (
      <div className={styles.screen}>
        <p>Combo not found</p>
      </div>
    );
  }

  const { colors, nameJp, nameEn, season, completionOwned, completionTotal } = combo;

  /* Match wardrobe items to combo colors by hex */
  const ownedHexes = new Set(
    dummyWardrobe.flatMap((item) => item.dominantColors.map((c) => c.hex))
  );
  const matchingItems = dummyWardrobe.filter((item) =>
    item.dominantColors.some((dc) => colors.some((cc) => cc.hex === dc.hex))
  );
  const missingColors = colors.filter((c) => !ownedHexes.has(c.hex));

  return (
    <div className={styles.screen}>
      <button className={styles.back} onClick={() => navigate(-1)}>
        <ArrowLeft size={24} />
      </button>

      <h1 className={styles.titleJp}>{nameJp}</h1>
      <p className={styles.titleEn}>{nameEn}</p>
      <SeasonBadge season={season} />

      {/* Palette */}
      <h2 className={styles.section}>The Palette</h2>
      <div className={styles.palette}>
        {colors.map((c, i) => {
          const owned = i < completionOwned;
          return (
            <div key={c.hex + i} className={styles.paletteItem}>
              <div className={styles.circleWrap}>
                <ColorCircle hex={c.hex} size="lg" missing={!owned} />
                <span className={`${styles.statusIcon} ${owned ? styles.have : styles.need}`}>
                  {owned ? <Check size={10} /> : <X size={10} />}
                </span>
              </div>
              <span className={styles.colorNameJp}>{c.nameJp}</span>
              <span className={styles.colorRomaji}>{c.romaji}</span>
              <span className={styles.colorNameEn}>{c.nameEn}</span>
            </div>
          );
        })}
      </div>

      <div className={styles.progressRow}>
        <ProgressBar owned={completionOwned} total={completionTotal} />
        <span className={styles.progressLabel}>{completionOwned}/{completionTotal}</span>
      </div>

      <div className={styles.divider} />

      {/* Matching clothes */}
      {matchingItems.length > 0 && (
        <>
          <h2 className={styles.section}>Your Matching Clothes</h2>
          <div className={styles.clothesGrid}>
            {matchingItems.map((item) => (
              <ClothingCard key={item.id} item={item} />
            ))}
          </div>
          <div className={styles.divider} />
        </>
      )}

      {/* Missing */}
      {missingColors.length > 0 && (
        <>
          <h2 className={styles.section}>Missing</h2>
          {missingColors.map((c) => (
            <div key={c.hex} className={styles.missingCard}>
              <div className={styles.missingTop}>
                <ColorCircle hex={c.hex} size="md" />
                <div>
                  <p className={styles.missingLabel}>You\u2019re missing:</p>
                  <p className={styles.missingName}>
                    {c.nameJp} ({c.romaji})
                  </p>
                  <p className={styles.missingEn}>{c.nameEn}</p>
                </div>
              </div>
              <p className={styles.suggestion}>
                \ud83d\udca1 Look for a matching bottom or accessory to complete this combo
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
