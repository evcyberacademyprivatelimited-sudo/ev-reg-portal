import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Eye,
  Search,
  Download,
  Calendar,
  Building,
  Clock,
  Trash2,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Lead } from '../../types';
import { LeadStatusBadge } from './LeadStatusBadge';
import { LeadDetailModal } from './LeadDetailModal';
import { DeleteAllLeadsModal } from './DeleteAllLeadsModal';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';

interface LeadTableProps {
  initialCourseFilter?: string;
}

export const LeadTable: React.FC<LeadTableProps> = ({ initialCourseFilter }) => {
  const {
    leads,
    courses,
    isLoadingLeads,
    leadsFetchError,
    fetchLeads,
    exportLeadsCsv,
    deleteAllLeads,
  } = useData();
  const { success, error: notifyError } = useNotification();

  // Ensure fresh leads are fetched from database on mount
  React.useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>(initialCourseFilter || 'all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDeleteAll = async () => {
    if (leads.length === 0) return;
    setIsDeleting(true);
    const res = await deleteAllLeads();
    setIsDeleting(false);
    setShowDeleteModal(false);

    if (res.success) {
      if (selectedLead) setSelectedLead(null);
      success(`All leads deleted successfully (${res.count || 0} removed).`);
    } else {
      notifyError('Failed to delete leads', res.error || 'Operation failed');
    }
  };

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = lead.full_name.toLowerCase().includes(q);
      const matchEmail = lead.email.toLowerCase().includes(q);
      const matchPhone = lead.phone.includes(q);
      const matchNumber = lead.lead_number.toLowerCase().includes(q);
      const matchCompany = lead.college_company.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchNumber && !matchCompany) {
        return false;
      }
    }

    // Status filter
    if (statusFilter !== 'all' && lead.status !== statusFilter) {
      return false;
    }

    // Course filter
    if (courseFilter !== 'all' && lead.course_id !== courseFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filters & Export Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search leads by name, email, phone, reference, organization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600"
          />
        </div>

        {/* Dropdowns & CSV */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Course filter */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white"
          >
            <option value="all">All Cohorts &amp; Programs</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white"
          >
            <option value="all">All Pipeline Stages</option>
            <option value="New">New Applications</option>
            <option value="Contacted">Contacted</option>
            <option value="Interested">Interested</option>
            <option value="Converted">Converted</option>
            <option value="Not Interested">Not Interested</option>
          </select>

          {/* CSV Export */}
          <button
            type="button"
            onClick={() => exportLeadsCsv({ courseId: courseFilter, status: statusFilter })}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-red-400" />
            <span>Export CSV</span>
          </button>

          {/* Delete All Leads */}
          <button
            type="button"
            disabled={leads.length === 0 || isDeleting}
            onClick={() => setShowDeleteModal(true)}
            className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed text-red-600 border border-red-200 text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Permanently delete all registered leads"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
            <span>Delete All</span>
          </button>
          {/* Refresh Leads from DB */}
          <button
            type="button"
            onClick={() => fetchLeads()}
            disabled={isLoadingLeads}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
            title="Refresh leads from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLeads ? 'animate-spin text-red-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Database Error Banner */}
      {leadsFetchError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Database Connection Error: {leadsFetchError}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchLeads()}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Lead Ref</th>
                <th className="py-3 px-4">Candidate Details</th>
                <th className="py-3 px-4">Selected Program</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4">Pipeline Status</th>
                <th className="py-3 px-4">Counselor</th>
                <th className="py-3 px-4">Follow-Up Date</th>
                <th className="py-3 px-4">Registered</th>
                <th className="py-3 px-4 text-right">Instant Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => {
                  const crs = courses.find((c) => c.id === lead.course_id);
                  const cleanPhone = lead.phone.replace(/[^0-9+]/g, '');
                  const whatsappUrl = `https://wa.me/${cleanPhone.replace(
                    /^\+/,
                    ''
                  )}?text=Hi%20${encodeURIComponent(
                    lead.full_name
                  )},%20greetings%20from%20EV%20Cyber%20Academy.`;

                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Ref */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {lead.lead_number}
                      </td>

                      {/* Candidate info */}
                      <td className="py-3.5 px-4 min-w-[200px]">
                        <button
                          type="button"
                          onClick={() => setSelectedLead(lead)}
                          className="font-bold text-slate-900 hover:text-red-600 text-left block"
                        >
                          {lead.full_name}
                        </button>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <span>{lead.email}</span>
                          <span>&bull;</span>
                          <span>{lead.phone}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{lead.college_company}</span>
                        </div>
                      </td>

                      {/* Course */}
                      <td className="py-3.5 px-4 max-w-[220px]">
                        <span className="font-semibold text-slate-900 line-clamp-1">
                          {crs?.title || lead.course_title}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Fee: ₹{crs?.fee_amount.toLocaleString('en-IN') || '49,999'}
                        </span>
                      </td>

                      {/* Experience */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                          {lead.experience_level}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <LeadStatusBadge status={lead.status} />
                      </td>

                      {/* Counselor */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 text-[11px]">
                        {lead.assigned_staff_name || 'Unassigned'}
                      </td>

                      {/* Follow-up date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-[11px]">
                        {lead.next_follow_up_date ? (
                          <span className="flex items-center gap-1 text-slate-700 font-medium">
                            <Clock className="w-3 h-3 text-red-500" />
                            <span>{new Date(lead.next_follow_up_date).toLocaleDateString()}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">Not set</span>
                        )}
                      </td>

                      {/* Registration Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-slate-400">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Call */}
                          <a
                            href={`tel:${cleanPhone}`}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition"
                            title="Direct Call"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          </a>

                          {/* WhatsApp */}
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          </a>

                          {/* View details */}
                          <button
                            type="button"
                            onClick={() => setSelectedLead(lead)}
                            className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Details</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                isLoadingLeads ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500 font-normal">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-red-600 mb-2" />
                      <span>Retrieving live leads from database...</span>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400 font-normal">
                      No leads found matching your criteria.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Showing {filteredLeads.length} of {leads.length} recorded leads</span>
          <span className="text-[11px] text-slate-400">Authenticated staff access protected by Supabase RLS</span>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}

      {/* Delete All Leads Modal */}
      <DeleteAllLeadsModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDeleteAll}
        totalLeads={leads.length}
        isDeleting={isDeleting}
      />
    </div>
  );
};
