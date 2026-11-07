import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { CourseCard } from '../components/courses/CourseCard';
import { CourseLevel } from '../types';
import { Search, Shield, Filter, Sparkles } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

export const ProgramsPage: React.FC = () => {
  const { courses, isLoadingCourses } = useData();
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    trackEvent('page_view', undefined, { page: 'programs_listing' });
  }, []);

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const publishedCourses = courses.filter((c) => c.status === 'published');

  const filtered = publishedCourses.filter((course) => {
    if (selectedLevel !== 'All' && course.level !== selectedLevel) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchTagline = course.tagline.toLowerCase().includes(q);
      const matchTools = course.tools_covered?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchTagline && !matchTools) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Official Cyber Engineering Curriculum</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Cyber Defense, Threat Hunting &amp; Red Team Cohorts
          </h1>

          <p className="text-base text-slate-600 leading-relaxed">
            All programs are taught by enterprise practitioners in dedicated cloud cyber ranges. Browse available tracks, compare syllabus phases, and reserve your seat.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by role, tool (Splunk, AD, Falco), or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600"
            />
          </div>

          {/* Level Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto">
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  selectedLevel === lvl
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl === 'All' ? 'All Levels' : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {isLoadingCourses ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((course) => (
              <CourseCard key={course.id} course={course} featured={course.featured} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
            <p className="text-sm font-semibold text-slate-600">No programs match your search criteria.</p>
            <button
              onClick={() => {
                setSelectedLevel('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

