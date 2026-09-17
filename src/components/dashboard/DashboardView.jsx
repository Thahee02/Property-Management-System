import React from 'react';
import { usePMSStore } from '../../store/usePMSStore';
import MetricCard from '../common/MetricCard';
import StatusBadge from '../common/StatusBadge';
import RevenueChart from './RevenueChart';
import OccupancyChart from './OccupancyChart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faDoorOpen,
  faBuildingUser,
  faFileContract,
  faClock,
  faMoneyBillWave,
  faCircleExclamation,
  faWrench,
  faArrowRight,
  faPlus,
  faCreditCard,
  faUserPlus,
  faCalendarCheck
} from '@fortawesome/free-solid-svg-icons';

export default function DashboardView({ onOpenQuickAction }) {
  const {
    properties,
    units,
    customers,
    leases,
    payments,
    maintenance,
    activityLogs,
    setActiveView
  } = usePMSStore();

  // Metrics computation
  const totalProperties = properties.length;
  const totalUnits = units.length;
  const occupiedUnits = units.filter((u) => u.status === 'Occupied').length;
  const vacantUnits = units.filter((u) => u.status === 'Available').length;
  const activeLeases = leases.filter((l) => l.status === 'Active' || l.status === 'Renewed').length;
  const expiringLeases = leases.filter((l) => l.status === 'Expiring Soon');
  const pendingMaintenance = maintenance.filter((m) => m.status !== 'Completed' && m.status !== 'Cancelled').length;

  const totalOutstanding = payments
    .filter((p) => p.status === 'Overdue' || p.status === 'Pending')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const monthlyRevenue = leases
    .filter((l) => l.status === 'Active' || l.status === 'Renewed')
    .reduce((acc, curr) => acc + (Number(curr.monthlyRent) || 0), 0);

  const recentPayments = payments.slice(0, 5);
  const recentTickets = maintenance.slice(0, 4);
  const recentActivities = activityLogs.slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Quick Operations Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 rounded-2xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
              Executive Portfolio Overview
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Centralized property performance, rent roll collections, occupancy rates, and active facilities tickets across all corporate holdings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenQuickAction('customer')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs border border-white/10 transition-all hover:scale-102"
            >
              <FontAwesomeIcon icon={faUserPlus} className="text-emerald-400" />
              Add Tenant
            </button>
            <button
              onClick={() => onOpenQuickAction('lease')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs border border-white/10 transition-all hover:scale-102"
            >
              <FontAwesomeIcon icon={faFileContract} className="text-teal-400" />
              New Lease
            </button>
            <button
              onClick={() => onOpenQuickAction('payment')}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-900/30 hover:scale-102"
            >
              <FontAwesomeIcon icon={faCreditCard} />
              Record Payment
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Properties"
          value={totalProperties}
          subtitle="4 Active Locations"
          icon={faBuilding}
          iconBg="bg-blue-50 text-blue-600"
          trend="+1 Added"
          trendDirection="up"
          onClick={() => setActiveView('properties')}
        />

        <MetricCard
          title="Total Units"
          value={totalUnits}
          subtitle={`${occupiedUnits} Occupied • ${vacantUnits} Vacant`}
          icon={faDoorOpen}
          iconBg="bg-purple-50 text-purple-600"
          trend={`${Math.round((occupiedUnits / (totalUnits || 1)) * 100)}% Occupancy`}
          trendDirection="up"
          onClick={() => setActiveView('units')}
        />

        <MetricCard
          title="Active Leases"
          value={activeLeases}
          subtitle={`${expiringLeases.length} expiring soon`}
          icon={faFileContract}
          iconBg="bg-emerald-50 text-emerald-600"
          trend={expiringLeases.length > 0 ? `${expiringLeases.length} Action Needed` : 'Stable'}
          trendDirection={expiringLeases.length > 0 ? 'down' : 'up'}
          onClick={() => setActiveView('leases')}
        />

        <MetricCard
          title="Monthly Rent Roll"
          value={`$${monthlyRevenue.toLocaleString()}`}
          subtitle="Projected Monthly Inflow"
          icon={faMoneyBillWave}
          iconBg="bg-teal-50 text-teal-600"
          trend="+6.2% vs target"
          trendDirection="up"
          onClick={() => setActiveView('payments')}
        />

        <MetricCard
          title="Occupied Units"
          value={occupiedUnits}
          subtitle={`${Math.round((occupiedUnits / totalUnits) * 100)}% physical capacity`}
          icon={faBuildingUser}
          iconBg="bg-indigo-50 text-indigo-600"
          onClick={() => setActiveView('units')}
        />

        <MetricCard
          title="Expiring Leases"
          value={expiringLeases.length}
          subtitle="Approaching within 60 days"
          icon={faClock}
          iconBg="bg-amber-50 text-amber-600"
          badge="Urgent"
          onClick={() => setActiveView('leases')}
        />

        <MetricCard
          title="Outstanding Receivables"
          value={`$${totalOutstanding.toLocaleString()}`}
          subtitle="Pending & Overdue invoices"
          icon={faCircleExclamation}
          iconBg="bg-rose-50 text-rose-600"
          trendDirection="down"
          onClick={() => setActiveView('payments')}
        />

        <MetricCard
          title="Pending Maintenance"
          value={pendingMaintenance}
          subtitle="Open work orders"
          icon={faWrench}
          iconBg="bg-sky-50 text-sky-600"
          badge={`${maintenance.filter((m) => m.priority === 'Urgent').length} Urgent`}
          onClick={() => setActiveView('maintenance')}
        />
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <OccupancyChart />
        </div>
      </div>

      {/* Expiring Leases Alert & Recent Payments Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expiring Leases Action List */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 lg:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Upcoming Lease Expirations</h3>
                  <p className="text-xs text-slate-500">Requires proactive renewal negotiation</p>
                </div>
              </div>
              <button
                onClick={() => setActiveView('leases')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                View All <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {expiringLeases.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No leases currently expiring in the next 60 days.
                </div>
              ) : (
                expiringLeases.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => setActiveView('lease-detail', { leaseId: l.id })}
                    className="py-3 flex items-center justify-between hover:bg-slate-50 rounded-xl px-2 cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">{l.customerName}</p>
                      <p className="text-[11px] text-slate-500">
                        {l.propertyName} • Unit {l.unitNumber}
                      </p>
                      <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1 mt-0.5">
                        <FontAwesomeIcon icon={faCalendarCheck} /> Expires on: {l.endDate}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900">${l.monthlyRent.toLocaleString()}/mo</p>
                      <StatusBadge status={l.status} size="xs" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-400">
              Automated 60-day renewal notices sent to corporate accounts.
            </span>
          </div>
        </div>

        {/* Recent Payments Ledger */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 lg:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FontAwesomeIcon icon={faCreditCard} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Recent Rent Collections</h3>
                  <p className="text-xs text-slate-500">Latest rent and utility transactions</p>
                </div>
              </div>
              <button
                onClick={() => setActiveView('payments')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                Full Ledger <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {recentPayments.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setActiveView('payments')}
                  className="py-2.5 flex items-center justify-between hover:bg-slate-50 rounded-xl px-2 cursor-pointer transition-colors"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">{p.customerName}</p>
                    <p className="text-[11px] text-slate-500">
                      {p.invoiceNumber} • {p.method}
                    </p>
                    <span className="text-[10px] text-slate-400">{p.paymentDate || `Due: ${p.dueDate}`}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900">${p.amount.toLocaleString()}</p>
                    <StatusBadge status={p.status} size="xs" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Live banking & gateway sync</span>
            <span className="font-semibold text-slate-700">Auto-reconciliation active</span>
          </div>
        </div>
      </div>

      {/* Maintenance Queue & Activity Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Maintenance Tickets */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 lg:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <FontAwesomeIcon icon={faWrench} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Priority Work Orders</h3>
                <p className="text-xs text-slate-500">Facilities and resident maintenance dispatch</p>
              </div>
            </div>
            <button
              onClick={() => setActiveView('maintenance')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              All Tickets <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {recentTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setActiveView('maintenance-detail', { ticketId: t.id })}
                className="py-3 flex items-start justify-between gap-3 hover:bg-slate-50 rounded-xl px-2 cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{t.title}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        t.priority === 'Urgent'
                          ? 'bg-rose-100 text-rose-700'
                          : t.priority === 'High'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {t.propertyName} ({t.unitNumber}) • Assigned: {t.assignedStaffName}
                  </p>
                </div>
                <StatusBadge status={t.status} size="xs" />
              </div>
            ))}
          </div>
        </div>

        {/* Corporate Audit & Activity Log */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 lg:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Corporate Activity Trail</h3>
              <p className="text-xs text-slate-500">Real-time internal employee audit actions</p>
            </div>
            <button
              onClick={() => setActiveView('activity-logs')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Full Audit <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {recentActivities.map((act) => (
              <div key={act.id} className="py-2.5 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-800 leading-snug">
                    <strong className="text-slate-900">{act.userName}</strong>: {act.description}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                    <span>{act.module}</span>
                    <span>•</span>
                    <span>{act.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
