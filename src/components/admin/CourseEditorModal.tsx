import React, { useState } from 'react';
import { X, BookOpen, Clock, Laptop, Image, Save, Eye, EyeOff, Terminal, ListOrdered, Tag, Globe, Copy, Check, Zap } from 'lucide-react';
import { Course, CourseStatus, DurationUnit } from '../../types';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';

interface CourseEditorModalProps {
  course?: Course | null;
  onClose: () => void;
}

export const CourseEditorModal: React.FC<CourseEditorModalProps> = ({ course, onClose }) => {
  const { saveCourse, courses } = useData();
  const { success, error: notifyError } = useNotification();

  const isEditing = Boolean(course?.id);

  // Form states based on requirements:
  // - Course Name
  // - Short Description
  // - Pricing (Original Price & Now Price)
  // - Duration
  // - Learning Mode
  // - Course Image
  // - Hacker Banner Text
  // - Display Order (1, 2, 3...)
  // - Publish / Hide Course
  const [courseName, setCourseName] = useState(course?.title || '');
  const [shortDescription, setShortDescription] = useState(course?.summary || '');
  const [nowPrice, setNowPrice] = useState<number | string>(
    course?.fee_amount !== undefined ? course.fee_amount : 499
  );
  const [originalPrice, setOriginalPrice] = useState<number | string>(
    course?.original_price !== undefined ? course.original_price : 4999
  );
  
  // Program Duration: Value and Unit ('Weeks' | 'Days')
  const initialDurationUnit: DurationUnit = course?.duration_unit
    ? course.duration_unit
    : (course?.duration_text?.toLowerCase().includes('day') ? 'Days' : 'Weeks');

  const initialDurationValue = course?.duration_value !== undefined
    ? course.duration_value
    : (course?.duration_text ? (parseInt(course.duration_text, 10) || course.duration_weeks || 12) : (course?.duration_weeks || 12));

  const [durationValue, setDurationValue] = useState<number | string>(initialDurationValue);
  const [durationUnit, setDurationUnit] = useState<DurationUnit>(initialDurationUnit);

  const [learningMode, setLearningMode] = useState(course?.learning_mode || course?.tagline || 'Live Online');
  const [customSlug, setCustomSlug] = useState(course?.slug || '');
  const [autoOpenModal, setAutoOpenModal] = useState<boolean>(course?.auto_open_modal ?? false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [bannerText, setBannerText] = useState(course?.badge_text || 'Professional Certification Track');
  const [sortOrder, setSortOrder] = useState<number>(course?.sort_order || courses.length + 1);
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

    const generatedSlug = (customSlug.trim() || courseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '');

    const numDuration = Math.max(1, Number(durationValue) || 1);
    const calculatedWeeks = durationUnit === 'Weeks' ? numDuration : Math.max(1, Math.round(numDuration / 7));
    const calculatedDurationText = `${numDuration} ${durationUnit}`;

    const coursePayload: Partial<Course> = {
      ...(course?.id ? { id: course.id } : {}),
      title: courseName.trim(),
      slug: generatedSlug,
      auto_open_modal: autoOpenModal,
      summary: shortDescription.trim(),
      description: shortDescription.trim(),
      tagline: learningMode.trim(),
      learning_mode: learningMode.trim(),
      fee_amount: Number(nowPrice) || 0,
      original_price: Number(originalPrice) || 0,
      badge_text: bannerText.trim() || 'Professional Certification Track',
      sort_order: Number(sortOrder) || 1,
      duration_value: numDuration,
      duration_unit: durationUnit,
      duration_text: calculatedDurationText,
      duration_weeks: calculatedWeeks,
      hours_per_week: course?.hours_per_week || 8,
      level: course?.level || 'Intermediate',
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
          {/* 2. Course Description */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Course Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Enter course description, learning outcomes, and practical objectives..."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-y min-h-[110px] leading-relaxed text-xs"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              The full description will be shown completely on the public course card without being cut off.
            </p>
          </div>

          {/* Custom Campaign URL Route / Slug & Direct Form Settings */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-2 text-xs">
                <Globe className="w-4 h-4 text-red-500" />
                Custom URL Route / Slug (Campaign Landing Page)
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Direct Ad Route
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1 text-[10px]">
                Custom URL Route / Slug <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="font-mono font-bold text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs">
                    /
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 499 or ethical-hacking-workshop"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://registration01.evcyberacademy.in';
                    const activeSlug = customSlug.trim() || (courseName ? courseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '499');
                    const fullUrl = `${origin}/${activeSlug}`;
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                      navigator.clipboard.writeText(fullUrl);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-700 shrink-0"
                  title="Copy full campaign ad destination URL"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>

              {/* Live Preview Badge */}
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400 flex-wrap">
                <span className="text-slate-500">Live Preview:</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-red-400 font-mono font-bold truncate max-w-full">
                  {typeof window !== 'undefined' ? window.location.origin : 'https://registration01.evcyberacademy.in'}/
                  {customSlug.trim() || (courseName ? courseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '499')}
                </span>
              </div>
            </div>

            {/* Auto-Open Registration Form Toggle */}
            <div className="pt-2.5 border-t border-slate-800">
              <div className="flex items-center justify-between gap-3">
                <div className="pr-2">
                  <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Auto-Open Registration Form on Page Load</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Instantly pops up the registration modal when visitors open your custom ad link for maximum conversion.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={autoOpenModal}
                  onClick={() => setAutoOpenModal(!autoOpenModal)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    autoOpenModal ? 'bg-red-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      autoOpenModal ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 3. Course Pricing (Original Price & Now Price) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-red-600" />
                Course Pricing (₹ INR)
              </span>
              {Number(originalPrice) > Number(nowPrice) && Number(originalPrice) > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-mono font-bold">
                  {Math.round(((Number(originalPrice) - Number(nowPrice)) / Number(originalPrice)) * 100)}% DISCOUNT
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Original Price (₹ MRP)
                </label>
                <div className="relative">
                  <span className="font-mono font-bold text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={0}
                    placeholder="e.g. 4999"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Displayed with strikethrough (Original Price)
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Now Price (₹ Current Fee) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="font-mono font-bold text-red-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={0}
                    required
                    placeholder="e.g. 499"
                    value={nowPrice}
                    onChange={(e) => setNowPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono font-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Active fee students pay (Now Price)
                </p>
              </div>
            </div>
          </div>

          {/* 4. Duration Selector & 5. Learning Mode Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-bold text-slate-700 uppercase tracking-wider">
                  Program Duration <span className="text-red-500">*</span>
                </label>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-300 text-slate-800 text-[11px] font-mono font-bold">
                  {durationValue || 0} {durationUnit}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="number"
                    min={1}
                    max={durationUnit === 'Weeks' ? 104 : 365}
                    required
                    placeholder={durationUnit === 'Weeks' ? "e.g. 12" : "e.g. 14 or 30"}
                    value={durationValue}
                    onChange={(e) => setDurationValue(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
                  />
                </div>

                {/* Duration Unit Selector: Weeks vs Days */}
                <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-300 shrink-0">
                  <button
                    type="button"
                    onClick={() => setDurationUnit('Weeks')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      durationUnit === 'Weeks'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Weeks
                  </button>
                  <button
                    type="button"
                    onClick={() => setDurationUnit('Days')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      durationUnit === 'Days'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Days
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Choose <strong>Weeks</strong> (e.g. 12 Weeks) or <strong>Days</strong> (e.g. 14 Days, 30 Days).
              </p>
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

          {/* 6. Hacker Banner Label / Badge Text (Admin Editable) */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Card Banner Label / Badge
            </label>
            <div className="relative">
              <Terminal className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                placeholder="e.g. Professional Certification Track"
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-xs"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Displayed on the hacker-themed banner of this course card (e.g. Professional Certification Track, 14-Day Crash Program, etc.).
            </p>
          </div>

          {/* 7. Display Order / Card Position (1, 2, 3...) */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Display Position on Website (1, 2, 3...)
            </label>
            <div className="relative">
              <ListOrdered className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-xs bg-white"
              >
                {Array.from(
                  { length: Math.max(courses.length + (isEditing ? 0 : 1), 6) },
                  (_, i) => i + 1
                ).map((pos) => (
                  <option key={pos} value={pos}>
                    Position #{pos}{' '}
                    {pos === 1
                      ? '(1st Card on Website)'
                      : pos === 2
                      ? '(2nd Card)'
                      : pos === 3
                      ? '(3rd Card)'
                      : ''}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Controls whether this course appears 1st, 2nd, 3rd, etc. on the website.
            </p>
          </div>

          {/* 8. Publish / Hide Course Toggle */}
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
