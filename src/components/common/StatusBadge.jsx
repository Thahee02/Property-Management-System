import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faClock,
  faTriangleExclamation,
  faBan,
  faWrench,
  faCheck,
  faHourglassHalf,
  faDoorOpen,
  faBuildingUser
} from '@fortawesome/free-solid-svg-icons';

export default function StatusBadge({ status, size = 'sm' }) {
  const getBadgeConfig = () => {
    switch (status) {
      // General / Customer / Property / Lease / Payment / Maintenance
      case 'Active':
      case 'Paid':
      case 'Completed':
      case 'Renewed':
      case 'Available':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/10',
          dot: 'bg-emerald-500',
          icon: faCircleCheck
        };
      case 'Occupied':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500/10',
          dot: 'bg-blue-500',
          icon: faBuildingUser
        };
      case 'Pending':
      case 'In Progress':
      case 'Assigned':
      case 'Draft':
      case 'Reserved':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500/10',
          dot: 'bg-amber-500',
          icon: faClock
        };
      case 'Expiring Soon':
      case 'Waiting':
      case 'Partially Paid':
        return {
          bg: 'bg-orange-50 text-orange-700 border-orange-200 ring-1 ring-orange-500/10',
          dot: 'bg-orange-500',
          icon: faHourglassHalf
        };
      case 'Overdue':
      case 'Urgent':
      case 'Blacklisted':
      case 'Terminated':
      case 'Unavailable':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-500/10',
          dot: 'bg-rose-500',
          icon: faTriangleExclamation
        };
      case 'Maintenance':
      case 'Under Maintenance':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-500/10',
          dot: 'bg-purple-500',
          icon: faWrench
        };
      case 'Former Tenant':
      case 'Inactive':
      case 'Sold':
      case 'Expired':
      case 'Cancelled':
      default:
        return {
          bg: 'bg-slate-100 text-slate-600 border-slate-200 ring-1 ring-slate-400/10',
          dot: 'bg-slate-400',
          icon: faBan
        };
    }
  };

  const config = getBadgeConfig();
  const sizeClasses = size === 'xs' 
    ? 'text-[11px] px-2 py-0.5 gap-1' 
    : size === 'lg' 
    ? 'text-sm px-3.5 py-1.5 gap-2 font-semibold' 
    : 'text-xs px-2.5 py-1 gap-1.5 font-medium';

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-xs transition-colors duration-150 ${config.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{status}</span>
    </span>
  );
}
