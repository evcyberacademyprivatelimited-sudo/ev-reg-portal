import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { LeadTable } from '../../components/admin/LeadTable';
import { useData } from '../../context/DataContext';
import { Users, Download, Plus, Filter } from 'lucide-react';

export const AdminLeadsPage: React.FC = () => {
  const { toggleMenu } = useOutletContext<{ toggleMenu: () => void }>();
  const { exportLeadsCsv } = useData();

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-100">
      <AdminHeader
        title="Lead CRM &amp; Pipeline Command"
        subtitle="Manage inquiries, counselor assignments, status transitions, and direct candidate outreach."
        onMenuToggle={toggleMenu}
        actions={
          <button
            type="button"
            onClick={() => exportLeadsCsv()}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-red-400" />
            <span>Export CSV</span>
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
        <LeadTable />
      </div>
    </div>
  );
};
