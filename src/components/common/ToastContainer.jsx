import React from 'react';
import { usePMSStore } from '../../store/usePMSStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faTriangleExclamation,
  faCircleInfo,
  faXmark
} from '@fortawesome/free-solid-svg-icons';

export default function ToastContainer() {
  const { toasts, removeToast } = usePMSStore();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = faCircleCheck;
        let style = 'bg-slate-900 text-white border-slate-800';
        let iconColor = 'text-emerald-400';

        if (toast.type === 'warning') {
          icon = faTriangleExclamation;
          iconColor = 'text-amber-400';
        } else if (toast.type === 'info') {
          icon = faCircleInfo;
          iconColor = 'text-sky-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border shadow-xl transition-all duration-300 transform translate-y-0 ${style}`}
          >
            <div className="flex items-center gap-2.5 text-sm">
              <FontAwesomeIcon icon={icon} className={`text-base shrink-0 ${iconColor}`} />
              <span className="font-medium text-slate-100">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xs" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
