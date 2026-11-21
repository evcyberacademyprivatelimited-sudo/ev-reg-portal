import React, { useState } from 'react';
import { Volume2, VolumeX, Play, ShieldCheck, ExternalLink } from 'lucide-react';
import { buildYouTubeEmbedUrl, extractYouTubeId } from '../../lib/youtube';
import { trackEvent } from '../../lib/analytics';

interface YouTubeEmbedProps {
  urlOrId: string;
  title: string;
  autoplay?: boolean;
  muted?: boolean;
  showControls?: boolean;
  privacyEnhanced?: boolean;
  courseId?: string;
  className?: string;
  description?: string;
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  urlOrId,
  title,
  autoplay = true,
  muted = true,
  showControls = true,
  privacyEnhanced = true,
  courseId,
  className = '',
  description,
}) => {
  const [isMuted, setIsMuted] = useState(muted);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [hasInteracted, setHasInteracted] = useState(false);

  const videoId = extractYouTubeId(urlOrId);

  if (!videoId) {
    return (
      <div className="w-full aspect-video bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-400 p-6 text-center">
        <p className="font-semibold text-slate-300">Video currently unavailable</p>
        <p className="text-xs text-slate-500 mt-1">Please check the YouTube URL or video ID in Admin.</p>
      </div>
    );
  }

  const embedUrl = buildYouTubeEmbedUrl(videoId, {
    autoplay: isPlaying,
    muted: isMuted,
    controls: showControls,
    privacyEnhanced,
  });

  const handleStartPlay = () => {
    setIsPlaying(true);
    setIsMuted(false);
    setHasInteracted(true);
    trackEvent('video_play', courseId, {
      title,
      videoId,
      action: 'play_with_sound',
    });
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    if (!hasInteracted) {
      setHasInteracted(true);
      trackEvent('video_play', courseId, {
        title,
        videoId,
        action: isMuted ? 'unmute' : 'mute',
      });
    }
  };

  return (
    <div className={`relative group rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl ${className}`}>
      {/* 16:9 Aspect Ratio Frame */}
      <div className="relative w-full aspect-video">
        {!isPlaying ? (
          <div
            onClick={handleStartPlay}
            className="w-full h-full relative cursor-pointer group/thumb overflow-hidden flex items-center justify-center bg-slate-950"
            title="Click to play video"
          >
            {/* Lightweight Thumbnail Preview */}
            <img
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300 opacity-90 group-hover/thumb:opacity-100"
            />
            {/* Ambient Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

            {/* Glowing Cyber Play Button */}
            <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600/90 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-600/50 group-hover/thumb:scale-110 transition-all duration-300 border-2 border-white/20">
              <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white translate-x-0.5" />
            </div>

            <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-white text-xs pointer-events-none">
              <span className="font-bold truncate drop-shadow-md">{title}</span>
              <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] font-mono border border-white/20 shrink-0">
                Click to Play
              </span>
            </div>
          </div>
        ) : (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0 absolute inset-0"
          />
        )}

        {/* Video overlay controls & unmute helper banner if muted autoplay is active */}
        {isMuted && isPlaying && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
            <button
              onClick={toggleMute}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-red-600 text-white text-xs font-semibold backdrop-blur-md border border-slate-700/80 transition shadow-lg cursor-pointer"
              title="Click to enable sound"
            >
              <VolumeX className="w-4 h-4 text-red-400 group-hover:text-white" />
              <span>Click to Unmute Sound</span>
            </button>
          </div>
        )}

        {/* Unmute / Audio indicator when unmuted */}
        {!isMuted && isPlaying && (
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={toggleMute}
              type="button"
              className="p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 transition"
              title="Mute audio"
            >
              <Volume2 className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        )}
      </div>

      {/* Video caption / badge footer */}
      <div className="p-4 bg-slate-900/95 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-red-600/20 text-red-400 border border-red-500/30">
              OFFICIAL STREAM
            </span>
            <h4 className="text-sm font-semibold text-white truncate">{title}</h4>
          </div>
          {description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-1">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Privacy-Enhanced</span>
          </div>
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
          >
            <span>YouTube</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

