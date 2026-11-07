import React from 'react';
import { Menu, RefreshCw, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onMenuToggle?: () => void;
  actions?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  onMenuToggle,
  actions,
}) => {
  const { isSuperAdmin, user } = useAuth();
  const { refreshData } = useData();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title area */}
        <div className="flex items-center gap-3">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {title}
            </h1>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        {/* Action Controls & Role Badge */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Authenticated Role Badge (Production-grade, non-switchable) */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            <Shield className="w-3.5 h-3.5 text-red-600" />
            <span className="text-[11px] font-bold text-slate-500 uppercase">Role:</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
              isSuperAdmin ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-900 text-white'
            }`}>
              {isSuperAdmin ? 'Super Admin' : 'Admissions Counselor'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => refreshData()}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
            title="Refresh database records"
            aria-label="Refresh data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {actions}
        </div>
      </div>
    </header>
  );
};
