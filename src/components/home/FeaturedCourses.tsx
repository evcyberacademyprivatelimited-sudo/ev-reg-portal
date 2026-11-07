import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CourseCard } from '../courses/CourseCard';
import { useData } from '../../context/DataContext';
import { CourseLevel } from '../../types';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const FeaturedCourses: React.FC = () => {
  const { courses, isLoadingCourses } = useData();
  const [selectedLevel, setSelectedLevel] = useState<string>('All');

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Published courses only for public showcase
  const publishedCourses = courses.filter((c) => c.status === 'published');

  const filteredCourses =
    selectedLevel === 'All'
      ? publishedCourses
      : publishedCourses.filter((c) => c.level === (selectedLevel as CourseLevel));

  return (
    <section id="programs" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Production-Grade Cybersecurity Programs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Defend, Hunt, or Penetrate: Choose Your Cohort
            </h2>
            <p className="text-slate-600 text-base">
              Every track is 100% hands-on. Live cyber ranges, dedicated cloud labs, real adversary payloads, and zero theoretical filler.
            </p>
          </div>

          {/* Level Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl self-start md:self-auto">
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  selectedLevel === lvl
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl === 'All' ? 'All Cohorts' : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        {isLoadingCourses ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 bg-white rounded-2xl border border-slate-200 animate-pulse p-6" />
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} featured={course.featured} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500 font-medium">No courses found matching this level.</p>
          </div>
        )}

        {/* Bottom Explorer CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-6 py-3 rounded-xl transition"
          >
            <span>Compare Full Curriculum & Syllabus Syllabi</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

