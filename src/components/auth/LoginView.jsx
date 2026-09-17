import React, { useState } from 'react';
import { usePMSStore } from '../../store/usePMSStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuildingCircleCheck,
  faLock,
  faUserTie,
  faShieldHalved,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

export default function LoginView({ onLoginSuccess }) {
  const { users, setCurrentUser } = usePMSStore();

  const [email, setEmail] = useState('d.sterling@apexproperties.com');
  const [password, setPassword] = useState('••••••••••••');

  const handleQuickLogin = (userId) => {
    setCurrentUser(userId);
    if (onLoginSuccess) onLoginSuccess();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const matched = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setCurrentUser(matched.id);
    } else {
      setCurrentUser(users[0].id);
    }
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-emerald-900/40 mb-4">
          <FontAwesomeIcon icon={faBuildingCircleCheck} className="text-2xl" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Apex Properties
        </h2>
        <p className="mt-1 text-xs text-emerald-400 font-semibold tracking-wider uppercase">
          Internal Corporate Management Portal
        </p>
        <p className="mt-2 text-xs text-slate-400 max-w-sm mx-auto">
          Private back-office operations gateway for authorized property managers, facilities technicians, and executive leadership.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white text-slate-900 py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Corporate Employee Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@apexproperties.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Active Directory Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors text-xs flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faLock} /> Authenticate into Operations Portal
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
              One-Click Role Demonstration
            </p>
            <div className="space-y-2">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleQuickLogin(u.id)}
                  className="w-full flex items-center justify-between p-2 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-7 h-7 rounded-lg object-cover shrink-0 ring-1 ring-slate-200"
                    />
                    <div className="truncate">
                      <p className="font-bold text-xs text-slate-900 group-hover:text-emerald-800 truncate">
                        {u.name}
                      </p>
                      <p className="text-[10px] text-slate-500">{u.role} • {u.department}</p>
                    </div>
                  </div>
                  <FontAwesomeIcon icon={faArrowRight} className="text-slate-300 group-hover:text-emerald-600 text-xs mr-1" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security badges footer */}
        <div className="mt-6 text-center text-slate-400 text-xs flex items-center justify-center gap-4">
          <span className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faShieldHalved} className="text-emerald-400" />
            256-Bit TLS Encryption
          </span>
          <span>•</span>
          <span>Private Corporate Intranet</span>
        </div>
      </div>
    </div>
  );
}
