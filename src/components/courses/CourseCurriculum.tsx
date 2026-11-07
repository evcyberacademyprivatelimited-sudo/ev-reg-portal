import React, { useState } from 'react';
import { ChevronDown, CheckCircle2, Clock, BookOpen } from 'lucide-react';
import { SyllabusModule } from '../../types';

interface CourseCurriculumProps {
  syllabus: SyllabusModule[];
}

export const CourseCurriculum: React.FC<CourseCurriculumProps> = ({ syllabus }) => {
  const [openModule, setOpenModule] = useState<number | null>(syllabus[0]?.module || 1);

  const toggle = (modNum: number) => {
    setOpenModule((prev) => (prev === modNum ? null : modNum));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <BookOpen className="w-4 h-4 text-red-600" />
          <span>Curriculum Modules ({syllabus.length} Phases)</span>
        </div>
        <button
          type="button"
          onClick={() => setOpenModule(openModule ? null : 1)}
          className="text-xs font-semibold text-red-600 hover:text-red-700"
        >
          {openModule ? 'Collapse Active' : 'Expand Phase 1'}
        </button>
      </div>

      <div className="space-y-3">
        {syllabus.map((mod) => {
          const isOpen = openModule === mod.module;
          return (
            <div
              key={mod.module}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-red-500/40 bg-white shadow-sm ring-1 ring-red-500/10'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(mod.module)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-red-100 text-red-700 font-black text-xs flex items-center justify-center shrink-0">
                    {mod.module}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                      {mod.title}
                    </h4>
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{mod.duration}</span>
                    </span>
                  </div>
                </div>

                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'transform rotate-180 text-red-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Hands-on Topics &amp; Range Scenarios:
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {mod.topics.map((topic, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

