import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import {
  Users,
  BookOpen,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar: React.FC<{ onCloseMobile?: () => void }> = ({ onCloseMobile }) => {
  const { user, isSuperAdmin, signOut } = useAuth();

  const navItems = [
    { label: 'Applications', path: '/admin', icon: Users, exact: true },
    { label: 'Courses', path: '/admin/courses', icon: BookOpen },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-white flex flex-col h-full border-r border-slate-800 shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-2">
          <Logo variant="light" size="sm" />
        </Link>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1 font-semibold text-red-500">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Panel</span>
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] uppercase font-bold text-slate-300">
            {isSuperAdmin ? 'Super Admin' : 'Admin'}
          </span>
        </div>
      </div>

      {/* Simple Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="min-w-0">
            <p className="font-bold text-white truncate text-xs">{user?.full_name || 'Administrator'}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1 border-t border-slate-900">
          <Link
            to="/"
            target="_blank"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Website</span>
          </Link>

          <button
            type="button"
            onClick={() => signOut()}
            className="flex items-center justify-center p-2 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-950/40 transition cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
