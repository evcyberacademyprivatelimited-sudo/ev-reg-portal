import React from 'react';
import {
  Clock,
  Laptop,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Cpu,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Course } from '../../types';

interface CourseCardProps {
  course: Course;
  featured?: boolean;
  onApply?: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onApply }) => {
  // Determine duration text
  const durationText =
    course.duration_text ||
    (course.duration_weeks ? `${course.duration_weeks} Weeks` : 'Self-Paced');

  // Determine learning mode
  const learningMode =
    course.learning_mode || course.tagline || 'Live Online & Hands-on Labs';

  const handleApplyClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onApply) {
      onApply(course);
    } else {
      const el = document.getElementById('courses');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Choose high-tech cyber icon based on course topic
  const getCourseIcon = () => {
    const text = `${course.title} ${course.slug}`.toLowerCase();
    if (text.includes('offensive') || text.includes('penetration') || text.includes('red team')) {
      return <Terminal className="w-6 h-6 text-red-400" />;
    }
    if (text.includes('cloud') || text.includes('devsecops') || text.includes('architecture')) {
      return <Cpu className="w-6 h-6 text-red-400" />;
    }
    if (text.includes('soc') || text.includes('threat') || text.includes('defense')) {
      return <ShieldCheck className="w-6 h-6 text-red-400" />;
    }
    return <Lock className="w-6 h-6 text-red-400" />;
  };

  return (
    <div
      onClick={handleApplyClick}
      className="group flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:shadow-red-500/15 hover:-translate-y-2 transition-all duration-300 overflow-hidden cursor-pointer relative"
    >
      {/* Top Accent Gradient Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />

      {/* High-Tech Visual Banner */}
      {course.image_url ? (
        <div className="h-44 sm:h-48 relative overflow-hidden bg-slate-950">
          <img
            src={course.image_url}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Enrolling Batch
            </span>
          </div>
        </div>
      ) : (
        <div className="h-40 sm:h-44 bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 relative overflow-hidden flex flex-col justify-between p-6">
          {/* Subtle cyber background grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#ef444415_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Top badges */}
          <div className="relative z-10 flex items-center justify-between w-full">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-950/80 border border-red-500/40 text-red-300 text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-red-400" />
              <span>EV Cyber Academy</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Enrolling Batch
            </span>
          </div>

          {/* Bottom icon & tech glow */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:border-red-400 transition-all duration-300">
              {getCourseIcon()}
            </div>
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
              Professional Certification Track
            </div>
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between gap-6">
        <div className="space-y-3">
          {/* Course Name */}
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-red-600 transition-colors leading-snug tracking-tight">
            {course.title}
          </h3>

          {/* Short Description */}
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
            {course.summary}
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
