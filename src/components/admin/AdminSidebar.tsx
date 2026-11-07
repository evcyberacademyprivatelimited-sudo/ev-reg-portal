import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Video,
  BarChart3,
  Sliders,
  Settings,
  Shield,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar: React.FC<{ onCloseMobile?: () => void }> = ({ onCloseMobile }) => {
  const { user, isSuperAdmin, signOut } = useAuth();

  const navItems = [
    { label: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Lead CRM & Pipeline', path: '/admin/leads', icon: Users },
    { label: 'Course Management', path: '/admin/courses', icon: BookOpen },
    { label: 'YouTube Videos', path: '/admin/videos', icon: Video },
    { label: 'Conversion Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Content & CMS', path: '/admin/content', icon: Sliders },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
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
            <Shield className="w-3.5 h-3.5" />
            <span>Admin &amp; CRM Console</span>
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] uppercase font-bold text-slate-300">
            {isSuperAdmin ? 'Super Admin' : 'Counselor Staff'}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
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
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User profile & quick links footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/60 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold text-xs">
            {user?.full_name ? user.full_name[0] : 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{user?.full_name || 'Staff User'}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white flex items-center gap-1 transition"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <button
            onClick={() => signOut()}
            className="text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold transition cursor-pointer"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

