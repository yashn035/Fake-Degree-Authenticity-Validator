import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UploadPage from './pages/UploadPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-1 w-full mx-auto text-slate-900 dark:text-slate-100">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><UploadPage /></div></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><AdminPage /></div></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
