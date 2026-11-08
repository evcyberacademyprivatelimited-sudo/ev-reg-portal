import React, { useState } from 'react';
import { X, BookOpen, Clock, Laptop, Image, Save, Eye, EyeOff } from 'lucide-react';
import { Course, CourseStatus } from '../../types';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';

interface CourseEditorModalProps {
  course?: Course | null;
  onClose: () => void;
}

export const CourseEditorModal: React.FC<CourseEditorModalProps> = ({ course, onClose }) => {
  const { saveCourse } = useData();
  const { success, error: notifyError } = useNotification();

  const isEditing = Boolean(course?.id);

  // Form states based strictly on Requirement 6:
  // - Course Name
  // - Short Description
  // - Duration
  // - Learning Mode
  // - Course Image
  // - Publish / Hide Course
  const [courseName, setCourseName] = useState(course?.title || '');
  const [shortDescription, setShortDescription] = useState(course?.summary || '');
  const [durationWeeks, setDurationWeeks] = useState(course?.duration_weeks || 12);
  const [learningMode, setLearningMode] = useState(course?.learning_mode || course?.tagline || 'Live Online');
  const [courseImage, setCourseImage] = useState(course?.image_url || '');
  const [isPublished, setIsPublished] = useState(course?.status !== 'draft');

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseName.trim()) {
      notifyError('Please enter a course name.');
      return;
    }

    setIsSaving(true);

    const generatedSlug = course?.slug || courseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const coursePayload: Partial<Course> = {
      ...(course?.id ? { id: course.id } : {}),
      title: courseName.trim(),
      slug: generatedSlug,
      summary: shortDescription.trim(),
      description: shortDescription.trim(),
      tagline: learningMode.trim(),
      learning_mode: learningMode.trim(),
      duration_weeks: Number(durationWeeks) || 12,
      hours_per_week: course?.hours_per_week || 8,
      level: course?.level || 'Intermediate',
      fee_amount: course?.fee_amount || 0,
      currency: 'INR',
      status: (isPublished ? 'published' : 'draft') as CourseStatus,
      featured: course?.featured ?? true,
      image_url: courseImage.trim() || undefined,
      certification_title: course?.certification_title || `EV Certified ${courseName.trim()}`,
      syllabus: course?.syllabus || [],
      outcomes: course?.outcomes || [],
      prerequisites: course?.prerequisites || [],
      tools_covered: course?.tools_covered || [],
    };

    const result = await saveCourse(coursePayload);
    setIsSaving(false);

    if (result.success) {
      success(isEditing ? 'Course updated successfully.' : 'Course created successfully.');
      onClose();
    } else {
      notifyError('Failed to save course', result.error);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isEditing ? 'Edit Course' : 'Add New Course'}
              </h3>
              <p className="text-xs text-slate-400">EV Cyber Academy Private Limited</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clean, Simple Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 text-xs">
          {/* 1. Course Name */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Course Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Certified SOC Analyst & Threat Hunter (L1/L2)"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
          </div>

          {/* 2. Short Description */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Short Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Brief summary of the course and practical objectives..."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none leading-relaxed"
            />
          </div>

          {/* 3. Duration & 4. Learning Mode Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Duration (Weeks)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="number"
                  min={1}
                  max={52}
                  required
                  placeholder="e.g. 12"
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Learning Mode
              </label>
              <div className="relative">
                <Laptop className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Live Online, Hybrid, Classroom"
                  value={learningMode}
                  onChange={(e) => setLearningMode(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* 5. Course Image (Optional) */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Course Image URL <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <Image className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="url"
                placeholder="https://example.com/course-banner.jpg"
                value={courseImage}
                onChange={(e) => setCourseImage(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>
          </div>

          {/* 6. Publish / Hide Course Toggle */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900">Website Publication</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isPublished ? 'This course will be visible to students on the website.' : 'This course is hidden from the public website.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsPublished(!isPublished)}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isPublished
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {isPublished ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Published</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Hidden</span>
                </>
              )}
            </button>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 font-semibold transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 text-white font-bold transition flex items-center gap-2 cursor-pointer shadow"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Course'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
