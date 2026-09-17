import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

export default function RenewLeaseModal({ isOpen, onClose, lease, onRenew }) {
  const [newEndDate, setNewEndDate] = useState('');
  const [newRent, setNewRent] = useState('');

  useEffect(() => {
    if (lease) {
      // Default to 12 months past current end date
      const currEnd = new Date(lease.endDate);
      const nextEnd = new Date(currEnd.getFullYear() + 1, currEnd.getMonth(), currEnd.getDate());
      setNewEndDate(nextEnd.toISOString().substring(0, 10));
      // Default to 3-5% standard increase
      const escalated = Math.round(lease.monthlyRent * 1.03);
      setNewRent(escalated);
    }
  }, [lease, isOpen]);

  if (!lease) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newEndDate || !newRent) return;
    onRenew(lease.id, newEndDate, newRent);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Renew Lease Agreement: ${lease.leaseNumber}`}
      subtitle={`Tenant: ${lease.customerName} • ${lease.propertyName} (${lease.unitNumber})`}
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
            Execute Renewal Extension
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800">
          <p className="font-bold">Current Expiration: {lease.endDate}</p>
          <p className="text-[11px] mt-0.5">
            Current Monthly Rent: ${lease.monthlyRent.toLocaleString()}
          </p>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">
            New Lease End Date *
          </label>
          <input
            type="date"
            required
            value={newEndDate}
            onChange={(e) => setNewEndDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">
            Adjusted Monthly Rent ($) *
          </label>
          <input
            type="number"
            required
            value={newRent}
            onChange={(e) => setNewRent(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Standard annual renewal guideline recommends 3% CPI adjustment.
          </p>
        </div>
      </form>
    </Modal>
  );
}
