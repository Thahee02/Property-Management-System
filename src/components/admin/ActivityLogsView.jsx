import React, { useState, useMemo } from 'react';
import { usePMSStore } from '../../store/usePMSStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClockRotateLeft,
  faMagnifyingGlass,
  faFilter,
  faDownload,
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons';

export default function ActivityLogsView() {
  const { activityLogs } = usePMSStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');

  const filteredLogs = useMemo(() => {
    return activityLogs.filter((log) => {
      const matchesSearch =
        log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.module.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesModule = moduleFilter === 'All' || log.module === moduleFilter;

      return matchesSearch && matchesModule;
    });
  }, [activityLogs, searchQuery, moduleFilter]);

  const modules = ['All', 'Customers', 'Properties', 'Units', 'Leases', 'Payments', 'Maintenance', 'Administration', 'Settings'];

  const handleExportLogs = () => {
    let csv = 'Timestamp,Actor,Module,Action,Description\r\n';
    filteredLogs.forEach((l) => {
      csv += `"${l.timestamp}","${l.userName}","${l.module}","${l.action}","${l.description.replace(/"/g, '""')}"\r\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Apex_Audit_Trail_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-slate-900">
            Compliance & Activity Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable chronological logging of all internal transactions, lease modifications, and staff actions.
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <FontAwesomeIcon icon={faDownload} />
          Export Audit Trail
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="relative max-w-md">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by action, employee name, or description..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Module Pill Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-xs font-medium text-slate-400 mr-1">Module:</span>
          {modules.map((m) => (
            <button
              key={m}
              onClick={() => setModuleFilter(m)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                moduleFilter === m
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {m}
              {m === 'All' && ` (${activityLogs.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-5">Timestamp</th>
                <th className="py-3.5 px-4">Staff User</th>
                <th className="py-3.5 px-4">Module</th>
                <th className="py-3.5 px-4">Action Type</th>
                <th className="py-3.5 px-4">Audit Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-slate-600">No activity log entries found</p>
                    <p className="text-[11px] mt-1">Try adjusting the search query or module filter.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5 font-mono text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {log.userName}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200 text-[10px]">
                        {log.module}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      {log.action}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 leading-relaxed max-w-md">
                      {log.description}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>Displaying {filteredLogs.length} audit trail records</span>
          <span className="flex items-center gap-1 text-slate-400">
            <FontAwesomeIcon icon={faShieldHalved} className="text-emerald-500" /> Tamper-evident logging active
          </span>
        </div>
      </div>
    </div>
  );
}
