import React, { useState, useMemo } from 'react';
import { usePMSStore } from '../../store/usePMSStore';
import StatusBadge from '../common/StatusBadge';
import PropertyFormModal from './PropertyFormModal';
import ConfirmModal from '../common/ConfirmModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faPlus,
  faMagnifyingGlass,
  faLocationDot,
  faDoorOpen,
  faUserTie,
  faTableCellsLarge,
  faList,
  faPenToSquare,
  faTrashCan,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

export default function PropertyListView() {
  const {
    properties,
    units,
    addProperty,
    updateProperty,
    deleteProperty,
    setActiveView
  } = usePMSStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [viewMode, setViewMode] = useState('cards'); // cards or table
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [deletingPropId, setDeletingPropId] = useState(null);

  // Property Types filter
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'All' || p.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [properties, searchQuery, typeFilter]);

  const handleSave = (formData) => {
    if (editingProperty) {
      updateProperty(editingProperty.id, formData);
      setEditingProperty(null);
    } else {
      addProperty(formData);
    }
  };

  const types = ['All', 'Apartment Building', 'House', 'Villa', 'Commercial Building'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-slate-900">
            Real Estate Portfolio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Physical buildings, complexes, and corporate commercial real estate assets under management.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProperty(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shadow-emerald-700/20 active:scale-98"
        >
          <FontAwesomeIcon icon={faPlus} />
          Add Real Estate Asset
        </button>
      </div>

      {/* Filter and View Toggle Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by building name, address, or city..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Type Filter & Layout Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  typeFilter === t
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="border-l border-slate-200 pl-3 flex items-center gap-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-xl text-xs transition-colors ${
                viewMode === 'cards' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-400 hover:bg-slate-100'
              }`}
              title="Grid Cards View"
            >
              <FontAwesomeIcon icon={faTableCellsLarge} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl text-xs transition-colors ${
                viewMode === 'table' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-400 hover:bg-slate-100'
              }`}
              title="Table Ledger View"
            >
              <FontAwesomeIcon icon={faList} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredProperties.map((prop) => {
            const propUnits = units.filter((u) => u.propertyId === prop.id);
            const totalU = propUnits.length || prop.unitsCount || 1;
            const occupiedU = propUnits.filter((u) => u.status === 'Occupied').length;
            const occupancyPct = Math.round((occupiedU / totalU) * 100);

            return (
              <div
                key={prop.id}
                onClick={() => setActiveView('property-detail', { propertyId: prop.id })}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Property Image Banner */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={prop.image}
                      alt={prop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white border border-white/20">
                        {prop.type}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-xs">
                        <button
                          onClick={() => {
                            setEditingProperty(prop);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-white transition-colors"
                          title="Edit Asset"
                        >
                          <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
                        </button>
                        <button
                          onClick={() => setDeletingPropId(prop.id)}
                          className="p-1.5 text-slate-600 hover:text-rose-600 rounded-lg hover:bg-white transition-colors"
                          title="Delete Asset"
                        >
                          <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                        </button>
                      </div>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-lg font-extrabold leading-snug group-hover:text-emerald-300 transition-colors">
                        {prop.name}
                      </h3>
                      <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5">
                        <FontAwesomeIcon icon={faLocationDot} className="text-emerald-400 text-xs" />
                        {prop.address}, {prop.city}, {prop.state}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {prop.description}
                    </p>

                    {/* Occupancy Bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <FontAwesomeIcon icon={faDoorOpen} className="text-emerald-600 text-xs" />
                          Unit Occupancy
                        </span>
                        <span className="font-bold text-slate-900">
                          {occupiedU} of {totalU} Units ({occupancyPct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${occupancyPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <FontAwesomeIcon icon={faUserTie} className="text-slate-400" />
                    <span>Manager: <strong className="text-slate-800">{prop.managerName}</strong></span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Explore Units <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-5">Property Name</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Units Occupancy</th>
                <th className="py-3.5 px-4">Assigned Manager</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProperties.map((prop) => {
                const propUnits = units.filter((u) => u.propertyId === prop.id);
                const totalU = propUnits.length || prop.unitsCount || 1;
                const occupiedU = propUnits.filter((u) => u.status === 'Occupied').length;

                return (
                  <tr
                    key={prop.id}
                    onClick={() => setActiveView('property-detail', { propertyId: prop.id })}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img src={prop.image} alt={prop.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {prop.name}
                          </p>
                          <span className="text-[10px] text-slate-400">ID: {prop.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {prop.address}, {prop.city}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{prop.type}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {occupiedU} / {totalU} Occupied
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{prop.managerName}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={prop.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          setEditingProperty(prop);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg"
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        onClick={() => setDeletingPropId(prop.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg ml-1"
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <PropertyFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProperty(null);
        }}
        onSubmit={handleSave}
        initialData={editingProperty}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingPropId)}
        onClose={() => setDeletingPropId(null)}
        onConfirm={() => {
          if (deletingPropId) deleteProperty(deletingPropId);
        }}
        title="Delete Real Estate Property"
        message="Are you sure you want to permanently delete this property asset? All associated units and historical records will be removed from inventory."
        confirmText="Yes, Delete Property"
        isDanger={true}
      />
    </div>
  );
}
