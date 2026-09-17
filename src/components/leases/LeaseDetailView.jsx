import React, { useState } from 'react';
import { usePMSStore } from '../../store/usePMSStore';
import StatusBadge from '../common/StatusBadge';
import RenewLeaseModal from './RenewLeaseModal';
import ConfirmModal from '../common/ConfirmModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faFileContract,
  faUser,
  faBuilding,
  faCalendarDays,
  faRotateRight,
  faBan,
  faDownload,
  faCreditCard,
  faClock,
  faFolderOpen,
  faShieldHalved,
  faPrint,
  faEnvelope,
  faPhone
} from '@fortawesome/free-solid-svg-icons';

export default function LeaseDetailView({ onOpenQuickAction }) {
  const {
    viewParams,
    leases,
    customers,
    properties,
    units,
    payments,
    documents,
    activityLogs,
    renewLease,
    terminateLease,
    setActiveView
  } = usePMSStore();

  const [isRenewOpen, setIsRenewOpen] = useState(false);
  const [isTerminateOpen, setIsTerminateOpen] = useState(false);

  const leaseId = viewParams?.leaseId;
  const lease = leases.find((l) => l.id === leaseId) || leases[0];

  if (!lease) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500">Lease contract not found.</p>
        <button
          onClick={() => setActiveView('leases')}
          className="mt-3 text-xs font-semibold text-emerald-600"
        >
          Back to Leases Directory
        </button>
      </div>
    );
  }

  const tenant = customers.find((c) => c.id === lease.customerId);
  const property = properties.find((p) => p.id === lease.propertyId);
  const unit = units.find((u) => u.id === lease.unitId);
  const leasePayments = payments.filter((p) => p.leaseId === lease.id || (p.customerId === lease.customerId && p.unitNumber === lease.unitNumber));
  const leaseDocs = documents.filter((d) => d.entityId === lease.id || d.entityType === 'Lease');
  const leaseLogs = activityLogs.filter((a) => a.description.includes(lease.leaseNumber));

  // Compute timeline progress
  const start = new Date(lease.startDate).getTime();
  const end = new Date(lease.endDate).getTime();
  const now = new Date('2024-01-05').getTime(); // anchored demo date
  const totalDuration = end - start || 1;
  const elapsed = Math.max(0, Math.min(now - start, totalDuration));
  const progressPercent = Math.round((elapsed / totalDuration) * 100);

  return (
    <div className="space-y-6 pb-12">
      {/* Back Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => setActiveView('leases')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Leases Directory
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onOpenQuickAction('payment', { customerId: lease.customerId, propertyId: lease.propertyId, unitId: lease.unitId })}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <FontAwesomeIcon icon={faCreditCard} />
            Record Rent Payment
          </button>
          {(lease.status === 'Active' || lease.status === 'Expiring Soon') && (
            <button
              onClick={() => setIsRenewOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <FontAwesomeIcon icon={faRotateRight} />
              Renew Lease
            </button>
          )}
          {lease.status !== 'Terminated' && (
            <button
              onClick={() => setIsTerminateOpen(true)}
              className="px-3.5 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <FontAwesomeIcon icon={faBan} />
              Terminate Lease
            </button>
          )}
        </div>
      </div>

      {/* Contract Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                Legal Contract
              </span>
              <StatusBadge status={lease.status} size="sm" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">{lease.leaseNumber}</h1>
            <p className="text-xs text-slate-500 mt-1">
              Executed between <strong className="text-slate-800">{lease.customerName}</strong> and{' '}
              <strong className="text-slate-800">Apex Properties Ltd.</strong>
            </p>
          </div>

          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Monthly Rent
              </span>
              <span className="text-2xl font-extrabold text-emerald-700">
                QAR {lease.monthlyRent?.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Security Deposit
              </span>
              <span className="text-xl font-bold text-slate-800">
                QAR {lease.securityDeposit?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Lease Timeline */}
        <div className="pt-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faCalendarDays} className="text-emerald-600 text-xs" />
              Contract Term Timeline
            </span>
            <span className="font-bold text-slate-900">
              {progressPercent}% Complete ({lease.startDate} to {lease.endDate})
            </span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                lease.status === 'Expiring Soon' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
            <span>Commenced: {lease.startDate}</span>
            <span>Expiration: {lease.endDate}</span>
          </div>
        </div>
      </div>

      {/* Linked Parties Dossier (Tenant + Property Unit) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tenant Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-slate-400" />
                Contracted Tenant / Resident
              </h3>
              {tenant && (
                <button
                  onClick={() => setActiveView('customer-detail', { customerId: tenant.id })}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  View Profile →
                </button>
              )}
            </div>

            {tenant ? (
              <div className="mt-4 flex items-start gap-4">
                <img
                  src={tenant.avatar}
                  alt={tenant.fullName}
                  className="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-200 shrink-0"
                />
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-slate-900 text-sm">{tenant.fullName}</h4>
                  <p className="text-slate-500 flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faEnvelope} className="text-slate-400 text-[10px]" />
                    {tenant.email}
                  </p>
                  <p className="text-slate-500 flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faPhone} className="text-slate-400 text-[10px]" />
                    {tenant.phone}
                  </p>
                  <p className="text-slate-400 text-[11px]">ID/Tax Code: {tenant.nicPassport}</p>
                </div>
              </div>
            ) : (
              <div className="py-4 text-slate-400 text-xs">{lease.customerName}</div>
            )}
          </div>

          <div className="pt-3 mt-4 border-t border-slate-100 text-[11px] text-slate-400">
            Emergency Contact: {tenant?.emergencyContact || 'Verified on file'}
          </div>
        </div>

        {/* Property & Unit Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faBuilding} className="text-slate-400" />
                Demised Property & Unit
              </h3>
              {property && (
                <button
                  onClick={() => setActiveView('property-detail', { propertyId: property.id })}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  Property Details →
                </button>
              )}
            </div>

            <div className="mt-4 flex items-start gap-4">
              {property?.image && (
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-200 shrink-0"
                />
              )}
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-slate-900 text-sm">
                  {lease.propertyName} - Unit {lease.unitNumber}
                </h4>
                <p className="text-slate-500">
                  {property?.address}, {property?.city}
                </p>
                {unit && (
                  <p className="text-slate-600 font-medium">
                    Floor {unit.floor} • {unit.type} • {unit.bedrooms} Bed / {unit.bathrooms} Bath ({unit.area} sq ft)
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 mt-4 border-t border-slate-100 text-[11px] text-slate-400">
            Property Manager: {property?.managerName || 'Assigned'}
          </div>
        </div>
      </div>

      {/* Financial Clauses & Terms */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Contract Clauses & Financial Terms
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Monthly Due Day
            </span>
            <p className="font-bold text-slate-900">{lease.dueDay}st of each calendar month</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Notice Period
            </span>
            <p className="font-bold text-slate-900">{lease.noticePeriodDays || 60} Days Advance Notice</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Additional Recurring Surcharges
            </span>
            <p className="font-bold text-slate-900">QAR {lease.additionalCharges || 0} / mo (Parking/CAM)</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-700 leading-relaxed">
          <span className="font-bold text-slate-900 block mb-1">Renewal Terms:</span>
          <p>{lease.renewalTerms || 'Standard annual extension with market rate review.'}</p>
        </div>
      </div>

      {/* Associated Rent Payments Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Rent Ledger for This Contract</h3>
          <button
            onClick={() => onOpenQuickAction('payment', { customerId: lease.customerId, propertyId: lease.propertyId, unitId: lease.unitId })}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
          >
            + Record Rent Payment
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Payment Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leasePayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No payment records logged under this contract yet.
                  </td>
                </tr>
              ) : (
                leasePayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{p.invoiceNumber}</td>
                    <td className="py-3 px-4 font-extrabold text-slate-900">QAR {p.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">{p.method}</td>
                    <td className="py-3 px-4">{p.dueDate}</td>
                    <td className="py-3 px-4">{p.paymentDate || '—'}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={p.status} size="xs" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setActiveView('payments', { highlightPaymentId: p.id })}
                        className="text-emerald-600 hover:text-emerald-700 font-semibold"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Renewal Modal */}
      <RenewLeaseModal
        isOpen={isRenewOpen}
        onClose={() => setIsRenewOpen(false)}
        lease={lease}
        onRenew={renewLease}
      />

      {/* Terminate Modal */}
      <ConfirmModal
        isOpen={isTerminateOpen}
        onClose={() => setIsTerminateOpen(false)}
        onConfirm={() => {
          terminateLease(lease.id, 'Early agreement termination');
          setIsTerminateOpen(false);
        }}
        title="Terminate Lease Contract"
        message={`Are you sure you want to terminate Lease #${lease.leaseNumber}? Unit ${lease.unitNumber} will be marked Available immediately.`}
        confirmText="Confirm Termination"
        isDanger={true}
      />
    </div>
  );
}
