import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Shield, Award, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Course } from '../../types';
import { trackEvent } from '../../lib/analytics';

interface CourseCardProps {
  course: Course;
  featured?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, featured = false }) => {
  const handleApplyClick = () => {
    trackEvent('cta_click', course.id, {
      source: 'course_card',
      course_title: course.title,
    });
  };

  const levelColor = {
    Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Intermediate: 'bg-blue-50 text-blue-700 border-blue-200',
    Advanced: 'bg-purple-50 text-purple-700 border-purple-200',
    'All Levels': 'bg-slate-100 text-slate-800 border-slate-200',
  }[course.level] || 'bg-slate-100 text-slate-800 border-slate-200';

  return (
    <div
      className={`group relative flex flex-col bg-white rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
        featured
          ? 'border-red-500 shadow-xl ring-2 ring-red-500/10'
          : 'border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300'
      }`}
    >
      {/* Top Banner / Badge */}
      {course.badge_text && (
        <div className="absolute -top-3 left-6 z-10">
          <span className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white bg-red-600 rounded-full shadow-md">
            <Shield className="w-3 h-3 fill-current" />
            <span>{course.badge_text}</span>
          </span>
        </div>
      )}

      <div className="p-6 sm:p-8 flex-1 flex flex-col">
        {/* Meta Header */}
        <div className="flex items-center justify-between gap-2 mt-1 mb-4">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${levelColor}`}>
            {course.level}
          </span>

          {course.batch_start_date && (
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Starts {new Date(course.batch_start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </span>
          )}
        </div>

        {/* Title & Tagline */}
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors duration-200 leading-snug">
          <Link to={`/courses/${course.slug}`}>{course.title}</Link>
        </h3>
        <p className="text-xs font-medium text-red-600 mt-1 mb-3 line-clamp-1">{course.tagline}</p>

        {/* Summary */}
        <p className="text-sm text-slate-600 mb-6 leading-relaxed line-clamp-3">
          {course.summary}
        </p>

        {/* Key Highlights / Outcomes preview */}
        {course.outcomes && course.outcomes.length > 0 && (
          <div className="mb-6 space-y-2 border-t border-slate-100 pt-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Outcomes:</div>
            {course.outcomes.slice(0, 3).map((outcome, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{outcome}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tools Badges */}
        {course.tools_covered && course.tools_covered.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {course.tools_covered.slice(0, 4).map((tool, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200/60"
              >
                {tool}
              </span>
            ))}
            {course.tools_covered.length > 4 && (
              <span className="text-[11px] font-medium px-1.5 py-0.5 text-slate-400">
                +{course.tools_covered.length - 4} more
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-6 border-t border-slate-100">
          {/* Duration & Fee Row */}
          <div className="flex items-baseline justify-between mb-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{course.duration_weeks} Weeks ({course.hours_per_week}h/week)</span>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block font-normal">Program Fee</span>
              <span className="text-lg font-black text-slate-900">
                ₹{course.fee_amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-2 gap-2.5">
            <Link
              to={`/courses/${course.slug}`}
              className="w-full py-2.5 px-3 text-center text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              Curriculum & Labs
            </Link>

            <Link
              to={`/register?course=${course.id}`}
              onClick={handleApplyClick}
              className="w-full py-2.5 px-3 text-center text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg shadow-sm hover:shadow transition flex items-center justify-center gap-1.5 group/btn"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

