import React, { useState } from 'react';
import { usePMSStore } from '../../store/usePMSStore';
import StatusBadge from '../common/StatusBadge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faBuilding,
  faDoorOpen,
  faEnvelope,
  faPhone,
  faPassport,
  faCalendarDays,
  faLocationDot,
  faPhoneVolume,
  faFileContract,
  faCreditCard,
  faWrench,
  faFolderOpen,
  faClockRotateLeft,
  faPlus,
  faPenToSquare,
  faDownload,
  faEye
} from '@fortawesome/free-solid-svg-icons';

export default function CustomerDetailView({ onOpenQuickAction }) {
  const {
    viewParams,
    customers,
    leases,
    payments,
    maintenance,
    documents,
    activityLogs,
    setActiveView
  } = usePMSStore();

  const [activeTab, setActiveTab] = useState('overview'); // overview, lease, payments, maintenance, documents, logs

  const customerId = viewParams?.customerId;
  const customer = customers.find((c) => c.id === customerId) || customers[0];

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500">Tenant not found.</p>
        <button
          onClick={() => setActiveView('customers')}
          className="mt-3 text-xs font-semibold text-emerald-600"
        >
          Back to Tenants Directory
        </button>
      </div>
    );
  }

  // Related data
  const customerLeases = leases.filter((l) => l.customerId === customer.id);
  const activeLease = customerLeases.find((l) => l.status === 'Active' || l.status === 'Renewed' || l.status === 'Expiring Soon') || customerLeases[0];
  const customerPayments = payments.filter((p) => p.customerId === customer.id);
  const customerTickets = maintenance.filter((m) => m.customerId === customer.id);
  const customerDocs = documents.filter((d) => d.entityId === customer.id || (activeLease && d.entityId === activeLease.id));
  const customerLogs = activityLogs.filter((a) => a.description.includes(customer.fullName) || a.description.includes(customer.id));

  const totalPaid = customerPayments
    .filter((p) => p.status === 'Paid')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const totalOverdue = customerPayments
    .filter((p) => p.status === 'Overdue')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Back Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => setActiveView('customers')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Tenants Directory
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onOpenQuickAction('payment', { customerId: customer.id })}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <FontAwesomeIcon icon={faCreditCard} />
            Record Payment
          </button>
          <button
            onClick={() => onOpenQuickAction('maintenance', { customerId: customer.id, propertyId: customer.currentPropertyId, unitId: customer.currentUnitId })}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <FontAwesomeIcon icon={faWrench} className="text-amber-500" />
            New Maintenance Order
          </button>
          {!activeLease && (
            <button
              onClick={() => onOpenQuickAction('lease', { customerId: customer.id })}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <FontAwesomeIcon icon={faFileContract} />
              Assign Lease
            </button>
          )}
        </div>
      </div>

      {/* Tenant Profile Hero Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={customer.avatar}
              alt={customer.fullName}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-slate-200 shadow-md shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-extrabold text-slate-900">{customer.fullName}</h2>
                <StatusBadge status={customer.status} size="sm" />
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {customer.customerType}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Tenant Reference ID: <strong className="text-slate-800">{customer.id}</strong> • Member since{' '}
                {customer.createdAt}
              </p>

              {customer.currentPropertyName ? (
                <div className="mt-2.5 flex items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1.5 font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <FontAwesomeIcon icon={faBuilding} className="text-emerald-600" />
                    {customer.currentPropertyName}
                  </span>
                  <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                    Unit {customer.currentUnitNumber}
                  </span>
                </div>
              ) : (
                <div className="mt-2 text-xs text-slate-400 italic">No current active residency unit</div>
              )}
            </div>
          </div>

          {/* Quick Ledger Balance Chips */}
          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Total Invoiced Paid
              </span>
              <span className="text-lg font-extrabold text-emerald-600">
                ${totalPaid.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Arrears / Overdue
              </span>
              <span className={`text-lg font-extrabold ${totalOverdue > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                ${totalOverdue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <FontAwesomeIcon icon={faEnvelope} className="text-slate-400" />
            <span className="truncate">{customer.email}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <FontAwesomeIcon icon={faPhone} className="text-slate-400" />
            <span>{customer.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <FontAwesomeIcon icon={faPassport} className="text-slate-400" />
            <span>{customer.nicPassport}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <FontAwesomeIcon icon={faCalendarDays} className="text-slate-400" />
            <span>DOB: {customer.dob || 'Not provided'}</span>
          </div>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {[
          { id: 'overview', label: 'Overview & Profile', icon: faBuilding },
          { id: 'lease', label: `Leases (${customerLeases.length})`, icon: faFileContract },
          { id: 'payments', label: `Payment History (${customerPayments.length})`, icon: faCreditCard },
          { id: 'maintenance', label: `Work Orders (${customerTickets.length})`, icon: faWrench },
          { id: 'documents', label: `Documents (${customerDocs.length})`, icon: faFolderOpen },
          { id: 'logs', label: 'Activity Trail', icon: faClockRotateLeft }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <FontAwesomeIcon icon={tab.icon} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Identity & Emergency Info Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Identity & Emergency Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Permanent Address
                  </span>
                  <p className="text-slate-800 font-medium">{customer.address || 'Same as current residence'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Emergency Contact
                  </span>
                  <p className="text-slate-800 font-medium">{customer.emergencyContact || 'None on file'}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Internal Staff Notes & Special Conditions
                </span>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/70 leading-relaxed">
                  {customer.notes || 'No special conditions recorded for this resident.'}
                </p>
              </div>
            </div>

            {/* Current Active Lease Summary */}
            {activeLease ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">Current Lease Agreement</h3>
                  <StatusBadge status={activeLease.status} size="xs" />
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Lease Ref</span>
                    <p className="font-bold text-slate-900">{activeLease.leaseNumber}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Term Duration</span>
                    <p className="font-bold text-slate-900">{activeLease.startDate} to {activeLease.endDate}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Monthly Rent</span>
                    <p className="font-bold text-emerald-700">${activeLease.monthlyRent.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Deposit Held</span>
                    <p className="font-bold text-slate-900">${activeLease.securityDeposit.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => setActiveView('lease-detail', { leaseId: activeLease.id })}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    View Full Lease File & Actions →
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Right Column: Quick Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Compliance Checklist
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 text-emerald-800">
                  <span>ID / Passport Verification</span>
                  <span className="font-bold">Verified</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 text-emerald-800">
                  <span>Background & Credit Check</span>
                  <span className="font-bold">Cleared</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 text-emerald-800">
                  <span>Security Deposit In Escrow</span>
                  <span className="font-bold">Secured</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Leases */}
      {activeTab === 'lease' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Lease Contracts History</h3>
            <button
              onClick={() => onOpenQuickAction('lease', { customerId: customer.id })}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              + Create New Contract
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Lease Code</th>
                  <th className="py-3 px-4">Property & Unit</th>
                  <th className="py-3 px-4">Term Dates</th>
                  <th className="py-3 px-4">Rent / Mo</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customerLeases.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{l.leaseNumber}</td>
                    <td className="py-3 px-4">
                      {l.propertyName} (Unit {l.unitNumber})
                    </td>
                    <td className="py-3 px-4">
                      {l.startDate} ~ {l.endDate}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-700">
                      ${l.monthlyRent.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={l.status} size="xs" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setActiveView('lease-detail', { leaseId: l.id })}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Payments */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Tenant Payment Ledger</h3>
            <button
              onClick={() => onOpenQuickAction('payment', { customerId: customer.id })}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              + Record Payment
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Paid Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customerPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{p.invoiceNumber}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">${p.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">{p.method}</td>
                    <td className="py-3 px-4">{p.dueDate}</td>
                    <td className="py-3 px-4">{p.paymentDate || '—'}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={p.status} size="xs" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setActiveView('payments', { highlightPaymentId: p.id })}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Maintenance */}
      {activeTab === 'maintenance' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Work Orders & Maintenance Tickets</h3>
            <button
              onClick={() => onOpenQuickAction('maintenance', { customerId: customer.id })}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              + Create Ticket
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Issue Description</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assigned Tech</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customerTickets.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{m.id}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{m.title}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-700">{m.priority}</span>
                    </td>
                    <td className="py-3 px-4">{m.assignedStaffName}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={m.status} size="xs" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setActiveView('maintenance-detail', { ticketId: m.id })}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Documents */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Tenant Files & Documents</h3>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {customerDocs.map((doc) => (
              <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <p className="font-bold text-slate-900">{doc.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {doc.type} • {doc.fileSize} • Uploaded by {doc.uploadedBy}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faDownload} /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Activity History */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Tenant Audit Trail
          </h3>
          <div className="divide-y divide-slate-100">
            {customerLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-800 leading-snug">{log.description}</p>
                  <span className="text-[10px] text-slate-400">
                    {log.userName} • {log.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
