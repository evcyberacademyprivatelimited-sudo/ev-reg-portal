import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Play, CheckCircle2, Terminal, Users, Award } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { YouTubeEmbed } from '../common/YouTubeEmbed';
import { trackEvent } from '../../lib/analytics';

export const HeroSection: React.FC = () => {
  const { siteSettings, getHeroVideo } = useData();
  const heroVideo = getHeroVideo();

  const handleApplyClick = () => {
    trackEvent('cta_click', undefined, { source: 'hero_primary_apply' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 text-white pt-16 pb-20 lg:pt-24 lg:pb-28">
      {/* Subtle architectural background elements (corporate grid, not hacker matrix) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Red accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-semibold tracking-wide shadow-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>{siteSettings.hero_badge}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            {siteSettings.hero_headline_prefix}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-rose-400">
              {siteSettings.hero_headline_highlight}
            </span>
          </h1>

          {/* Value proposition subheadline */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            {siteSettings.hero_subheadline}
          </p>

          {/* Primary Action Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              onClick={handleApplyClick}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-base shadow-xl hover:shadow-brand transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{siteSettings.primary_cta_text}</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="#video-spotlight"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-base transition flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-red-400 fill-current" />
              <span>{siteSettings.secondary_cta_text}</span>
            </a>
          </div>

          {/* Trust bullet markers */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Practical Cyber Ranges</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Live Enterprise SIEM & EDR Stacks</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>1-on-1 Senior Placement Counsel</span>
            </span>
          </div>
        </div>

        {/* Video / Range Spotlight Hero Unit */}
        {heroVideo && (
          <div id="video-spotlight" className="mt-14 max-w-4xl mx-auto scroll-mt-24">
            <div className="p-2 sm:p-3 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-950 border border-slate-800 shadow-2xl">
              <YouTubeEmbed
                urlOrId={heroVideo.youtube_video_id || heroVideo.youtube_url}
                title={heroVideo.title}
                description={heroVideo.description}
                autoplay={heroVideo.autoplay}
                muted={heroVideo.muted_autoplay}
                showControls={heroVideo.show_controls}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

