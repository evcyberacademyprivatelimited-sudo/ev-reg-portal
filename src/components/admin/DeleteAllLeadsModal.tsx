import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, Loader2, ShieldAlert } from 'lucide-react';

interface DeleteAllLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  totalLeads: number;
  isDeleting: boolean;
}

export const DeleteAllLeadsModal: React.FC<DeleteAllLeadsModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  totalLeads,
  isDeleting,
}) => {
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!confirmed || isDeleting) return;
    await onConfirm();
    setConfirmed(false);
  };

  const handleClose = () => {
    if (isDeleting) return;
    setConfirmed(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-red-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>Delete All Leads</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 font-mono">
                  {totalLeads} record{totalLeads === 1 ? '' : 's'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Permanent Database Cleanup Action
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isDeleting}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Body */}
        <div className="space-y-3 relative z-10">
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800/50 text-xs text-red-200/90 space-y-2">
            <div className="flex items-center gap-2 font-bold text-red-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Critical Warning</span>
            </div>
            <p className="leading-relaxed">
              You are about to delete <strong className="text-white font-mono">{totalLeads}</strong> registered student lead(s) along with all counselor notes, follow-up timelines, and intake activity logs.
            </p>
            <p className="text-[11px] text-red-300/70">
              This action cannot be undone. Leads will be permanently removed from both Supabase and the Admin CRM.
            </p>
          </div>

          {/* Confirmation Checkbox */}
          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition cursor-pointer select-none">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              disabled={isDeleting}
              className="mt-0.5 w-4 h-4 rounded text-red-600 focus:ring-red-500 bg-slate-900 border-slate-700 cursor-pointer"
            />
            <span className="text-xs text-slate-300 font-medium leading-tight">
              I understand this action is permanent and cannot be undone. Delete all lead records now.
            </span>
          </label>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800 relative z-10">
          <button
            type="button"
            onClick={handleClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition disabled:opacity-40 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!confirmed || isDeleting || totalLeads === 0}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-red-950 disabled:text-red-400/40 text-white text-xs font-black tracking-wide transition flex items-center gap-2 shadow-lg shadow-red-600/20 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Deleting Leads...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 text-white" />
                <span>Permanently Delete All Leads</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

