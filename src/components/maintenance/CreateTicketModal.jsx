import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { usePMSStore } from '../../store/usePMSStore';

const DEFAULT_PRESELECTED = {};

export default function CreateTicketModal({ isOpen, onClose, preselected = DEFAULT_PRESELECTED }) {
  const { customers, properties, units, users, createMaintenance } = usePMSStore();

  const [formData, setFormData] = useState({
    customerId: '',
    propertyId: '',
    unitId: '',
    title: '',
    description: '',
    priority: 'Medium',
    category: 'Plumbing',
    assignedStaffId: '',
    dueDate: ''
  });

  const staffMembers = users.filter((u) => u.role === 'Staff' || u.role === 'Property Manager');

  const preselectedCustomer = preselected?.customerId;
  const preselectedProperty = preselected?.propertyId;
  const preselectedUnit = preselected?.unitId;

  useEffect(() => {
    if (!isOpen) return;

    const defaultCust = preselectedCustomer || (customers[0]?.id || '');
    const cust = customers.find((c) => c.id === defaultCust);
    const defaultProp = preselectedProperty || cust?.currentPropertyId || (properties[0]?.id || '');
    const defaultUnit = preselectedUnit || cust?.currentUnitId || '';

    const next3Days = new Date();
    next3Days.setDate(next3Days.getDate() + 3);

    setFormData({
      customerId: defaultCust,
      propertyId: defaultProp,
      unitId: defaultUnit,
      title: '',
      description: '',
      priority: 'Medium',
      category: 'Plumbing',
      assignedStaffId: staffMembers[0]?.id || '',
      dueDate: next3Days.toISOString().substring(0, 10)
    });
  }, [isOpen, preselectedCustomer, preselectedProperty, preselectedUnit]);

  const propertyUnits = units.filter((u) => u.propertyId === formData.propertyId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    createMaintenance(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Maintenance Work Order"
      subtitle="Dispatch internal facilities technician or vendor for resident issue"
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
            Dispatch Work Order
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">
            Issue Title / Summary <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="e.g. Water leak under kitchen sink fixture"
            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
            >
              <option value="Plumbing">Plumbing</option>
              <option value="HVAC">HVAC / Air Conditioning</option>
              <option value="Electrical">Electrical</option>
              <option value="Carpentry">Carpentry & Doors</option>
              <option value="Elevator">Elevator / Mechanical</option>
              <option value="Appliance">Appliance</option>
              <option value="General">General Facilities</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Priority Level</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData((prev) => ({ ...prev, priority: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold"
            >
              <option value="Low">Low (Routine)</option>
              <option value="Medium">Medium (Standard)</option>
              <option value="High">High (Within 24h)</option>
              <option value="Urgent">Urgent (Emergency Response)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Property Location <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={formData.propertyId}
              onChange={(e) => setFormData((prev) => ({ ...prev, propertyId: e.target.value, unitId: '' }))}
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
            <label className="block font-bold text-slate-700 mb-1">Unit</label>
            <select
              value={formData.unitId}
              onChange={(e) => setFormData((prev) => ({ ...prev, unitId: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
            >
              <option value="">-- Common Area / Building General --</option>
              {propertyUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  Unit {u.unitNumber} ({u.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Reporting Tenant</label>
            <select
              value={formData.customerId}
              onChange={(e) => setFormData((prev) => ({ ...prev, customerId: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
            >
              <option value="">-- Reported by Building Staff --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Assign Technician / Lead</label>
            <select
              value={formData.assignedStaffId}
              onChange={(e) => setFormData((prev) => ({ ...prev, assignedStaffId: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
            >
              <option value="">-- Unassigned (Open Queue) --</option>
              {staffMembers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.department})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Target Completion Date</label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Issue Description & Diagnostics</label>
          <textarea
            rows="3"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Detailed description of symptoms, location inside unit, tenant availability for access..."
            className="w-full px-3 py-2 rounded-xl border border-slate-300"
          />
        </div>
      </form>
    </Modal>
  );
}
