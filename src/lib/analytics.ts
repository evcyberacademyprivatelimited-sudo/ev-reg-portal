import { supabase, isSupabaseConfigured } from './supabase';
import { getStoredUtmParams } from './utm';
import { AnalyticsEvent } from '../types';

const SESSION_KEY = 'ev_analytics_session_id';
const LOCAL_ANALYTICS_KEY = 'ev_local_analytics_events';

export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export async function trackEvent(
  eventType: AnalyticsEvent['event_type'],
  courseId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    const utm = getStoredUtmParams();
    const eventData: Omit<AnalyticsEvent, 'id'> = {
      event_type: eventType,
      page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
      course_id: courseId,
      utm_source: utm.utm_source || 'direct',
      utm_medium: utm.utm_medium || 'organic',
      utm_campaign: utm.utm_campaign || 'none',
      session_id: getSessionId(),
      metadata: metadata || {},
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      await supabase.from('analytics_events').insert([eventData]);
    } else {
      // Store in local storage for admin analytics demonstration
      const currentRaw = localStorage.getItem(LOCAL_ANALYTICS_KEY);
      const list: AnalyticsEvent[] = currentRaw ? JSON.parse(currentRaw) : [];
      list.push({
        ...eventData,
        id: 'evt_' + Math.random().toString(36).substring(2, 9),
      });
      // Keep last 500 events
      if (list.length > 500) {
        list.splice(0, list.length - 500);
      }
      localStorage.setItem(LOCAL_ANALYTICS_KEY, JSON.stringify(list));
    }
  } catch (err) {
    console.debug('Analytics track error:', err);
  }
}

export function getLocalAnalyticsEvents(): AnalyticsEvent[] {
  try {
    const currentRaw = localStorage.getItem(LOCAL_ANALYTICS_KEY);
    return currentRaw ? JSON.parse(currentRaw) : [];
  } catch {
    return [];
  }
}
