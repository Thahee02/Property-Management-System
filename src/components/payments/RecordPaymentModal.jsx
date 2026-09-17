import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { usePMSStore } from '../../store/usePMSStore';

const DEFAULT_PRESELECTED = {};

export default function RecordPaymentModal({ isOpen, onClose, preselected = DEFAULT_PRESELECTED }) {
  const { customers, properties, units, leases, recordPayment } = usePMSStore();

  const [formData, setFormData] = useState({
    customerId: '',
    propertyId: '',
    unitNumber: '',
    amount: '',
    paymentDate: new Date().toISOString().substring(0, 10),
    dueDate: new Date().toISOString().substring(0, 10),
    method: 'Bank Transfer',
    referenceNumber: '',
    notes: ''
  });

  const preselectedCustomer = preselected?.customerId;
  const preselectedProperty = preselected?.propertyId;

  useEffect(() => {
    if (!isOpen) return;

    const custId = preselectedCustomer || (customers[0]?.id || '');
    const cust = customers.find((c) => c.id === custId);
    const propId = preselectedProperty || cust?.currentPropertyId || (properties[0]?.id || '');
    const unitNo = cust?.currentUnitNumber || 'A-101';

    // Find rent amount if lease exists
    const lease = leases.find((l) => l.customerId === custId);

    // Generate a stable unique reference code once when modal opens
    const uniqueRef = `TRX-${Math.floor(100000 + Math.random() * 900000)}`;

    setFormData({
      customerId: custId,
      propertyId: propId,
      unitNumber: unitNo,
      amount: lease ? lease.monthlyRent : '2200',
      paymentDate: new Date().toISOString().substring(0, 10),
      dueDate: new Date().toISOString().substring(0, 10),
      method: 'Bank Transfer',
      referenceNumber: uniqueRef,
      notes: 'Monthly rental settlement'
    });
  }, [isOpen, preselectedCustomer, preselectedProperty]);

  const handleCustomerChange = (custId) => {
    const cust = customers.find((c) => c.id === custId);
    const lease = leases.find((l) => l.customerId === custId);

    setFormData((prev) => ({
      ...prev,
      customerId: custId,
      propertyId: cust?.currentPropertyId || prev.propertyId,
      unitNumber: cust?.currentUnitNumber || prev.unitNumber,
      amount: lease ? lease.monthlyRent : prev.amount
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerId || !formData.amount) return;

    recordPayment({
      ...formData,
      amount: Number(formData.amount)
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Rent Collection / Payment"
      subtitle="Process verified rent, security deposit, or utility transaction into corporate accounts"
      maxWidth="max-w-xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
          >
            Record & Issue Receipt
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">
            Payer / Resident <span className="text-rose-500">*</span>
          </label>
          <select
            required
            value={formData.customerId}
            onChange={(e) => handleCustomerChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName} ({c.currentUnitNumber ? `Unit ${c.currentUnitNumber}` : 'No unit'})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Property Location <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={formData.propertyId}
              onChange={(e) => setFormData((prev) => ({ ...prev, propertyId: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Unit Number
            </label>
            <input
              type="text"
              value={formData.unitNumber}
              onChange={(e) => setFormData((prev) => ({ ...prev, unitNumber: e.target.value }))}
              placeholder="e.g. A-101"
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Payment Amount (QAR) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              value={formData.amount}
              onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Payment Method <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.method}
              onChange={(e) => setFormData((prev) => ({ ...prev, method: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
            >
              <option value="Bank Transfer">Bank Transfer (ACH / Wire)</option>
              <option value="Card">Credit / Debit Card</option>
              <option value="Online Payment">Online Portal Payment</option>
              <option value="Cash">Cash Handover</option>
              <option value="Cheque">Cashier / Corporate Cheque</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Transaction Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.paymentDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, paymentDate: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Reference / Transaction Code
            </label>
            <input
              type="text"
              value={formData.referenceNumber}
              onChange={(e) => setFormData((prev) => ({ ...prev, referenceNumber: e.target.value }))}
              placeholder="e.g. WIRE-990182"
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">
            Transaction Notes & Ledger Item
          </label>
          <input
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="e.g. Monthly rent settlement for January 2024"
            className="w-full px-3 py-2 rounded-xl border border-slate-300"
          />
        </div>
      </form>
    </Modal>
  );
}
