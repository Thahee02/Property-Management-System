import React from 'react';
import { usePMSStore } from '../../store/usePMSStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen, faWrench, faCheckCircle, faBuildingUser } from '@fortawesome/free-solid-svg-icons';

export default function OccupancyChart() {
  const { units } = usePMSStore();

  const total = units.length || 1;
  const occupied = units.filter((u) => u.status === 'Occupied').length;
  const available = units.filter((u) => u.status === 'Available').length;
  const maintenance = units.filter((u) => u.status === 'Maintenance').length;
  const reserved = units.filter((u) => u.status === 'Reserved').length;

  const occupancyRate = Math.round((occupied / total) * 100);

  const categories = [
    { label: 'Occupied', count: occupied, color: 'bg-emerald-500', text: 'text-emerald-700', icon: faBuildingUser },
    { label: 'Available', count: available, color: 'bg-sky-500', text: 'text-sky-700', icon: faDoorOpen },
    { label: 'Maintenance', count: maintenance, color: 'bg-purple-500', text: 'text-purple-700', icon: faWrench },
    { label: 'Reserved', count: reserved, color: 'bg-amber-500', text: 'text-amber-700', icon: faCheckCircle }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 lg:p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Portfolio Occupancy</h3>
            <p className="text-xs text-slate-500 mt-0.5">Physical unit distribution</p>
          </div>
          <span className="text-sm font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            {occupancyRate}% Rate
          </span>
        </div>

        {/* Visual Progress Multi-Bar */}
        <div className="mt-5">
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${(occupied / total) * 100}%` }}
              className="bg-emerald-500 hover:brightness-110 transition-all"
              title={`Occupied: ${occupied}`}
            />
            <div
              style={{ width: `${(available / total) * 100}%` }}
              className="bg-sky-500 hover:brightness-110 transition-all"
              title={`Available: ${available}`}
            />
            <div
              style={{ width: `${(maintenance / total) * 100}%` }}
              className="bg-purple-500 hover:brightness-110 transition-all"
              title={`Maintenance: ${maintenance}`}
            />
            <div
              style={{ width: `${(reserved / total) * 100}%` }}
              className="bg-amber-500 hover:brightness-110 transition-all"
              title={`Reserved: ${reserved}`}
            />
          </div>
        </div>

        {/* Detailed Breakdown List */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {categories.map((cat, idx) => {
            const pct = Math.round((cat.count / total) * 100);
            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                  <div>
                    <span className="text-xs font-semibold text-slate-700 block">{cat.label}</span>
                    <span className="text-[10px] text-slate-400">{pct}% of total</span>
                  </div>
                </div>
                <span className="text-base font-bold text-slate-900">{cat.count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Total Units Audited: <strong className="text-slate-800">{total} Units</strong></span>
        <span>Target: <strong>92%</strong></span>
      </div>
    </div>
  );
}
