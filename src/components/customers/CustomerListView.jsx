import React, { useState, useMemo } from 'react';
import { usePMSStore } from '../../store/usePMSStore';
import StatusBadge from '../common/StatusBadge';
import CustomerFormModal from './CustomerFormModal';
import ConfirmModal from '../common/ConfirmModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faMagnifyingGlass,
  faFilter,
  faEye,
  faPenToSquare,
  faTrashCan,
  faBuilding,
  faPhone,
  faEnvelope,
  faFileContract
} from '@fortawesome/free-solid-svg-icons';

export default function CustomerListView() {
  const {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    setActiveView
  } = usePMSStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deletingCustomerId, setDeletingCustomerId] = useState(null);

  // Filter logic
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        (c.currentUnitNumber && c.currentUnitNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.currentPropertyName && c.currentPropertyName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesType = typeFilter === 'All' || c.customerType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [customers, searchQuery, statusFilter, typeFilter]);

  const handleSaveCustomer = (formData) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, formData);
      setEditingCustomer(null);
    } else {
      addCustomer(formData);
    }
  };

  const statusOptions = ['All', 'Active', 'Inactive', 'Former Tenant', 'Blacklisted'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-slate-900">
            Tenants & Customers
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Centralized directory of individual and corporate tenants, active residencies, and verification records.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCustomer(null);
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shadow-emerald-700/20 active:scale-98"
        >
          <FontAwesomeIcon icon={faUserPlus} />
          Register New Tenant
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, phone, or unit..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="All">All Types</option>
              <option value="Individual">Individual</option>
              <option value="Corporate">Corporate</option>
            </select>
          </div>
        </div>

        {/* Status Pill Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-xs font-medium text-slate-400 mr-1">Status:</span>
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === status
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
              }`}
            >
              {status}
              {status === 'All' && ` (${customers.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 lg:px-6">Tenant Profile</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Current Residence</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-slate-600">No tenants found</p>
                    <p className="text-[11px] mt-1">Try adjusting your search query or status filter.</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => setActiveView('customer-detail', { customerId: cust.id })}
                  >
                    {/* Tenant Profile */}
                    <td className="py-3.5 px-4 lg:px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={cust.avatar}
                          alt={cust.fullName}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {cust.fullName}
                          </p>
                          <p className="text-[11px] text-slate-400">ID: {cust.id} • {cust.nicPassport}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <FontAwesomeIcon icon={faEnvelope} className="text-[10px] text-slate-400" />
                          <span>{cust.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <FontAwesomeIcon icon={faPhone} className="text-[10px] text-slate-400" />
                          <span>{cust.phone}</span>
                        </div>
                      </div>
                    </td>

                    {/* Current Residence */}
                    <td className="py-3.5 px-4">
                      {cust.currentPropertyName ? (
                        <div>
                          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faBuilding} className="text-emerald-500 text-xs" />
                            {cust.currentPropertyName}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            Unit {cust.currentUnitNumber}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">No active unit</span>
                      )}
                    </td>

                    {/* Customer Type */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-700">{cust.customerType}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={cust.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setActiveView('customer-detail', { customerId: cust.id })}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="View Dossier"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingCustomer(cust);
                            setIsAddModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Profile"
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                        <button
                          onClick={() => setDeletingCustomerId(cust.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Tenant"
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>Showing <strong>{filteredCustomers.length}</strong> of <strong>{customers.length}</strong> registered tenants</span>
          <span>Verified against state civil registry</span>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <CustomerFormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingCustomer(null);
        }}
        onSubmit={handleSaveCustomer}
        initialData={editingCustomer}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deletingCustomerId)}
        onClose={() => setDeletingCustomerId(null)}
        onConfirm={() => {
          if (deletingCustomerId) deleteCustomer(deletingCustomerId);
        }}
        title="Delete Tenant Record"
        message="Are you sure you want to permanently delete this tenant profile? Active lease connections and past financial receipts will lose relational link."
        confirmText="Yes, Delete Tenant"
        isDanger={true}
      />
    </div>
  );
}
