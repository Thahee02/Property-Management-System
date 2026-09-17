import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { usePMSStore } from '../../store/usePMSStore';

const DEFAULT_PRESELECTED = {};

export default function CreateLeaseModal({ isOpen, onClose, preselected = DEFAULT_PRESELECTED }) {
  const { customers, properties, units, createLease } = usePMSStore();

  const [formData, setFormData] = useState({
    customerId: '',
    propertyId: '',
    unitId: '',
    startDate: new Date().toISOString().substring(0, 10),
    endDate: '',
    monthlyRent: '',
    securityDeposit: '',
    dueDay: 1,
    leaseDurationMonths: 12,
    renewalTerms: 'Automatic 12-month extension with 60 days advance notice.',
    noticePeriodDays: 60,
    additionalCharges: 0,
    notes: ''
  });

  const preselectedCustomer = preselected?.customerId;
  const preselectedProperty = preselected?.propertyId;
  const preselectedUnit = preselected?.unitId;

  // Prepopulate when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const today = new Date();
    const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
    const endDateStr = nextYear.toISOString().substring(0, 10);

    const initialCust = preselectedCustomer || (customers[0]?.id || '');
    const initialProp = preselectedProperty || (properties[0]?.id || '');
    const initialUnit = preselectedUnit || '';
    const selectedUnit = units.find((u) => u.id === initialUnit);

    setFormData({
      customerId: initialCust,
      propertyId: initialProp,
      unitId: initialUnit,
      startDate: new Date().toISOString().substring(0, 10),
      endDate: endDateStr,
      monthlyRent: selectedUnit ? (selectedUnit.monthlyRent || '') : '',
      securityDeposit: selectedUnit ? (selectedUnit.securityDeposit || selectedUnit.monthlyRent || '') : '',
      dueDay: 1,
      leaseDurationMonths: 12,
      renewalTerms: 'Standard 12-month extension with 60 days notice.',
      noticePeriodDays: 60,
      additionalCharges: 0,
      notes: ''
    });
  }, [isOpen, preselectedCustomer, preselectedProperty, preselectedUnit]);

  // When property changes, reset unitId
  const availableUnitsForProperty = units.filter(
    (u) => u.propertyId === formData.propertyId && (u.status === 'Available' || u.id === preselectedUnit)
  );

  // When unit selected, auto-fill rent and deposit
  const handleUnitChange = (unitId) => {
    const selected = units.find((u) => u.id === unitId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        unitId,
        monthlyRent: selected.monthlyRent || '',
        securityDeposit: selected.securityDeposit || selected.monthlyRent || ''
      }));
    } else {
      setFormData((prev) => ({ ...prev, unitId }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerId || !formData.propertyId || !formData.unitId) return;

    createLease({
      ...formData,
      monthlyRent: Number(formData.monthlyRent),
      securityDeposit: Number(formData.securityDeposit),
      dueDay: Number(formData.dueDay || 1),
      noticePeriodDays: Number(formData.noticePeriodDays || 60),
      additionalCharges: Number(formData.additionalCharges || 0)
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Draft & Execute Lease Agreement"
      subtitle="Connect customer/tenant to a property and physical unit in the portfolio"
      maxWidth="max-w-2xl"
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
            Execute Lease Contract
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs">
        {/* 3-Way Selector */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
          <h4 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider text-slate-500">
            1. Relational Assignment (Tenant $\rightarrow$ Property $\rightarrow$ Unit)
          </h4>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Select Tenant / Resident <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={formData.customerId}
              onChange={(e) => setFormData((prev) => ({ ...prev, customerId: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
            >
              <option value="">-- Choose Tenant --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} ({c.id} • {c.customerType})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Property Building <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={formData.propertyId}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, propertyId: e.target.value, unitId: '' }));
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value="">-- Choose Property --</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Available Physical Unit <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={formData.unitId}
                onChange={(e) => handleUnitChange(e.target.value)}
                disabled={!formData.propertyId}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white disabled:bg-slate-100"
              >
                <option value="">-- Select Available Unit --</option>
                {availableUnitsForProperty.map((u) => (
                  <option key={u.id} value={u.id}>
                    Unit {u.unitNumber} ({u.type} • Floor {u.floor} • ${u.monthlyRent}/mo)
                  </option>
                ))}
              </select>
              {formData.propertyId && availableUnitsForProperty.length === 0 && (
                <p className="text-[11px] text-amber-600 mt-1">
                  No units currently available in this property.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Lease Terms & Financials */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider text-slate-500">
            2. Financial Terms & Term Dates
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Lease Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Lease End Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Monthly Rent ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.monthlyRent}
                onChange={(e) => setFormData((prev) => ({ ...prev, monthlyRent: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Security Deposit ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.securityDeposit}
                onChange={(e) => setFormData((prev) => ({ ...prev, securityDeposit: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Monthly Due Day
              </label>
              <input
                type="number"
                min="1"
                max="28"
                value={formData.dueDay}
                onChange={(e) => setFormData((prev) => ({ ...prev, dueDay: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Additional Recurring Charges ($)
              </label>
              <input
                type="number"
                value={formData.additionalCharges}
                onChange={(e) => setFormData((prev) => ({ ...prev, additionalCharges: e.target.value }))}
                placeholder="e.g. 50 (Parking, Pet fee)"
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Notice Period (Days)
              </label>
              <input
                type="number"
                value={formData.noticePeriodDays}
                onChange={(e) => setFormData((prev) => ({ ...prev, noticePeriodDays: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Renewal & Termination Terms
            </label>
            <input
              type="text"
              value={formData.renewalTerms}
              onChange={(e) => setFormData((prev) => ({ ...prev, renewalTerms: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Internal Agreement Notes
            </label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Key handover notes, storage locker numbers, parking stall allocation..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
