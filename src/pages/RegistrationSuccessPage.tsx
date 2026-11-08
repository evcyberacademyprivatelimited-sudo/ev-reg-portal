import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import {
  CheckCircle2,
  Calendar,
  PhoneCall,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { trackEvent } from '../lib/analytics';

export const RegistrationSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get('leadId');
  const leadNum = searchParams.get('leadNum') || 'EV-CONFIRMED';
  const { leads, courses, siteSettings } = useData();

  const currentLead = leads.find((l) => l.id === leadId);
  const enrolledCourse = currentLead
    ? courses.find((c) => c.id === currentLead.course_id)
    : null;

  useEffect(() => {
    trackEvent('page_view', currentLead?.course_id, {
      page: 'registration_success',
      lead_number: leadNum,
    });
    window.scrollTo(0, 0);
  }, [currentLead, leadNum]);

  return (
    <div className="min-h-screen bg-slate-50 py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-8 sm:p-12 text-center space-y-8">
          {/* Animated Success Badge */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 shadow-md ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-3">
            <span className="inline-block px-3.5 py-1 rounded-full bg-red-100 text-red-700 font-mono text-xs font-black uppercase tracking-wider">
              Application ID: {leadNum}
            </span>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Registration Recorded Successfully!
            </h1>

            <p className="text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              Thank you for applying to <strong className="text-slate-900 font-bold">EV Cyber Academy</strong>. Your application has been logged into our admissions command system.
            </p>
          </div>

          {/* Lead Summary Card */}
          {currentLead && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-bold text-slate-900">{currentLead.full_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Selected Program:</span>
                <span className="font-bold text-slate-900 truncate ml-2">
                  {enrolledCourse?.title || currentLead.course_title}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Contact Email:</span>
                <span className="font-mono text-slate-700">{currentLead.email}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Admissions Status:</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Queue Priority Review
                </span>
              </div>
            </div>
          )}

          {/* What to Expect Next */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white text-left space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400">
              <Clock className="w-4 h-4" />
              <span>What Happens Next (Counselor Review Process)</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Admissions Counselor Callback:</strong> An academic advisor will reach out via call/WhatsApp within 24 hours to verify your background and discuss schedule fit.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>No Payment Required Upfront:</strong> Your application reserves your seat in line without immediate financial commitment.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Range Lab Tour:</strong> You can request a private screen walkthrough of our live-fire cyber range during your counselor call.
                </span>
              </li>
            </ul>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {siteSettings.contact_whatsapp ? (
              <a
                href={`https://wa.me/${siteSettings.contact_whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20EV%20Cyber%20Academy,%20I%20just%20submitted%20my%20application%20with%20reference%20${encodeURIComponent(leadNum)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Connect on WhatsApp Now</span>
              </a>
            ) : (
              <a
                href={`mailto:${siteSettings.contact_email}?subject=Application%20Reference%20${encodeURIComponent(leadNum)}`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-red-500" />
                <span>Email Admissions Desk</span>
              </a>
            )}

            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition flex items-center justify-center gap-2"
            >
              <span>Return to Homepage</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

