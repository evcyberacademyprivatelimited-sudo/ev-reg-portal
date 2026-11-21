import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Logo } from '../components/common/Logo';
import { Footer } from '../components/common/Footer';
import { Course } from '../types';
import { trackEvent } from '../lib/analytics';
import {
  ShieldCheck,
  Clock,
  Laptop,
  ArrowRight,
  Sparkles,
  Lock,
  User,
  Phone,
  CheckCircle2,
  Loader2,
  BookOpen,
} from 'lucide-react';

// Built-in fallback course object for instant 0ms rendering on /499
const FALLBACK_CAMPAIGN_COURSE: Course = {
  id: 'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9012',
  slug: '499',
  title: '14-Day Ethical Hacking Program',
  tagline: '14 Days Intensive Ethical Hacking & Hands-on Cyber Training',
  summary:
    'A fast-paced, practical 14-day crash program covering cybersecurity fundamentals, network reconnaissance, web penetration, and defense techniques.',
  description:
    'A fast-paced, practical 14-day crash program covering cybersecurity fundamentals, network reconnaissance, web penetration, and defense techniques. Includes live daily mentor-led sessions, virtual cyber range access, and official certificate of completion.',
  level: 'Beginner',
  duration_weeks: 2,
  duration_text: '14 Days',
  duration_unit: 'Days',
  duration_value: 14,
  learning_mode: 'Live Daily Sessions & Hands-on Labs',
  hours_per_week: 10,
  fee_amount: 499,
  original_price: 4999,
  currency: 'INR',
  status: 'published',
  featured: true,
  badge_text: 'Intensive Cyber Defense Cohort',
  certification_title: 'EV Certified Junior Ethical Hacker',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  syllabus: [],
  outcomes: ['Network Penetration Testing', 'Web Vulnerability Assessment', 'Cyber Defense Fundamentals'],
  prerequisites: ['Basic computer literacy', 'Passion to learn ethical hacking'],
  tools_covered: ['Kali Linux', 'Nmap', 'Burp Suite', 'Wireshark', 'Metasploit'],
};

// Known dummy or test numbers to reject
const DUMMY_NUMBERS = new Set([
  '9876543210',
  '1234567890',
  '0123456789',
  '9898989898',
  '9090909090',
  '9123456789',
  '9988776655',
  '1122334455',
  '1212121212',
]);

const isDummyNumber = (phone10: string): boolean => {
  if (DUMMY_NUMBERS.has(phone10)) return true;
  // All same digits (e.g. 9999999999, 8888888888)
  if (/^(\d)\1{9}$/.test(phone10)) return true;
  return false;
};

export const CampaignCoursePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { courses, siteSettings, leads, checkDuplicateLead, submitRegistration } = useData();

  // Registration modal is directly visible and locked on campaign landing
  const [isModalOpen, setIsModalOpen] = useState(true);

  // Form states
  const [studentName, setStudentName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedLeadNumber, setSubmittedLeadNumber] = useState<string | null>(null);

  // Look up matching course from Supabase if available
  const matchingCourse =
    courses.find(
      (c) =>
        (slug && c.slug && c.slug.toLowerCase() === slug.toLowerCase()) ||
        (slug === '499' && (c.slug === '499' || c.fee_amount === 499 || c.title.includes('499') || c.title.toLowerCase().includes('14-day')))
    ) ||
    courses.find((c) => c.slug === '499') ||
    courses.find((c) => c.fee_amount === 499);

  // ZERO REDIRECTS: Seamlessly use live course if loaded, otherwise instant fallback course
  const course: Course = matchingCourse || FALLBACK_CAMPAIGN_COURSE;

  // Track campaign landing view on mount
  useEffect(() => {
    trackEvent('page_view', course.id, {
      page: 'campaign_landing_page',
      slug: slug || '499',
      course_title: course.title,
    });
  }, [course.id, course.title, slug]);

  // Clean 10-digit phone calculation
  const cleanPhone = contactNumber.replace(/\D/g, '');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    let digits = val.replace(/\D/g, '');
    // If pasted with country code (+91) or leading zero, normalize
    if (digits.length === 12 && digits.startsWith('91')) {
      digits = digits.slice(2);
    } else if (digits.length === 11 && digits.startsWith('0')) {
      digits = digits.slice(1);
    }
    setContactNumber(digits.slice(0, 10));
    if (errorMessage) setErrorMessage(null);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentName(e.target.value);
    if (errorMessage) setErrorMessage(null);
  };

  // Submission handler with friendly Thanglish validation rules
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Full name validation (minimum 3 letters)
    if (!studentName.trim() || studentName.trim().length < 3) {
      setErrorMessage('Proper-ah unga full name enter pannunga bro (minimum 3 letters).');
      return;
    }

    // 2. Mobile validation (10 digits starting with 6, 7, 8, or 9)
    if (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMessage('10-digit valid mobile number enter pannunga bro (6, 7, 8, or 9-la start aaganum).');
      return;
    }

    // 3. Dummy / Repeated number check
    if (isDummyNumber(cleanPhone)) {
      setErrorMessage('Fake/dummy number podadheenga bro — unga original WhatsApp number enter pannunga.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 4. Duplicate number check (Supabase RPC + local cache)
      const syntheticEmail = `${cleanPhone}@whatsapp.evcyberacademy.in`;
      const dupCheck = await checkDuplicateLead(syntheticEmail, course.id);
      const localPhoneMatch = leads.some(
        (l) => l.course_id === course.id && (l.phone.replace(/\D/g, '').endsWith(cleanPhone) || l.email.startsWith(cleanPhone))
      );

      if (dupCheck.isDuplicate || localPhoneMatch) {
        setIsSubmitting(false);
        setErrorMessage('Indha number already register aayiduchu! Enga team WhatsApp-la ungalukku contact pannuvaanga.');
        return;
      }

      // Submit lead to Supabase
      const result = await submitRegistration({
        full_name: studentName.trim(),
        email: syntheticEmail,
        phone: `+91 ${cleanPhone}`,
        course_id: course.id,
        college_company: 'Not Specified',
        experience_level: 'Student / Fresher',
        referral_source: 'Campaign /499 Page',
        utm_campaign: 'campaign_499',
      });

      setIsSubmitting(false);

      if (result.success && result.lead) {
        setSubmittedLeadNumber(result.lead.lead_number);
      } else if (
        result.isDuplicate ||
        result.error?.toLowerCase().includes('already') ||
        result.error?.toLowerCase().includes('duplicate')
      ) {
        setErrorMessage('Indha number already register aayiduchu! Enga team WhatsApp-la ungalukku contact pannuvaanga.');
      } else {
        setErrorMessage(result.error || 'Registration submit aagala. Konjam kazhichu try pannunga bro.');
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage((err as Error).message || 'Registration submit aagala. Konjam kazhichu try pannunga bro.');
    }
  };

  // Course display attributes
  const durationText =
    course.duration_text ||
    (course.duration_weeks ? `${course.duration_weeks} Weeks` : '14 Days');
  const learningMode =
    course.learning_mode || course.tagline || 'Live Online & Hands-on Cyber Labs';
  const bannerLabel =
    course.badge_text ||
    siteSettings.default_card_banner_text ||
    'Intensive Cyber Defense Cohort';

  const nowPrice = course.fee_amount ?? 499;
  const originalPrice = course.original_price ?? 4999;
  const hasDiscount = originalPrice > nowPrice && originalPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - nowPrice) / originalPrice) * 100)
    : 90;

  const handleApplyClick = () => {
    setIsModalOpen(true);
    trackEvent('cta_click', course.id, {
      course_name: course.title,
      source: 'campaign_page_apply_now',
    });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-between selection:bg-red-600 selection:text-white">
      {/* Top Header Bar with Logo */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center focus:outline-none">
            <Logo variant="light" size="md" />
          </Link>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/60 border border-red-800/50 text-red-400 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Admissions Active</span>
          </div>
        </div>
      </header>

      {/* Main Campaign Hero Section */}
      <main className="flex-1 py-8 sm:py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-center">
        {/* Cyber Matrix Grid Background & Red Ambient Glows */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ef444408_1px,transparent_1px),linear-gradient(to_bottom,#ef444408_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto w-full space-y-6">
          {/* Top Trust Badge */}
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
              {/* Title & Learning Mode */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                  {course.title}
                </h1>
                <p className="text-sm font-semibold text-red-400">
                  {learningMode}
                </p>
              </div>

              {/* Full Course Description */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal whitespace-pre-line">
                  {course.description || course.summary}
                </p>
              </div>

              {/* Quick Badges Row (Duration & Format) */}
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

        {/* Locked Thanglish Campaign Registration Modal */}
        {isModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-[#090d16] rounded-3xl shadow-2xl border border-slate-800 text-white overflow-hidden animate-fade-in"
            >
              {/* Top Accent Gradient Bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />

              {/* Ambient Red Glow in corner */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-red-600/15 rounded-full blur-2xl pointer-events-none" />

              {/* Note: NO Close Button (X is locked on /499) */}

              {submittedLeadNumber ? (
                /* Success Screen (Thanglish) */
                <div className="p-8 sm:p-10 text-center space-y-6 relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-950/50">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-white tracking-tight">
                      Slot Confirmed! 🎉
                    </h3>

                    <div className="inline-block px-3 py-1 rounded-full bg-red-950/60 border border-red-800/60 text-red-400 text-xs font-mono font-bold tracking-wider">
                      Application Ref: {submittedLeadNumber}
                    </div>

                    <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto leading-relaxed pt-2 font-normal">
                      Super! Unga registration EV Cyber Academy-la confirm aayiduchu. Enga team seekirama unga WhatsApp number-ku batch details &amp; group link anuppuvaanga!
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="w-full py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition cursor-pointer border border-slate-700"
                    >
                      View Course Details
                    </button>
                  </div>
                </div>
              ) : (
                /* Registration Form (Thanglish + Locked) */
                <div className="p-6 sm:p-8 space-y-6 relative z-10">
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-500">
                      EV Cyber Academy Private Limited
                    </span>
                    <h2 className="text-2xl font-black text-white tracking-tight mt-0.5">
                      Direct Slot Registration
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Fill pannunga bro, instant-ah unga slot book aagidum.
                    </p>
                  </div>

                  {/* High-Visibility Urgency Badge */}
                  <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-950/80 via-amber-950/60 to-red-950/80 border border-red-500/50 text-amber-300 shadow-md">
                    <div className="flex items-center gap-2">
                      <span className="text-sm animate-bounce">🔥</span>
                      <span className="text-xs font-mono font-black tracking-wider uppercase text-amber-200">
                        🔥 Only 3 Slots Remaining
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                      </span>
                      <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest hidden sm:inline">
                        Live
                      </span>
                    </div>
                  </div>

                  {/* Selected Course Display */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-900/40 text-red-400 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          Selected Program
                        </p>
                        <p className="text-xs font-bold text-white truncate">
                          {course.title}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Fee</span>
                      <span className="font-mono text-sm font-bold text-emerald-400">₹{nowPrice}</span>
                    </div>
                  </div>

                  {/* Validation / Error Message Alert */}
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-xs leading-relaxed flex items-start gap-2.5 shadow-md">
                      <span className="text-red-400 font-bold shrink-0 text-sm">⚠️</span>
                      <span className="font-medium">{errorMessage}</span>
                    </div>
                  )}

                  {/* Thanglish Simple Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 1. Unga Full Name * */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                        Unga Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          required
                          placeholder="Unga name enter pannunga (e.g. Karthik R)"
                          value={studentName}
                          onChange={handleNameChange}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition"
                        />
                      </div>
                    </div>

                    {/* 2. WhatsApp / Contact Number * */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                          WhatsApp / Contact Number <span className="text-red-500">*</span>
                        </label>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded transition ${
                            cleanPhone.length === 10
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                              : 'bg-slate-900 text-slate-400 border border-slate-800'
                          }`}
                        >
                          {cleanPhone.length}/10 digits
                        </span>
                      </div>
                      <div className="relative flex items-center">
                        <div className="absolute left-3.5 flex items-center gap-1.5 pointer-events-none text-slate-400">
                          <Phone className="w-4 h-4 text-slate-500" />
                          <span className="text-xs font-mono font-bold text-slate-400 border-r border-slate-700 pr-2">
                            +91
                          </span>
                        </div>
                        <input
                          type="tel"
                          required
                          placeholder="10-digit WhatsApp number podunga"
                          value={contactNumber}
                          onChange={handlePhoneChange}
                          maxLength={10}
                          className="w-full pl-20 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition font-mono"
                        />
                      </div>
                      {/* Helper Micro-Copy below Phone Input */}
                      <p className="text-[11px] text-amber-300/90 leading-tight mt-1.5 font-sans">
                        📲 Live class Zoom link, Lab access &amp; WhatsApp group invite indha number-ku dhaan varum. So correct-ana WhatsApp number podunga!
                      </p>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 via-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:from-red-700 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-red-950/50 hover:shadow-red-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Register aagudhu, wait pannunga...</span>
                          </>
                        ) : (
                          <>
                            <span>Confirm My Slot (₹{nowPrice})</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] text-center text-slate-500 pt-1 font-mono">
                      EV Cyber Academy &bull; Official Direct Admission Desk
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Official Footer with Counseling Contacts */}
      <Footer />
    </div>
  );
};