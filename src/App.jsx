import React, { useState } from 'react';
import AppShell from './components/layout/AppShell';
import LoginView from './components/auth/LoginView';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return <AppShell onSignOut={() => setIsAuthenticated(false)} />;
}
