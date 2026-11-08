import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { CourseCard } from '../components/courses/CourseCard';
import { SimpleRegistrationModal } from '../components/registration/SimpleRegistrationModal';
import { YouTubeEmbed } from '../components/common/YouTubeEmbed';
import { Course } from '../types';
import {
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Play,
  Mail,
  Phone,
  MapPin,
  Clock,
  Sparkles,
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
          1. WELCOME HEADING / CORPORATE HERO
      ========================================================================== */}
      <section className="bg-slate-950 text-white pt-14 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-800 relative overflow-hidden">
        {/* Subtle corporate grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Corporate Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-red-500" />
            <span>EV Cyber Academy Private Limited</span>
          </div>

          {/* Main Welcome Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Industry-Standard Cybersecurity &amp; Defense Programs
          </h1>

          {/* Short Subheading */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Welcome to the official course registration platform. Browse the available programs below, choose your track, and submit your registration directly.
          </p>

          {/* Action Button to scroll directly to Courses */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => scrollToSection('courses')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm shadow-xl hover:shadow-brand transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Courses &amp; Apply</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('overview')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 text-red-400 fill-current" />
              <span>Watch Academy Video</span>
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
              Academy Introduction &amp; Training Overview
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
          3. COURSES & PROGRAMS – MAIN SECTION (THE STAR OF THE PAGE)
      ========================================================================== */}
      <section id="courses" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200 scroll-mt-16 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Main Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Available Programs</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Courses &amp; Programs
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              Explore our comprehensive cybersecurity training tracks. Select a course and click <strong className="text-slate-900 font-semibold">Apply Now</strong> to register your application online.
            </p>
          </div>

          {/* Minimalist Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {displayCourses.map((course) => (
              <CourseCard key={course.id} course={course} onApply={handleApply} />
            ))}
          </div>

          {/* Quick Apply Banner */}
          <div className="max-w-5xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-white">
                Not sure which course is right for your background?
              </h3>
              <p className="text-xs text-slate-400">
                Submit a general registration and our team will evaluate your profile and advise you directly.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGeneralApply}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition shrink-0 cursor-pointer shadow"
            >
              General Application
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. SIMPLE CONTACT INFORMATION
      ========================================================================== */}
      <section id="contact-info" className="py-14 sm:py-20 bg-white">
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
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
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
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
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
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
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
