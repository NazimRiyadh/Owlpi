import { useState, useEffect, useCallback } from 'react';
import LandingPage from './components/Landing/LandingPage.jsx';
import AuthPage from './components/Auth/AuthPage.jsx';
import DashboardPage from './DashboardPage.jsx';
import './index.css';

function normalizeRoute(pathname) {
  if (pathname === '/auth') return '/auth';
  if (pathname === '/dashboard') return '/dashboard';
  return '/';
}

import CustomCursor from './components/Common/CustomCursor.jsx';

function App() {
  const [route, setRoute] = useState(() => normalizeRoute(window.location.pathname));
  // Initialize user from localStorage to persist "Guest" or "Demo" sessions
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('owlpi_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const syncRoute = () => setRoute(normalizeRoute(window.location.pathname));
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, []);

  const navigateToAuth = useCallback(() => {
    window.history.pushState({}, '', '/auth');
    setRoute('/auth');
  }, []);

  const navigateToHome = useCallback(() => {
    window.history.pushState({}, '', '/');
    setRoute('/');
  }, []);

  const navigateToDashboard = useCallback((userData) => {
    if (userData) {
      setUser(userData);
      localStorage.setItem('owlpi_user', JSON.stringify(userData));
    }
    window.history.pushState({}, '', '/dashboard');
    setRoute('/dashboard');
  }, []);

  const handleLiveDemo = useCallback(() => {
    // Immediate bypass for recruiters: Go straight to dashboard as Guest
    navigateToDashboard({ 
      username: "Guest_Operator", 
      role: "GUEST",
      isDemo: true 
    });
  }, [navigateToDashboard]);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('owlpi_user');
    navigateToHome();
  }, [navigateToHome]);

  return (
    <>
      <CustomCursor />
      {route === '/auth' && (
        <AuthPage onBack={navigateToHome} onAuthSuccess={navigateToDashboard} />
      )}
      {route === '/dashboard' && (
        <DashboardPage 
          user={user}
          onRequireAuth={navigateToAuth} 
          onBackHome={handleLogout} 
        />
      )}
      {route === '/' && (
        <LandingPage 
          onSignIn={navigateToAuth} 
          onLiveDemo={handleLiveDemo}
        />
      )}
    </>
  );
}

export default App;
