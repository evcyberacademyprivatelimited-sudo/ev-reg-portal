import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { CourseEditorModal } from '../../components/admin/CourseEditorModal';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Course } from '../../types';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Calendar,
  Shield,
  Layers,
} from 'lucide-react';

export const AdminCoursesPage: React.FC = () => {
  const { toggleMenu } = useOutletContext<{ toggleMenu: () => void }>();
  const { courses, saveCourse, deleteCourse } = useData();
  const { isSuperAdmin } = useAuth();
  const { success, error: notifyError } = useNotification();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const handleCreate = () => {
    setEditingCourse(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsEditorOpen(true);
  };

  const handleToggleStatus = async (course: Course) => {
    const nextStatus = course.status === 'published' ? 'draft' : 'published';
    const res = await saveCourse({ id: course.id, status: nextStatus });
    if (res.success) {
      success(`Course ${nextStatus === 'published' ? 'published' : 'moved to draft'}.`);
    } else {
      notifyError('Failed to change status', res.error);
    }
  };

  const handleDelete = async (course: Course) => {
    if (!isSuperAdmin) {
      notifyError('Super Admin permission required to delete courses.');
      return;
    }
    if (!confirm(`Are you sure you want to delete ${course.title}?`)) {
      return;
    }
    const res = await deleteCourse(course.id);
    if (res.success) {
      success('Course deleted.');
    } else {
      notifyError('Failed to delete course', res.error);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-100">
      <AdminHeader
        title="Course Management"
        subtitle="Manage cybersecurity cohort programs, syllabus modules, pricing, and live publication status."
        onMenuToggle={toggleMenu}
        actions={
          <button
            type="button"
            onClick={handleCreate}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Cohort Program</span>
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
        {/* Courses Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Program Title</th>
                  <th className="py-3.5 px-4">Level</th>
                  <th className="py-3.5 px-4">Duration &amp; Pricing</th>
                  <th className="py-3.5 px-4">Seats Left</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 min-w-[260px]">
                      <div className="flex items-center gap-2">
                        {course.featured && (
                          <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" title="Featured Course" />
                        )}
                        <h4 className="font-bold text-slate-900 text-sm hover:text-red-600">
                          {course.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{course.tagline}</p>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">/courses/{course.slug}</div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {course.level}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">
                        ₹{course.fee_amount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {course.duration_weeks} Weeks &bull; {course.hours_per_week}h/week
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-800">{course.seats_remaining ?? 15}</span>
                      <span className="text-[11px] text-slate-400 block">
                        Batch: {course.batch_start_date ? new Date(course.batch_start_date).toLocaleDateString() : 'Rolling'}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(course)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition ${
                          course.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                        title="Click to toggle publication"
                      >
                        {course.status === 'published' ? '● Published' : '○ Draft'}
                      </button>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/courses/${course.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                          title="View Live Landing Page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleEdit(course)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-black text-white transition cursor-pointer"
                          title="Edit Course & Syllabus"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {isSuperAdmin && (
                          <button
                            type="button"
                            onClick={() => handleDelete(course)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                            title="Delete Course"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
        <CourseEditorModal
          course={editingCourse}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingCourse(null);
          }}
        />
      )}
    </div>
  );
};
