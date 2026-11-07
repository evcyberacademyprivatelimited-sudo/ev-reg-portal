import React from 'react';
import { Course } from '../../types';
import { CheckCircle2, AlertCircle, Wrench, Target } from 'lucide-react';

interface CourseKeyHighlightsProps {
  course: Course;
}

export const CourseKeyHighlights: React.FC<CourseKeyHighlightsProps> = ({ course }) => {
  return (
    <div className="space-y-10">
      {/* Learning Outcomes */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            Target Capabilities &amp; Learning Outcomes
          </h3>
        </div>

        <p className="text-xs text-slate-500">
          Skills verified through live lab challenges and production-grade scenario assessments:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          {course.outcomes.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-xs font-semibold text-slate-800 leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tools & Telemetry Covered */}
      {course.tools_covered && course.tools_covered.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Enterprise Tools &amp; Telemetry Covered
            </h3>
          </div>

          <p className="text-xs text-slate-500">
            Work directly with industry standard stacks used in enterprise Blue &amp; Red teams:
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {course.tools_covered.map((tool, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-100 text-xs font-bold tracking-wide border border-slate-800 shadow-xs"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Prerequisites & Eligibility */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            Prerequisites &amp; Eligibility
          </h3>
        </div>

        <ul className="space-y-2.5">
          {course.prerequisites.map((pre, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
              <span className="leading-relaxed">{pre}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

