import React, { useEffect } from 'react';
import { RegistrationForm } from '../components/registration/RegistrationForm';
import { Shield, CheckCircle2, Clock, Award, PhoneCall, MessageCircle, Mail } from 'lucide-react';
import { useData } from '../context/DataContext';
import { trackEvent } from '../lib/analytics';

export const RegisterPage: React.FC = () => {
  const { siteSettings } = useData();

  useEffect(() => {
    trackEvent('page_view', undefined, { page: 'registration_page' });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Admissions Guidance & Trust */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5" />
                <span>Admissions &amp; Cohort Enrollment</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Apply for EV Cyber Academy Cohorts
              </h1>

              <p className="text-sm text-slate-600 leading-relaxed">
                Reserve your cyber range seat in our next intensive batch. Our admissions panel reviews each candidate profile to ensure prerequisite alignment and cohort standard.
              </p>
            </div>

            {/* What to expect timeline */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Admissions Roadmap: What Happens Next
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Application Intake</h4>
                    <p className="text-slate-500 mt-0.5 leading-relaxed">
                      Instant generation of your unique Lead Reference ID (EV-XXXX).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Counselor Callback (Within 24 Hours)</h4>
                    <p className="text-slate-500 mt-0.5 leading-relaxed">
                      A dedicated admissions advisor contacts you via Call/WhatsApp to discuss technical prerequisites and batch schedule.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Range Access &amp; Cohort Onboarding</h4>
                    <p className="text-slate-500 mt-0.5 leading-relaxed">
                      Dedicated lab instance provisioning, syllabus onboarding, and Discord community access.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Desk */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-lg space-y-3">
              <h4 className="text-sm font-bold text-white">Need Quick Answers?</h4>
              <p className="text-xs text-slate-300">
                Connect directly with our admissions lead via WhatsApp or phone.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                {siteSettings.contact_whatsapp && (
                  <a
                    href={`https://wa.me/${siteSettings.contact_whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20EV%20Cyber%20Academy,%20I%20have%20an%20admissions%20question.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Desk</span>
                  </a>
                )}
                {siteSettings.contact_phone ? (
                  <a
                    href={`tel:${siteSettings.contact_phone}`}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-red-400" />
                    <span>Call {siteSettings.contact_phone}</span>
                  </a>
                ) : (
                  <a
                    href={`mailto:${siteSettings.contact_email}?subject=Admissions%20Inquiry`}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Mail className="w-3.5 h-3.5 text-red-400" />
                    <span>{siteSettings.contact_email}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Actual Registration Form */}
          <div className="lg:col-span-7">
            <RegistrationForm />
          </div>
        </div>
      </div>
    </div>
  );
};

