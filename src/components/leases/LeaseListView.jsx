import React, { useState, useMemo } from 'react';
import { usePMSStore } from '../../store/usePMSStore';
import StatusBadge from '../common/StatusBadge';
import CreateLeaseModal from './CreateLeaseModal';
import RenewLeaseModal from './RenewLeaseModal';
import ConfirmModal from '../common/ConfirmModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileContract,
  faPlus,
  faMagnifyingGlass,
  faRotateRight,
  faBan,
  faEye,
  faClock,
  faBuilding,
  faDoorOpen,
  faCalendarCheck
} from '@fortawesome/free-solid-svg-icons';

export default function LeaseListView({ onOpenQuickAction }) {
  const {
    leases,
    renewLease,
    terminateLease,
    setActiveView
  } = usePMSStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [renewingLease, setRenewingLease] = useState(null);
  const [terminatingLease, setTerminatingLease] = useState(null);

  const filteredLeases = useMemo(() => {
    return leases.filter((l) => {
      const matchesSearch =
        l.leaseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.unitNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leases, searchQuery, statusFilter]);

  const expiringCount = leases.filter((l) => l.status === 'Expiring Soon').length;

  const statuses = ['All', 'Active', 'Expiring Soon', 'Renewed', 'Terminated', 'Draft'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-slate-900">
            Lease Agreements & Contracts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official binding contractual agreements connecting residents and corporate commercial tenants to property units.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shadow-emerald-700/20 active:scale-98"
        >
          <FontAwesomeIcon icon={faPlus} />
          Create Lease Contract
        </button>
      </div>

      {/* Expiring Leases Highlight Alert Banner */}
      {expiringCount > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <FontAwesomeIcon icon={faClock} className="text-lg" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                {expiringCount} Leases Approaching Expiration
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                Contracts within 60 days of expiry require renewal negotiations or transition inspections.
              </p>
            </div>
          </div>
          <button
            onClick={() => setStatusFilter('Expiring Soon')}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs whitespace-nowrap"
          >
            Filter Expiring Leases
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by lease code, tenant name, or property..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Status Pill Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-xs font-medium text-slate-400 mr-1">Status:</span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {st}
              {st === 'All' && ` (${leases.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Leases Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-5">Lease Identifier</th>
                <th className="py-3.5 px-4">Resident / Tenant</th>
                <th className="py-3.5 px-4">Property & Unit</th>
                <th className="py-3.5 px-4">Term Period</th>
                <th className="py-3.5 px-4">Monthly Rent</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeases.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-slate-600">No lease records found</p>
                    <p className="text-[11px] mt-1">Try adjusting search or status filters.</p>
                  </td>
                </tr>
              ) : (
                filteredLeases.map((lease) => (
                  <tr
                    key={lease.id}
                    onClick={() => setActiveView('lease-detail', { leaseId: lease.id })}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                          <FontAwesomeIcon icon={faFileContract} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {lease.leaseNumber}
                          </p>
                          <span className="text-[10px] text-slate-400">{lease.leaseDurationMonths} Months Term</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {lease.customerName}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {lease.propertyName}
                      </span>
                      <span className="text-[11px] text-slate-500">Unit {lease.unitNumber}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-700 font-medium block">
                        {lease.startDate} ~ {lease.endDate}
                      </span>
                      {lease.status === 'Expiring Soon' && (
                        <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                          <FontAwesomeIcon icon={faClock} className="text-[9px]" /> Expiring Soon
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-slate-900 text-sm">
                        QAR {lease.monthlyRent.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 block">/month</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={lease.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setActiveView('lease-detail', { leaseId: lease.id })}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                          title="View Lease Details"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        {(lease.status === 'Active' || lease.status === 'Expiring Soon') && (
                          <button
                            onClick={() => setRenewingLease(lease)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Renew Contract"
                          >
                            <FontAwesomeIcon icon={faRotateRight} />
                          </button>
                        )}
                        {lease.status !== 'Terminated' && (
                          <button
                            onClick={() => setTerminatingLease(lease)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Terminate Contract"
                          >
                            <FontAwesomeIcon icon={faBan} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredLeases.length} of {leases.length} lease contracts</span>
          <span>Official Corporate Tenancy Master Index</span>
        </div>
      </div>

      {/* Create Lease Modal */}
      <CreateLeaseModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* Renew Lease Modal */}
      <RenewLeaseModal
        isOpen={Boolean(renewingLease)}
        onClose={() => setRenewingLease(null)}
        lease={renewingLease}
        onRenew={renewLease}
      />

      {/* Terminate Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(terminatingLease)}
        onClose={() => setTerminatingLease(null)}
        onConfirm={() => {
          if (terminatingLease) terminateLease(terminatingLease.id, 'Standard internal contract termination');
        }}
        title="Terminate Lease Agreement"
        message={`Are you sure you want to terminate Lease #${terminatingLease?.leaseNumber} for ${terminatingLease?.customerName}? This will immediately release Unit ${terminatingLease?.unitNumber} back into Available inventory.`}
        confirmText="Yes, Terminate Lease"
        isDanger={true}
      />
    </div>
  );
}
