import styles from './Button.module.css';

export default function Button({
  children,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  onClick,
  className = '',
  ...rest
}) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${fullWidth ? styles.fullWidth : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
