import React, { useState } from 'react';
import { usePMSStore } from '../../store/usePMSStore';
import StatusBadge from '../common/StatusBadge';
import Modal from '../common/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserShield,
  faPlus,
  faCheck,
  faXmark,
  faEnvelope,
  faPhone,
  faBuilding,
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons';

export default function UsersView() {
  const { users, addUser, updateUser, currentUser } = usePMSStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Property Manager',
    phone: '',
    department: 'Residential Leasing',
    status: 'Active'
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newUser.name.trim()) return;
    addUser(newUser);
    setIsAddOpen(false);
    setNewUser({
      name: '',
      email: '',
      role: 'Property Manager',
      phone: '',
      department: 'Residential Leasing',
      status: 'Active'
    });
  };

  const permissionMatrix = [
    { capability: 'Corporate Portal Settings & Policies', admin: true, manager: false, staff: false },
    { capability: 'Staff Accounts & Role Assignments', admin: true, manager: false, staff: false },
    { capability: 'Compliance & Audit Log Access', admin: true, manager: true, staff: false },
    { capability: 'Rent Collections, Financials & Ledgers', admin: true, manager: true, staff: false },
    { capability: 'Portfolio Properties & Unit Asset CRUD', admin: true, manager: true, staff: false },
    { capability: 'Lease Drafting, Renewal & Termination', admin: true, manager: true, staff: false },
    { capability: 'Tenant Profiles & Screening Records', admin: true, manager: true, staff: true },
    { capability: 'Maintenance Work Orders & Dispatch', admin: true, manager: true, staff: true },
    { capability: 'Classified Document Archive Access', admin: true, manager: true, staff: true },
    { capability: 'Executive Analytics & Report Exports', admin: true, manager: true, staff: false }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-slate-900">
            Internal Staff & Access Control
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage company employees, operational departments, and role-based permissions for portal operations.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shadow-emerald-700/20 active:scale-98"
        >
          <FontAwesomeIcon icon={faPlus} />
          Add Staff Member
        </button>
      </div>

      {/* Staff Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {users.map((u) => {
          let roleBadge = 'bg-purple-100 text-purple-700 border-purple-200';
          if (u.role === 'Administrator') roleBadge = 'bg-slate-900 text-white border-slate-800';
          else if (u.role === 'Staff') roleBadge = 'bg-blue-100 text-blue-700 border-blue-200';

          return (
            <div
              key={u.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between text-left"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-200 shrink-0"
                  />
                  <StatusBadge status={u.status} size="xs" />
                </div>

                <h3 className="font-extrabold text-slate-900 text-sm leading-snug">{u.name}</h3>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border mt-1 ${roleBadge}`}>
                  {u.role}
                </span>

                <div className="mt-3 text-xs text-slate-500 space-y-1">
                  <p className="font-semibold text-slate-700">{u.department}</p>
                  <p className="truncate flex items-center gap-1.5 text-slate-600">
                    <FontAwesomeIcon icon={faEnvelope} className="text-slate-400 text-[10px]" />
                    {u.email}
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-600">
                    <FontAwesomeIcon icon={faPhone} className="text-slate-400 text-[10px]" />
                    {u.phone}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-mono">ID: {u.id}</span>
                <span className="text-emerald-600 font-semibold">Active Session</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Role-Based Permissions Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs text-left">
        <div className="pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faShieldHalved} className="text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Role-Based Access Control (RBAC) Matrix</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational boundary rules enforced across portal modules by authorization tier.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">System Operational Capability</th>
                <th className="py-3 px-4 text-center">Administrator</th>
                <th className="py-3 px-4 text-center">Property Manager</th>
                <th className="py-3 px-4 text-center">Operational Staff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold text-slate-800">{item.capability}</td>
                  <td className="py-3 px-4 text-center">
                    {item.admin ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 inline-flex items-center justify-center text-xs">
                        <FontAwesomeIcon icon={faCheck} />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 inline-flex items-center justify-center text-xs">
                        <FontAwesomeIcon icon={faXmark} />
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.manager ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 inline-flex items-center justify-center text-xs">
                        <FontAwesomeIcon icon={faCheck} />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 inline-flex items-center justify-center text-xs">
                        <FontAwesomeIcon icon={faXmark} />
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.staff ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 inline-flex items-center justify-center text-xs">
                        <FontAwesomeIcon icon={faCheck} />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 inline-flex items-center justify-center text-xs">
                        <FontAwesomeIcon icon={faXmark} />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Register Internal Staff Account"
        subtitle="Provision employee access into the property operations portal"
        maxWidth="max-w-lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateSubmit}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
            >
              Provision Account
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-left text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Employee Full Name *</label>
            <input
              type="text"
              required
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="e.g. Samantha Miller"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Corporate Email *</label>
              <input
                type="email"
                required
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="s.miller@wathnanmall.com"
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                placeholder="+1 (555) 019-3382"
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Operational Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Administrator">Administrator (Full Access)</option>
                <option value="Property Manager">Property Manager</option>
                <option value="Staff">Operational Staff</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Department</label>
              <input
                type="text"
                value={newUser.department}
                onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                placeholder="Residential Leasing"
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
