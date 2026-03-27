import styles from './SeasonBadge.module.css';

const SEASON_EMOJI = {
  Spring: '🌸',
  Summer: '🌊',
  Autumn: '🍂',
  Winter: '❄️',
};

export default function SeasonBadge({ season }) {
  return (
    <span className={styles.badge}>
      {season} {SEASON_EMOJI[season] || ''}
    </span>
  );
}
