import React from 'react';
import { Link } from 'react-router-dom';
import { Course, VideoItem } from '../../types';
import { YouTubeEmbed } from '../common/YouTubeEmbed';
import {
  Shield,
  Calendar,
  Clock,
  Award,
  Users,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
} from 'lucide-react';
import { trackEvent } from '../../lib/analytics';
import { useData } from '../../context/DataContext';

interface CourseHeroProps {
  course: Course;
  video?: VideoItem;
}

export const CourseHero: React.FC<CourseHeroProps> = ({ course, video }) => {
  const { siteSettings } = useData();

  const handleApplyClick = () => {
    trackEvent('cta_click', course.id, {
      source: 'course_detail_hero_apply',
      course_title: course.title,
    });
  };

  const levelColor = {
    Beginner: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    Intermediate: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Advanced: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'All Levels': 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  }[course.level] || 'bg-slate-500/20 text-slate-300 border-slate-500/30';

  return (
    <section className="relative bg-slate-950 text-white pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Course Details & Sales CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
              {course.badge_text && (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-black uppercase tracking-wider text-white bg-red-600 rounded-md shadow-sm">
                  <Shield className="w-3.5 h-3.5 fill-current" />
                  <span>{course.badge_text}</span>
                </span>
              )}

              <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${levelColor}`}>
                {course.level} Level
              </span>

              {course.seats_remaining != null && course.seats_remaining > 0 ? (
                <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{course.seats_remaining} Seats Remaining</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Cohort Admissions Active</span>
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-lg text-red-400 font-semibold leading-snug">
              {course.tagline}
            </p>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {course.summary}
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
                  Duration
                </span>
                <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-red-500" />
                  <span>{course.duration_weeks} Weeks ({course.hours_per_week}h/w)</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
                  Next Batch
                </span>
                <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-red-500" />
                  <span>
                    {course.batch_start_date
                      ? new Date(course.batch_start_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'Rolling Intake'}
                  </span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
                  Program Fee
                </span>
                <span className="text-base font-black text-white mt-0.5 block">
                  ₹{course.fee_amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Action Group */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                to={`/register?course=${course.id}`}
                onClick={handleApplyClick}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black text-base shadow-xl hover:shadow-brand transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Apply &amp; Reserve Seat</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>

              {siteSettings.contact_whatsapp && (
                <a
                  href={`https://wa.me/${siteSettings.contact_whatsapp.replace(/[^0-9]/g, '')}?text=Hi,%20I%20have%20questions%20about%20the%20${encodeURIComponent(course.title)}%20program.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>Talk to Admissions Lead</span>
                </a>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Certification Awarded:{' '}
                <strong className="text-slate-200">{course.certification_title}</strong>
              </span>
            </div>
          </div>

          {/* Right Column: Video or Visual Card */}
          <div className="lg:col-span-5">
            {video ? (
              <div className="p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
                <YouTubeEmbed
                  urlOrId={video.youtube_video_id || video.youtube_url}
                  title={video.title}
                  description={video.description}
                  autoplay={video.autoplay}
                  muted={video.muted_autoplay}
                  showControls={video.show_controls}
                  courseId={course.id}
                />
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-8 shadow-2xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Cohort Registration Open</h3>
                    <p className="text-xs text-slate-400">Strictly 20 Candidates Per Range</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Private cloud cyber range instances provisioned for every candidate</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Live adversary emulation and triage scenarios</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Direct recruiter referrals and technical portfolio review</span>
                  </div>
                </div>

                <Link
                  to={`/register?course=${course.id}`}
                  onClick={handleApplyClick}
                  className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Register for Batch</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

