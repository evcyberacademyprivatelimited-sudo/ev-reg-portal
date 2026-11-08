import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { CourseEditorModal } from '../../components/admin/CourseEditorModal';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import { Course } from '../../types';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  Laptop,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

export const AdminCoursesPage: React.FC = () => {
  const { toggleMenu } = useOutletContext<{ toggleMenu: () => void }>();
  const { courses, saveCourse, deleteCourse, updateCourseOrder } = useData();
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

  const handleOrderChange = async (courseId: string, newPosition: number) => {
    const res = await updateCourseOrder(courseId, newPosition);
    if (res.success) {
      success(`Course moved to position #${newPosition}.`);
    } else {
      notifyError('Failed to update course order', res.error);
    }
  };

  const handleToggleStatus = async (course: Course) => {
    const nextStatus = course.status === 'published' ? 'draft' : 'published';
    const res = await saveCourse({ id: course.id, status: nextStatus });
    if (res.success) {
      success(`Course ${nextStatus === 'published' ? 'published' : 'hidden'}.`);
    } else {
      notifyError('Failed to update status', res.error);
    }
  };

  const handleDelete = async (course: Course) => {
    if (!confirm(`Are you sure you want to delete the course "${course.title}"?`)) {
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
        title="Courses &amp; Programs"
        subtitle="Manage the courses displayed on the EV Cyber Academy Private Limited registration website."
        onMenuToggle={toggleMenu}
        actions={
          <button
            type="button"
            onClick={handleCreate}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No courses created yet</h3>
            <p className="text-xs text-slate-500">
              Click the Add Course button above to create your first training program.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4 w-44">Display Order</th>
                    <th className="py-3.5 px-4">Course Name</th>
                    <th className="py-3.5 px-4">Duration</th>
                    <th className="py-3.5 px-4">Learning Mode</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {courses.map((course) => {
                    const isPub = course.status === 'published';
                    const durationText = course.duration_text || (course.duration_weeks ? `${course.duration_weeks} Weeks` : 'Self-Paced');
                    const learningMode = course.learning_mode || course.tagline || 'Live Online';

                    return (
                      <tr key={course.id} className="hover:bg-slate-50/80 transition">
                        {/* Display Order Controls */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <select
                              value={course.sort_order || 1}
                              onChange={(e) => handleOrderChange(course.id, Number(e.target.value))}
                              className="px-2.5 py-1 text-xs font-black text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer"
                              title="Select which card displays 1st, 2nd, 3rd, etc."
                            >
                              {courses.map((_, idx) => (
                                <option key={idx + 1} value={idx + 1}>
                                  Card #{idx + 1} {idx === 0 ? '(1st)' : idx === 1 ? '(2nd)' : idx === 2 ? '(3rd)' : ''}
                                </option>
                              ))}
                            </select>

                            <button
                              type="button"
                              disabled={(course.sort_order || 1) <= 1}
                              onClick={() => handleOrderChange(course.id, (course.sort_order || 1) - 1)}
                              className="p-1 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              disabled={(course.sort_order || 1) >= courses.length}
                              onClick={() => handleOrderChange(course.id, (course.sort_order || 1) + 1)}
                              className="p-1 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        <td className="py-4 px-4 font-bold text-slate-900 max-w-sm">
                          <div>
                            <span className="text-sm font-bold text-slate-900">{course.title}</span>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-normal">
                              {course.summary}
                            </p>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{durationText}</span>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Laptop className="w-3.5 h-3.5 text-slate-400" />
                            <span>{learningMode}</span>
                          </div>
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(course)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                              isPub
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                            }`}
                            title="Click to toggle publish status"
                          >
                            {isPub ? (
                              <>
                                <Eye className="w-3 h-3 text-emerald-600" />
                                <span>Published</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3 text-slate-500" />
                                <span>Hidden</span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(course)}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(course)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                              title="Delete Course"
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
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Course Modal */}
      {isEditorOpen && (
        <CourseEditorModal
          course={editingCourse}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </div>
  );
};
