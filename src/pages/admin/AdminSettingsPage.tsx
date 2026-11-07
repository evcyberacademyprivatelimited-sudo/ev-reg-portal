import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import {
  Settings,
  ShieldCheck,
  Users,
  Database,
  Save,
  CheckCircle2,
  AlertTriangle,
  Lock,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { toggleMenu } = useOutletContext<{ toggleMenu: () => void }>();
  const { siteSettings, updateSiteSettings } = useData();
  const { staffList, isSuperAdmin, user } = useAuth();
  const { success } = useNotification();

  const [contactForm, setContactForm] = useState({
    contact_phone: siteSettings.contact_phone,
    contact_email: siteSettings.contact_email,
    contact_whatsapp: siteSettings.contact_whatsapp,
    counseling_hours: siteSettings.counseling_hours,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSiteSettings(contactForm);
    setIsSaving(false);
    success('Admissions contact settings updated.');
  };

  const isConnected = isSupabaseConfigured();

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-100">
      <AdminHeader
        title="Settings &amp; Access Controls"
        subtitle="Manage official academy contact details, database connections, and staff role permissions."
        onMenuToggle={toggleMenu}
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 max-w-5xl">
        {/* Database & Supabase Status Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <Database className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Supabase PostgreSQL Engine Status
                </h3>
                <p className="text-xs text-slate-500">Live database and authentication provider</p>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                isConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {isConnected ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Connected (Live Supabase DB)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Offline / Embedded Demo DB (Zero Setup Needed)</span>
                </>
              )}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-2">
            <p>
              To connect your live Supabase cloud project, set <code className="font-mono text-red-600">VITE_SUPABASE_URL</code> and <code className="font-mono text-red-600">VITE_SUPABASE_ANON_KEY</code> in your environment variables or <code className="font-mono">.env</code> file.
            </p>
            <p>
              Schema migrations and seed scripts are pre-built in <code className="font-mono">supabase/migrations/20261107000000_init_schema.sql</code> with full Row Level Security (RLS) policies.
            </p>
          </div>
        </div>

        {/* Admissions Contact Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Official Admissions Contact Desk</h3>
              <p className="text-xs text-slate-500">
                Shown across header, sticky bar, WhatsApp triggers, and footer
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveContact} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Admissions Helpline Phone
              </label>
              <input
                type="text"
                value={contactForm.contact_phone}
                onChange={(e) =>
                  setContactForm({ ...contactForm, contact_phone: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Admissions Email
              </label>
              <input
                type="email"
                value={contactForm.contact_email}
                onChange={(e) =>
                  setContactForm({ ...contactForm, contact_email: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Admissions WhatsApp Number (with country code)
              </label>
              <input
                type="text"
                value={contactForm.contact_whatsapp}
                onChange={(e) =>
                  setContactForm({ ...contactForm, contact_whatsapp: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Counseling Desk Hours
              </label>
              <input
                type="text"
                value={contactForm.counseling_hours}
                onChange={(e) =>
                  setContactForm({ ...contactForm, counseling_hours: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div className="sm:col-span-2 pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Desk Settings'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Staff Permissions & RBAC Directory */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Staff Directory &amp; Role-Based Access Control (RBAC)
              </h3>
              <p className="text-xs text-slate-500">
                Super Admin controls staff permissions; Staff access is scoped to assigned leads and actions
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Access Role</th>
                  <th className="py-3 px-4">Permissions Scope</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {staffList.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">
                        {member.full_name[0]}
                      </div>
                      <span>{member.full_name}</span>
                    </td>
                    <td className="py-3.5 px-4">{member.email}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          member.role === 'super_admin'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {member.role === 'super_admin' ? 'Super Admin' : 'Academic Counselor'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {member.role === 'super_admin'
                        ? 'Full System Authority (Manage Courses, Delete Leads, Configure CMS)'
                        : 'Lead Triage, Notes & Status Progression for Assigned Inquiries'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

