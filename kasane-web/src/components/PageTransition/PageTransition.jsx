import { useEffect, useState } from 'react';
import styles from './PageTransition.module.css';

export default function PageTransition({
  children,
  variant = 'fade',    /* fade | slideUp | slideLeft | scaleUp */
  duration = 400,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    /* Trigger enter animation on next frame */
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={`${styles.wrapper} ${styles[variant]} ${visible ? styles.enter : ''}`}
      style={{ '--duration': `${duration}ms` }}
    >
      {children}
    </div>
  );
}
