import React, { useState } from 'react';
import { usePMSStore } from '../../store/usePMSStore';
import StatusBadge from '../common/StatusBadge';
import UnitDetailModal from './UnitDetailModal';
import Modal from '../common/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faBuilding,
  faLocationDot,
  faDoorOpen,
  faUserTie,
  faCalendarDays,
  faPlus,
  faBed,
  faBath,
  faFilter,
  faMoneyBillWave,
  faCheckCircle,
  faWrench,
  faBuildingUser
} from '@fortawesome/free-solid-svg-icons';

export default function PropertyDetailView({ onOpenQuickAction }) {
  const {
    viewParams,
    properties,
    units,
    addUnit,
    setActiveView
  } = usePMSStore();

  const [unitFilter, setUnitFilter] = useState('All');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);

  // New Unit Form State
  const [newUnitForm, setNewUnitForm] = useState({
    unitNumber: '',
    floor: 1,
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 950,
    monthlyRent: 2100,
    securityDeposit: 2100,
    description: ''
  });

  const propertyId = viewParams?.propertyId;
  const property = properties.find((p) => p.id === propertyId) || properties[0];

  if (!property) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500">Property asset not found.</p>
        <button
          onClick={() => setActiveView('properties')}
          className="mt-3 text-xs font-semibold text-emerald-600"
        >
          Return to Portfolio
        </button>
      </div>
    );
  }

  const propertyUnits = units.filter((u) => u.propertyId === property.id);
  const totalUnits = propertyUnits.length || 1;
  const occupiedUnits = propertyUnits.filter((u) => u.status === 'Occupied').length;
  const availableUnits = propertyUnits.filter((u) => u.status === 'Available').length;
  const maintenanceUnits = propertyUnits.filter((u) => u.status === 'Maintenance').length;
  const occupancyRate = Math.round((occupiedUnits / totalUnits) * 100);

  const monthlyPropertyRevenue = propertyUnits
    .filter((u) => u.status === 'Occupied')
    .reduce((acc, curr) => acc + (Number(curr.monthlyRent) || 0), 0);

  const filteredUnits = propertyUnits.filter((u) => {
    if (unitFilter === 'All') return true;
    return u.status === unitFilter;
  });

  // Group units by floor
  const floors = Array.from(new Set(filteredUnits.map((u) => u.floor))).sort((a, b) => a - b);

  const handleAddUnitSubmit = (e) => {
    e.preventDefault();
    if (!newUnitForm.unitNumber.trim()) return;
    addUnit({
      propertyId: property.id,
      ...newUnitForm
    });
    setIsAddUnitOpen(false);
    setNewUnitForm({
      unitNumber: '',
      floor: 1,
      type: 'Apartment',
      bedrooms: 2,
      bathrooms: 2,
      area: 950,
      monthlyRent: 2100,
      securityDeposit: 2100,
      description: ''
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back Button */}
      <button
        onClick={() => setActiveView('properties')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Back to Properties Portfolio
      </button>

      {/* Property Hero Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="relative h-64 lg:h-72 w-full bg-slate-900">
          <img
            src={property.image}
            alt={property.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white">
                  {property.type}
                </span>
                <StatusBadge status={property.status} size="sm" />
              </div>
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">{property.name}</h1>
              <p className="text-xs text-slate-200 flex items-center gap-1.5 mt-1">
                <FontAwesomeIcon icon={faLocationDot} className="text-emerald-400" />
                {property.address}, {property.city}, {property.state} {property.postalCode}, {property.country}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddUnitOpen(true)}
                className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-1.5"
              >
                <FontAwesomeIcon icon={faPlus} className="text-emerald-600" />
                Add Unit to Property
              </button>
            </div>
          </div>
        </div>

        {/* Property Specs Strip */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-b border-slate-100 bg-slate-50/50">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Portfolio Manager
            </span>
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faUserTie} className="text-slate-400" />
              {property.managerName}
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Acquisition Date
            </span>
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faCalendarDays} className="text-slate-400" />
              {property.acquisitionDate}
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Current Occupancy
            </span>
            <p className="font-bold text-emerald-700">
              {occupiedUnits} of {totalUnits} Units ({occupancyRate}%)
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Monthly Realized Rent
            </span>
            <p className="font-bold text-slate-900">
              ${monthlyPropertyRevenue.toLocaleString()} / mo
            </p>
          </div>
        </div>

        <div className="px-6 py-4 text-xs text-slate-600 leading-relaxed">
          {property.description}
        </div>
      </div>

      {/* Visual Unit Matrix & Availability Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Interactive Floorplan & Unit Matrix</h2>
            <p className="text-xs text-slate-500">
              Visual unit distribution. Click any unit to view tenant file, rental specs, and status.
            </p>
          </div>

          {/* Availability Filters */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
            {['All', 'Available', 'Occupied', 'Maintenance'].map((st) => (
              <button
                key={st}
                onClick={() => setUnitFilter(st)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  unitFilter === st ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Units Grouped by Floor */}
        <div className="space-y-6">
          {floors.map((floorNum) => {
            const floorUnits = filteredUnits.filter((u) => u.floor === floorNum);
            return (
              <div key={floorNum} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                    Floor {floorNum}
                  </h3>
                  <span className="text-xs text-slate-400">{floorUnits.length} Units</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {floorUnits.map((unit) => {
                    let cardBorder = 'border-slate-200 hover:border-emerald-500';
                    let statusBg = 'bg-slate-50';

                    if (unit.status === 'Occupied') {
                      cardBorder = 'border-blue-200 hover:border-blue-500';
                      statusBg = 'bg-blue-50/40';
                    } else if (unit.status === 'Available') {
                      cardBorder = 'border-emerald-200 hover:border-emerald-500';
                      statusBg = 'bg-emerald-50/40';
                    } else if (unit.status === 'Maintenance') {
                      cardBorder = 'border-purple-200 hover:border-purple-500';
                      statusBg = 'bg-purple-50/40';
                    }

                    return (
                      <div
                        key={unit.id}
                        onClick={() => setSelectedUnit(unit)}
                        className={`rounded-xl border p-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${cardBorder} ${statusBg}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-base font-extrabold text-slate-900">
                            Unit {unit.unitNumber}
                          </span>
                          <StatusBadge status={unit.status} size="xs" />
                        </div>

                        <div className="text-xs text-slate-500 space-y-1 mb-3">
                          <p className="font-semibold text-slate-700">{unit.type}</p>
                          <p>
                            {unit.bedrooms > 0 ? `${unit.bedrooms} Bed` : 'Studio'} • {unit.bathrooms} Bath • {unit.area} sq ft
                          </p>
                          <p className="font-bold text-slate-900 text-sm">
                            ${unit.monthlyRent?.toLocaleString()}/mo
                          </p>
                        </div>

                        <div className="pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
                          {unit.currentTenantName ? (
                            <span className="text-slate-700 font-medium truncate flex items-center gap-1">
                              <FontAwesomeIcon icon={faBuildingUser} className="text-blue-500" />
                              {unit.currentTenantName}
                            </span>
                          ) : (
                            <span className="text-emerald-600 font-semibold">Ready to Lease</span>
                          )}
                          <span className="text-slate-400 font-semibold">Inspect →</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unit Detail Modal */}
      <UnitDetailModal
        isOpen={Boolean(selectedUnit)}
        onClose={() => setSelectedUnit(null)}
        unit={selectedUnit}
        onOpenQuickAction={onOpenQuickAction}
      />

      {/* Add Unit Modal */}
      <Modal
        isOpen={isAddUnitOpen}
        onClose={() => setIsAddUnitOpen(false)}
        title={`Add Unit to ${property.name}`}
        subtitle="Create physical unit specification within this real estate asset"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsAddUnitOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddUnitSubmit}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
            >
              Save Unit
            </button>
          </>
        }
      >
        <form onSubmit={handleAddUnitSubmit} className="space-y-4 text-left text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Unit Number *</label>
              <input
                type="text"
                required
                value={newUnitForm.unitNumber}
                onChange={(e) => setNewUnitForm({ ...newUnitForm, unitNumber: e.target.value })}
                placeholder="e.g. C-301"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Floor Number *</label>
              <input
                type="number"
                min="1"
                required
                value={newUnitForm.floor}
                onChange={(e) => setNewUnitForm({ ...newUnitForm, floor: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Bedrooms</label>
              <input
                type="number"
                min="0"
                value={newUnitForm.bedrooms}
                onChange={(e) => setNewUnitForm({ ...newUnitForm, bedrooms: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Bathrooms</label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={newUnitForm.bathrooms}
                onChange={(e) => setNewUnitForm({ ...newUnitForm, bathrooms: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Area (sq ft)</label>
              <input
                type="number"
                value={newUnitForm.area}
                onChange={(e) => setNewUnitForm({ ...newUnitForm, area: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Monthly Rent ($) *</label>
              <input
                type="number"
                required
                value={newUnitForm.monthlyRent}
                onChange={(e) => setNewUnitForm({ ...newUnitForm, monthlyRent: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Security Deposit ($)</label>
              <input
                type="number"
                value={newUnitForm.securityDeposit}
                onChange={(e) => setNewUnitForm({ ...newUnitForm, securityDeposit: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows="2"
              value={newUnitForm.description}
              onChange={(e) => setNewUnitForm({ ...newUnitForm, description: e.target.value })}
              placeholder="Unit layout features, appliances, patio, view..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
