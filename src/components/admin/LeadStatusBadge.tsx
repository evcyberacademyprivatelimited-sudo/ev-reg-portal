import React from 'react';
import { LeadStatus } from '../../types';

interface LeadStatusBadgeProps {
  status: LeadStatus;
  size?: 'sm' | 'md';
}

export const LeadStatusBadge: React.FC<LeadStatusBadgeProps> = ({ status, size = 'sm' }) => {
  const styles: Record<LeadStatus, string> = {
    New: 'bg-blue-50 text-blue-700 border-blue-200',
    Contacted: 'bg-amber-50 text-amber-700 border-amber-200',
    Interested: 'bg-purple-50 text-purple-700 border-purple-200',
    Converted: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold',
    'Not Interested': 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const dots: Record<LeadStatus, string> = {
    New: 'bg-blue-500',
    Contacted: 'bg-amber-500',
    Interested: 'bg-purple-500',
    Converted: 'bg-emerald-500',
    'Not Interested': 'bg-slate-400',
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-semibold border ${
        styles[status] || 'bg-slate-100 text-slate-700 border-slate-200'
      } ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || 'bg-slate-400'}`} />
      <span>{status}</span>
    </span>
  );
};

