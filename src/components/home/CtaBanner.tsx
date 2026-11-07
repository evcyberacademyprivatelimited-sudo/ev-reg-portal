import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

export const CtaBanner: React.FC = () => {
  const handleApplyClick = () => {
    trackEvent('cta_click', undefined, { source: 'bottom_cta_banner' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white py-16 sm:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,0,0,0.25),transparent_70%)] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/20 border border-white/20 text-white text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-white" />
          <span>Next Cohort Registration Closing Soon</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          Ready to Train Like a Tier-1 Cyber Defense Specialist?
        </h2>

        <p className="text-red-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Batch seats are strictly capped to maintain 1-on-1 cyber range lab mentorship and dedicated infrastructure access.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            onClick={handleApplyClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-950 hover:bg-black text-white font-black text-base shadow-2xl hover:shadow-brand transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Apply For Admission Now</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-red-100">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>No upfront payment required to apply</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Counselor review call within 24 hours</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Dedicated Cyber Range Seat Reservation</span>
          </span>
        </div>
      </div>
    </section>
  );
};
