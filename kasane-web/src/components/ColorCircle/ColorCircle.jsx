import styles from './ColorCircle.module.css';

const SIZE_MAP = { sm: 'sm', md: 'md', lg: 'lg', inline: 'inline' };

export default function ColorCircle({ hex, missing = false, size = 'md' }) {
  const sizeClass = styles[SIZE_MAP[size]] || styles.md;

  return (
    <span
      className={`${styles.circle} ${sizeClass} ${missing ? styles.missing : ''}`}
      style={missing ? undefined : { backgroundColor: hex }}
    />
  );
}
