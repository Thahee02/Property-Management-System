import React, { useState } from 'react';
import AppShell from './components/layout/AppShell';
import LoginView from './components/auth/LoginView';
import TrialExpiredModal from './components/auth/TrialExpiredModal';
import { usePMSStore } from './store/usePMSStore';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { getTrialInfo } = usePMSStore();
  const trial = getTrialInfo();

  const handleSignOut = () => {
    setIsAuthenticated(false);
  };

  // If user is not authenticated, show Login View
  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // If user is authenticated BUT trial is expired, show Trial Expired Modal and log out on close
  if (trial.isExpired && !trial.isLicensed) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <TrialExpiredModal
          isOpen={true}
          onClose={handleSignOut}
        />
      </div>
    );
  }

  return <AppShell onSignOut={handleSignOut} />;
}
