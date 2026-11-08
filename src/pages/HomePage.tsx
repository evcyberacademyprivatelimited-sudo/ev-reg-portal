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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Get active courses
  const publishedCourses = courses.filter((c) => c.status === 'published');
  const displayCourses = publishedCourses.length > 0 ? publishedCourses : courses;

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
          {/* Welcome Heading */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              <span>EV Cyber Academy Private Limited</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Scroll Down to Apply
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Click to Apply on any program below to submit your official registration.
            </p>
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
