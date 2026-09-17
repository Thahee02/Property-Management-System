import React, { useState, useEffect, useMemo } from 'react';
import { usePMSStore } from '../../store/usePMSStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faXmark,
  faUsers,
  faBuilding,
  faDoorClosed,
  faFileContract,
  faCreditCard,
  faWrench,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const {
    customers,
    properties,
    units,
    leases,
    payments,
    maintenance,
    setActiveView
  } = usePMSStore();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return null;
    const q = query.toLowerCase();

    return {
      customers: customers.filter(
        (c) =>
          c.fullName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.id.toLowerCase().includes(q)
      ),
      properties: properties.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q)
      ),
      units: units.filter(
        (u) =>
          u.unitNumber.toLowerCase().includes(q) ||
          u.propertyName.toLowerCase().includes(q)
      ),
      leases: leases.filter(
        (l) =>
          l.leaseNumber.toLowerCase().includes(q) ||
          l.customerName.toLowerCase().includes(q)
      ),
      payments: payments.filter(
        (p) =>
          p.invoiceNumber.toLowerCase().includes(q) ||
          p.customerName.toLowerCase().includes(q)
      ),
      maintenance: maintenance.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          m.customerName.toLowerCase().includes(q)
      )
    };
  }, [query, customers, properties, units, leases, payments, maintenance]);

  if (!isOpen) return null;

  const handleSelect = (view, params) => {
    setActiveView(view, params);
    onClose();
  };

  const totalHits = results
    ? Object.values(results).reduce((acc, curr) => acc + curr.length, 0)
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="min-h-full flex items-start justify-center p-4 pt-16 sm:pt-24 text-center">
        <div
          className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-2xl transition-all border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input Box */}
          <div className="relative flex items-center px-4 border-b border-slate-100">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-slate-400 text-lg mr-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tenants, buildings, unit numbers, leases, invoices, or tickets..."
              className="w-full py-4 text-base bg-transparent text-slate-800 placeholder-slate-400 focus:outline-hidden"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            )}
            <kbd className="hidden sm:inline-flex text-[10px] font-mono px-2 py-1 rounded bg-slate-100 text-slate-500 border ml-2">
              ESC
            </kbd>
          </div>

          {/* Search Results */}
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
            {!query.trim() && (
              <div className="text-center py-8 text-slate-400">
                <p className="text-xs">Type at least 2 characters to search across the entire property portfolio.</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                  <span
                    onClick={() => setQuery('Green Valley')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer text-slate-600"
                  >
                    Green Valley
                  </span>
                  <span
                    onClick={() => setQuery('John Smith')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer text-slate-600"
                  >
                    John Smith
                  </span>
                  <span
                    onClick={() => setQuery('A-101')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer text-slate-600"
                  >
                    Unit A-101
                  </span>
                </div>
              </div>
            )}

            {query.trim().length >= 2 && totalHits === 0 && (
              <div className="text-center py-10 text-slate-400">
                <p className="text-sm font-medium text-slate-600">No records found matching "{query}"</p>
                <p className="text-xs mt-1">Try searching by tenant name, unit number, or invoice code.</p>
              </div>
            )}

            {results && results.customers.length > 0 && (
              <div>
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faUsers} className="text-emerald-500" /> Tenants ({results.customers.length})
                </h5>
                <div className="space-y-1">
                  {results.customers.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => handleSelect('customer-detail', { customerId: c.id })}
                      className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors border border-transparent hover:border-slate-200"
                    >
                      <div className="flex items-center gap-3">
                        <img src={c.avatar} alt={c.fullName} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{c.fullName}</p>
                          <p className="text-[11px] text-slate-500">
                            {c.email} • {c.currentUnitNumber ? `Unit ${c.currentUnitNumber}` : 'No active unit'}
                          </p>
                        </div>
                      </div>
                      <FontAwesomeIcon icon={faArrowRight} className="text-slate-300 text-xs" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results && results.properties.length > 0 && (
              <div>
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faBuilding} className="text-blue-500" /> Properties ({results.properties.length})
                </h5>
                <div className="space-y-1">
                  {results.properties.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelect('property-detail', { propertyId: p.id })}
                      className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors border border-transparent hover:border-slate-200"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900">{p.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {p.address}, {p.city} • {p.unitsCount} Units
                        </p>
                      </div>
                      <FontAwesomeIcon icon={faArrowRight} className="text-slate-300 text-xs" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results && results.units.length > 0 && (
              <div>
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faDoorClosed} className="text-purple-500" /> Units ({results.units.length})
                </h5>
                <div className="space-y-1">
                  {results.units.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => handleSelect('property-detail', { propertyId: u.propertyId, highlightUnitId: u.id })}
                      className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors border border-transparent hover:border-slate-200"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          Unit {u.unitNumber} - {u.propertyName}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {u.type} • QAR {u.monthlyRent}/mo • Status: {u.status}
                        </p>
                      </div>
                      <FontAwesomeIcon icon={faArrowRight} className="text-slate-300 text-xs" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results && results.leases.length > 0 && (
              <div>
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faFileContract} className="text-indigo-500" /> Leases ({results.leases.length})
                </h5>
                <div className="space-y-1">
                  {results.leases.map((l) => (
                    <div
                      key={l.id}
                      onClick={() => handleSelect('lease-detail', { leaseId: l.id })}
                      className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors border border-transparent hover:border-slate-200"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          {l.leaseNumber} - {l.customerName}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {l.propertyName} ({l.unitNumber}) • Ends: {l.endDate}
                        </p>
                      </div>
                      <FontAwesomeIcon icon={faArrowRight} className="text-slate-300 text-xs" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
