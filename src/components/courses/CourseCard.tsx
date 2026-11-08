import React from 'react';
import {
  Clock,
  Laptop,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { Course } from '../../types';
import { useData } from '../../context/DataContext';

interface CourseCardProps {
  course: Course;
  featured?: boolean;
  onApply?: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onApply }) => {
  const { siteSettings } = useData();

  // Determine duration text
  const durationText =
    course.duration_text ||
    (course.duration_weeks ? `${course.duration_weeks} Weeks` : 'Self-Paced');

  // Determine learning mode
  const learningMode =
    course.learning_mode || course.tagline || 'Live Online & Hands-on Labs';

  // Determine the banner label text (Admin-Controlled & Editable)
  const bannerLabel =
    course.badge_text ||
    siteSettings.default_card_banner_text ||
    'Professional Certification Track';

  const handleApplyClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onApply) {
      onApply(course);
    } else {
      const el = document.getElementById('courses');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      onClick={handleApplyClick}
      className="group flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:shadow-red-500/15 hover:-translate-y-2 transition-all duration-300 overflow-hidden cursor-pointer relative"
    >
      {/* Top Accent Gradient Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />

      {/* =====================================================================
          UNIFIED PROFESSIONAL HACKER-THEMED BANNER (SAME FOR ALL COURSES)
      ====================================================================== */}
      <div className="h-44 sm:h-48 bg-gradient-to-br from-[#060a12] via-[#090e1c] to-[#150912] relative overflow-hidden flex flex-col justify-between p-5 sm:p-6 border-b border-slate-900 select-none">
        {/* Subtle Cyber Grid Matrix Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ef444412_1px,transparent_1px),linear-gradient(to_bottom,#ef444412_1px,transparent_1px)] bg-[size:1.25rem_1.25rem] pointer-events-none" />

        {/* Ambient Red Glow in Corner */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-red-600/15 rounded-full blur-2xl pointer-events-none" />

        {/* Top Terminal Bar */}
        <div className="relative z-10 flex items-center justify-between w-full">
          {/* Terminal Controls & Shell Prompt */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-950/80 border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-red-500/90" />
              <span className="w-2 h-2 rounded-full bg-amber-500/90" />
              <span className="w-2 h-2 rounded-full bg-emerald-500/90" />
            </div>
            <span className="font-mono text-[11px] font-bold text-slate-400 tracking-wider">
              root@ev-cyber:~#
            </span>
          </div>

          {/* Live Batch Indicator */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            LIVE LABS
          </span>
        </div>

        {/* Center / Bottom Hacker Emblem & Admin-Editable Banner Label */}
        <div className="relative z-10 flex items-center gap-3 pt-2">
          {/* Hacker Badge Shield */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600/20 via-red-950/40 to-slate-900 border border-red-500/40 backdrop-blur-md flex items-center justify-center shadow-lg shadow-red-950/30 group-hover:scale-105 group-hover:border-red-400 transition-all duration-300 shrink-0">
            <Terminal className="w-6 h-6 text-red-400 group-hover:text-red-300 transition-colors" />
          </div>

          {/* Admin-Controlled Banner Text */}
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
              EV CYBER ACADEMY
            </div>
            <div
              className="text-xs sm:text-sm font-black font-mono tracking-wide text-white uppercase truncate flex items-center gap-2 mt-0.5"
              title={bannerLabel}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0"></span>
              <span className="truncate">{bannerLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between gap-6">
        <div className="space-y-3">
          {/* Course Name */}
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-red-600 transition-colors leading-snug tracking-tight">
            {course.title}
          </h3>

          {/* Course Description (Full Visibility - No Line Clamping) */}
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {course.summary || course.description}
          </p>
        </div>

        <div className="space-y-4">
          {/* Structured Meta Cards (Duration & Learning Mode) */}
          <div className="grid grid-cols-2 gap-3">
            {/* Duration */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 group-hover:border-red-100 group-hover:bg-red-50/30 transition-colors flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Duration
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {durationText}
                </div>
              </div>
            </div>

            {/* Learning Mode */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 group-hover:border-red-100 group-hover:bg-red-50/30 transition-colors flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Laptop className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Mode
                </div>
                <div
                  className="text-xs sm:text-sm font-bold text-slate-900 truncate"
                  title={learningMode}
                >
                  {learningMode}
                </div>
              </div>
            </div>
          </div>

          {/* Super Apply Now Button */}
          <button
            type="button"
            onClick={handleApplyClick}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:from-red-700 active:to-rose-700 text-white font-bold text-sm shadow-md hover:shadow-xl hover:shadow-red-600/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group/btn relative overflow-hidden"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

            <span>Apply Now</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
