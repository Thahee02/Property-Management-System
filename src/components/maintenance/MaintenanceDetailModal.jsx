import React, { useState } from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { usePMSStore } from '../../store/usePMSStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWrench,
  faBuilding,
  faDoorOpen,
  faUser,
  faCalendarDays,
  faCheckCircle,
  faClock,
  faUserCheck,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons';

export default function MaintenanceDetailModal({ isOpen, onClose, ticketId }) {
  const {
    maintenance,
    users,
    updateMaintenanceStatus,
    assignMaintenanceStaff,
    setActiveView
  } = usePMSStore();

  const [newNote, setNewNote] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');

  const ticket = maintenance.find((m) => m.id === ticketId);
  const staffMembers = users.filter((u) => u.role === 'Staff' || u.role === 'Property Manager');

  if (!ticket) return null;

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    updateMaintenanceStatus(ticket.id, ticket.status, newNote);
    setNewNote('');
  };

  const handleStatusChange = (newStatus) => {
    updateMaintenanceStatus(ticket.id, newStatus, `Status updated to ${newStatus}`);
  };

  const handleAssign = (staffId) => {
    assignMaintenanceStaff(ticket.id, staffId);
    setSelectedStaff('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Work Order #${ticket.id}`}
      subtitle={`${ticket.category} • Created ${ticket.createdAt}`}
      maxWidth="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Quick Status:</span>
            {ticket.status !== 'Completed' && (
              <button
                onClick={() => handleStatusChange('Completed')}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
              >
                <FontAwesomeIcon icon={faCheckCircle} /> Mark Completed
              </button>
            )}
            {ticket.status === 'Open' && (
              <button
                onClick={() => handleStatusChange('In Progress')}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
              >
                Start Work Order
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="space-y-5 text-left text-xs">
        {/* Ticket Header Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                  ticket.priority === 'Urgent'
                    ? 'bg-rose-100 text-rose-700'
                    : ticket.priority === 'High'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {ticket.priority} Priority
              </span>
              <StatusBadge status={ticket.status} size="sm" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{ticket.title}</h3>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">
              Due Date
            </span>
            <span className="text-xs font-bold text-slate-900">{ticket.dueDate || 'Standard SLA'}</span>
          </div>
        </div>

        {/* Location & Tenant Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Location
            </span>
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faBuilding} className="text-slate-400" />
              {ticket.propertyName}
            </p>
            <p className="text-slate-500 text-[11px] mt-0.5">Unit {ticket.unitNumber}</p>
          </div>

          <div className="p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Reporting Resident
            </span>
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faUser} className="text-slate-400" />
              {ticket.customerName}
            </p>
          </div>

          <div className="p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Assigned Field Tech
            </span>
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faUserCheck} className="text-emerald-600" />
              {ticket.assignedStaffName}
            </p>
          </div>
        </div>

        {/* Work Order Description */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Resident Reported Symptoms
          </span>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-700 leading-relaxed">
            {ticket.description}
          </div>
        </div>

        {/* Tech Dispatch & Status Adjuster */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
          <h4 className="font-bold text-slate-900 text-xs">Dispatch Controls</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 mb-1 font-semibold">Change Work Order Status:</label>
              <select
                value={ticket.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="Open">Open</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Waiting">Waiting (Parts / Access)</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-semibold">Reassign Technician:</label>
              <select
                value={selectedStaff}
                onChange={(e) => handleAssign(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="">-- Change Assignee --</option>
                {staffMembers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.department})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Technician Log Thread & Append Note */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Technician Notes & Progress Log
          </span>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 max-h-36 overflow-y-auto space-y-2 whitespace-pre-line text-slate-700 font-mono text-[11px]">
            {ticket.notes || 'No progress notes logged yet.'}
          </div>

          <form onSubmit={handleAddNote} className="mt-3 flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add technician update, parts ordered, or access notes..."
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs"
            >
              <FontAwesomeIcon icon={faPaperPlane} /> Post Note
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
}
