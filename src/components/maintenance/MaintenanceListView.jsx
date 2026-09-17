import React, { useState, useMemo } from 'react';
import { usePMSStore } from '../../store/usePMSStore';
import StatusBadge from '../common/StatusBadge';
import MetricCard from '../common/MetricCard';
import CreateTicketModal from './CreateTicketModal';
import MaintenanceDetailModal from './MaintenanceDetailModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWrench,
  faPlus,
  faMagnifyingGlass,
  faTriangleExclamation,
  faClock,
  faCheckCircle,
  faTableCellsLarge,
  faList,
  faBuilding,
  faUser
} from '@fortawesome/free-solid-svg-icons';

export default function MaintenanceListView({ onOpenQuickAction }) {
  const { maintenance, setActiveView } = usePMSStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // table or kanban
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const filteredTickets = useMemo(() => {
    return maintenance.filter((m) => {
      const matchesSearch =
        m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.assignedStaffName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || m.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [maintenance, searchQuery, statusFilter, priorityFilter]);

  const urgentCount = maintenance.filter((m) => m.priority === 'Urgent').length;
  const inProgressCount = maintenance.filter((m) => m.status === 'In Progress').length;
  const openCount = maintenance.filter((m) => m.status === 'Open' || m.status === 'Assigned').length;
  const completedCount = maintenance.filter((m) => m.status === 'Completed').length;

  const statuses = ['All', 'Open', 'Assigned', 'In Progress', 'Waiting', 'Completed'];
  const kanbanColumns = ['Open', 'Assigned', 'In Progress', 'Waiting', 'Completed'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-slate-900">
            Maintenance & Facilities Work Orders
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch facilities staff, manage HVAC/plumbing repairs, and track ticket SLAs across units.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shadow-emerald-700/20 active:scale-98"
        >
          <FontAwesomeIcon icon={faPlus} />
          Create Work Order
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Open Queue"
          value={openCount}
          subtitle="Awaiting technician dispatch"
          icon={faClock}
          iconBg="bg-blue-50 text-blue-600"
        />
        <MetricCard
          title="Urgent Emergencies"
          value={urgentCount}
          subtitle="Immediate dispatch protocol"
          icon={faTriangleExclamation}
          iconBg="bg-rose-50 text-rose-600"
          badge={urgentCount > 0 ? 'Critical' : 'Clear'}
        />
        <MetricCard
          title="In Progress"
          value={inProgressCount}
          subtitle="Actively on-site"
          icon={faWrench}
          iconBg="bg-amber-50 text-amber-600"
        />
        <MetricCard
          title="Completed"
          value={completedCount}
          subtitle="Resolved tickets"
          icon={faCheckCircle}
          iconBg="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Search and Filters */}
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
              placeholder="Search by ticket ID, issue, building, or technician..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-hidden"
              >
                <option value="All">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="border-l border-slate-200 pl-3 flex items-center gap-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-xl text-xs transition-colors ${
                  viewMode === 'table' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-400 hover:bg-slate-100'
                }`}
                title="Table List View"
              >
                <FontAwesomeIcon icon={faList} />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-xl text-xs transition-colors ${
                  viewMode === 'kanban' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-400 hover:bg-slate-100'
                }`}
                title="Kanban Board View"
              >
                <FontAwesomeIcon icon={faTableCellsLarge} />
              </button>
            </div>
          </div>
        </div>

        {/* Status Pill Tabs */}
        {viewMode === 'table' && (
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
                {st === 'All' && ` (${maintenance.length})`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-5">Ticket Reference</th>
                  <th className="py-3.5 px-4">Issue Details</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Resident</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Assigned Tech</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-400">
                      <p className="font-semibold text-slate-600">No maintenance tickets found</p>
                      <p className="text-[11px] mt-1">Try clearing filters or search parameters.</p>
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-5 font-mono font-bold text-slate-900">
                        {ticket.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {ticket.title}
                        </p>
                        <span className="text-[11px] text-slate-400">{ticket.category}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-800 font-semibold block">{ticket.propertyName}</span>
                        <span className="text-[11px] text-slate-500">Unit {ticket.unitNumber}</span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-800 font-medium">
                        {ticket.customerName}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            ticket.priority === 'Urgent'
                              ? 'bg-rose-100 text-rose-700 border border-rose-200'
                              : ticket.priority === 'High'
                              ? 'bg-orange-100 text-orange-700 border border-orange-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {ticket.assignedStaffName}
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={ticket.status} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedTicketId(ticket.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                        >
                          Details →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filteredTickets.length} of {maintenance.length} work orders</span>
            <span>Internal Facilities Management Queue</span>
          </div>
        </div>
      )}

      {/* Kanban Board View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {kanbanColumns.map((col) => {
            const colTickets = filteredTickets.filter((t) => t.status === col);
            return (
              <div key={col} className="bg-slate-100/70 rounded-2xl p-3.5 border border-slate-200/80 min-w-[240px]">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-700">{col}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white text-slate-600 shadow-2xs">
                    {colTickets.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {colTickets.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTicketId(t.id)}
                      className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs hover:shadow-md cursor-pointer transition-all hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono font-bold text-slate-400">{t.id}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            t.priority === 'Urgent'
                              ? 'bg-rose-100 text-rose-700'
                              : t.priority === 'High'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug mb-2">
                        {t.title}
                      </h4>
                      <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="truncate max-w-[120px]">{t.propertyName} ({t.unitNumber})</span>
                        <span className="font-semibold text-slate-700">{t.assignedStaffName.split(' ')[0]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* Detail Modal */}
      <MaintenanceDetailModal
        isOpen={Boolean(selectedTicketId)}
        onClose={() => setSelectedTicketId(null)}
        ticketId={selectedTicketId}
      />
    </div>
  );
}
