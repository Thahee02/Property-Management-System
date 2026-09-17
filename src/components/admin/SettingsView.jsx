import React, { useState } from 'react';
import { usePMSStore } from '../../store/usePMSStore';
import ConfirmModal from '../common/ConfirmModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGear,
  faBuilding,
  faMoneyBillWave,
  faBell,
  faRotateLeft,
  faCheck
} from '@fortawesome/free-solid-svg-icons';

export default function SettingsView() {
  const { settings, updateSettings, resetToDefaults } = usePMSStore();

  const [formData, setFormData] = useState({ ...settings });
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-slate-900">
            Corporate System Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Company headquarters identity, default lease clauses, grace periods, and accounting defaults.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          {savedSuccess ? (
            <>
              <FontAwesomeIcon icon={faCheck} /> Settings Saved!
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Company Identity */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <FontAwesomeIcon icon={faBuilding} className="text-emerald-600 text-sm" />
            <h2 className="text-sm font-bold text-slate-900">Company Identity & Headquarters</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Company / Entity Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tax / EIN Registration Number</label>
              <input
                type="text"
                name="taxRegistrationNumber"
                value={formData.taxRegistrationNumber}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Portal Subtitle Header</label>
            <input
              type="text"
              name="portalSubtitle"
              value={formData.portalSubtitle}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Headquarters Address</label>
            <input
              type="text"
              name="hqAddress"
              value={formData.hqAddress}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Operations Contact Email</label>
              <input
                type="email"
                name="supportEmail"
                value={formData.supportEmail}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Emergency Maintenance Phone</label>
              <input
                type="text"
                name="emergencyDispatchPhone"
                value={formData.emergencyDispatchPhone}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>
        </div>

        {/* Leasing & Finance Parameters */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <FontAwesomeIcon icon={faMoneyBillWave} className="text-emerald-600 text-sm" />
            <h2 className="text-sm font-bold text-slate-900">Leasing Terms & Accounting Parameters</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Base Currency</label>
              <input
                type="text"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Default Lease Term (Months)</label>
              <input
                type="number"
                name="defaultLeaseDurationMonths"
                value={formData.defaultLeaseDurationMonths}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Grace Period (Days)</label>
              <input
                type="number"
                name="gracePeriodDays"
                value={formData.gracePeriodDays}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Renewal Advance Notice (Days)</label>
              <input
                type="number"
                name="renewalNoticeDays"
                value={formData.renewalNoticeDays}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Municipal Assessment / Tax (%)</label>
              <input
                type="number"
                step="0.1"
                name="taxRatePercent"
                value={formData.taxRatePercent}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Notifications & Automations */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <FontAwesomeIcon icon={faBell} className="text-emerald-600 text-sm" />
            <h2 className="text-sm font-bold text-slate-900">Automated Communications</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                name="enableEmailAlerts"
                checked={formData.enableEmailAlerts}
                onChange={handleChange}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="font-bold text-slate-900 block">Automated Email Renewal Reminders</span>
                <span className="text-[11px] text-slate-500">
                  Send automated notifications to residents 60 days prior to lease expiration.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                name="enableSmsNotifications"
                checked={formData.enableSmsNotifications}
                onChange={handleChange}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="font-bold text-slate-900 block">SMS Dispatch For Urgent Work Orders</span>
                <span className="text-[11px] text-slate-500">
                  Instantly ping on-call technician cell phones when an Urgent maintenance order is opened.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                name="autoGenerateReceipts"
                checked={formData.autoGenerateReceipts}
                onChange={handleChange}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="font-bold text-slate-900 block">Auto-Generate Official Receipts</span>
                <span className="text-[11px] text-slate-500">
                  Automatically file printable PDF receipt voucher whenever rent is recorded as Paid.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Demo Seed Reset (Danger Zone) */}
        <div className="bg-rose-50/50 rounded-2xl border border-rose-200 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-rose-900">Prototype Demonstration Data Reset</h3>
              <p className="text-xs text-rose-700 mt-0.5">
                Restores the database back to clean baseline state with pre-populated properties, units, tenants, and contracts.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <FontAwesomeIcon icon={faRotateLeft} /> Reset Data
            </button>
          </div>
        </div>
      </form>

      {/* Reset Confirmation */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={() => {
          resetToDefaults();
          setFormData({ ...settings });
        }}
        title="Reset All Demonstration Records"
        message="Are you sure you want to reset the system state? Any customized properties, tenants, leases, or recorded payments created during this session will be restored to default demo values."
        confirmText="Confirm Reset"
        isDanger={true}
      />
    </div>
  );
}
