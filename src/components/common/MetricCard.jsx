import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faArrowTrendDown } from '@fortawesome/free-solid-svg-icons';

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  iconBg = 'bg-slate-100 text-slate-700',
  trend,
  trendDirection = 'up',
  onClick,
  badge
}) {
  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-emerald-500/40 hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${iconBg}`}>
          <FontAwesomeIcon icon={icon} className="text-base" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        {badge && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {badge}
          </span>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
          <span className="truncate">{subtitle}</span>
          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-semibold shrink-0 ${
                trendDirection === 'up'
                  ? 'text-emerald-600'
                  : trendDirection === 'down'
                  ? 'text-rose-600'
                  : 'text-slate-500'
              }`}
            >
              <FontAwesomeIcon
                icon={trendDirection === 'up' ? faArrowTrendUp : faArrowTrendDown}
                className="text-[10px]"
              />
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
