import React, { useState, useMemo } from 'react';
import { usePMSStore } from '../../store/usePMSStore';
import StatusBadge from '../common/StatusBadge';
import UnitDetailModal from '../properties/UnitDetailModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDoorOpen,
  faMagnifyingGlass,
  faBuilding,
  faBed,
  faBath,
  faBuildingUser,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

export default function UnitListView({ onOpenQuickAction }) {
  const { units, properties, setActiveView } = usePMSStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [propertyFilter, setPropertyFilter] = useState('All');
  const [selectedUnit, setSelectedUnit] = useState(null);

  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      const matchesSearch =
        u.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.currentTenantName && u.currentTenantName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        u.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
      const matchesProperty = propertyFilter === 'All' || u.propertyId === propertyFilter;

      return matchesSearch && matchesStatus && matchesProperty;
    });
  }, [units, searchQuery, statusFilter, propertyFilter]);

  const statuses = ['All', 'Available', 'Occupied', 'Maintenance', 'Reserved'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-slate-900">
            Physical Units & Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Comprehensive catalog of residential apartments, commercial offices, and villas across all company holdings.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
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
              placeholder="Search by unit number, building name, or resident..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Building:</span>
            <select
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold"
            >
              <option value="All">All Properties</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
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
              {st === 'All' && ` (${units.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Units Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-5">Unit Number</th>
                <th className="py-3.5 px-4">Building Property</th>
                <th className="py-3.5 px-4">Floor & Type</th>
                <th className="py-3.5 px-4">Specs & Area</th>
                <th className="py-3.5 px-4">Monthly Rent</th>
                <th className="py-3.5 px-4">Current Resident</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-slate-600">No units match criteria</p>
                    <p className="text-[11px] mt-1">Try clearing filters or search queries.</p>
                  </td>
                </tr>
              ) : (
                filteredUnits.map((unit) => (
                  <tr
                    key={unit.id}
                    onClick={() => setSelectedUnit(unit)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-5 font-extrabold text-slate-900 group-hover:text-emerald-700">
                      Unit {unit.unitNumber}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {unit.propertyName}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-800 block">Floor {unit.floor}</span>
                      <span className="text-[11px] text-slate-400">{unit.type}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {unit.bedrooms > 0 ? `${unit.bedrooms} Bed` : 'Studio'} • {unit.bathrooms} Bath • {unit.area} sq ft
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ${unit.monthlyRent?.toLocaleString()}/mo
                    </td>

                    <td className="py-3.5 px-4">
                      {unit.currentTenantName ? (
                        <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <FontAwesomeIcon icon={faBuildingUser} className="text-blue-500" />
                          {unit.currentTenantName}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-medium italic text-[11px]">
                          Available
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={unit.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedUnit(unit)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredUnits.length} of {units.length} physical units</span>
          <span>Integrated Physical Asset Register</span>
        </div>
      </div>

      {/* Detail Modal */}
      <UnitDetailModal
        isOpen={Boolean(selectedUnit)}
        onClose={() => setSelectedUnit(null)}
        unit={selectedUnit}
        onOpenQuickAction={onOpenQuickAction}
      />
    </div>
  );
}
