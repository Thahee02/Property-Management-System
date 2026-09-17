import React, { useState, useMemo } from 'react';
import { usePMSStore } from '../../store/usePMSStore';
import StatusBadge from '../common/StatusBadge';
import RecordPaymentModal from './RecordPaymentModal';
import PaymentReceiptModal from './PaymentReceiptModal';
import MetricCard from '../common/MetricCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCreditCard,
  faPlus,
  faMagnifyingGlass,
  faFileInvoiceDollar,
  faTriangleExclamation,
  faCircleCheck,
  faClock,
  faPrint,
  faCheck
} from '@fortawesome/free-solid-svg-icons';

export default function PaymentListView({ onOpenQuickAction }) {
  const { payments, recordPayment, updatePaymentStatus, setActiveView } = usePMSStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesSearch =
        p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.referenceNumber && p.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.propertyName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchesMethod = methodFilter === 'All' || p.method === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [payments, searchQuery, statusFilter, methodFilter]);

  const totalCollected = payments
    .filter((p) => p.status === 'Paid')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const totalOverdue = payments
    .filter((p) => p.status === 'Overdue')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const totalPending = payments
    .filter((p) => p.status === 'Pending')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const statuses = ['All', 'Paid', 'Pending', 'Overdue'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-slate-900">
            Rent Collections & Financial Invoices
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tracking rent receipts, invoice reconciliations, aging arrears, and printable corporate vouchers.
          </p>
        </div>

        <button
          onClick={() => setIsRecordOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shadow-emerald-700/20 active:scale-98"
        >
          <FontAwesomeIcon icon={faPlus} />
          Record Rent Payment
        </button>
      </div>

      {/* Financial Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Total Rent Collected"
          value={`$${totalCollected.toLocaleString()}`}
          subtitle="Realized this cycle"
          icon={faCircleCheck}
          iconBg="bg-emerald-50 text-emerald-600"
          trend="Settled"
          trendDirection="up"
        />

        <MetricCard
          title="Pending Invoices"
          value={`$${totalPending.toLocaleString()}`}
          subtitle={`${payments.filter((p) => p.status === 'Pending').length} invoices awaiting due date`}
          icon={faClock}
          iconBg="bg-amber-50 text-amber-600"
        />

        <MetricCard
          title="Overdue Arrears"
          value={`$${totalOverdue.toLocaleString()}`}
          subtitle={`${payments.filter((p) => p.status === 'Overdue').length} past grace period`}
          icon={faTriangleExclamation}
          iconBg="bg-rose-50 text-rose-600"
          badge="Action Required"
          trendDirection="down"
        />
      </div>

      {/* Search and Filters */}
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
              placeholder="Search by invoice number, tenant name, or reference..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Method:</span>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="All">All Methods</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Card">Card</option>
              <option value="Online Payment">Online Payment</option>
            </select>
          </div>
        </div>

        {/* Status Pills */}
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
              {st === 'All' && ` (${payments.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-5">Invoice Reference</th>
                <th className="py-3.5 px-4">Resident / Tenant</th>
                <th className="py-3.5 px-4">Property & Unit</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Method & Ref</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-slate-600">No payment invoices found</p>
                    <p className="text-[11px] mt-1">Try clearing filters or search terms.</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      <span className="font-mono">{p.invoiceNumber}</span>
                      <span className="block text-[10px] text-slate-400 font-normal">{p.notes}</span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {p.customerName}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-800 font-semibold block">{p.propertyName}</span>
                      <span className="text-[11px] text-slate-500">Unit {p.unitNumber}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-slate-900 text-sm">
                        ${p.amount.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-700 font-medium block">{p.method}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {p.referenceNumber || 'Pending Gateway'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-700">{p.dueDate}</span>
                      {p.paymentDate && (
                        <span className="text-[10px] text-emerald-600 block">
                          Paid: {p.paymentDate}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={p.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {p.status !== 'Paid' && (
                          <button
                            onClick={() => updatePaymentStatus(p.id, 'Paid')}
                            className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] flex items-center gap-1"
                            title="Reconcile as Paid"
                          >
                            <FontAwesomeIcon icon={faCheck} /> Mark Paid
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedReceipt(p)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-[11px] flex items-center gap-1"
                          title="Generate Receipt"
                        >
                          <FontAwesomeIcon icon={faPrint} /> Receipt
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredPayments.length} of {payments.length} transactions</span>
          <span>Integrated with Corporate Accounts Receivable</span>
        </div>
      </div>

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={isRecordOpen}
        onClose={() => setIsRecordOpen(false)}
      />

      {/* Receipt Modal */}
      <PaymentReceiptModal
        isOpen={Boolean(selectedReceipt)}
        onClose={() => setSelectedReceipt(null)}
        payment={selectedReceipt}
      />
    </div>
  );
}
