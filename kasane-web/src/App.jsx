import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PageTransition from './components/PageTransition/PageTransition';
import SplashScreen from './screens/SplashScreen/SplashScreen';
import UploadScreen from './screens/UploadScreen/UploadScreen';
import CategorizeScreen from './screens/CategorizeScreen/CategorizeScreen';
import DashboardScreen from './screens/DashboardScreen/DashboardScreen';
import ComboDetailScreen from './screens/ComboDetailScreen/ComboDetailScreen';
import MyClothesScreen from './screens/MyClothesScreen/MyClothesScreen';
import ProfileScreen from './screens/ProfileScreen/ProfileScreen';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageTransition variant="fade" duration={400}><SplashScreen /></PageTransition>} />
        <Route path="/upload" element={<PageTransition variant="slideUp" duration={400}><UploadScreen /></PageTransition>} />
        <Route path="/categorize" element={<PageTransition variant="slideLeft" duration={300}><CategorizeScreen /></PageTransition>} />
        <Route path="/combos" element={<PageTransition variant="scaleUp" duration={500}><DashboardScreen /></PageTransition>} />
        <Route path="/combos/:id" element={<PageTransition variant="fade" duration={350}><ComboDetailScreen /></PageTransition>} />
        <Route path="/clothes" element={<PageTransition variant="fade" duration={200}><MyClothesScreen /></PageTransition>} />
        <Route path="/profile" element={<PageTransition variant="fade" duration={200}><ProfileScreen /></PageTransition>} />
      </Routes>
    </BrowserRouter>
  );
}
