import React, { useState } from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { usePMSStore } from '../../store/usePMSStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBed,
  faBath,
  faRulerCombined,
  faMoneyBillWave,
  faShieldHalved,
  faUser,
  faFileContract,
  faWrench,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

export default function UnitDetailModal({
  isOpen,
  onClose,
  unit,
  onOpenQuickAction
}) {
  const { customers, leases, maintenance, updateUnit, setActiveView } = usePMSStore();
  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState(unit?.status || 'Available');

  if (!unit) return null;

  const tenant = unit.currentTenantId ? customers.find((c) => c.id === unit.currentTenantId) : null;
  const lease = unit.currentLeaseId ? leases.find((l) => l.id === unit.currentLeaseId) : null;
  const unitTickets = maintenance.filter((m) => m.unitId === unit.id);

  const handleStatusUpdate = () => {
    updateUnit(unit.id, { status: newStatus });
    setEditingStatus(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Unit ${unit.unitNumber} - ${unit.propertyName}`}
      subtitle={`Floor ${unit.floor} • ${unit.type} Specification`}
      maxWidth="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            {!editingStatus ? (
              <div className="flex items-center gap-2">
                <StatusBadge status={unit.status} size="sm" />
                <button
                  onClick={() => {
                    setNewStatus(unit.status);
                    setEditingStatus(true);
                  }}
                  className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 underline ml-1"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="text-xs px-2 py-1 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  className="px-2.5 py-1 text-xs font-bold bg-emerald-600 text-white rounded-lg"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingStatus(false)}
                  className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            {unit.status === 'Available' && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenQuickAction('lease', { propertyId: unit.propertyId, unitId: unit.id });
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
              >
                Draft Lease For Unit
              </button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-5 text-left text-xs">
        {/* Unit Image & Specs Banner */}
        <div className="relative h-44 rounded-xl overflow-hidden bg-slate-100">
          <img
            src={unit.images && unit.images[0] ? unit.images[0] : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80'}
            alt={`Unit ${unit.unitNumber}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-600 text-white">
                Floor {unit.floor}
              </span>
              <h3 className="text-xl font-extrabold mt-1">Unit {unit.unitNumber}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-200 block">Monthly Rent</span>
              <span className="text-lg font-extrabold text-white">${unit.monthlyRent?.toLocaleString()}/mo</span>
            </div>
          </div>
        </div>

        {/* Physical Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faBed} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Bedrooms</span>
              <p className="font-bold text-slate-900">{unit.bedrooms || 'Studio'}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faBath} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Bathrooms</span>
              <p className="font-bold text-slate-900">{unit.bathrooms}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faRulerCombined} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Area</span>
              <p className="font-bold text-slate-900">{unit.area} sq ft</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faShieldHalved} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Deposit</span>
              <p className="font-bold text-slate-900">${unit.securityDeposit?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Current Tenant & Lease Dossier */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="text-slate-400" />
              Occupancy & Tenancy Status
            </h4>
            <StatusBadge status={unit.status} size="xs" />
          </div>

          {tenant ? (
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
              <div className="flex items-center gap-3">
                <img src={tenant.avatar} alt={tenant.fullName} className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <p className="font-bold text-slate-900">{tenant.fullName}</p>
                  <p className="text-[11px] text-slate-500">{tenant.email} • {tenant.phone}</p>
                  {lease && (
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      Lease #{lease.leaseNumber} (Term: {lease.startDate} to {lease.endDate})
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  setActiveView('customer-detail', { customerId: tenant.id });
                }}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1"
              >
                Tenant File <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
              </button>
            </div>
          ) : (
            <div className="py-3 text-center text-slate-400">
              <p className="font-semibold text-slate-600">No active tenant in this unit</p>
              <p className="text-[11px] mt-0.5">Unit is currently {unit.status.toLowerCase()} for new lease assignment.</p>
            </div>
          )}
        </div>

        {/* Maintenance History */}
        {unitTickets.length > 0 && (
          <div>
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faWrench} className="text-amber-500" />
              Unit Work Orders ({unitTickets.length})
            </h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {unitTickets.map((t) => (
                <div key={t.id} className="p-3 bg-white flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{t.title}</p>
                    <span className="text-[11px] text-slate-400">
                      Priority: {t.priority} • Assigned: {t.assignedStaffName}
                    </span>
                  </div>
                  <StatusBadge status={t.status} size="xs" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Unit Features & Amenities
          </span>
          <p className="text-slate-600 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
            {unit.description || 'Standard finishes, central air conditioning, and electrical metering.'}
          </p>
        </div>
      </div>
    </Modal>
  );
}
