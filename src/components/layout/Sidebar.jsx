import React from 'react';
import { usePMSStore } from '../../store/usePMSStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faUsers,
  faBuilding,
  faDoorClosed,
  faFileContract,
  faCreditCard,
  faWrench,
  faFolderOpen,
  faChartPie,
  faUserShield,
  faClockRotateLeft,
  faGear,
  faXmark,
  faBuildingCircleCheck
} from '@fortawesome/free-solid-svg-icons';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const {
    activeView,
    setActiveView,
    leases,
    payments,
    maintenance,
    currentUser,
    settings
  } = usePMSStore();

  // Badges calculation
  const expiringLeasesCount = leases.filter((l) => l.status === 'Expiring Soon').length;
  const overduePaymentsCount = payments.filter((p) => p.status === 'Overdue').length;
  const openMaintenanceCount = maintenance.filter((m) => m.status === 'Open' || m.status === 'Assigned').length;

  const navSections = [
    {
      title: null,
      items: [
        {
          id: 'dashboard',
          label: 'Executive Dashboard',
          icon: faChartLine
        }
      ]
    },
    {
      title: 'Portfolio & Tenancy',
      items: [
        {
          id: 'customers',
          label: 'Tenants & Customers',
          icon: faUsers
        },
        {
          id: 'properties',
          label: 'Properties Directory',
          icon: faBuilding
        },
        {
          id: 'units',
          label: 'Units & Inventory',
          icon: faDoorClosed
        },
        {
          id: 'leases',
          label: 'Lease Agreements',
          icon: faFileContract,
          badge: expiringLeasesCount > 0 ? expiringLeasesCount : null,
          badgeColor: 'bg-amber-500 text-white'
        }
      ]
    },
    {
      title: 'Finance & Accounts',
      items: [
        {
          id: 'payments',
          label: 'Rent & Payments',
          icon: faCreditCard,
          badge: overduePaymentsCount > 0 ? overduePaymentsCount : null,
          badgeColor: 'bg-rose-500 text-white'
        }
      ]
    },
    {
      title: 'Operations',
      items: [
        {
          id: 'maintenance',
          label: 'Maintenance Orders',
          icon: faWrench,
          badge: openMaintenanceCount > 0 ? openMaintenanceCount : null,
          badgeColor: 'bg-blue-600 text-white'
        },
        {
          id: 'documents',
          label: 'Document Hub',
          icon: faFolderOpen
        }
      ]
    },
    {
      title: 'Intelligence',
      items: [
        {
          id: 'reports',
          label: 'Reports & Analytics',
          icon: faChartPie
        }
      ]
    },
    {
      title: 'Internal Governance',
      items: [
        {
          id: 'users',
          label: 'Staff & Roles',
          icon: faUserShield,
          restrictedTo: ['Administrator']
        },
        {
          id: 'activity-logs',
          label: 'Compliance Audit Log',
          icon: faClockRotateLeft,
          restrictedTo: ['Administrator', 'Property Manager']
        },
        {
          id: 'settings',
          label: 'System Settings',
          icon: faGear,
          restrictedTo: ['Administrator']
        }
      ]
    }
  ];

  const handleNavClick = (viewId) => {
    setActiveView(viewId);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 border-r border-slate-800 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="py-6 px-5 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-950/40">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30">
              <FontAwesomeIcon icon={faBuildingCircleCheck} className="text-2xl" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white uppercase truncate max-w-[170px]">
                  {settings?.companyName || 'WATHNAN MALL'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate max-w-[140px]">
                Property Operations
              </p>
            </div>
          </div>
          {setMobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <FontAwesomeIcon icon={faXmark} className="text-lg" />
            </button>
          )}
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          {navSections.map((section, idx) => {
            // Check role filtering
            const visibleItems = section.items.filter(
              (item) => !item.restrictedTo || item.restrictedTo.includes(currentUser.role)
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-1">
                {section.title && (
                  <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {section.title}
                  </h4>
                )}
                {visibleItems.map((item) => {
                  const isActive =
                    activeView === item.id ||
                    (item.id === 'customers' && activeView === 'customer-detail') ||
                    (item.id === 'properties' && activeView === 'property-detail') ||
                    (item.id === 'leases' && activeView === 'lease-detail') ||
                    (item.id === 'maintenance' && activeView === 'maintenance-detail');

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FontAwesomeIcon
                          icon={item.icon}
                          className={`w-4 h-4 transition-colors ${
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            isActive ? 'bg-white text-emerald-700' : item.badgeColor
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
