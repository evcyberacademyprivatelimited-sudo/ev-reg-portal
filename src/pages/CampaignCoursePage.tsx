import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { SimpleRegistrationModal } from '../components/registration/SimpleRegistrationModal';
import { trackEvent } from '../lib/analytics';
import {
  ShieldCheck,
  Clock,
  Laptop,
  ArrowRight,
  Loader2,
  Sparkles,
  Lock,
} from 'lucide-react';

export const CampaignCoursePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { courses, isLoadingCourses, getCourseBySlug, siteSettings } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Look up matching course
  const targetCourse = slug ? getCourseBySlug(slug) : undefined;
  const course = targetCourse && targetCourse.status === 'published' ? targetCourse : undefined;

  // Auto-open registration modal on load if configured by admin
  useEffect(() => {
    if (course) {
      trackEvent('page_view', course.id, {
        page: 'campaign_landing_page',
        slug,
        course_title: course.title,
      });

      if (course.auto_open_modal) {
        setIsModalOpen(true);
      }
    }
  }, [course?.id, course?.auto_open_modal, slug]);

  // Loading state: While courses are loading or list is empty on mount, show clean cyber loader
  if (isLoadingCourses || (courses.length === 0 && !course)) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-600/10 border border-red-500/30 flex items-center justify-center shadow-lg shadow-red-950/50">
          <Loader2 className="w-7 h-7 text-red-500 animate-spin" />
        </div>
        <div className="space-y-1">
          <p className="text-base font-bold text-white tracking-wide">Loading Program...</p>
          <p className="text-xs font-mono text-slate-400">EV Cyber Academy &bull; Direct Enrollment Track</p>
        </div>
      </div>
    );
  }

  // If loading finished and course is not found, cleanly redirect to home
  if (!course) {
    return <Navigate to="/" replace />;
  }

  // Course attributes
  const durationText =
    course.duration_text ||
    (course.duration_weeks ? `${course.duration_weeks} Weeks` : 'Self-Paced');
  const learningMode =
    course.learning_mode || course.tagline || 'Live Online & Hands-on Cyber Labs';
  const bannerLabel =
    course.badge_text ||
    siteSettings.default_card_banner_text ||
    'Professional Certification Track';

  const nowPrice = course.fee_amount ?? 0;
  const originalPrice = course.original_price ?? 0;
  const hasDiscount = originalPrice > nowPrice && originalPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - nowPrice) / originalPrice) * 100)
    : 0;

  const handleApplyClick = () => {
    setIsModalOpen(true);
    trackEvent('cta_click', course.id, {
      course_name: course.title,
      source: 'campaign_page_apply_now',
    });
  };

  return (
    <div className="min-h-[85vh] py-8 sm:py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-center">
      {/* Cyber Grid Background Matrix & Red Ambient Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ef444408_1px,transparent_1px),linear-gradient(to_bottom,#ef444408_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto w-full space-y-6">
        {/* Top Minimal Trust Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/70 border border-red-800/60 text-red-400 text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-sm shadow-inner">
            <ShieldCheck className="w-4 h-4 text-red-500" />
            <span>EV Cyber Academy Private Limited &bull; Direct Campaign Enrollment</span>
          </div>
        </div>

        {/* Focused Single-Course Hero Card */}
        <div className="bg-[#090d16] rounded-3xl border border-slate-800 shadow-2xl hover:border-red-500/40 transition-all duration-300 overflow-hidden">
          {/* Top Accent Gradient Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />

          {/* Banner Badge */}
          <div className="px-6 sm:px-8 pt-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/50 text-red-400 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>{bannerLabel}</span>
            </div>
          </div>

          {/* Course Details Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Title & Tagline */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                {course.title}
              </h1>
              <p className="text-sm font-semibold text-red-400">
                {learningMode}
              </p>
            </div>

            {/* Full Course Description (Uncut) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal whitespace-pre-line">
                {course.description || course.summary}
              </p>
            </div>

            {/* Quick Badges Row (Duration & Learning Mode) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300">
                <Clock className="w-4 h-4 text-red-500 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Program Duration</span>
                  <span className="font-bold text-white text-xs">{durationText}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300">
                <Laptop className="w-4 h-4 text-red-500 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Training Format</span>
                  <span className="font-bold text-white text-xs">{learningMode}</span>
                </div>
              </div>
            </div>

            {/* Pricing Card & Immediate CTA Button */}
            <div className="pt-2 border-t border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    Special Program Fee
                  </span>
                  <div className="flex items-baseline gap-2.5 mt-0.5">
                    <span className="font-mono text-3xl sm:text-4xl font-black text-white tracking-tight">
                      ₹{nowPrice.toLocaleString('en-IN')}
                    </span>
                    {hasDiscount && (
                      <span className="font-mono text-base sm:text-lg text-slate-500 line-through">
                        ₹{originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                {hasDiscount && (
                  <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
                    {discountPercent}% OFF ACTIVE
                  </span>
                )}
              </div>

              {/* Primary Apply Now CTA Button */}
              <button
                type="button"
                onClick={handleApplyClick}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:from-red-700 text-white font-bold text-base shadow-xl shadow-red-950/80 hover:shadow-2xl hover:shadow-red-600/30 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer relative overflow-hidden group/btn"
              >
                <span>Apply Now for {course.title}</span>
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                <span>Instant Admission Registration &bull; EV Cyber Academy Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Back to All Courses link */}
        <div className="text-center pt-2">
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-white transition font-medium inline-flex items-center gap-1.5"
          >
            <span>Want to explore all programs?</span>
            <span className="text-red-400 font-bold underline underline-offset-2">Browse All Courses &rarr;</span>
          </Link>
        </div>
      </div>

      {/* Registration Modal Pre-Selected with This Course */}
      <SimpleRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCourse={course}
      />
    </div>
  );
};
