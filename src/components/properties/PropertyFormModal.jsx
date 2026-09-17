import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { usePMSStore } from '../../store/usePMSStore';

export default function PropertyFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const { users } = usePMSStore();

  const [formData, setFormData] = useState({
    name: '',
    type: 'Apartment Building',
    address: '',
    city: '',
    state: '',
    country: 'United States',
    postalCode: '',
    unitsCount: 4,
    managerId: 'USR-002',
    status: 'Active',
    acquisitionDate: new Date().toISOString().substring(0, 10),
    image: '',
    description: ''
  });

  const propertyManagers = users.filter((u) => u.role === 'Property Manager' || u.role === 'Administrator');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        type: initialData.type || 'Apartment Building',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        country: initialData.country || 'United States',
        postalCode: initialData.postalCode || '',
        unitsCount: initialData.unitsCount || 4,
        managerId: initialData.managerId || 'USR-002',
        status: initialData.status || 'Active',
        acquisitionDate: initialData.acquisitionDate || '',
        image: initialData.image || '',
        description: initialData.description || ''
      });
    } else {
      setFormData({
        name: '',
        type: 'Apartment Building',
        address: '',
        city: '',
        state: '',
        country: 'United States',
        postalCode: '',
        unitsCount: 4,
        managerId: 'USR-002',
        status: 'Active',
        acquisitionDate: new Date().toISOString().substring(0, 10),
        image: '',
        description: ''
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit Property: ${initialData.name}` : 'Acquire / Add Real Estate Property'}
      subtitle="Register new physical asset or building complex into corporate inventory"
      maxWidth="max-w-2xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
          >
            {initialData ? 'Update Property' : 'Save Property Asset'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Property / Building Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Green Valley Apartments"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Property Type <span className="text-rose-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
            >
              <option value="Apartment Building">Apartment Building</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Commercial Building">Commercial Building</option>
              <option value="Office">Office</option>
              <option value="Retail Space">Retail Space</option>
              <option value="Warehouse">Warehouse</option>
              <option value="Land">Land</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Physical Street Address <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
            placeholder="e.g. 742 Evergreen Terrace"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              City <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              placeholder="Seattle"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              State / Prov <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="state"
              required
              value={formData.state}
              onChange={handleChange}
              placeholder="WA"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Postal Code
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="98101"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Total Units
            </label>
            <input
              type="number"
              name="unitsCount"
              value={formData.unitsCount}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Assigned Property Manager
            </label>
            <select
              name="managerId"
              value={formData.managerId}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
            >
              {propertyManagers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Operating Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
            >
              <option value="Active">Active</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Inactive">Inactive</option>
              <option value="Sold">Sold</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Exterior / Architectural Image URL
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Property Description & Amenities
          </label>
          <textarea
            name="description"
            rows="2"
            value={formData.description}
            onChange={handleChange}
            placeholder="Summary of architectural features, parking amenities, security access, etc."
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </form>
    </Modal>
  );
}
