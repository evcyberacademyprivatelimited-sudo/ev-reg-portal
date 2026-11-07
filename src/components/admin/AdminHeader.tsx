import React from 'react';
import { Menu, ShieldCheck, UserCheck, RefreshCw } from 'lucide-react';
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
  const { user, isSuperAdmin, switchMockRole } = useAuth();
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

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Mock Role Switcher for instant testing */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Role:</span>
            <button
              type="button"
              onClick={() => switchMockRole('super_admin')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                isSuperAdmin
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Super Admin
            </button>
            <button
              type="button"
              onClick={() => switchMockRole('staff')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                !isSuperAdmin
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Staff
            </button>
          </div>

          <button
            type="button"
            onClick={() => refreshData()}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
            title="Refresh database records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {actions}
        </div>
      </div>
    </header>
  );
};

