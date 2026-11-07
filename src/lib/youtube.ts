/**
 * YouTube Utility functions for EV Cyber Academy Video Management
 * Supports standard URLs, short URLs, embeds, and raw IDs with privacy-enhanced mode.
 */

export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();

  // If already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Handle youtu.be/VIDEO_ID
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // Handle youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  // Handle youtube.com/embed/VIDEO_ID or youtube-nocookie.com/embed/VIDEO_ID
  const embedMatch = trimmed.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  // Handle shorts youtube.com/shorts/VIDEO_ID
  const shortsMatch = trimmed.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];

  return null;
}

export interface EmbedOptions {
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  loop?: boolean;
  privacyEnhanced?: boolean;
  startAt?: number;
}

export function buildYouTubeEmbedUrl(
  urlOrId: string,
  options: EmbedOptions = {}
): string {
  const videoId = extractYouTubeId(urlOrId);
  if (!videoId) return '';

  const {
    autoplay = false,
    muted = true,
    controls = true,
    loop = false,
    privacyEnhanced = true,
    startAt,
  } = options;

  const domain = privacyEnhanced ? 'https://www.youtube-nocookie.com' : 'https://www.youtube.com';
  const params = new URLSearchParams({
    enablejsapi: '1',
    rel: '0',
    modestbranding: '1',
    controls: controls ? '1' : '0',
  });

  if (autoplay) {
    params.set('autoplay', '1');
  }

  if (muted) {
    params.set('mute', '1');
  }

  if (loop) {
    params.set('loop', '1');
    params.set('playlist', videoId);
  }

  if (startAt && startAt > 0) {
    params.set('start', String(startAt));
  }

  return `${domain}/embed/${videoId}?${params.toString()}`;
}

export function getYouTubeThumbnailUrl(
  urlOrId: string,
  quality: 'maxresdefault' | 'hqdefault' | 'mqdefault' = 'hqdefault'
): string {
  const videoId = extractYouTubeId(urlOrId);
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}
