import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { LeadTable } from '../../components/admin/LeadTable';
import {
  Users,
  TrendingUp,
  Award,
  Video,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  PhoneCall,
  Download,
} from 'lucide-react';
import { LeadStatus } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const { toggleMenu } = useOutletContext<{ toggleMenu: () => void }>();
  const { leads, courses, videos, exportLeadsCsv } = useData();
  const { isSuperAdmin, user } = useAuth();

  // Metrics calculation
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'New').length;
  const inProgressLeads = leads.filter(
    (l) => l.status === 'Contacted' || l.status === 'Interested'
  ).length;
  const convertedLeads = leads.filter((l) => l.status === 'Converted').length;

  const publishedCourses = courses.filter((c) => c.status === 'published').length;
  const activeVideos = videos.filter((v) => v.is_active).length;

  // Pipeline conversion rate
  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

  // Estimate pipeline fee value
  const totalPipelineValue = leads.reduce((acc, lead) => {
    const crs = courses.find((c) => c.id === lead.course_id);
    return acc + (crs?.fee_amount || 49999);
  }, 0);

  const convertedValue = leads
    .filter((l) => l.status === 'Converted')
    .reduce((acc, lead) => {
      const crs = courses.find((c) => c.id === lead.course_id);
      return acc + (crs?.fee_amount || 49999);
    }, 0);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-100">
      <AdminHeader
        title="Operations &amp; Lead Command"
        subtitle={`Welcome back, ${user?.full_name}. Real-time admissions and pipeline triage.`}
        onMenuToggle={toggleMenu}
        actions={
          <button
            type="button"
            onClick={() => exportLeadsCsv()}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-red-400" />
            <span>Export All Leads</span>
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8">
        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Total Applications */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Registrations
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{totalLeads}</h3>
              <p className="text-xs text-blue-600 font-semibold mt-1">
                {newLeads} awaiting initial contact
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Active Counseling Pipeline */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                In Counseling Review
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{inProgressLeads}</h3>
              <p className="text-xs text-amber-600 font-semibold mt-1">
                Contacted &amp; Interested
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* Converted Admissions */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Enrolled / Converted
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{convertedLeads}</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-1">
                {conversionRate}% Lead Conversion
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          {/* Pipeline Enrolled Value */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Cohort Value (INR)
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                ₹{convertedValue.toLocaleString('en-IN')}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Pipeline: ₹{totalPipelineValue.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Pipeline Stage Bar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Admissions Pipeline Stages
              </h3>
              <p className="text-xs text-slate-500">Live lead distribution across counseling stages</p>
            </div>
            <Link
              to="/admin/leads"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <span>Manage In CRM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'New', count: leads.filter((l) => l.status === 'New').length, color: 'bg-blue-500 text-blue-700 bg-blue-50' },
              { label: 'Contacted', count: leads.filter((l) => l.status === 'Contacted').length, color: 'bg-amber-500 text-amber-700 bg-amber-50' },
              { label: 'Interested', count: leads.filter((l) => l.status === 'Interested').length, color: 'bg-purple-500 text-purple-700 bg-purple-50' },
              { label: 'Converted', count: leads.filter((l) => l.status === 'Converted').length, color: 'bg-emerald-500 text-emerald-700 bg-emerald-50' },
              { label: 'Not Interested', count: leads.filter((l) => l.status === 'Not Interested').length, color: 'bg-slate-400 text-slate-600 bg-slate-50' },
            ].map((st) => (
              <div key={st.label} className={`p-4 rounded-2xl border border-slate-200/70 ${st.color.split(' ')[2]}`}>
                <span className="text-xs font-bold block text-slate-700">{st.label}</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{st.count}</span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {totalLeads > 0 ? Math.round((st.count / totalLeads) * 100) : 0}% of intake
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Leads Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Recent Lead Submissions
              </h3>
              <p className="text-xs text-slate-500">
                Direct WhatsApp and Call actions enabled. Auto-records counselor notes and status transitions.
              </p>
            </div>
            <Link
              to="/admin/leads"
              className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition flex items-center gap-1.5"
            >
              <span>Open Full CRM Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <LeadTable />
        </div>
      </div>
    </div>
  );
};

