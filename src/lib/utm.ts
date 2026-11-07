import { UtmParams } from '../types';

const STORAGE_KEY = 'ev_campaign_params';

/**
 * Parses UTM query parameters from the current URL and persists them to sessionStorage
 */
export function captureUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {};

  const searchParams = new URLSearchParams(window.location.search);
  const currentParams: UtmParams = {};

  const utmKeys: (keyof UtmParams)[] = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'ref',
  ];

  let hasAny = false;
  for (const key of utmKeys) {
    const val = searchParams.get(key);
    if (val) {
      currentParams[key] = val;
      hasAny = true;
    }
  }

  // If found in current URL, store in session storage to persist across navigations
  if (hasAny) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(currentParams));
    } catch {
      // Ignore sessionStorage errors
    }
    return currentParams;
  }

  // Otherwise check stored session params
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore error
  }

  // Fallback to document referrer if available
  if (typeof document !== 'undefined' && document.referrer) {
    try {
      const refUrl = new URL(document.referrer);
      if (refUrl.hostname && !refUrl.hostname.includes(window.location.hostname)) {
        return {
          utm_source: refUrl.hostname,
          utm_medium: 'referral',
          ref: document.referrer,
        };
      }
    } catch {
      // Ignore invalid URL
    }
  }

  return {
    utm_source: 'direct',
    utm_medium: 'organic',
    utm_campaign: 'none',
  };
}

export function getStoredUtmParams(): UtmParams {
  return captureUtmParams();
}

