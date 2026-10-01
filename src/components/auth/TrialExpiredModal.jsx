import React from 'react';
import { usePMSStore } from '../../store/usePMSStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLock,
  faClock,
  faCircleCheck,
  faEnvelope,
  faPhone,
  faTriangleExclamation,
  faBuildingCircleCheck,
  faXmark
} from '@fortawesome/free-solid-svg-icons';

export default function TrialExpiredModal({ isOpen, onClose }) {
  const { getTrialInfo, settings } = usePMSStore();
  const trial = getTrialInfo();

  if (!isOpen && !trial.isExpired) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 text-slate-900 p-6 sm:p-8">
        
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} className="text-sm" />
          </button>
        )}

        {/* Dynamic Icon & Header */}
        <div className="text-center">
          {trial.isLicensed ? (
            <>
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
                <FontAwesomeIcon icon={faCircleCheck} />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
                Enterprise License Active
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Full Access Activated
              </h2>
              <p className="mt-3 text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                Your system is fully licensed with unlimited access to all property management features.
              </p>
            </>
          ) : trial.isExpired ? (
            <>
              <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
                <FontAwesomeIcon icon={faLock} />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
                <FontAwesomeIcon icon={faTriangleExclamation} />
                System Access Expired
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                System License Expired
              </h2>
              <p className="mt-3 text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                The access validity for <strong className="text-slate-900">{settings?.companyName || 'Wathnan Mall'} Property Management System</strong> expired on <strong className="text-rose-600 font-bold">28.10.2026</strong>. System logins and administrative functions are currently locked.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
                <FontAwesomeIcon icon={faClock} />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
                System License Active (Valid until 28.10.2026)
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                {trial.daysRemaining} {trial.daysRemaining === 1 ? 'Day' : 'Days'} Remaining
              </h2>
              <p className="mt-3 text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                You are currently using <strong className="text-slate-900">{settings?.companyName || 'Wathnan Mall'} Property Management System</strong>. The system is licensed to work until <strong className="text-slate-900">28.10.2026</strong>. You have <span className="font-bold text-amber-600">{trial.daysRemaining} {trial.daysRemaining === 1 ? 'day' : 'days'} remaining</span>.
              </p>
            </>
          )}
        </div>

        {/* Support Information Box */}
        <div className="mt-6 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2.5">
          <p className="font-semibold text-slate-900 text-xs flex items-center gap-2">
            <FontAwesomeIcon icon={faBuildingCircleCheck} className="text-emerald-600" />
            Contact System Administrator / Sales:
          </p>
          <div className="flex items-center gap-2.5 text-slate-600 pt-1">
            <FontAwesomeIcon icon={faEnvelope} className="text-emerald-600 shrink-0" />
            <span>info@codesofy.com</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-600">
            <FontAwesomeIcon icon={faPhone} className="text-emerald-600 shrink-0" />
            <span>+94 77 926 3767</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
          >
            {trial.isExpired ? 'Understood' : 'Continue Using System'}
          </button>
        </div>

      </div>
    </div>
  );
}
