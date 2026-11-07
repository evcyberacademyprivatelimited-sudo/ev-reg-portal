import React, { useEffect } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { TrustMetrics } from '../components/home/TrustMetrics';
import { FeaturedCourses } from '../components/home/FeaturedCourses';
import { AcademyIntro } from '../components/home/AcademyIntro';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { FaqSection } from '../components/home/FaqSection';
import { CtaBanner } from '../components/home/CtaBanner';
import { StickyCtaBar } from '../components/common/StickyCtaBar';
import { trackEvent } from '../lib/analytics';

export const HomePage: React.FC = () => {
  useEffect(() => {
    trackEvent('page_view');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <HeroSection />
      <TrustMetrics />
      <FeaturedCourses />
      <AcademyIntro />
      <TestimonialsSection />
      <FaqSection />
      <CtaBanner />
      <StickyCtaBar customTitle="EV Cyber Academy Admissions" />
    </div>
  );
};
