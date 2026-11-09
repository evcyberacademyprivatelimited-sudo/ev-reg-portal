import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { LeadTable } from '../../components/admin/LeadTable';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import { DeleteAllLeadsModal } from '../../components/admin/DeleteAllLeadsModal';
import { Download, Trash2 } from 'lucide-react';

export const AdminLeadsPage: React.FC = () => {
  const { toggleMenu } = useOutletContext<{ toggleMenu: () => void }>();
  const { leads, exportLeadsCsv, deleteAllLeads, fetchLeads } = useData();
  const { success, error: notifyError } = useNotification();

  // Ensure fresh leads are fetched from database on mount
  React.useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDeleteAll = async () => {
    if (leads.length === 0) return;
    setIsDeleting(true);
    const res = await deleteAllLeads();
    setIsDeleting(false);
    setShowDeleteModal(false);

    if (res.success) {
      success(`All leads deleted successfully (${res.count || 0} removed).`);
    } else {
      notifyError('Failed to delete leads', res.error || 'Operation failed');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-100">
      <AdminHeader
        title="Lead CRM &amp; Pipeline Command"
        subtitle="Manage inquiries, counselor assignments, status transitions, and direct candidate outreach."
        onMenuToggle={toggleMenu}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={leads.length === 0 || isDeleting}
              onClick={() => setShowDeleteModal(true)}
              className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed text-red-600 border border-red-200 text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Permanently delete all registered leads"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              <span>Delete All Leads</span>
            </button>
            <button
              type="button"
              onClick={() => exportLeadsCsv()}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-red-400" />
              <span>Export CSV</span>
            </button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
        <LeadTable />
      </div>

      {/* Delete All Confirmation Modal */}
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
