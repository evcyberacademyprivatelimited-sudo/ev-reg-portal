import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageCircle,
  Mail,
  User,
  Building,
  GraduationCap,
  Calendar,
  Send,
  UserCheck,
  Tag,
  History,
  FileText,
  Trash2,
} from 'lucide-react';
import { Lead, LeadStatus } from '../../types';
import { LeadStatusBadge } from './LeadStatusBadge';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, onClose }) => {
  const {
    courses,
    updateLeadStatus,
    updateLeadFollowUp,
    assignLead,
    getLeadNotes,
    addLeadNote,
    getLeadHistory,
    deleteLead,
  } = useData();

  const { staffList, isSuperAdmin } = useAuth();
  const { success, error: notifyError } = useNotification();

  const [currentStatus, setCurrentStatus] = useState<LeadStatus>(lead.status);
  const [statusNote, setStatusNote] = useState('');
  const [followUpDate, setFollowUpDate] = useState(lead.next_follow_up_date || '');
  const [assignedStaffId, setAssignedStaffId] = useState<string>(lead.assigned_to || '');
  const [newNote, setNewNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'history' | 'tracking'>('notes');

  const course = courses.find((c) => c.id === lead.course_id);
  const notes = getLeadNotes(lead.id);
  const history = getLeadHistory(lead.id);

  // Clean phone for WhatsApp & Call
  const cleanPhone = lead.phone.replace(/[^0-9+]/g, '');
  const whatsappNumber = cleanPhone.replace(/^\+/, '');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi%20${encodeURIComponent(
    lead.full_name
  )},%20greetings%20from%20EV%20Cyber%20Academy.%20I%20am%20reaching%20out%20regarding%20your%20application%20for%20the%20${encodeURIComponent(
    course?.title || lead.course_title || 'Cybersecurity'
  )}%20cohort.`;

  const handleStatusUpdate = async () => {
    if (currentStatus === lead.status) return;
    setIsUpdatingStatus(true);
    const res = await updateLeadStatus(lead.id, currentStatus, statusNote);
    setIsUpdatingStatus(false);
    if (res.success) {
      success('Lead status updated to ' + currentStatus);
      setStatusNote('');
    } else {
      notifyError('Failed to update status', res.error);
    }
  };

  const handleFollowUpChange = async (dateVal: string) => {
    setFollowUpDate(dateVal);
    const res = await updateLeadFollowUp(lead.id, dateVal);
    if (res.success) {
      success('Follow-up date scheduled.');
    } else {
      notifyError('Failed to update follow-up date', res.error);
    }
  };

  const handleAssignmentChange = async (newStaffId: string) => {
    setAssignedStaffId(newStaffId);
    const res = await assignLead(lead.id, newStaffId);
    if (res.success) {
      success('Counselor assigned successfully.');
    } else {
      notifyError('Failed to assign counselor', res.error);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setIsAddingNote(true);
    const res = await addLeadNote(lead.id, newNote);
    setIsAddingNote(false);
    if (res.success) {
      setNewNote('');
      success('Internal counselor note recorded.');
    } else {
      notifyError('Failed to add note', res.error);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete lead ${lead.lead_number}?`)) {
      return;
    }
    const res = await deleteLead(lead.id);
    if (res.success) {
      success('Lead deleted.');
      onClose();
    } else {
      notifyError('Delete failed', res.error);
    }
  };

  const statuses: LeadStatus[] = ['New', 'Contacted', 'Interested', 'Converted', 'Not Interested'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        {/* Modal Top Header */}
        <div className="bg-slate-950 text-white p-6 flex items-start justify-between gap-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-black text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/30">
                {lead.lead_number}
              </span>
              <LeadStatusBadge status={lead.status} size="md" />
              <span className="text-xs text-slate-400">
                Registered {new Date(lead.created_at).toLocaleString()}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">{lead.full_name}</h2>
            <p className="text-xs text-red-400 font-semibold mt-0.5">
              {course?.title || lead.course_title}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Contact Bar */}
        <div className="bg-slate-100 p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Direct Phone Call */}
            <a
              href={`tel:${cleanPhone}`}
              className="px-3.5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Call ({lead.phone})</span>
            </a>

            {/* Direct WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Counselor Chat</span>
            </a>

            {/* Direct Email */}
            <a
              href={`mailto:${lead.email}?subject=EV%20Cyber%20Academy%20Admissions%20-%20Application%20Follow-up`}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>Send Email</span>
            </a>
          </div>

          {/* Super Admin Delete */}
          {isSuperAdmin && (
            <button
              onClick={handleDelete}
              className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 p-2 rounded-lg hover:bg-red-50 transition"
              title="Delete lead record"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Lead</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Lead Info & Pipeline Controls */}
          <div className="md:col-span-5 space-y-5">
            {/* Candidate Details Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Candidate Profile
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold">{lead.full_name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lead.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lead.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lead.college_company}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-900">{lead.experience_level}</span>
                </div>
              </div>
            </div>

            {/* Pipeline Stage Management */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Pipeline Stage Control
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">Current Status:</label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value as LeadStatus)}
                  className="w-full text-xs font-bold p-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>

                {currentStatus !== lead.status && (
                  <div className="space-y-2 pt-1">
                    <input
                      type="text"
                      placeholder="Optional status transition note..."
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    />
                    <button
                      type="button"
                      onClick={handleStatusUpdate}
                      disabled={isUpdatingStatus}
                      className="w-full py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition"
                    >
                      {isUpdatingStatus ? 'Saving...' : 'Confirm Status Change'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Scheduled Follow-Up Date */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-red-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Scheduled Follow-Up Date
                </h3>
              </div>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => handleFollowUpChange(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-300 bg-white"
              />
            </div>

            {/* Staff Counselor Assignment */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-red-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Assigned Counselor
                </h3>
              </div>

              <select
                value={assignedStaffId}
                onChange={(e) => handleAssignmentChange(e.target.value)}
                className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="">-- Unassigned --</option>
                {staffList.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.full_name} ({st.role === 'super_admin' ? 'Admin' : 'Counselor'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Column: Tabbed Notes, History, and Tracking */}
          <div className="md:col-span-7 flex flex-col space-y-4">
            {/* Tabs */}
            <div className="flex items-center border-b border-slate-200 gap-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('notes')}
                className={`pb-2.5 flex items-center gap-1.5 transition ${
                  activeTab === 'notes'
                    ? 'border-b-2 border-red-600 text-red-600'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Counselor Notes ({notes.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`pb-2.5 flex items-center gap-1.5 transition ${
                  activeTab === 'history'
                    ? 'border-b-2 border-red-600 text-red-600'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Status &amp; Audit Trail ({history.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tracking')}
                className={`pb-2.5 flex items-center gap-1.5 transition ${
                  activeTab === 'tracking'
                    ? 'border-b-2 border-red-600 text-red-600'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Campaign &amp; UTM</span>
              </button>
            </div>

            {/* Tab: Internal Notes */}
            {activeTab === 'notes' && (
              <div className="flex-1 flex flex-col space-y-4">
                {/* Add Note Box */}
                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    rows={3}
                    placeholder="Record notes on candidate call, syllabus shared, lab readiness..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/20"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isAddingNote || !newNote.trim()}
                      className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-40"
                    >
                      <Send className="w-3 h-3" />
                      <span>{isAddingNote ? 'Saving...' : 'Add Note'}</span>
                    </button>
                  </div>
                </form>

                {/* Notes List */}
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {notes.length > 0 ? (
                    notes.map((n) => (
                      <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                          <span className="text-red-600 font-bold">{n.author_name}</span>
                          <span className="text-slate-400 font-normal">
                            {new Date(n.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{n.note}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic text-center py-6">
                      No counselor notes added yet.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Tab: History */}
            {activeTab === 'history' && (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {history.length > 0 ? (
                  history.map((h) => (
                    <div key={h.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between text-slate-700 mb-1">
                        <span className="font-bold">
                          Status &rarr; <span className="text-red-600">{h.new_status}</span>
                        </span>
                        <span className="text-slate-400">
                          {new Date(h.created_at).toLocaleString()}
                        </span>
                      </div>
                      {h.changed_by_name && (
                        <p className="text-slate-500 text-[11px]">Changed by: {h.changed_by_name}</p>
                      )}
                      {h.note && <p className="text-slate-700 mt-1 italic">&ldquo;{h.note}&rdquo;</p>}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-6">
                    No status history recorded.
                  </p>
                )}
              </div>
            )}

            {/* Tab: UTM / Tracking */}
            {activeTab === 'tracking' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <h4 className="font-bold text-slate-900">Campaign Attribution Data</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">UTM Source</span>
                    <span className="font-semibold text-slate-800">{lead.utm_source || 'direct'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">UTM Medium</span>
                    <span className="font-semibold text-slate-800">{lead.utm_medium || 'organic'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">UTM Campaign</span>
                    <span className="font-semibold text-slate-800">{lead.utm_campaign || 'none'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Referral Source</span>
                    <span className="font-semibold text-slate-800">{lead.referral_source || 'website'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
