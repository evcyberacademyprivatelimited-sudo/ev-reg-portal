import React from 'react';
import { Clock, Laptop, ArrowRight, ShieldCheck } from 'lucide-react';
import { Course } from '../../types';

interface CourseCardProps {
  course: Course;
  featured?: boolean;
  onApply?: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onApply }) => {
  // Determine duration text
  const durationText = course.duration_text || (course.duration_weeks ? `${course.duration_weeks} Weeks` : 'Self-Paced');
  
  // Determine learning mode (fall back cleanly to tagline or standard mode)
  const learningMode = course.learning_mode || course.tagline || 'Live Online & Hands-on Labs';

  const handleApplyClick = () => {
    if (onApply) {
      onApply(course);
    } else {
      const el = document.getElementById('courses');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-red-500/40 transition-all duration-300 p-6 sm:p-8 relative">
      {/* Course Name */}
      <div className="mb-3">
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors leading-snug">
          {course.title}
        </h3>
      </div>

      {/* Short Description */}
      <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-1 line-clamp-3">
        {course.summary}
      </p>

      {/* Meta details: Duration & Learning Mode */}
      <div className="pt-4 border-t border-slate-100 space-y-2 mb-6 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-500 shrink-0" />
          <span className="font-semibold text-slate-700">Duration:</span>
          <span>{durationText}</span>
        </div>

        <div className="flex items-center gap-2">
          <Laptop className="w-4 h-4 text-red-500 shrink-0" />
          <span className="font-semibold text-slate-700">Learning Mode:</span>
          <span className="truncate">{learningMode}</span>
        </div>
      </div>

      {/* Apply Now Button */}
      <button
        type="button"
        onClick={handleApplyClick}
        className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm shadow-sm hover:shadow transition flex items-center justify-center gap-2 cursor-pointer group/btn"
      >
        <span>Apply Now</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
      </button>
    </div>
  );
};
