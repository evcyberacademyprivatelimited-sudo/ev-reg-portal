import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import { Lead, LeadStatus } from '../../types';
import {
  Users,
  UserCheck,
  BookOpen,
  Search,
  Download,
  Phone,
  MessageCircle,
  Mail,
  Trash2,
  Calendar,
  X,
  FileText,
  Plus,
  AlertCircle,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { toggleMenu } = useOutletContext<{ toggleMenu: () => void }>();
  const {
    leads,
    courses,
    updateLeadStatus,
    addLeadNote,
    getLeadNotes,
    deleteLead,
    exportLeadsCsv,
  } = useData();
  const { success, error: notifyError } = useNotification();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeLeadForModal, setActiveLeadForModal] = useState<Lead | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  // 1. KPI Counts
  const totalApplications = leads.length;
  const newApplications = leads.filter((l) => l.status === 'New').length;
  const totalCourses = courses.length;

  // 2. Filter & Search
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.course_title || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' ? true : lead.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Handle status update
  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    const res = await updateLeadStatus(leadId, newStatus);
    if (res.success) {
      success(`Status updated to ${newStatus}.`);
    } else {
      notifyError('Failed to update status', res.error);
    }
  };

  // Handle Delete
  const handleDeleteLead = async (lead: Lead) => {
    if (!confirm(`Are you sure you want to delete the application for ${lead.full_name}?`)) {
      return;
    }
    const res = await deleteLead(lead.id);
    if (res.success) {
      if (activeLeadForModal?.id === lead.id) {
        setActiveLeadForModal(null);
      }
      success('Application deleted.');
    } else {
      notifyError('Delete failed', res.error);
    }
  };

  // Handle Adding Internal Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLeadForModal || !newNoteText.trim()) return;

    setIsSavingNote(true);
    const res = await addLeadNote(activeLeadForModal.id, newNoteText.trim());
    setIsSavingNote(false);

    if (res.success) {
      setNewNoteText('');
      success('Internal note added.');
    } else {
      notifyError('Failed to save note', res.error);
    }
  };

  // Helper for status badge colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Contacted':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Interested':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Converted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Not Interested':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const activeNotes = activeLeadForModal ? getLeadNotes(activeLeadForModal.id) : [];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-100">
      {/* Top Header */}
      <AdminHeader
        title="Course Applications"
        subtitle="Manage student registrations for EV Cyber Academy Private Limited."
        onMenuToggle={toggleMenu}
        actions={
          <button
            type="button"
            onClick={() => exportLeadsCsv()}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4 text-red-400" />
            <span>Export CSV</span>
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* =========================================================================
            1. 3 TOP KPI CARDS
        ========================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Total Applications */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Applications
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">
                {totalApplications}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">All registered students</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: New Applications */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                New Applications
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">
                {newApplications}
              </h3>
              <p className="text-xs text-blue-600 font-semibold mt-0.5">
                Awaiting contact
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Total Courses */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Courses
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">
                {totalCourses}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Programs in academy</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. APPLICATIONS SEARCH & TABLE
        ========================================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-4 sm:p-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by student name, email, or number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
              {['all', 'New', 'Contacted', 'Interested', 'Converted', 'Not Interested'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition shrink-0 cursor-pointer ${
                    selectedStatus === status
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status === 'all' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>

          {/* Applications Table */}
          <div className="overflow-x-auto">
            {filteredLeads.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <Users className="w-10 h-10 mx-auto text-slate-300" />
                <p className="font-bold text-slate-700 text-sm">No applications found</p>
                <p className="text-xs">
                  {searchTerm ? 'Try a different search keyword.' : 'Applications submitted by students will appear here.'}
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Contact Number</th>
                    <th className="py-3 px-4">Selected Course</th>
                    <th className="py-3 px-4">Application Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredLeads.map((lead) => {
                    const matchedCourse = courses.find((c) => c.id === lead.course_id);
                    const courseName = matchedCourse?.title || lead.course_title || 'General Application';
                    const rawPhone = lead.phone.replace(/[^0-9]/g, '');

                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/80 transition">
                        {/* 1. Student Name */}
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <div>
                            <span>{lead.full_name}</span>
                            <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                              {lead.lead_number}
                            </span>
                          </div>
                        </td>

                        {/* 2. Email */}
                        <td className="py-3.5 px-4">
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-slate-600 hover:text-red-600 flex items-center gap-1.5 transition"
                          >
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{lead.email}</span>
                          </a>
                        </td>

                        {/* 3. Contact Number */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${lead.phone}`}
                              className="text-slate-800 font-semibold hover:text-red-600 flex items-center gap-1"
                              title="Call"
                            >
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{lead.phone}</span>
                            </a>

                            {rawPhone && (
                              <a
                                href={`https://wa.me/${rawPhone}?text=Hello%20${encodeURIComponent(lead.full_name)},%20this%20is%20EV%20Cyber%20Academy%20Private%20Limited%20regarding%20your%20course%20application.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </td>

                        {/* 4. Selected Course */}
                        <td className="py-3.5 px-4">
                          <span className="inline-block max-w-[200px] truncate font-semibold text-slate-900" title={courseName}>
                            {courseName}
                          </span>
                        </td>

                        {/* 5. Application Date */}
                        <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                          {new Date(lead.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>

                        {/* 6. Application Status Dropdown */}
                        <td className="py-3.5 px-4">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none cursor-pointer ${getStatusBadge(
                              lead.status
                            )}`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Interested">Interested</option>
                            <option value="Converted">Enrolled</option>
                            <option value="Not Interested">Closed</option>
                          </select>
                        </td>

                        {/* 7. Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setActiveLeadForModal(lead)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                              title="View & Add Notes"
                            >
                              <FileText className="w-3.5 h-3.5 text-slate-500" />
                              <span>Notes</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteLead(lead)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                              title="Delete Application"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. APPLICATION DETAILS & INTERNAL NOTES MODAL
      ========================================================================== */}
      {activeLeadForModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
        >
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-red-400 uppercase">
                  {activeLeadForModal.lead_number}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {activeLeadForModal.full_name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveLeadForModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              {/* Application Details Summary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-semibold">Course:</span>
                  <span className="font-bold text-slate-900">
                    {courses.find((c) => c.id === activeLeadForModal.course_id)?.title ||
                      activeLeadForModal.course_title}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-semibold">Email:</span>
                  <span className="font-mono text-slate-800">{activeLeadForModal.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-semibold">Contact:</span>
                  <span className="font-semibold text-slate-800">{activeLeadForModal.phone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-semibold">Registered On:</span>
                  <span className="text-slate-700">
                    {new Date(activeLeadForModal.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 font-semibold">Status:</span>
                  <select
                    value={activeLeadForModal.status}
                    onChange={(e) => {
                      const newSt = e.target.value as LeadStatus;
                      handleStatusChange(activeLeadForModal.id, newSt);
                      setActiveLeadForModal({ ...activeLeadForModal, status: newSt });
                    }}
                    className={`px-2 py-0.5 rounded text-xs font-bold border ${getStatusBadge(
                      activeLeadForModal.status
                    )}`}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                    <option value="Converted">Enrolled</option>
                    <option value="Not Interested">Closed</option>
                  </select>
                </div>
              </div>

              {/* Internal Notes Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-700">
                  <FileText className="w-4 h-4 text-red-600" />
                  <span>Internal Notes</span>
                </div>

                {/* Notes List */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {activeNotes.length === 0 ? (
                    <p className="text-slate-400 italic py-2">No internal notes added yet.</p>
                  ) : (
                    activeNotes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1"
                      >
                        <p className="text-slate-800 text-xs leading-relaxed">{note.note}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <span>{note.author_name}</span>
                          <span>{new Date(note.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="space-y-2 pt-2">
                  <textarea
                    rows={2}
                    placeholder="Add an internal follow-up note..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteLead(activeLeadForModal)}
                      className="text-red-600 hover:text-red-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Application</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSavingNote || !newNoteText.trim()}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isSavingNote ? 'Saving...' : 'Add Note'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
