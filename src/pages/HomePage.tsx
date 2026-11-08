import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { CourseCard } from '../components/courses/CourseCard';
import { SimpleRegistrationModal } from '../components/registration/SimpleRegistrationModal';
import { YouTubeEmbed } from '../components/common/YouTubeEmbed';
import { Course } from '../types';
import {
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { trackEvent } from '../lib/analytics';

export const HomePage: React.FC = () => {
  const { courses, videos, siteSettings, getHeroVideo } = useData();

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    trackEvent('page_view', undefined, { page: 'home_single_page' });
  }, []);

  const handleApply = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
    trackEvent('cta_click', course.id, {
      course_name: course.title,
      source: 'course_card_apply',
    });
  };

  const handleGeneralApply = () => {
    if (courses.length > 0) {
      setSelectedCourse(courses[0]);
    } else {
      setSelectedCourse(null);
    }
    setIsModalOpen(true);
  };

  const handleQuickApply1 = () => {
    let target = siteSettings.quick_btn1_course_id
      ? courses.find((c) => c.id === siteSettings.quick_btn1_course_id)
      : undefined;

    if (!target) {
      target = courses.find(
        (c) =>
          c.title.toLowerCase().includes('14-day') ||
          c.title.toLowerCase().includes('14 day') ||
          c.title.toLowerCase().includes('499')
      );
    }

    if (!target) {
      target = courses[0] || {
        id: siteSettings.quick_btn1_course_id || 'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9012',
        title: siteSettings.quick_btn1_course_name || '14-Day Ethical Hacking Program',
        slug: '14-days-ethical-hacking-program',
        tagline: '14 Days Intensive Ethical Hacking & Hands-on Cyber Training',
        summary:
          'A fast-paced, practical 14-day crash program covering cybersecurity fundamentals, network reconnaissance, web penetration, and defense techniques.',
        level: 'Beginner',
        duration_weeks: 2,
        duration_text: '14 Days',
        learning_mode: 'Live Daily Sessions & Hands-on Labs',
        hours_per_week: 10,
        fee_amount: 499,
        currency: 'INR',
        status: 'published',
        featured: true,
        certification_title: 'EV Certified Junior Ethical Hacker',
      };
    }

    setSelectedCourse(target);
    setIsModalOpen(true);
    trackEvent('cta_click', target.id, {
      course_name: target.title,
      source: 'quick_apply_btn_1',
    });
  };

  const handleQuickApply2 = () => {
    let target = siteSettings.quick_btn2_course_id
      ? courses.find((c) => c.id === siteSettings.quick_btn2_course_id)
      : undefined;

    if (!target) {
      target = courses.find(
        (c) =>
          c.title.toLowerCase().includes('offensive') ||
          c.title.toLowerCase().includes('full ethical') ||
          c.title.toLowerCase().includes('red team')
      );
    }

    if (!target) {
      target = (courses.length > 1 ? courses[1] : courses[0]) || {
        id: siteSettings.quick_btn2_course_id || 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
        title: siteSettings.quick_btn2_course_name || 'Full Ethical Hacking Course',
        slug: 'full-ethical-hacking-course',
        tagline: 'Learn Real-world Adversary Emulation, Active Directory Exploitation & Evasion',
        summary:
          'Comprehensive offensive security and red teaming masterclass from network penetration to Active Directory exploitation.',
        level: 'Advanced',
        duration_weeks: 16,
        duration_text: '16 Weeks',
        hours_per_week: 12,
        fee_amount: 64999,
        currency: 'INR',
        status: 'published',
        featured: true,
        certification_title: 'EV Certified Red Team Specialist',
      };
    }

    setSelectedCourse(target);
    setIsModalOpen(true);
    trackEvent('cta_click', target.id, {
      course_name: target.title,
      source: 'quick_apply_btn_2',
    });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Get active courses sorted strictly by admin display order (1, 2, 3...)
  const publishedCourses = courses.filter((c) => c.status === 'published');
  const baseCourses = publishedCourses.length > 0 ? publishedCourses : courses;
  const displayCourses = [...baseCourses].sort(
    (a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999)
  );

  // Get introduction / promotional video
  const heroVideo = getHeroVideo() || (videos.length > 0 ? videos[0] : null);
  const videoUrl = heroVideo?.youtube_video_id || heroVideo?.youtube_url || 'https://www.youtube.com/watch?v=inWWhr5tnEA';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* =========================================================================
          1. COURSES & PROGRAMS – FIRST SECTION (IMMEDIATE COURSE CARDS)
      ========================================================================== */}
      <section id="courses" className="pt-8 pb-16 sm:pt-12 sm:pb-20 bg-slate-50 border-b border-slate-200 scroll-mt-20 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          {/* Top Brand Identity & 2 Quick Apply Action Buttons (Admin Editable) */}
          <div className="text-center max-w-4xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              <span>EV Cyber Academy Private Limited</span>
            </div>

            {/* 2 Quick Apply Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1">
              {siteSettings.quick_btn1_enabled !== false && (
                <button
                  type="button"
                  onClick={handleQuickApply1}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:from-red-700 text-white font-black text-sm sm:text-base shadow-lg hover:shadow-xl hover:shadow-red-600/30 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer relative overflow-hidden group/btn"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                  <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
                  <span>
                    {siteSettings.quick_btn1_text ||
                      'Apply for ₹499 - 14 Days Ethical Hacking Program'}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              )}

              {siteSettings.quick_btn2_enabled !== false && (
                <button
                  type="button"
                  onClick={handleQuickApply2}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl hover:shadow-slate-900/25 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer relative overflow-hidden border border-slate-700 group/btn2"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover/btn2:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                  <ShieldCheck className="w-5 h-5 text-red-500 shrink-0" />
                  <span>
                    {siteSettings.quick_btn2_text || 'Apply to Full Ethical Hacking Course'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover/btn2:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>

          {/* Course Cards Grid - First thing student sees */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {displayCourses.map((course) => (
              <CourseCard key={course.id} course={course} onApply={handleApply} />
            ))}
          </div>

          {/* Quick General Application Banner */}
          <div className="max-w-5xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-white">
                Not sure which course is right for your background?
              </h3>
              <p className="text-xs text-slate-400">
                Submit a general registration and our admissions team will advise you directly.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGeneralApply}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs uppercase tracking-wider transition shrink-0 cursor-pointer shadow"
            >
              General Application
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. INTRODUCTION / PROMOTIONAL VIDEO
      ========================================================================== */}
      <section id="overview" className="py-14 sm:py-20 bg-white border-b border-slate-200 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              Overview
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Introduction to EV Cyber Academy
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Get an inside look at EV Cyber Academy&apos;s practical training methodology, cyber range labs, and technical programs.
            </p>
          </div>

          <div className="p-2 sm:p-3 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl">
            <YouTubeEmbed
              urlOrId={videoUrl}
              title={heroVideo?.title || 'EV Cyber Academy Overview'}
              description={heroVideo?.description || 'Introduction to practical cybersecurity training at EV Cyber Academy'}
              autoplay={false}
              muted={true}
              showControls={true}
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. SIMPLE CONTACT INFORMATION
      ========================================================================== */}
      <section id="contact" className="py-14 sm:py-20 bg-slate-50 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              Get in Touch
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Contact for Courses
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Have questions regarding our training programs or batch schedules? Contact EV Cyber Academy Private Limited.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {/* Phone / Helpline */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center mx-auto">
                <Phone className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Contact Number</h4>
              {siteSettings.contact_phone ? (
                <a
                  href={`tel:${siteSettings.contact_phone}`}
                  className="text-xs font-semibold text-slate-700 hover:text-red-600 transition block"
                >
                  {siteSettings.contact_phone}
                </a>
              ) : (
                <p className="text-xs text-slate-500">Contact through official email</p>
              )}
            </div>

            {/* Email */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center mx-auto">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Official Email</h4>
              <a
                href={`mailto:${siteSettings.contact_email}`}
                className="text-xs font-semibold text-slate-700 hover:text-red-600 transition block truncate"
              >
                {siteSettings.contact_email}
              </a>
            </div>

            {/* Office Location */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center mx-auto">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Location</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {siteSettings.contact_address || 'Bangalore & Online Worldwide'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. SIMPLE REGISTRATION MODAL
      ========================================================================== */}
      <SimpleRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCourse={selectedCourse}
      />
    </div>
  );
};
