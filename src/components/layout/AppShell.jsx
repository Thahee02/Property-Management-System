import React, { useState } from 'react';
import { usePMSStore } from '../../store/usePMSStore';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import GlobalSearchModal from './GlobalSearchModal';
import ToastContainer from '../common/ToastContainer';

// Modules
import DashboardView from '../dashboard/DashboardView';
import CustomerListView from '../customers/CustomerListView';
import CustomerDetailView from '../customers/CustomerDetailView';
import CustomerFormModal from '../customers/CustomerFormModal';
import PropertyListView from '../properties/PropertyListView';
import PropertyDetailView from '../properties/PropertyDetailView';
import UnitListView from '../units/UnitListView';
import LeaseListView from '../leases/LeaseListView';
import LeaseDetailView from '../leases/LeaseDetailView';
import CreateLeaseModal from '../leases/CreateLeaseModal';
import PaymentListView from '../payments/PaymentListView';
import RecordPaymentModal from '../payments/RecordPaymentModal';
import MaintenanceListView from '../maintenance/MaintenanceListView';
import MaintenanceDetailModal from '../maintenance/MaintenanceDetailModal';
import CreateTicketModal from '../maintenance/CreateTicketModal';
import DocumentListView from '../documents/DocumentListView';
import ReportsView from '../reports/ReportsView';
import UsersView from '../admin/UsersView';
import ActivityLogsView from '../admin/ActivityLogsView';
import SettingsView from '../admin/SettingsView';

export default function AppShell() {
  const { activeView, addCustomer } = usePMSStore();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Quick Action Modal States
  const [quickCustomerOpen, setQuickCustomerOpen] = useState(false);
  const [quickLeaseOpen, setQuickLeaseOpen] = useState(false);
  const [quickPaymentOpen, setQuickPaymentOpen] = useState(false);
  const [quickMaintenanceOpen, setQuickMaintenanceOpen] = useState(false);
  const [quickActionPreselected, setQuickActionPreselected] = useState({});

  const handleOpenQuickAction = (actionType, preselected = {}) => {
    setQuickActionPreselected(preselected);
    if (actionType === 'customer') setQuickCustomerOpen(true);
    else if (actionType === 'lease') setQuickLeaseOpen(true);
    else if (actionType === 'payment') setQuickPaymentOpen(true);
    else if (actionType === 'maintenance') setQuickMaintenanceOpen(true);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView onOpenQuickAction={handleOpenQuickAction} />;
      case 'customers':
        return <CustomerListView />;
      case 'customer-detail':
        return <CustomerDetailView onOpenQuickAction={handleOpenQuickAction} />;
      case 'properties':
        return <PropertyListView />;
      case 'property-detail':
        return <PropertyDetailView onOpenQuickAction={handleOpenQuickAction} />;
      case 'units':
        return <UnitListView onOpenQuickAction={handleOpenQuickAction} />;
      case 'leases':
        return <LeaseListView onOpenQuickAction={handleOpenQuickAction} />;
      case 'lease-detail':
        return <LeaseDetailView onOpenQuickAction={handleOpenQuickAction} />;
      case 'payments':
        return <PaymentListView onOpenQuickAction={handleOpenQuickAction} />;
      case 'maintenance':
        return <MaintenanceListView onOpenQuickAction={handleOpenQuickAction} />;
      case 'maintenance-detail':
        return <MaintenanceListView onOpenQuickAction={handleOpenQuickAction} />;
      case 'documents':
        return <DocumentListView />;
      case 'reports':
        return <ReportsView />;
      case 'users':
        return <UsersView />;
      case 'activity-logs':
        return <ActivityLogsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onOpenQuickAction={handleOpenQuickAction} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 text-slate-800 antialiased font-sans">
      {/* Sidebar navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <TopHeader
          setMobileOpen={setMobileOpen}
          onOpenQuickAction={handleOpenQuickAction}
          onOpenSearchModal={() => setSearchModalOpen(true)}
        />

        {/* Dynamic Page View Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Global Omnisearch Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* Quick Action Modals */}
      <CustomerFormModal
        isOpen={quickCustomerOpen}
        onClose={() => setQuickCustomerOpen(false)}
        onSubmit={addCustomer}
      />

      <CreateLeaseModal
        isOpen={quickLeaseOpen}
        onClose={() => setQuickLeaseOpen(false)}
        preselected={quickActionPreselected}
      />

      <RecordPaymentModal
        isOpen={quickPaymentOpen}
        onClose={() => setQuickPaymentOpen(false)}
        preselected={quickActionPreselected}
      />

      <CreateTicketModal
        isOpen={quickMaintenanceOpen}
        onClose={() => setQuickMaintenanceOpen(false)}
        preselected={quickActionPreselected}
      />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
}
