import React, { useState } from 'react';
import { usePMSStore } from '../../store/usePMSStore';
import TrialExpiredModal from './TrialExpiredModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuildingCircleCheck,
  faLock,
  faUser,
  faEye,
  faEyeSlash,
  faClock,
  faArrowRight,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';

export default function LoginView({ onLoginSuccess }) {
  const { users, setCurrentUser, settings, getTrialInfo } = usePMSStore();
  const trial = getTrialInfo();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (trial.isExpired) {
      setShowExpiredModal(true);
      return;
    }

    const inputUser = username.trim().toLowerCase();

    if (!inputUser || !password) {
      setFormError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if ((inputUser === 'admin' || inputUser === 'ahamed') && password === 'admin123') {
        setCurrentUser(users[0]?.id || 'USR-001');
        setIsLoading(false);
        if (onLoginSuccess) onLoginSuccess();
        return;
      }

      const matched = users.find(
        (u) =>
          u.email.toLowerCase() === inputUser ||
          u.name.toLowerCase() === inputUser ||
          u.id.toLowerCase() === inputUser
      );

      if (matched) {
        setCurrentUser(matched.id);
        setIsLoading(false);
        if (onLoginSuccess) onLoginSuccess();
      } else if (password === 'admin123' || password.length >= 4) {
        setCurrentUser(users[0]?.id || 'USR-001');
        setIsLoading(false);
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setIsLoading(false);
        setFormError('Incorrect username or password. Default: admin / admin123');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-900 font-sans overflow-hidden">
      
      {/* SECTION 1: Left Screen Branding (Full Height 50% width on Desktop) */}
      <div className="md:w-1/2 min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Logo & Brand Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xl shadow-emerald-950/60 ring-1 ring-white/20 shrink-0">
              <FontAwesomeIcon icon={faBuildingCircleCheck} className="text-3xl" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
                {settings?.companyName || 'Wathnan Mall'}
              </h1>
              <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mt-0.5">
                Property Management System
              </p>
            </div>
          </div>

          <div className="max-w-md">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-3">
              Executive Operations Gateway
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Streamline property administration, tenant lease tracking, rent collection receipts, and maintenance orders from one unified platform.
            </p>
          </div>
        </div>

        {/* Trial Status Pill */}
        <div className="relative z-10 pt-8 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faClock}
              className={trial.isExpired ? 'text-rose-400' : 'text-emerald-400'}
            />
            <span className="text-xs text-slate-400 font-medium">Evaluation Period:</span>
          </div>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              trial.isLicensed
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : trial.isExpired
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}
          >
            {trial.isLicensed
              ? 'Licensed Edition'
              : trial.isExpired
              ? 'Trial Expired'
              : `${trial.daysRemaining} Days Remaining`}
          </span>
        </div>
      </div>

      {/* SECTION 2: Right Screen Login Form (Full Height 50% width on Desktop) */}
      <div className="md:w-1/2 min-h-screen bg-white text-slate-900 p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-center">
        <div className="w-full max-w-md">
          
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign In
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Please enter your username and password to log in.
            </p>
          </div>

          {/* Trial Expired Alert Banner */}
          {trial.isExpired && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
              <FontAwesomeIcon icon={faTriangleExclamation} className="text-rose-600 text-base shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs">14-Day Free Trial Expired</p>
                <p className="text-[11px] text-rose-700 mt-0.5 leading-relaxed">
                  Your 14-day evaluation trial has ended. Please contact support to activate your system.
                </p>
              </div>
            </div>
          )}

          {/* Form Error Message */}
          {formError && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <FontAwesomeIcon icon={faTriangleExclamation} />
              {formError}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-xs sm:text-sm text-slate-900 transition-all"
                />
                <FontAwesomeIcon
                  icon={faUser}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-xs sm:text-sm text-slate-900 transition-all"
                />
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-xs" />
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500"
                />
                <span className="text-slate-600 font-medium text-xs">Remember me</span>
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </>
              )}
            </button>

            {/* Default Credentials Note */}
            <div className="pt-4 text-center text-xs text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              Default Login: <strong className="text-slate-800">admin</strong> / <strong className="text-slate-800">admin123</strong>
            </div>
          </form>

        </div>
      </div>

      {/* Trial Expired Info Modal */}
      <TrialExpiredModal
        isOpen={showExpiredModal}
        onClose={() => setShowExpiredModal(false)}
      />
    </div>
  );
}
