import BottomTabBar from '../../components/BottomTabBar/BottomTabBar';
import styles from './ProfileScreen.module.css';

export default function ProfileScreen() {
  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <div className={styles.avatar} />
        <h1 className={styles.heading}>Profile</h1>
        <p className={styles.info}>Subscription: Free</p>
        <p className={styles.link}>Settings</p>
      </div>
      <BottomTabBar />
    </div>
  );
}
