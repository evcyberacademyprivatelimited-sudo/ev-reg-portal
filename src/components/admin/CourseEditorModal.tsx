import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  Shield,
  Clock,
  Calendar,
  Layers,
} from 'lucide-react';
import { Course, CourseLevel, CourseStatus, SyllabusModule } from '../../types';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';

interface CourseEditorModalProps {
  course?: Course | null;
  onClose: () => void;
}

export const CourseEditorModal: React.FC<CourseEditorModalProps> = ({ course, onClose }) => {
  const { saveCourse } = useData();
  const { success, error: notifyError } = useNotification();

  const [formData, setFormData] = useState({
    title: course?.title || '',
    slug: course?.slug || '',
    tagline: course?.tagline || '',
    summary: course?.summary || '',
    description: course?.description || '',
    level: (course?.level || 'Intermediate') as CourseLevel,
    duration_weeks: course?.duration_weeks || 12,
    hours_per_week: course?.hours_per_week || 8,
    fee_amount: course?.fee_amount || 49999,
    currency: course?.currency || 'INR',
    status: (course?.status || 'published') as CourseStatus,
    featured: course?.featured ?? false,
    badge_text: course?.badge_text || '',
    certification_title: course?.certification_title || 'EV Certified Security Specialist',
    batch_start_date: course?.batch_start_date || '',
    seats_remaining: course?.seats_remaining || 15,
  });

  const [syllabus, setSyllabus] = useState<SyllabusModule[]>(
    course?.syllabus || [
      {
        module: 1,
        title: 'Network & System Telemetry Fundamentals',
        duration: '2 Weeks',
        topics: ['Traffic packet inspection', 'Log source parsing'],
      },
    ]
  );

  const [toolsString, setToolsString] = useState(
    course?.tools_covered ? course.tools_covered.join(', ') : 'Splunk, Wireshark, Zeek'
  );

  const [outcomesString, setOutcomesString] = useState(
    course?.outcomes ? course.outcomes.join('\n') : 'Triage active intrusions within 10 minutes'
  );

  const [prereqString, setPrereqString] = useState(
    course?.prerequisites ? course.prerequisites.join('\n') : 'Basic networking knowledge'
  );

  const [isSaving, setIsSaving] = useState(false);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug:
        prev.slug === '' || prev.slug === course?.slug
          ? val
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '')
          : prev.slug,
    }));
  };

  const handleAddModule = () => {
    const nextModNum = syllabus.length + 1;
    setSyllabus([
      ...syllabus,
      {
        module: nextModNum,
        title: `Module ${nextModNum}: Advanced Operations`,
        duration: '2 Weeks',
        topics: ['Enterprise range drill'],
      },
    ]);
  };

  const handleRemoveModule = (index: number) => {
    const updated = syllabus
      .filter((_, idx) => idx !== index)
      .map((mod, idx) => ({ ...mod, module: idx + 1 }));
    setSyllabus(updated);
  };

  const handleModuleChange = (index: number, field: keyof SyllabusModule, value: unknown) => {
    const updated = [...syllabus];
    updated[index] = { ...updated[index], [field]: value };
    setSyllabus(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      notifyError('Course title is required.');
      return;
    }

    setIsSaving(true);

    const toolsCovered = toolsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const outcomes = outcomesString
      .split('\n')
      .map((o) => o.trim())
      .filter(Boolean);

    const prerequisites = prereqString
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const res = await saveCourse({
      id: course?.id,
      title: formData.title,
      slug: formData.slug,
      tagline: formData.tagline,
      summary: formData.summary,
      description: formData.description,
      level: formData.level,
      duration_weeks: Number(formData.duration_weeks),
      hours_per_week: Number(formData.hours_per_week),
      fee_amount: Number(formData.fee_amount),
      currency: formData.currency,
      status: formData.status,
      featured: formData.featured,
      badge_text: formData.badge_text,
      certification_title: formData.certification_title,
      batch_start_date: formData.batch_start_date,
      seats_remaining: Number(formData.seats_remaining),
      syllabus,
      tools_covered: toolsCovered,
      outcomes,
      prerequisites,
    });

    setIsSaving(false);

    if (res.success) {
      success('Course saved successfully.');
      onClose();
    } else {
      notifyError('Failed to save course', res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-slate-950 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                {course ? 'Edit Course Cohort' : 'Create New Course Program'}
              </h2>
              <p className="text-xs text-slate-400">Manage curriculum, syllabus &amp; batch details</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <form id="course-form" onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* Basic Info */}
            <div className="space-y-4">
              <span className="font-bold uppercase tracking-wider text-slate-500 block">
                Basic Program Identification
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Course Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Certified SOC Analyst & Threat Hunter (L1/L2)"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    URL Slug <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="certified-soc-analyst-l1-l2"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Tagline / Catchphrase <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Master Live Security Operations, SIEM Architecture, Incident Triage & Threat Hunting"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Summary (Shown on cards &amp; previews) <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Detailed Description (Course landing page)
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                />
              </div>
            </div>

            {/* Logistics & Pricing */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <span className="font-bold uppercase tracking-wider text-slate-500 block">
                Duration, Pricing &amp; Certification
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value as CourseLevel })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Duration (Weeks)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.duration_weeks}
                    onChange={(e) =>
                      setFormData({ ...formData, duration_weeks: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Hours / Week
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.hours_per_week}
                    onChange={(e) =>
                      setFormData({ ...formData, hours_per_week: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Fee (INR ₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.fee_amount}
                    onChange={(e) =>
                      setFormData({ ...formData, fee_amount: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Certification Title
                  </label>
                  <input
                    type="text"
                    value={formData.certification_title}
                    onChange={(e) =>
                      setFormData({ ...formData, certification_title: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Next Batch Date
                  </label>
                  <input
                    type="date"
                    value={formData.batch_start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, batch_start_date: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Seats Remaining
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.seats_remaining}
                    onChange={(e) =>
                      setFormData({ ...formData, seats_remaining: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Publication Status & Flags */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Publication Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as CourseStatus })
                    }
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white font-bold"
                  >
                    <option value="published">Published (Visible on site)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Badge Text (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MOST POPULAR"
                    value={formData.badge_text}
                    onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 font-bold text-red-600"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span className="font-bold text-slate-900">Featured Course Spotlight</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Dynamic Syllabus Editor */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold uppercase tracking-wider text-slate-900 block">
                    Curriculum Syllabus ({syllabus.length} Modules)
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Detailed breakdown shown on course landing page
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAddModule}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center gap-1 hover:bg-black transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Module</span>
                </button>
              </div>

              <div className="space-y-3">
                {syllabus.map((mod, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-bold text-slate-900 text-xs">Module {idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveModule(idx)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Remove module"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                          Module Title
                        </label>
                        <input
                          type="text"
                          value={mod.title}
                          onChange={(e) => handleModuleChange(idx, 'title', e.target.value)}
                          className="w-full p-2 rounded-lg border border-slate-300 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={mod.duration}
                          onChange={(e) => handleModuleChange(idx, 'duration', e.target.value)}
                          className="w-full p-2 rounded-lg border border-slate-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        Topics Covered (one per line)
                      </label>
                      <textarea
                        rows={2}
                        value={mod.topics.join('\n')}
                        onChange={(e) =>
                          handleModuleChange(
                            idx,
                            'topics',
                            e.target.value.split('\n').filter(Boolean)
                          )
                        }
                        className="w-full p-2 rounded-lg border border-slate-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools, Outcomes & Prerequisites */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Tools Covered (comma-separated)
                </label>
                <input
                  type="text"
                  value={toolsString}
                  onChange={(e) => setToolsString(e.target.value)}
                  placeholder="Splunk, Wireshark, Zeek, Sysmon, CrowdStrike"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Learning Outcomes (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={outcomesString}
                    onChange={(e) => setOutcomesString(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Prerequisites (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={prereqString}
                    onChange={(e) => setPrereqString(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="course-form"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : course ? 'Update Course' : 'Create & Publish Course'}
          </button>
        </div>
      </div>
    </div>
  );
};

