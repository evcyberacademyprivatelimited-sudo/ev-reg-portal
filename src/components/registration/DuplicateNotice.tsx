import React from 'react';
import { AlertCircle, PhoneCall, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Lead } from '../../types';

interface DuplicateNoticeProps {
  existingLead?: Lead;
  onContinueAnyway?: () => void;
}

export const DuplicateNotice: React.FC<DuplicateNoticeProps> = ({ existingLead }) => {
  return (
    <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-200/60 text-amber-800 shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-amber-950">Application Already Registered</h3>
          <p className="text-xs text-amber-800 mt-1 leading-relaxed">
            We already have an active admissions request on file for this email address. Your seat reservation is queued under reference number:
          </p>
          <div className="mt-2 inline-block px-3 py-1 bg-amber-200/80 rounded-md font-mono text-sm font-bold text-amber-950">
            {existingLead?.lead_number || 'EV-ACTIVE'}
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-amber-800">
          Status: <strong>{existingLead?.status || 'Review in progress'}</strong>
        </span>

        <a
          href="https://wa.me/919876543210?text=Hi,%20I%20have%20an%20existing%20application%20with%20EV%20Cyber%20Academy."
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold flex items-center gap-1.5 hover:bg-emerald-700 transition"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Priority Counselor WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

