import React, { useState, useMemo } from 'react';
import { usePMSStore } from '../../store/usePMSStore';
import StatusBadge from '../common/StatusBadge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartPie,
  faPrint,
  faFileExcel,
  faFilePdf,
  faFilter,
  faBuilding,
  faCalendarDays,
  faMoneyBillWave,
  faWrench,
  faUsers,
  faFileContract
} from '@fortawesome/free-solid-svg-icons';

export default function ReportsView() {
  const { properties, units, customers, leases, payments, maintenance, settings } = usePMSStore();

  const [selectedReport, setSelectedReport] = useState('occupancy'); // occupancy, revenue, payments, expirations, maintenance, performance
  const [propertyFilter, setPropertyFilter] = useState('All');
  const [dateRange, setDateRange] = useState('Q1-2024');

  const reportList = [
    { id: 'occupancy', label: 'Property Occupancy Report', icon: faBuilding, desc: 'Unit occupancy and vacancy rates by property asset' },
    { id: 'revenue', label: 'Revenue & Collections Report', icon: faMoneyBillWave, desc: 'Total realized rental income vs target budget' },
    { id: 'payments', label: 'Arrears & Outstanding Payments', icon: faMoneyBillWave, desc: 'Overdue rent aging and delinquent tenant ledger' },
    { id: 'expirations', label: 'Lease Expiration Forecast', icon: faFileContract, desc: 'Upcoming lease terminations and renewal timelines' },
    { id: 'maintenance', label: 'Maintenance Turnaround SLA', icon: faWrench, desc: 'Work order resolution speed and category costs' },
    { id: 'performance', label: 'Property Performance & Yield', icon: faChartPie, desc: 'Financial yields and return metrics per building' }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Apex Properties Corporate Report: ' + selectedReport.toUpperCase() + '\r\n';
    csvContent += 'Date Range: ' + dateRange + ' | Property Filter: ' + propertyFilter + '\r\n\r\n';

    if (selectedReport === 'occupancy') {
      csvContent += 'Property,Total Units,Occupied,Available,Maintenance,Occupancy Rate\r\n';
      properties.forEach((p) => {
        const pUnits = units.filter((u) => u.propertyId === p.id);
        const occ = pUnits.filter((u) => u.status === 'Occupied').length;
        const avail = pUnits.filter((u) => u.status === 'Available').length;
        const maint = pUnits.filter((u) => u.status === 'Maintenance').length;
        const pct = Math.round((occ / (pUnits.length || 1)) * 100);
        csvContent += `"${p.name}",${pUnits.length},${occ},${avail},${maint},${pct}%\r\n`;
      });
    } else {
      csvContent += 'Item,Description,Status,Amount\r\n';
      payments.forEach((p) => {
        csvContent += `"${p.invoiceNumber}","${p.customerName} - ${p.propertyName}",${p.status},$${p.amount}\r\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Apex_Report_${selectedReport}_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-slate-900">
            Operational & Financial Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Executive intelligence, portfolio occupancy analytics, rent collections, and SLA turnaround tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <FontAwesomeIcon icon={faFileExcel} className="text-emerald-600" />
            Export to CSV
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <FontAwesomeIcon icon={faPrint} />
            Print Report
          </button>
        </div>
      </div>

      {/* Report Selection Grid & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 no-print">
        {reportList.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedReport(r.id)}
            className={`p-3 rounded-2xl border text-left transition-all ${
              selectedReport === r.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-102 font-bold'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${
                selectedReport === r.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <FontAwesomeIcon icon={r.icon} className="text-xs" />
            </div>
            <h4 className="text-xs font-bold leading-tight">{r.label}</h4>
          </button>
        ))}
      </div>

      {/* Filter Parameters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Property Filter:</span>
            <select
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-semibold"
            >
              <option value="All">All Properties Portfolio</option>
              {properties.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Reporting Period:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-semibold"
            >
              <option value="Q1-2024">Q1 2024 (Current Fiscal Quarter)</option>
              <option value="Jan-2024">January 2024 (Monthly)</option>
              <option value="FY-2023">Full Year 2023</option>
              <option value="All-Time">All-Time Historical</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-medium text-slate-500">
          Generated for: <strong className="text-slate-800">{settings.companyName}</strong>
        </div>
      </div>

      {/* Rendered Report Document Sheet */}
      <div id="printable-area" className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6 text-left text-xs">
        {/* Document Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-5">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Corporate Intelligence Statement
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-2">
              {reportList.find((r) => r.id === selectedReport)?.label}
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Period: <strong>{dateRange}</strong> • Filter: <strong>{propertyFilter}</strong>
            </p>
          </div>

          <div className="text-right">
            <h3 className="font-extrabold text-slate-900">{settings.companyName}</h3>
            <p className="text-slate-400 text-[11px]">{settings.hqAddress}</p>
            <p className="text-slate-400 text-[10px]">Generated on 2024-01-05 (Internal Compliance Copy)</p>
          </div>
        </div>

        {/* 1. OCCUPANCY REPORT */}
        {selectedReport === 'occupancy' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Units Audited</span>
                <span className="text-2xl font-extrabold text-slate-900">{units.length}</span>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">Occupied Units</span>
                <span className="text-2xl font-extrabold text-emerald-800">
                  {units.filter((u) => u.status === 'Occupied').length}
                </span>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-[10px] uppercase font-bold text-blue-700 block">Available For Lease</span>
                <span className="text-2xl font-extrabold text-blue-800">
                  {units.filter((u) => u.status === 'Available').length}
                </span>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <span className="text-[10px] uppercase font-bold text-purple-700 block">Under Maintenance</span>
                <span className="text-2xl font-extrabold text-purple-800">
                  {units.filter((u) => u.status === 'Maintenance').length}
                </span>
              </div>
            </div>

            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Real Estate Property</th>
                  <th className="py-3 px-4">Building Type</th>
                  <th className="py-3 px-4">Total Capacity</th>
                  <th className="py-3 px-4">Occupied</th>
                  <th className="py-3 px-4">Vacant</th>
                  <th className="py-3 px-4">Occupancy Rate</th>
                  <th className="py-3 px-4 text-right">Yield Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties
                  .filter((p) => propertyFilter === 'All' || p.name === propertyFilter)
                  .map((prop) => {
                    const pUnits = units.filter((u) => u.propertyId === prop.id);
                    const occ = pUnits.filter((u) => u.status === 'Occupied').length;
                    const avail = pUnits.filter((u) => u.status === 'Available').length;
                    const rate = Math.round((occ / (pUnits.length || 1)) * 100);

                    return (
                      <tr key={prop.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-900">{prop.name}</td>
                        <td className="py-3 px-4 text-slate-600">{prop.type}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900">{pUnits.length} Units</td>
                        <td className="py-3 px-4 font-bold text-emerald-700">{occ} Units</td>
                        <td className="py-3 px-4 text-slate-700">{avail} Units</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900">{rate}%</span>
                            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${rate}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-emerald-700 font-extrabold">Optimal</span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. REVENUE / PAYMENTS REPORT */}
        {(selectedReport === 'revenue' || selectedReport === 'payments') && (
          <div className="space-y-5">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Invoice Code</th>
                  <th className="py-3 px-4">Payer / Tenant</th>
                  <th className="py-3 px-4">Property & Unit</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments
                  .filter((p) => propertyFilter === 'All' || p.propertyName === propertyFilter)
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.invoiceNumber}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{p.customerName}</td>
                      <td className="py-3 px-4 text-slate-600">
                        {p.propertyName} ({p.unitNumber})
                      </td>
                      <td className="py-3 px-4 text-slate-700">{p.dueDate}</td>
                      <td className="py-3 px-4 text-slate-600">{p.method}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={p.status} size="xs" />
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                        ${p.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. EXPIRATIONS FORECAST */}
        {selectedReport === 'expirations' && (
          <div className="space-y-5">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Lease Code</th>
                  <th className="py-3 px-4">Contracted Tenant</th>
                  <th className="py-3 px-4">Property & Unit</th>
                  <th className="py-3 px-4">Monthly Rent</th>
                  <th className="py-3 px-4">Expiration Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Retention Strategy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leases.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{l.leaseNumber}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{l.customerName}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {l.propertyName} ({l.unitNumber})
                    </td>
                    <td className="py-3 px-4 font-extrabold text-slate-900">${l.monthlyRent.toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{l.endDate}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={l.status} size="xs" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      {l.status === 'Expiring Soon' ? (
                        <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Priority Renewal
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium">Standard Review</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. MAINTENANCE REPORT */}
        {selectedReport === 'maintenance' && (
          <div className="space-y-5">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Work Order</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Assigned Tech</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {maintenance.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{m.id} - {m.title}</td>
                    <td className="py-3 px-4 text-slate-600">{m.category}</td>
                    <td className="py-3 px-4 text-slate-700">{m.propertyName} ({m.unitNumber})</td>
                    <td className="py-3 px-4 text-slate-800 font-semibold">{m.assignedStaffName}</td>
                    <td className="py-3 px-4 font-bold">{m.priority}</td>
                    <td className="py-3 px-4 text-right">
                      <StatusBadge status={m.status} size="xs" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. PERFORMANCE & YIELD */}
        {selectedReport === 'performance' && (
          <div className="space-y-5">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 leading-relaxed">
              <strong>Corporate Yield Assessment:</strong> Portfolio capitalization rate is tracking at 7.8% net operational yield across all residential multi-family and commercial Grade-A assets.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {properties.map((p) => {
                const pUnits = units.filter((u) => u.propertyId === p.id);
                const occ = pUnits.filter((u) => u.status === 'Occupied');
                const rentRoll = occ.reduce((a, b) => a + (Number(b.monthlyRent) || 0), 0);
                return (
                  <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-white">
                    <h4 className="font-bold text-slate-900">{p.name}</h4>
                    <p className="text-[11px] text-slate-500">{p.type}</p>
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Annualized Run Rate</span>
                      <span className="text-base font-extrabold text-emerald-700">
                        ${(rentRoll * 12).toLocaleString()} / yr
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sign-off footer */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-slate-400 text-[10px]">
          <span>Approved by Corporate Comptroller & Portfolio Director</span>
          <span>Apex Corporate Property Portal • Internal Confidential Record</span>
        </div>
      </div>
    </div>
  );
}
