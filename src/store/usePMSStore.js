import { create } from 'zustand';
import {
  INITIAL_USERS,
  INITIAL_PROPERTIES,
  INITIAL_UNITS,
  INITIAL_CUSTOMERS,
  INITIAL_LEASES,
  INITIAL_PAYMENTS,
  INITIAL_MAINTENANCE,
  INITIAL_DOCUMENTS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_SETTINGS
} from '../data/mockData';

const STORAGE_KEY = 'apex_pms_internal_portal_v1';

const loadSavedState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.settings?.currency === 'USD ($)') {
        parsed.settings.currency = 'QAR';
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to parse saved state from localStorage:', e);
  }
  return null;
};

const savedState = loadSavedState();

export const usePMSStore = create((set, get) => ({
  // Active internal user & view navigation
  currentUser: savedState?.currentUser || INITIAL_USERS[0],
  activeView: 'dashboard', // dashboard, customers, customer-detail, properties, property-detail, leases, lease-detail, payments, maintenance, maintenance-detail, documents, reports, users, activity-logs, settings
  viewParams: {}, // e.g. { customerId: 'CUST-001' }
  toasts: [],

  // Data collections
  users: savedState?.users || INITIAL_USERS,
  properties: savedState?.properties || INITIAL_PROPERTIES,
  units: savedState?.units || INITIAL_UNITS,
  customers: savedState?.customers || INITIAL_CUSTOMERS,
  leases: savedState?.leases || INITIAL_LEASES,
  payments: savedState?.payments || INITIAL_PAYMENTS,
  maintenance: savedState?.maintenance || INITIAL_MAINTENANCE,
  documents: savedState?.documents || INITIAL_DOCUMENTS,
  activityLogs: savedState?.activityLogs || INITIAL_ACTIVITY_LOGS,
  settings: savedState?.settings || INITIAL_SETTINGS,

  // Synchronize state helper
  persistState: () => {
    try {
      const state = get();
      const payload = {
        currentUser: state.currentUser,
        users: state.users,
        properties: state.properties,
        units: state.units,
        customers: state.customers,
        leases: state.leases,
        payments: state.payments,
        maintenance: state.maintenance,
        documents: state.documents,
        activityLogs: state.activityLogs,
        settings: state.settings
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.error('Could not save to localStorage', err);
    }
  },

  // Reset to initial demo data
  resetToDefaults: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      currentUser: INITIAL_USERS[0],
      users: INITIAL_USERS,
      properties: INITIAL_PROPERTIES,
      units: INITIAL_UNITS,
      customers: INITIAL_CUSTOMERS,
      leases: INITIAL_LEASES,
      payments: INITIAL_PAYMENTS,
      maintenance: INITIAL_MAINTENANCE,
      documents: INITIAL_DOCUMENTS,
      activityLogs: INITIAL_ACTIVITY_LOGS,
      settings: INITIAL_SETTINGS
    });
    get().addToast('System reset to default seed demonstration state', 'info');
  },

  // Navigation
  setActiveView: (view, params = {}) => {
    set({ activeView: view, viewParams: params });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // Switch internal user role
  setCurrentUser: (userId) => {
    const user = get().users.find((u) => u.id === userId);
    if (user) {
      set({ currentUser: user });
      get().logActivity(`Switched session role to ${user.name} (${user.role})`, 'Administration');
      get().addToast(`Active role switched to: ${user.name} [${user.role}]`, 'info');
      get().persistState();
    }
  },

  // Toast feedback
  addToast: (message, type = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }));
    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  },

  // Activity Logger
  logActivity: (description, module = 'System', action = 'General Action') => {
    const { currentUser, activityLogs } = get();
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    const newLog = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      action: action || description.split(' ')[0],
      module,
      timestamp,
      description
    };
    set({ activityLogs: [newLog, ...activityLogs] });
    get().persistState();
  },

  // ================= CUSTOMER ACTIONS =================
  addCustomer: (customerData) => {
    const id = `CUST-${String(get().customers.length + 1).padStart(3, '0')}`;
    const newCust = {
      id,
      createdAt: new Date().toISOString().substring(0, 10),
      avatar: customerData.avatar || `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 50000000)}?w=150&auto=format&fit=crop&q=80`,
      status: 'Active',
      customerType: 'Individual',
      currentPropertyId: null,
      currentPropertyName: null,
      currentUnitId: null,
      currentUnitNumber: null,
      ...customerData
    };
    set((state) => ({
      customers: [newCust, ...state.customers]
    }));
    get().logActivity(`Registered new tenant: ${newCust.fullName} (${newCust.id})`, 'Customers', 'Customer Created');
    get().addToast(`Tenant ${newCust.fullName} successfully registered!`);
    get().persistState();
    return newCust;
  },

  updateCustomer: (id, updates) => {
    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? { ...c, ...updates } : c))
    }));
    get().logActivity(`Updated tenant details for ${id}`, 'Customers', 'Customer Updated');
    get().addToast(`Customer record updated.`);
    get().persistState();
  },

  deleteCustomer: (id) => {
    const target = get().customers.find((c) => c.id === id);
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id)
    }));
    get().logActivity(`Removed tenant profile for ${target?.fullName || id}`, 'Customers', 'Customer Deleted');
    get().addToast(`Customer profile removed.`, 'warning');
    get().persistState();
  },

  // ================= PROPERTY & UNIT ACTIONS =================
  addProperty: (propertyData) => {
    const id = `PROP-${String(get().properties.length + 1).padStart(2, '0')}`;
    const manager = get().users.find((u) => u.id === propertyData.managerId);
    const newProp = {
      id,
      unitsCount: Number(propertyData.unitsCount) || 0,
      status: 'Active',
      acquisitionDate: new Date().toISOString().substring(0, 10),
      image: propertyData.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
      managerName: manager ? manager.name : 'Unassigned',
      ...propertyData
    };
    set((state) => ({
      properties: [newProp, ...state.properties]
    }));
    get().logActivity(`Added new real estate asset: ${newProp.name} (${newProp.id})`, 'Properties', 'Property Added');
    get().addToast(`Property ${newProp.name} added to portfolio.`);
    get().persistState();
    return newProp;
  },

  updateProperty: (id, updates) => {
    set((state) => ({
      properties: state.properties.map((p) => (p.id === id ? { ...p, ...updates } : p))
    }));
    get().logActivity(`Updated property asset details for ${id}`, 'Properties', 'Property Updated');
    get().addToast(`Property information updated.`);
    get().persistState();
  },

  deleteProperty: (id) => {
    const target = get().properties.find((p) => p.id === id);
    set((state) => ({
      properties: state.properties.filter((p) => p.id !== id),
      units: state.units.filter((u) => u.propertyId !== id)
    }));
    get().logActivity(`Deleted property asset ${target?.name || id}`, 'Properties', 'Property Deleted');
    get().addToast(`Property and associated units deleted.`, 'warning');
    get().persistState();
  },

  addUnit: (unitData) => {
    const id = `UNIT-${Date.now().toString().slice(-4)}`;
    const property = get().properties.find((p) => p.id === unitData.propertyId);
    const newUnit = {
      id,
      status: 'Available',
      currentTenantId: null,
      currentTenantName: null,
      currentLeaseId: null,
      propertyName: property?.name || 'Property',
      images: [property?.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80'],
      ...unitData
    };
    set((state) => ({
      units: [...state.units, newUnit],
      properties: state.properties.map((p) =>
        p.id === unitData.propertyId ? { ...p, unitsCount: (p.unitsCount || 0) + 1 } : p
      )
    }));
    get().logActivity(`Added unit ${newUnit.unitNumber} to ${property?.name}`, 'Units', 'Unit Added');
    get().addToast(`Unit ${newUnit.unitNumber} added successfully.`);
    get().persistState();
    return newUnit;
  },

  updateUnit: (id, updates) => {
    set((state) => ({
      units: state.units.map((u) => (u.id === id ? { ...u, ...updates } : u))
    }));
    get().logActivity(`Updated unit specifications for ${id}`, 'Units', 'Unit Updated');
    get().addToast(`Unit updated.`);
    get().persistState();
  },

  // ================= LEASE ACTIONS =================
  createLease: (leaseData) => {
    const id = `LSE-${String(get().leases.length + 1).padStart(3, '0')}`;
    const leaseNumber = `LSE-${new Date().getFullYear()}-${String(get().leases.length + 1).padStart(3, '0')}`;
    const customer = get().customers.find((c) => c.id === leaseData.customerId);
    const property = get().properties.find((p) => p.id === leaseData.propertyId);
    const unit = get().units.find((u) => u.id === leaseData.unitId);

    const newLease = {
      id,
      leaseNumber,
      customerName: customer?.fullName || 'Tenant',
      propertyName: property?.name || 'Property',
      unitNumber: unit?.unitNumber || 'Unit',
      status: 'Active',
      documentsCount: 1,
      dueDay: 1,
      ...leaseData
    };

    // Update Unit status to Occupied and link Tenant & Lease
    const updatedUnits = get().units.map((u) =>
      u.id === leaseData.unitId
        ? {
            ...u,
            status: 'Occupied',
            currentTenantId: leaseData.customerId,
            currentTenantName: customer?.fullName,
            currentLeaseId: id
          }
        : u
    );

    // Update Customer with current unit/property
    const updatedCustomers = get().customers.map((c) =>
      c.id === leaseData.customerId
        ? {
            ...c,
            currentPropertyId: leaseData.propertyId,
            currentPropertyName: property?.name,
            currentUnitId: leaseData.unitId,
            currentUnitNumber: unit?.unitNumber,
            status: 'Active'
          }
        : c
    );

    // Auto-generate 1st month rent & security deposit invoice
    const invId = `PAY-${Date.now().toString().slice(-4)}`;
    const initialPayment = {
      id: invId,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`,
      customerId: leaseData.customerId,
      customerName: customer?.fullName || 'Tenant',
      propertyId: leaseData.propertyId,
      propertyName: property?.name,
      unitNumber: unit?.unitNumber,
      leaseId: id,
      amount: Number(leaseData.monthlyRent) + Number(leaseData.securityDeposit || 0),
      paymentDate: null,
      dueDate: leaseData.startDate,
      method: 'Bank Transfer',
      status: 'Pending',
      referenceNumber: null,
      notes: 'Initial Security Deposit + 1st Month Rent billing'
    };

    set((state) => ({
      leases: [newLease, ...state.leases],
      units: updatedUnits,
      customers: updatedCustomers,
      payments: [initialPayment, ...state.payments]
    }));

    get().logActivity(
      `Executed Lease ${leaseNumber} for ${customer?.fullName} in ${property?.name} ${unit?.unitNumber}`,
      'Leases',
      'Lease Executed'
    );
    get().addToast(`Lease ${leaseNumber} created and Unit ${unit?.unitNumber} marked Occupied!`);
    get().persistState();
    return newLease;
  },

  renewLease: (leaseId, newEndDate, newRent) => {
    const target = get().leases.find((l) => l.id === leaseId);
    if (!target) return;

    set((state) => ({
      leases: state.leases.map((l) =>
        l.id === leaseId
          ? {
              ...l,
              endDate: newEndDate,
              monthlyRent: Number(newRent) || l.monthlyRent,
              status: 'Renewed'
            }
          : l
      )
    }));

    get().logActivity(
      `Renewed Lease ${target.leaseNumber} until ${newEndDate} at QAR ${newRent || target.monthlyRent}/mo`,
      'Leases',
      'Lease Renewed'
    );
    get().addToast(`Lease ${target.leaseNumber} successfully renewed!`);
    get().persistState();
  },

  terminateLease: (leaseId, terminationReason) => {
    const target = get().leases.find((l) => l.id === leaseId);
    if (!target) return;

    // Free up unit
    const updatedUnits = get().units.map((u) =>
      u.id === target.unitId
        ? {
            ...u,
            status: 'Available',
            currentTenantId: null,
            currentTenantName: null,
            currentLeaseId: null
          }
        : u
    );

    // Update customer status to Former Tenant
    const updatedCustomers = get().customers.map((c) =>
      c.id === target.customerId
        ? {
            ...c,
            currentPropertyId: null,
            currentPropertyName: null,
            currentUnitId: null,
            currentUnitNumber: null,
            status: 'Former Tenant'
          }
        : c
    );

    set((state) => ({
      leases: state.leases.map((l) =>
        l.id === leaseId ? { ...l, status: 'Terminated', terminationReason } : l
      ),
      units: updatedUnits,
      customers: updatedCustomers
    }));

    get().logActivity(`Terminated Lease ${target.leaseNumber}. Unit freed.`, 'Leases', 'Lease Terminated');
    get().addToast(`Lease ${target.leaseNumber} terminated and Unit marked Available.`, 'warning');
    get().persistState();
  },

  // ================= PAYMENT ACTIONS =================
  recordPayment: (paymentData) => {
    let paymentRecord;
    const existing = get().payments.find((p) => p.id === paymentData.id);

    if (existing) {
      paymentRecord = {
        ...existing,
        ...paymentData,
        status: 'Paid',
        paymentDate: paymentData.paymentDate || new Date().toISOString().substring(0, 10)
      };
      set((state) => ({
        payments: state.payments.map((p) => (p.id === paymentData.id ? paymentRecord : p))
      }));
    } else {
      const id = `PAY-${Date.now().toString().slice(-4)}`;
      const customer = get().customers.find((c) => c.id === paymentData.customerId);
      const property = get().properties.find((p) => p.id === paymentData.propertyId);
      paymentRecord = {
        id,
        invoiceNumber: `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`,
        customerName: customer?.fullName || 'Tenant',
        propertyName: property?.name || 'Property',
        status: 'Paid',
        paymentDate: paymentData.paymentDate || new Date().toISOString().substring(0, 10),
        ...paymentData
      };
      set((state) => ({
        payments: [paymentRecord, ...state.payments]
      }));
    }

    get().logActivity(
      `Recorded rent payment QAR ${paymentRecord.amount} for ${paymentRecord.customerName} (${paymentRecord.invoiceNumber})`,
      'Payments',
      'Payment Recorded'
    );
    get().addToast(`Payment QAR ${paymentRecord.amount} successfully recorded.`);
    get().persistState();
    return paymentRecord;
  },

  updatePaymentStatus: (paymentId, status) => {
    set((state) => ({
      payments: state.payments.map((p) => (p.id === paymentId ? { ...p, status } : p))
    }));
    get().logActivity(`Changed payment ${paymentId} status to ${status}`, 'Payments', 'Payment Status Changed');
    get().persistState();
  },

  // ================= MAINTENANCE ACTIONS =================
  createMaintenance: (ticketData) => {
    const id = `MNT-${new Date().getFullYear()}-${String(get().maintenance.length + 1).padStart(2, '0')}`;
    const property = get().properties.find((p) => p.id === ticketData.propertyId);
    const unit = get().units.find((u) => u.id === ticketData.unitId);
    const customer = get().customers.find((c) => c.id === ticketData.customerId);
    const staff = get().users.find((u) => u.id === ticketData.assignedStaffId);

    const now = new Date();
    const createdAt = `${now.toISOString().substring(0, 10)} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newTicket = {
      id,
      propertyName: property?.name || 'Property',
      unitNumber: unit?.unitNumber || 'Unit',
      customerName: customer?.fullName || 'Resident',
      assignedStaffName: staff?.name || 'Unassigned',
      status: ticketData.assignedStaffId ? 'Assigned' : 'Open',
      createdAt,
      notes: 'Work order opened in portal.',
      ...ticketData
    };

    set((state) => ({
      maintenance: [newTicket, ...state.maintenance]
    }));

    get().logActivity(
      `Opened Maintenance Work Order #${id}: "${newTicket.title}" (${newTicket.priority} Priority)`,
      'Maintenance',
      'Ticket Created'
    );
    get().addToast(`Maintenance ticket #${id} created!`);
    get().persistState();
    return newTicket;
  },

  updateMaintenanceStatus: (ticketId, status, additionalNote = '') => {
    const ticket = get().maintenance.find((t) => t.id === ticketId);
    const noteAppend = additionalNote ? `\n[${status}]: ${additionalNote}` : '';

    set((state) => ({
      maintenance: state.maintenance.map((m) =>
        m.id === ticketId
          ? {
              ...m,
              status,
              notes: (m.notes || '') + noteAppend
            }
          : m
      )
    }));

    get().logActivity(
      `Work Order #${ticketId} status changed to ${status}`,
      'Maintenance',
      'Ticket Updated'
    );
    get().addToast(`Work order #${ticketId} status updated to ${status}`);
    get().persistState();
  },

  assignMaintenanceStaff: (ticketId, staffId) => {
    const staff = get().users.find((u) => u.id === staffId);
    set((state) => ({
      maintenance: state.maintenance.map((m) =>
        m.id === ticketId
          ? {
              ...m,
              assignedStaffId: staffId,
              assignedStaffName: staff?.name || 'Unassigned',
              status: m.status === 'Open' ? 'Assigned' : m.status
            }
          : m
      )
    }));
    get().logActivity(`Assigned #${ticketId} to ${staff?.name}`, 'Maintenance', 'Ticket Assigned');
    get().addToast(`Assigned to ${staff?.name}`);
    get().persistState();
  },

  // ================= DOCUMENT ACTIONS =================
  uploadDocument: (docData) => {
    const id = `DOC-${Date.now().toString().slice(-3)}`;
    const newDoc = {
      id,
      uploadDate: new Date().toISOString().substring(0, 10),
      uploadedBy: get().currentUser.name,
      fileSize: docData.fileSize || '1.8 MB',
      fileType: 'PDF',
      status: 'Active',
      ...docData
    };

    set((state) => ({
      documents: [newDoc, ...state.documents]
    }));

    get().logActivity(`Archived document: ${newDoc.name} (${newDoc.type})`, 'Documents', 'Document Uploaded');
    get().addToast(`Document "${newDoc.name}" uploaded to company archive.`);
    get().persistState();
    return newDoc;
  },

  deleteDocument: (id) => {
    const target = get().documents.find((d) => d.id === id);
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id)
    }));
    get().logActivity(`Deleted document: ${target?.name || id}`, 'Documents', 'Document Deleted');
    get().addToast(`Document removed.`, 'warning');
    get().persistState();
  },

  // ================= USER MANAGEMENT ACTIONS =================
  addUser: (userData) => {
    const id = `USR-${String(get().users.length + 1).padStart(3, '0')}`;
    const newUser = {
      id,
      status: 'Active',
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 50000000)}?w=150&auto=format&fit=crop&q=80`,
      ...userData
    };
    set((state) => ({
      users: [...state.users, newUser]
    }));
    get().logActivity(`Created staff account: ${newUser.name} (${newUser.role})`, 'Administration', 'User Created');
    get().addToast(`Staff member ${newUser.name} added.`);
    get().persistState();
    return newUser;
  },

  updateUser: (id, updates) => {
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u))
    }));
    get().logActivity(`Updated user permissions/info for ${id}`, 'Administration', 'User Updated');
    get().addToast(`User updated.`);
    get().persistState();
  },

  // ================= SYSTEM SETTINGS =================
  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }));
    get().logActivity(`Updated corporate system parameters & policies`, 'Settings', 'Settings Updated');
    get().addToast(`System settings saved.`);
    get().persistState();
  }
}));
