import React, { useState, useRef, useEffect } from 'react';
import { usePMSStore } from '../../store/usePMSStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faMagnifyingGlass,
  faBell,
  faPlus,
  faUserTie,
  faAngleDown,
  faCreditCard,
  faUserPlus,
  faFileContract,
  faWrench,
  faClock,
  faTriangleExclamation,
  faBuilding,
  faCheckDouble
} from '@fortawesome/free-solid-svg-icons';

export default function TopHeader({ setMobileOpen, onOpenQuickAction, onOpenSearchModal }) {
  const {
    currentUser,
    users,
    setCurrentUser,
    leases,
    payments,
    maintenance,
    setActiveView
  } = usePMSStore();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);

  const roleRef = useRef(null);
  const notifRef = useRef(null);
  const quickRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleRef.current && !roleRef.current.contains(event.target)) {
        setRoleDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
      if (quickRef.current && !quickRef.current.contains(event.target)) {
        setQuickActionOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute notifications
  const expiringLeases = leases.filter((l) => l.status === 'Expiring Soon');
  const overduePayments = payments.filter((p) => p.status === 'Overdue');
  const urgentMaintenance = maintenance.filter((m) => m.priority === 'Urgent' || m.priority === 'High');
  const totalAlerts = expiringLeases.length + overduePayments.length + urgentMaintenance.length;

  return (
    <header className="h-18 bg-white border-b border-slate-200/90 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3 lg:gap-4 flex-1 max-w-xl">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
        >
          <FontAwesomeIcon icon={faBars} className="text-lg" />
        </button>

        {/* Global Omnisearch Bar Trigger */}
        <div
          onClick={onOpenSearchModal}
          className="w-full max-w-md flex items-center gap-2.5 px-3.5 py-2 bg-slate-100/80 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer transition-all text-slate-400 group"
        >
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-slate-400 group-hover:text-emerald-600 transition-colors text-sm"
          />
          <span className="text-xs sm:text-sm text-slate-500 font-medium truncate flex-1">
            Search tenants, properties, units, invoices...
          </span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white text-slate-400 border border-slate-200 shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Quick Actions + Role Switcher + Alerts + Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Action Button */}
        <div className="relative" ref={quickRef}>
          <button
            onClick={() => setQuickActionOpen(!quickActionOpen)}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs shadow-emerald-700/20 active:scale-98"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
            <span className="hidden md:inline">Quick Action</span>
            <FontAwesomeIcon icon={faAngleDown} className="text-xs ml-0.5 opacity-80" />
          </button>

          {quickActionOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                Create Operational Record
              </div>
              <button
                onClick={() => {
                  setQuickActionOpen(false);
                  onOpenQuickAction('customer');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
              >
                <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FontAwesomeIcon icon={faUserPlus} className="text-xs" />
                </div>
                <span>Add New Tenant</span>
              </button>
              <button
                onClick={() => {
                  setQuickActionOpen(false);
                  onOpenQuickAction('lease');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
              >
                <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FontAwesomeIcon icon={faFileContract} className="text-xs" />
                </div>
                <span>Create Lease Agreement</span>
              </button>
              <button
                onClick={() => {
                  setQuickActionOpen(false);
                  onOpenQuickAction('payment');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
              >
                <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FontAwesomeIcon icon={faCreditCard} className="text-xs" />
                </div>
                <span>Record Rent Payment</span>
              </button>
              <button
                onClick={() => {
                  setQuickActionOpen(false);
                  onOpenQuickAction('maintenance');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
              >
                <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
                  <FontAwesomeIcon icon={faWrench} className="text-xs" />
                </div>
                <span>New Maintenance Ticket</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-2.5 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            title="Operational Alerts"
          >
            <FontAwesomeIcon icon={faBell} className="text-base" />
            {totalAlerts > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Operational Alerts</h4>
                  <p className="text-[11px] text-slate-500">{totalAlerts} items requiring attention</p>
                </div>
                <span className="text-[10px] font-semibold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full border border-rose-200">
                  Live
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-left">
                {overduePayments.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setNotifDropdownOpen(false);
                      setActiveView('payments');
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer flex items-start gap-3 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                      <FontAwesomeIcon icon={faTriangleExclamation} className="text-xs" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">
                        Overdue Rent: QAR {p.amount.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {p.customerName} - {p.propertyName} ({p.unitNumber})
                      </p>
                      <span className="text-[10px] text-rose-500 font-medium">Due Date: {p.dueDate}</span>
                    </div>
                  </div>
                ))}

                {expiringLeases.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => {
                      setNotifDropdownOpen(false);
                      setActiveView('leases');
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer flex items-start gap-3 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <FontAwesomeIcon icon={faClock} className="text-xs" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">Lease Approaching Expiry</p>
                      <p className="text-[11px] text-slate-500">
                        {l.customerName} ({l.leaseNumber})
                      </p>
                      <span className="text-[10px] text-amber-600 font-medium">Expires: {l.endDate}</span>
                    </div>
                  </div>
                ))}

                {urgentMaintenance.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setNotifDropdownOpen(false);
                      setActiveView('maintenance');
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer flex items-start gap-3 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <FontAwesomeIcon icon={faWrench} className="text-xs" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">
                        {m.priority} Priority: {m.title}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {m.propertyName} - {m.unitNumber}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 pt-2 border-t border-slate-100 text-center">
                <span className="text-[11px] text-slate-400">All alerts monitored in real-time</span>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Staff Role Switcher */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200/90 bg-slate-50/80 hover:bg-slate-100 transition-all text-left"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-300"
            />
            <div className="hidden xl:block">
              <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                {currentUser.name}
                <FontAwesomeIcon icon={faAngleDown} className="text-[10px] text-slate-400" />
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded inline-block mt-0.5">
                {currentUser.role}
              </span>
            </div>
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Active Portal Role
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Demonstrate system views as different internal team members:
                </p>
              </div>
              <div className="py-1">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      setCurrentUser(user.id);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-xs transition-colors ${
                      currentUser.id === user.id ? 'bg-emerald-50 text-emerald-950 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 truncate">{user.name}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <span className="font-medium text-emerald-700">{user.role}</span>
                        <span>•</span>
                        <span className="truncate">{user.department}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
