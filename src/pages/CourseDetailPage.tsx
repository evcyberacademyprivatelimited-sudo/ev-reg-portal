import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { CourseHero } from '../components/courses/CourseHero';
import { CourseCurriculum } from '../components/courses/CourseCurriculum';
import { CourseKeyHighlights } from '../components/courses/CourseKeyHighlights';
import { StickyCtaBar } from '../components/common/StickyCtaBar';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { FaqSection } from '../components/home/FaqSection';
import { RegistrationForm } from '../components/registration/RegistrationForm';
import { trackEvent } from '../lib/analytics';
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  Award,
  Users,
  PhoneCall,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getCourseBySlug, getCourseVideo, siteSettings } = useData();

  const course = slug ? getCourseBySlug(slug) : undefined;

  useEffect(() => {
    if (course) {
      trackEvent('course_view', course.id, {
        slug: course.slug,
        title: course.title,
      });
      window.scrollTo(0, 0);
    }
  }, [course]);

  if (!course) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Program Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          The requested course URL does not exist or may have been updated.
        </p>
        <Link
          to="/programs"
          className="px-6 py-3 rounded-xl bg-red-600 text-white font-bold text-sm shadow hover:bg-red-700 transition"
        >
          Browse All Available Programs
        </Link>
      </div>
    );
  }

  const promoVideo = getCourseVideo(course.id);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Course Hero Section */}
      <CourseHero course={course} video={promoVideo} />

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Curriculum & Learning Outcomes */}
          <div className="lg:col-span-7 space-y-12">
            {/* Detailed Course Overview */}
            {course.description && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Program Architecture &amp; Methodology
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {course.description}
                </p>
              </div>
            )}

            {/* Curriculum Accordion Breakdown */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Comprehensive Syllabus &amp; Lab Schedule
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  100% hands-on. Every single phase includes enterprise cyber range drills.
                </p>
              </div>

              <CourseCurriculum syllabus={course.syllabus} />
            </div>

            {/* Target Capabilities, Tools & Prerequisites */}
            <CourseKeyHighlights course={course} />
          </div>

          {/* Right Column: Sticky Embedded Application Card & Counselor Help */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            {/* Embedded Registration Form */}
            <div id="apply-card">
              <RegistrationForm preselectedCourseId={course.id} />
            </div>

            {/* Direct Admissions Helpline Box */}
            <div className="p-6 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Need Pre-Enrollment Guidance?</h4>
                  <p className="text-xs text-slate-400">Speak with an Academic Counselor</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Not sure if your technical background satisfies prerequisites for {course.title}? Schedule a 10-minute technical evaluation call with our lead instructor.
              </p>

              <div className="pt-1 flex flex-col gap-2">
                <a
                  href={`https://wa.me/${siteSettings.contact_whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20EV%20Cyber%20Academy,%20I%20have%20questions%20regarding%20${encodeURIComponent(course.title)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp ({siteSettings.contact_phone})</span>
                </a>

                <a
                  href={`tel:${siteSettings.contact_phone}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs transition flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-red-500" />
                  <span>Call Admissions Lead Directly</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alumni Testimonials */}
      <TestimonialsSection />

      {/* Objection Handling FAQs */}
      <FaqSection />

      {/* Sticky Bottom CTA Bar */}
      <StickyCtaBar course={course} />
    </div>
  );
};

