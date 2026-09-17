import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faCalendarDays } from '@fortawesome/free-solid-svg-icons';

export default function RevenueChart() {
  const [timeRange, setTimeRange] = useState('6m');

  const monthlyData = [
    { month: 'Aug', collected: 38500, target: 40000 },
    { month: 'Sep', collected: 39800, target: 41000 },
    { month: 'Oct', collected: 41200, target: 42000 },
    { month: 'Nov', collected: 42100, target: 43000 },
    { month: 'Dec', collected: 44500, target: 44000 },
    { month: 'Jan', collected: 46800, target: 45000 }
  ];

  const maxVal = 50000;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 lg:p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Rental Revenue & Collections</h3>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              +12.4% vs H1
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Internal portfolio cash inflow vs target forecast
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setTimeRange('6m')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                timeRange === '6m' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Last 6 Months
            </button>
            <button
              onClick={() => setTimeRange('1y')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                timeRange === '1y' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Full Year
            </button>
          </div>
        </div>
      </div>

      {/* Chart Visual */}
      <div className="pt-6 pb-2">
        <div className="h-52 flex items-end justify-between gap-3 lg:gap-6 px-2">
          {monthlyData.map((item, idx) => {
            const heightPercent = Math.round((item.collected / maxVal) * 100);
            const targetPercent = Math.round((item.target / maxVal) * 100);

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] py-1 px-2 rounded-md shadow-lg pointer-events-none mb-1 text-center whitespace-nowrap">
                  <span className="font-bold">${item.collected.toLocaleString()}</span>
                  <span className="block text-[9px] text-slate-400">Target: ${item.target.toLocaleString()}</span>
                </div>

                <div className="w-full max-w-[42px] relative flex items-end justify-center h-full">
                  {/* Target line indicator */}
                  <div
                    className="absolute w-full border-b-2 border-dashed border-slate-300 pointer-events-none z-10"
                    style={{ bottom: `${targetPercent}%` }}
                    title={`Target: $${item.target}`}
                  />
                  {/* Realized Bar */}
                  <div
                    className="w-full bg-gradient-to-t from-emerald-600 to-teal-500 rounded-t-lg transition-all duration-500 group-hover:brightness-110 shadow-xs"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Legend & Total */}
      <div className="pt-4 mt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-emerald-600" />
            <span>Actual Collections</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-b-2 border-dashed border-slate-400" />
            <span>Budgeted Target</span>
          </span>
        </div>
        <div className="font-semibold text-slate-800">
          Jan 2024 Collections: <span className="text-emerald-600 font-bold">$46,800</span>
        </div>
      </div>
    </div>
  );
}
