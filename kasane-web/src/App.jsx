import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
        <Route path="/" element={<SplashScreen />} />
        <Route path="/upload" element={<UploadScreen />} />
        <Route path="/categorize" element={<CategorizeScreen />} />
        <Route path="/combos" element={<DashboardScreen />} />
        <Route path="/combos/:id" element={<ComboDetailScreen />} />
        <Route path="/clothes" element={<MyClothesScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
