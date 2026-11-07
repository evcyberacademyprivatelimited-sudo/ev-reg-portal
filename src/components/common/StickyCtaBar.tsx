import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Calendar, Users, ArrowRight } from 'lucide-react';
import { Course } from '../../types';
import { trackEvent } from '../../lib/analytics';

interface StickyCtaBarProps {
  course?: Course;
  customTitle?: string;
  onApplyClick?: () => void;
}

export const StickyCtaBar: React.FC<StickyCtaBarProps> = ({
  course,
  customTitle,
  onApplyClick,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down more than 350px
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  const targetUrl = course ? `/register?course=${course.id}` : '/register';
  const displayTitle = customTitle || course?.title || 'EV Cyber Defense Cohort';
  const seatsLeft = course?.seats_remaining || 7;

  const handleClick = () => {
    trackEvent('cta_click', course?.id, { source: 'sticky_bar' });
    if (onApplyClick) onApplyClick();
  };

  return (
    <aside
      aria-label="Registration bar"
      className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-red-500/30 text-white py-3 px-4 shadow-2xl transition-transform duration-300 transform translate-y-0 animate-fade-in"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Info */}
        <div className="min-w-0 flex items-center gap-4">
          <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold truncate text-white">{displayTitle}</h4>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                <Users className="w-3 h-3" />
                <span>{seatsLeft} seats left</span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
              {course?.batch_start_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>Next Batch: {new Date(course.batch_start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </span>
              )}
              {course?.duration_weeks && (
                <span className="hidden sm:inline">&bull; {course.duration_weeks} Weeks Intensive</span>
              )}
              {course?.fee_amount ? (
                <span className="font-semibold text-slate-200">
                  &bull; ₹{course.fee_amount.toLocaleString('en-IN')}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to={targetUrl}
            onClick={handleClick}
            className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm shadow-lg hover:shadow-brand transition-all flex items-center gap-2 group cursor-pointer"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </aside>
  );
};
