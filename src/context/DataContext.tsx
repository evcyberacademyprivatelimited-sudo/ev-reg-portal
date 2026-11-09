import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Course,
  VideoItem,
  Lead,
  LeadNote,
  LeadStatusHistory,
  Testimonial,
  Faq,
  SiteSettings,
  LeadStatus,
} from '../types';
import {
  INITIAL_COURSES,
  INITIAL_VIDEOS,
  INITIAL_TESTIMONIALS,
  INITIAL_FAQS,
  INITIAL_SITE_SETTINGS,
  INITIAL_LEADS,
} from '../lib/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { extractYouTubeId } from '../lib/youtube';
import { trackEvent } from '../lib/analytics';

const generateUuid = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const isValidUuid = (val?: string | null): boolean => {
  if (!val) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val);
};

interface DuplicateCheckResult {
  isDuplicate: boolean;
  existingLead?: Lead;
  message?: string;
}

interface DataContextType {
  // Courses
  courses: Course[];
  isLoadingCourses: boolean;
  getCourseBySlug: (slug: string) => Course | undefined;
  getCourseById: (id: string) => Course | undefined;
  saveCourse: (course: Partial<Course>) => Promise<{ success: boolean; data?: Course; error?: string }>;
  deleteCourse: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateCourseOrder: (courseId: string, newPosition: number) => Promise<{ success: boolean; error?: string }>;

  // Videos
  videos: VideoItem[];
  getHeroVideo: () => VideoItem | undefined;
  getCourseVideo: (courseId: string) => VideoItem | undefined;
  saveVideo: (video: Partial<VideoItem>) => Promise<{ success: boolean; data?: VideoItem; error?: string }>;
  deleteVideo: (id: string) => Promise<{ success: boolean; error?: string }>;

  // Leads & CRM
  leads: Lead[];
  isLoadingLeads: boolean;
  checkDuplicateLead: (email: string, courseId: string) => Promise<DuplicateCheckResult>;
  submitRegistration: (leadData: {
    full_name: string;
    email: string;
    phone: string;
    course_id: string;
    college_company: string;
    experience_level: Lead['experience_level'];
    referral_source?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
  }) => Promise<{ success: boolean; lead?: Lead; isDuplicate?: boolean; error?: string }>;
  updateLeadStatus: (leadId: string, newStatus: LeadStatus, note?: string) => Promise<{ success: boolean; error?: string }>;
  updateLeadFollowUp: (leadId: string, followUpDate: string) => Promise<{ success: boolean; error?: string }>;
  assignLead: (leadId: string, staffId: string, notes?: string) => Promise<{ success: boolean; error?: string }>;
  getLeadNotes: (leadId: string) => LeadNote[];
  addLeadNote: (leadId: string, noteText: string) => Promise<{ success: boolean; error?: string }>;
  getLeadHistory: (leadId: string) => LeadStatusHistory[];
  deleteLead: (leadId: string) => Promise<{ success: boolean; error?: string }>;
  deleteAllLeads: () => Promise<{ success: boolean; error?: string; count?: number }>;
  exportLeadsCsv: (options?: { courseId?: string; status?: string }) => void;
  fetchLeads: () => Promise<{ success: boolean; data?: Lead[]; error?: string }>;
  leadsFetchError: string | null;

  // Content (Testimonials, FAQs, Settings)
  testimonials: Testimonial[];
  faqs: Faq[];
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<{ success: boolean }>;
  saveFaq: (faq: Partial<Faq>) => Promise<{ success: boolean }>;
  deleteFaq: (id: string) => Promise<{ success: boolean }>;
  saveTestimonial: (item: Partial<Testimonial>) => Promise<{ success: boolean }>;
  deleteTestimonial: (id: string) => Promise<{ success: boolean }>;

  // Reload
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Storage Keys for local state cache/demo fallback
const STORAGE_COURSES = 'ev_courses_data';
const STORAGE_VIDEOS = 'ev_videos_data';
const STORAGE_LEADS = 'ev_leads_data';
const STORAGE_NOTES = 'ev_lead_notes_data';
const STORAGE_HISTORY = 'ev_lead_history_data';
const STORAGE_FAQS = 'ev_faqs_data';
const STORAGE_TESTIMONIALS = 'ev_testimonials_data';
const STORAGE_SETTINGS = 'ev_settings_data';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isSuperAdmin, staffList, isAuthenticated } = useAuth();
  const isProductionDB = isSupabaseConfigured();

  // Courses state
  const [courses, setCourses] = useState<Course[]>(() => {
    if (isProductionDB) return [];
    try {
      const stored = localStorage.getItem(STORAGE_COURSES);
      return stored ? JSON.parse(stored) : INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  });
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);

  // Videos state
  const [videos, setVideos] = useState<VideoItem[]>(() => {
    if (isProductionDB) return [];
    try {
      const stored = localStorage.getItem(STORAGE_VIDEOS);
      return stored ? JSON.parse(stored) : INITIAL_VIDEOS;
    } catch {
      return INITIAL_VIDEOS;
    }
  });

  // Leads state - Strictly empty in production until retrieved from Supabase
  const [leads, setLeads] = useState<Lead[]>(() => {
    if (isProductionDB) return [];
    try {
      const stored = localStorage.getItem(STORAGE_LEADS);
      return stored ? JSON.parse(stored) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [leadsFetchError, setLeadsFetchError] = useState<string | null>(null);

  // Notes & History - Strictly empty in production until retrieved from Supabase
  const [leadNotes, setLeadNotes] = useState<LeadNote[]>(() => {
    if (isProductionDB) return [];
    try {
      const stored = localStorage.getItem(STORAGE_NOTES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [leadHistory, setLeadHistory] = useState<LeadStatusHistory[]>(() => {
    if (isProductionDB) return [];
    try {
      const stored = localStorage.getItem(STORAGE_HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Testimonials, FAQs, Settings
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    if (isProductionDB) return [];
    try {
      const stored = localStorage.getItem(STORAGE_TESTIMONIALS);
      return stored ? JSON.parse(stored) : INITIAL_TESTIMONIALS;
    } catch {
      return INITIAL_TESTIMONIALS;
    }
  });

  const [faqs, setFaqs] = useState<Faq[]>(() => {
    if (isProductionDB) return [];
    try {
      const stored = localStorage.getItem(STORAGE_FAQS);
      return stored ? JSON.parse(stored) : INITIAL_FAQS;
    } catch {
      return INITIAL_FAQS;
    }
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_SETTINGS);
      return stored ? JSON.parse(stored) : INITIAL_SITE_SETTINGS;
    } catch {
      return INITIAL_SITE_SETTINGS;
    }
  });

  // Sync state to localStorage only when running locally without Supabase credentials
  useEffect(() => {
    if (!isProductionDB) {
      localStorage.setItem(STORAGE_COURSES, JSON.stringify(courses));
      localStorage.setItem(STORAGE_VIDEOS, JSON.stringify(videos));
      localStorage.setItem(STORAGE_LEADS, JSON.stringify(leads));
      localStorage.setItem(STORAGE_NOTES, JSON.stringify(leadNotes));
      localStorage.setItem(STORAGE_HISTORY, JSON.stringify(leadHistory));
      localStorage.setItem(STORAGE_TESTIMONIALS, JSON.stringify(testimonials));
      localStorage.setItem(STORAGE_FAQS, JSON.stringify(faqs));
      localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(siteSettings));
    }
  }, [isProductionDB, courses, videos, leads, leadNotes, leadHistory, testimonials, faqs, siteSettings]);

  // Standalone Lead Retrieval Directly from Supabase Backend Database
  const fetchLeads = useCallback(async (): Promise<{ success: boolean; data?: Lead[]; error?: string }> => {
    if (!isSupabaseConfigured()) {
      return { success: true, data: leads };
    }

    setIsLoadingLeads(true);
    setLeadsFetchError(null);

    try {
      const { data: dbLeads, error: leadsErr } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (leadsErr) {
        console.error('[DataContext] Error fetching leads from Supabase backend:', leadsErr);
        setLeadsFetchError(leadsErr.message);
        return { success: false, error: leadsErr.message };
      }

      const fetched = (dbLeads || []) as Lead[];
      setLeads(fetched);

      // Hydrate notes
      const { data: dbNotes } = await supabase
        .from('lead_notes')
        .select('*')
        .order('created_at', { ascending: false });
      if (dbNotes) setLeadNotes(dbNotes as LeadNote[]);

      // Hydrate history
      const { data: dbHist } = await supabase
        .from('lead_status_history')
        .select('*')
        .order('created_at', { ascending: false });
      if (dbHist) setLeadHistory(dbHist as LeadStatusHistory[]);

      return { success: true, data: fetched };
    } catch (err) {
      const msg = (err as Error).message || 'Failed to fetch leads from backend database';
      console.error('[DataContext] Exception during fetchLeads:', err);
      setLeadsFetchError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoadingLeads(false);
    }
  }, [leads]);

  // Load and hydrate all data directly from Supabase
  const refreshData = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      // In local dev without credentials, initialize defaults if storage is empty
      if (courses.length === 0) setCourses(INITIAL_COURSES);
      if (videos.length === 0) setVideos(INITIAL_VIDEOS);
      if (faqs.length === 0) setFaqs(INITIAL_FAQS);
      return;
    }

    try {
      setIsLoadingCourses(true);
      setIsLoadingLeads(true);

      // Load Site Settings & Course Display Order first
      let orderMap: Record<string, number> = {};
      let pricingMap: Record<string, { original_price?: number; now_price?: number }> = {};
      const { data: dbSettings } = await supabase.from('site_settings').select('*');

      if (dbSettings && dbSettings.length > 0) {
        setSiteSettings((prev) => {
          const updated = { ...prev };
          dbSettings.forEach((row) => {
            if (row.key === 'course_display_order' && row.value) {
              orderMap = (row.value.order || row.value) as Record<string, number>;
            }
            if (row.key === 'course_pricing' && row.value) {
              pricingMap = (row.value.pricing || row.value) as Record<string, { original_price?: number; now_price?: number }>;
            }
            if (row.key === 'intro_video_settings' && row.value) {
              updated.show_intro_video = row.value.is_enabled !== undefined ? Boolean(row.value.is_enabled) : updated.show_intro_video;
            }
            if (row.key === 'hero_content' && row.value) {
              updated.hero_badge = row.value.badge || updated.hero_badge;
              updated.hero_headline_prefix = row.value.headline_prefix || updated.hero_headline_prefix;
              updated.hero_headline_highlight = row.value.headline_highlight || updated.hero_headline_highlight;
              updated.hero_subheadline = row.value.subheadline || updated.hero_subheadline;
              updated.primary_cta_text = row.value.primary_cta_text || updated.primary_cta_text;
              updated.secondary_cta_text = row.value.secondary_cta_text || updated.secondary_cta_text;
              updated.trust_badge_text = row.value.trust_badge_text || updated.trust_badge_text;
            }
            if (row.key === 'contact_info' && row.value) {
              updated.contact_phone = row.value.phone || updated.contact_phone;
              updated.contact_email = row.value.email || updated.contact_email;
              updated.contact_whatsapp = row.value.whatsapp || updated.contact_whatsapp;
              updated.counseling_hours = row.value.counseling_hours || updated.counseling_hours;
            }
            if (row.key === 'quick_apply_buttons' && row.value) {
              updated.quick_btn1_text = row.value.btn1_text || updated.quick_btn1_text;
              updated.quick_btn1_course_id = row.value.btn1_course_id || updated.quick_btn1_course_id;
              updated.quick_btn1_course_name = row.value.btn1_course_name || updated.quick_btn1_course_name;
              updated.quick_btn1_enabled = row.value.btn1_enabled !== undefined ? row.value.btn1_enabled : updated.quick_btn1_enabled;
              updated.quick_btn2_text = row.value.btn2_text || updated.quick_btn2_text;
              updated.quick_btn2_course_id = row.value.btn2_course_id || updated.quick_btn2_course_id;
              updated.quick_btn2_course_name = row.value.btn2_course_name || updated.quick_btn2_course_name;
              updated.quick_btn2_enabled = row.value.btn2_enabled !== undefined ? row.value.btn2_enabled : updated.quick_btn2_enabled;
            }
            if (row.key === 'course_card_settings' && row.value) {
              updated.default_card_banner_text = row.value.banner_text || updated.default_card_banner_text;
            }
          });
          return updated;
        });
      }

      // 1. Load Courses & Apply Display Order
      const { data: dbCourses, error: courseErr } = await supabase
        .from('courses')
        .select('*');

      if (!courseErr && dbCourses) {
        const sorted = (dbCourses as Course[])
          .map((c, idx) => {
            const coursePricing = pricingMap[c.id];
            const mockMatch = INITIAL_COURSES.find((mc) => mc.slug === c.slug || mc.title === c.title);
            const origPrice = coursePricing?.original_price !== undefined
              ? Number(coursePricing.original_price)
              : (c.original_price ?? mockMatch?.original_price ?? 0);
            const feeAmt = coursePricing?.now_price !== undefined
              ? Number(coursePricing.now_price)
              : c.fee_amount;

            return {
              ...c,
              sort_order: orderMap[c.id] !== undefined ? Number(orderMap[c.id]) : (idx + 1),
              original_price: origPrice,
              fee_amount: feeAmt,
            };
          })
          .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
        setCourses(sorted);
      }

      // 2. Load Videos
      const { data: dbVideos } = await supabase
        .from('videos')
        .select('*')
        .order('sort_order', { ascending: true });

      if (dbVideos) {
        setVideos(dbVideos as VideoItem[]);
      }

      // 3. Load Leads from backend database
      await fetchLeads();

      // 6. Load Testimonials
      const { data: dbTestimonials } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true });

      if (dbTestimonials) {
        setTestimonials(dbTestimonials as Testimonial[]);
      }

      // 7. Load FAQs
      const { data: dbFaqs } = await supabase
        .from('faqs')
        .select('*')
        .order('sort_order', { ascending: true });

      if (dbFaqs) {
        setFaqs(dbFaqs as Faq[]);
      }

    } catch (err) {
      console.error('Error refreshing data from Supabase:', err);
    } finally {
      setIsLoadingCourses(false);
      setIsLoadingLeads(false);
    }
  }, [courses.length, videos.length, faqs.length, fetchLeads]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // 1. Reactive lead hydration: Whenever user authenticates, fetch backend leads immediately
  useEffect(() => {
    if (isAuthenticated || user) {
      fetchLeads();
    }
  }, [isAuthenticated, user?.id, fetchLeads]);

  // 2. Multi-tab & session synchronization: Listen to Supabase auth events
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchLeads();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchLeads]);

  // Course Helpers
  const getCourseBySlug = (slug: string): Course | undefined => {
    return courses.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
  };

  const getCourseById = (id: string): Course | undefined => {
    return courses.find((c) => c.id === id);
  };

  const saveCourse = async (courseData: Partial<Course>): Promise<{ success: boolean; data?: Course; error?: string }> => {
    const isNew = !courseData.id;
    const now = new Date().toISOString();

    const targetSortOrder = courseData.sort_order;
    const targetOriginalPrice = courseData.original_price;
    const currentCourse = courses.find((c) => c.id === courseData.id);

    const preparedCourse: Course = {
      id: courseData.id || generateUuid(),
      slug:
        courseData.slug ||
        (courseData.title
          ? courseData.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '')
          : 'course-' + Date.now()),
      title: courseData.title || 'Untitled Course',
      tagline: courseData.tagline || '',
      summary: courseData.summary || '',
      description: courseData.description || '',
      level: courseData.level || 'Intermediate',
      duration_weeks: Number(courseData.duration_weeks) || 12,
      hours_per_week: Number(courseData.hours_per_week) || 8,
      fee_amount: Number(courseData.fee_amount) || 0,
      original_price:
        targetOriginalPrice !== undefined
          ? Number(targetOriginalPrice)
          : (currentCourse?.original_price || 0),
      currency: courseData.currency || 'INR',
      status: courseData.status || 'published',
      featured: Boolean(courseData.featured),
      badge_text: courseData.badge_text || '',
      sort_order:
        targetSortOrder !== undefined
          ? Number(targetSortOrder)
          : (currentCourse?.sort_order || courses.length + 1),
      certification_title: courseData.certification_title || 'EV Cyber Professional Certificate',
      batch_start_date: courseData.batch_start_date,
      seats_remaining: courseData.seats_remaining ?? 20,
      syllabus: courseData.syllabus || [],
      outcomes: courseData.outcomes || [],
      prerequisites: courseData.prerequisites || [],
      tools_covered: courseData.tools_covered || [],
      created_at: courseData.created_at || now,
      updated_at: now,
    };

    if (isSupabaseConfigured()) {
      try {
        if (targetSortOrder !== undefined) {
          const currentOrderMap: Record<string, number> = {};
          courses.forEach((c) => {
            currentOrderMap[c.id] = c.sort_order ?? 999;
          });
          currentOrderMap[preparedCourse.id] = Number(targetSortOrder);

          await supabase.from('site_settings').upsert({
            key: 'course_display_order',
            value: { order: currentOrderMap },
            updated_at: new Date().toISOString(),
          });
        }

        if (targetOriginalPrice !== undefined || courseData.fee_amount !== undefined) {
          const currentPricingMap: Record<string, { original_price?: number; now_price?: number }> = {};
          courses.forEach((c) => {
            currentPricingMap[c.id] = {
              original_price: c.original_price || 0,
              now_price: c.fee_amount || 0,
            };
          });
          currentPricingMap[preparedCourse.id] = {
            original_price: preparedCourse.original_price || 0,
            now_price: preparedCourse.fee_amount || 0,
          };

          await supabase.from('site_settings').upsert({
            key: 'course_pricing',
            value: { pricing: currentPricingMap },
            updated_at: new Date().toISOString(),
          });
        }

        if (isNew) {
          // Omit id, sort_order, and original_price so PostgreSQL automatically assigns default uuid_generate_v4() and avoids column errors
          const { id: _omitId, sort_order: _omitSortOrder, original_price: _omitOrigPrice, ...insertPayload } = preparedCourse;
          const { data, error } = await supabase.from('courses').insert([insertPayload]).select().single();
          if (error) return { success: false, error: error.message };
          if (data) {
            const courseWithMeta = {
              ...data,
              sort_order: preparedCourse.sort_order,
              original_price: preparedCourse.original_price,
            } as Course;
            setCourses((prev) => {
              const updated = [courseWithMeta, ...prev.filter((c) => c.id !== courseWithMeta.id)];
              return updated.sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
            });
            return { success: true, data: courseWithMeta };
          }
        } else {
          // Omit sort_order and original_price from update payload for PostgreSQL
          const { sort_order: _omitSortOrder, original_price: _omitOrigPrice, ...updatePayload } = preparedCourse;
          const { data, error } = await supabase
            .from('courses')
            .update(updatePayload)
            .eq('id', preparedCourse.id)
            .select()
            .single();
          if (error) return { success: false, error: error.message };
          if (data) {
            const updatedCourse = {
              ...data,
              sort_order: preparedCourse.sort_order,
              original_price: preparedCourse.original_price,
            } as Course;
            setCourses((prev) => {
              const updated = prev.map((c) => (c.id === data.id ? updatedCourse : c));
              return updated.sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
            });
            return { success: true, data: updatedCourse };
          }
        }
        return { success: true, data: preparedCourse };
      } catch (err) {
        return { success: false, error: (err as Error).message };
      }
    }

    if (isNew) {
      setCourses((prev) => {
        const updated = [preparedCourse, ...prev];
        return updated.sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
      });
    } else {
      setCourses((prev) => {
        const updated = prev.map((c) => (c.id === preparedCourse.id ? preparedCourse : c));
        return updated.sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
      });
    }
    return { success: true, data: preparedCourse };
  };

  const updateCourseOrder = async (
    courseId: string,
    newPosition: number
  ): Promise<{ success: boolean; error?: string }> => {
    const currentList = [...courses].sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
    const targetCourse = currentList.find((c) => c.id === courseId);
    if (!targetCourse) return { success: false, error: 'Course not found' };

    const remaining = currentList.filter((c) => c.id !== courseId);
    const clampedIndex = Math.max(0, Math.min(newPosition - 1, remaining.length));
    remaining.splice(clampedIndex, 0, targetCourse);

    const updatedOrderMap: Record<string, number> = {};
    const updatedList = remaining.map((c, idx) => {
      const order = idx + 1;
      updatedOrderMap[c.id] = order;
      return { ...c, sort_order: order };
    });

    setCourses(updatedList);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('site_settings').upsert({
          key: 'course_display_order',
          value: { order: updatedOrderMap },
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Failed saving course order to Supabase:', err);
      }
    }

    return { success: true };
  };

  const deleteCourse = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('courses').delete().eq('id', id);
        if (error) return { success: false, error: error.message };
      } catch (err) {
        return { success: false, error: (err as Error).message };
      }
    }
    setCourses((prev) => prev.filter((c) => c.id !== id));
    return { success: true };
  };

  // Video Helpers
  const getHeroVideo = (): VideoItem | undefined => {
    return videos.find((v) => v.is_active && (v.pinned_homepage || v.placement === 'hero'));
  };

  const getCourseVideo = (courseId: string): VideoItem | undefined => {
    return videos.find(
      (v) => v.is_active && (v.pinned_course_id === courseId || v.placement === 'course_details')
    );
  };

  const saveVideo = async (videoData: Partial<VideoItem>): Promise<{ success: boolean; data?: VideoItem; error?: string }> => {
    const isNew = !videoData.id;
    const now = new Date().toISOString();

    const videoId = extractYouTubeId(videoData.youtube_url || videoData.youtube_video_id || '');
    if (!videoId) {
      return { success: false, error: 'Invalid YouTube URL or Video ID provided.' };
    }

    const preparedVideo: VideoItem = {
      id: videoData.id || generateUuid(),
      title: videoData.title || 'Cyber Range Walkthrough',
      description: videoData.description || '',
      youtube_url: videoData.youtube_url || `https://www.youtube.com/watch?v=${videoId}`,
      youtube_video_id: videoId,
      placement: videoData.placement || 'hero',
      pinned_homepage: Boolean(videoData.pinned_homepage),
      pinned_course_id: videoData.pinned_course_id || null,
      is_active: videoData.is_active !== undefined ? videoData.is_active : true,
      autoplay: videoData.autoplay !== undefined ? videoData.autoplay : true,
      muted_autoplay: videoData.muted_autoplay !== undefined ? videoData.muted_autoplay : true,
      show_controls: videoData.show_controls !== undefined ? videoData.show_controls : true,
      sort_order: videoData.sort_order ?? 0,
      created_at: videoData.created_at || now,
      updated_at: now,
    };

    if (isSupabaseConfigured()) {
      try {
        if (isNew) {
          const { id: _omitId, ...insertPayload } = preparedVideo;
          const { data, error } = await supabase.from('videos').insert([insertPayload]).select().single();
          if (error) return { success: false, error: error.message };
          if (data) {
            setVideos((prev) => [...prev, data as VideoItem]);
            return { success: true, data: data as VideoItem };
          }
        } else {
          const { data, error } = await supabase
            .from('videos')
            .update(preparedVideo)
            .eq('id', preparedVideo.id)
            .select()
            .single();
          if (error) return { success: false, error: error.message };
          if (data) {
            setVideos((prev) => prev.map((v) => (v.id === data.id ? (data as VideoItem) : v)));
            return { success: true, data: data as VideoItem };
          }
        }
        return { success: true, data: preparedVideo };
      } catch (err) {
        return { success: false, error: (err as Error).message };
      }
    }

    if (isNew) {
      setVideos((prev) => [...prev, preparedVideo]);
    } else {
      setVideos((prev) => prev.map((v) => (v.id === preparedVideo.id ? preparedVideo : v)));
    }
    return { success: true, data: preparedVideo };
  };

  const deleteVideo = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('videos').delete().eq('id', id);
        if (error) return { success: false, error: error.message };
      } catch (err) {
        return { success: false, error: (err as Error).message };
      }
    }
    setVideos((prev) => prev.filter((v) => v.id !== id));
    return { success: true };
  };

  // Secure Duplicate Registration Check
  const checkDuplicateLead = async (email: string, courseId: string): Promise<DuplicateCheckResult> => {
    const cleanEmail = email.trim().toLowerCase();

    // In Supabase mode, execute the secure RPC function (SECURITY DEFINER)
    // This returns boolean true/false and strictly NEVER exposes student registrations to public callers
    if (isSupabaseConfigured() && isValidUuid(courseId)) {
      try {
        const { data: isDup, error } = await supabase.rpc('check_duplicate_registration', {
          p_email: cleanEmail,
          p_course_id: courseId,
        });

        if (!error && isDup === true) {
          return {
            isDuplicate: true,
            message: `An application from ${email} for this program is already registered. Our team will contact you shortly.`,
          };
        }
      } catch (err) {
        console.error('Secure duplicate check error:', err);
      }
    } else {
      // Local check
      const match = leads.find(
        (l) => l.email.toLowerCase() === cleanEmail && l.course_id === courseId
      );

      if (match) {
        return {
          isDuplicate: true,
          existingLead: match,
          message: `An application from ${email} for this course is already registered (Application Ref: ${match.lead_number}). Our team will contact you shortly.`,
        };
      }
    }

    return { isDuplicate: false };
  };

  // Lead Registration Submission
  const submitRegistration = async (leadData: {
    full_name: string;
    email: string;
    phone: string;
    course_id: string;
    college_company: string;
    experience_level: Lead['experience_level'];
    referral_source?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
  }): Promise<{ success: boolean; lead?: Lead; isDuplicate?: boolean; error?: string }> => {
    // Resolve course reference
    const courseObj = courses.find((c) => c.id === leadData.course_id || c.slug === leadData.course_id);
    const resolvedCourseId = courseObj && isValidUuid(courseObj.id)
      ? courseObj.id
      : (isValidUuid(leadData.course_id) ? leadData.course_id : (courses.find((c) => isValidUuid(c.id))?.id || leadData.course_id));

    // 1. Anti-duplicate protection check
    const dupCheck = await checkDuplicateLead(leadData.email, resolvedCourseId);
    if (dupCheck.isDuplicate) {
      return {
        success: false,
        isDuplicate: true,
        lead: dupCheck.existingLead,
        error: dupCheck.message,
      };
    }

    const now = new Date().toISOString();
    const generatedLeadId = generateUuid();
    // Unique registration reference for student receipt & client state
    // (Supabase PostgreSQL automatically generates the official sequential lead_number via lead_number_seq)
    const nextLeadNum = 'EV-' + (100000 + Math.floor(Math.random() * 900000));

    // Only assign if submitted by an authenticated staff member with a valid UUID;
    // For public students, assigned_to is strictly null (unassigned incoming lead)
    const validAssignedTo = (isAuthenticated && isValidUuid(user?.id)) ? user!.id : null;
    const assignedStaffName = validAssignedTo ? (user?.full_name || 'Staff User') : 'Unassigned';

    const newLead: Lead = {
      id: generatedLeadId,
      lead_number: nextLeadNum,
      full_name: leadData.full_name.trim(),
      email: leadData.email.trim().toLowerCase(),
      phone: leadData.phone.trim(),
      course_id: resolvedCourseId,
      course_title: courseObj?.title || 'Cybersecurity Program',
      college_company: leadData.college_company.trim() || 'Not Specified',
      experience_level: leadData.experience_level || 'Student / Fresher',
      status: 'New',
      assigned_to: validAssignedTo,
      assigned_staff_name: assignedStaffName,
      next_follow_up_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      referral_source: leadData.referral_source || 'Website Course Page',
      utm_source: leadData.utm_source || 'direct',
      utm_medium: leadData.utm_medium || 'organic',
      utm_campaign: leadData.utm_campaign || 'none',
      utm_term: leadData.utm_term || '',
      utm_content: leadData.utm_content || '',
      last_contacted_at: null,
      created_at: now,
      updated_at: now,
    };

    if (isSupabaseConfigured()) {
      try {
        if (!isValidUuid(resolvedCourseId)) {
          return { success: false, error: 'Invalid course reference. Please select an available course.' };
        }

        const insertPayload = {
          id: generatedLeadId,
          // Do NOT pass lead_number: Supabase PostgreSQL automatically generates
          // unique sequential numbers via DEFAULT ('EV-' || NEXTVAL('lead_number_seq')::TEXT)
          full_name: newLead.full_name,
          email: newLead.email,
          phone: newLead.phone,
          course_id: resolvedCourseId,
          college_company: newLead.college_company,
          experience_level: newLead.experience_level,
          status: 'New' as const,
          assigned_to: validAssignedTo, // null for public registrations; never pass hardcoded string IDs
          referral_source: newLead.referral_source,
          utm_source: newLead.utm_source,
          utm_medium: newLead.utm_medium,
          utm_campaign: newLead.utm_campaign,
          utm_term: newLead.utm_term,
          utm_content: newLead.utm_content,
        };

        const { error } = await supabase.from('leads').insert([insertPayload]);

        if (error) {
          return { success: false, error: error.message };
        }

        setLeads((prev) => [newLead, ...prev]);

        // Track conversion event
        await trackEvent('lead_submission', newLead.course_id, {
          lead_number: newLead.lead_number,
          experience_level: newLead.experience_level,
        });

        return { success: true, lead: newLead };
      } catch (err) {
        return { success: false, error: (err as Error).message };
      }
    }

    // Local sandbox
    setLeads((prev) => [newLead, ...prev]);

    const historyItem: LeadStatusHistory = {
      id: 'hist_' + Math.random().toString(36).substring(2, 9),
      lead_id: newLead.id,
      old_status: null,
      new_status: 'New',
      changed_by_name: 'System Intake',
      note: 'Web application submitted from landing page.',
      created_at: now,
    };
    setLeadHistory((prev) => [historyItem, ...prev]);

    await trackEvent('lead_submission', newLead.course_id, {
      lead_number: newLead.lead_number,
      experience_level: newLead.experience_level,
    });

    return { success: true, lead: newLead };
  };

  // Lead Status update
  const updateLeadStatus = async (
    leadId: string,
    newStatus: LeadStatus,
    note?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const existing = leads.find((l) => l.id === leadId);
    if (!existing) return { success: false, error: 'Lead not found.' };

    const oldStatus = existing.status;
    const now = new Date().toISOString();

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('leads')
          .update({
            status: newStatus,
            last_contacted_at: now,
            updated_at: now,
          })
          .eq('id', leadId);

        if (error) return { success: false, error: error.message };

        const validChangedBy = isValidUuid(user?.id) ? user!.id : null;
        await supabase.from('lead_status_history').insert([
          {
            lead_id: leadId,
            old_status: oldStatus,
            new_status: newStatus,
            changed_by: validChangedBy,
            changed_by_name: user?.full_name || 'Staff User',
            note: note || `Status changed from ${oldStatus} to ${newStatus}`,
          },
        ]);
      } catch (err) {
        return { success: false, error: (err as Error).message };
      }
    }

    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              status: newStatus,
              last_contacted_at: now,
              updated_at: now,
            }
          : l
      )
    );

    const historyItem: LeadStatusHistory = {
      id: 'hist_' + Math.random().toString(36).substring(2, 9),
      lead_id: leadId,
      old_status: oldStatus,
      new_status: newStatus,
      changed_by: user?.id,
      changed_by_name: user?.full_name || 'Staff User',
      note: note || `Status updated to ${newStatus}`,
      created_at: now,
    };
    setLeadHistory((prev) => [historyItem, ...prev]);

    return { success: true };
  };

  // Follow-up Date Update
  const updateLeadFollowUp = async (
    leadId: string,
    followUpDate: string
  ): Promise<{ success: boolean; error?: string }> => {
    const now = new Date().toISOString();

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('leads')
          .update({
            next_follow_up_date: followUpDate,
            updated_at: now,
          })
          .eq('id', leadId);

        if (error) return { success: false, error: error.message };
      } catch (err) {
        return { success: false, error: (err as Error).message };
      }
    }

    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              next_follow_up_date: followUpDate,
              updated_at: now,
            }
          : l
      )
    );

    return { success: true };
  };

  // Assign lead to staff
  const assignLead = async (
    leadId: string,
    staffId: string,
    notes?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const targetStaff = staffList.find((s) => s.id === staffId);
    const now = new Date().toISOString();
    const validStaffId = isValidUuid(staffId) ? staffId : null;
    const validAssignedBy = isValidUuid(user?.id) ? user!.id : null;

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('leads')
          .update({
            assigned_to: validStaffId,
            updated_at: now,
          })
          .eq('id', leadId);

        if (error) return { success: false, error: error.message };

        await supabase.from('lead_assignments').insert([
          {
            lead_id: leadId,
            assigned_by: validAssignedBy,
            assigned_to: validStaffId,
            notes: notes || 'Lead assigned',
          },
        ]);
      } catch (err) {
        return { success: false, error: (err as Error).message };
      }
    }

    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              assigned_to: staffId,
              assigned_staff_name: targetStaff?.full_name || 'Assigned Staff',
              updated_at: now,
            }
          : l
      )
    );

    return { success: true };
  };

  // Notes
  const getLeadNotes = (leadId: string): LeadNote[] => {
    return leadNotes
      .filter((n) => n.lead_id === leadId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  const addLeadNote = async (leadId: string, noteText: string): Promise<{ success: boolean; error?: string }> => {
    if (!noteText.trim()) return { success: false, error: 'Note cannot be blank.' };
    const now = new Date().toISOString();
    const validAuthorId = isValidUuid(user?.id) ? user!.id : null;

    const newNote: LeadNote = {
      id: 'note_' + Math.random().toString(36).substring(2, 9),
      lead_id: leadId,
      author_id: validAuthorId || undefined,
      author_name: user?.full_name || 'Administrator',
      note: noteText.trim(),
      created_at: now,
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('lead_notes')
          .insert([
            {
              lead_id: leadId,
              author_id: validAuthorId,
              author_name: user?.full_name || 'Administrator',
              note: noteText.trim(),
            },
          ])
          .select()
          .single();

        if (error) return { success: false, error: error.message };
        if (data) {
          setLeadNotes((prev) => [data as LeadNote, ...prev]);
          return { success: true };
        }
      } catch (err) {
        return { success: false, error: (err as Error).message };
      }
    }

    setLeadNotes((prev) => [newNote, ...prev]);
    return { success: true };
  };

  const getLeadHistory = (leadId: string): LeadStatusHistory[] => {
    return leadHistory
      .filter((h) => h.lead_id === leadId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  const deleteLead = async (leadId: string): Promise<{ success: boolean; error?: string }> => {
    if (!isAuthenticated) {
      return { success: false, error: 'Authentication required.' };
    }

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('leads').delete().eq('id', leadId);
        if (error) return { success: false, error: error.message };
      } catch (err) {
        return { success: false, error: (err as Error).message };
      }
    }

    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    setLeadNotes((prev) => prev.filter((n) => n.lead_id !== leadId));
    setLeadHistory((prev) => prev.filter((h) => h.lead_id !== leadId));
    return { success: true };
  };

  const deleteAllLeads = async (): Promise<{ success: boolean; error?: string; count?: number }> => {
    if (!isAuthenticated) {
      return { success: false, error: 'Authentication required to delete leads.' };
    }

    const count = leads.length;
    if (count === 0) {
      return { success: true, count: 0 };
    }

    if (isSupabaseConfigured()) {
      try {
        const leadIds = leads.map((l) => l.id).filter((id) => isValidUuid(id));
        if (leadIds.length > 0) {
          const { error } = await supabase.from('leads').delete().in('id', leadIds);
          if (error) return { success: false, error: error.message };
        } else {
          const { error } = await supabase.from('leads').delete().neq('id', '00000000-0000-0000-0000-000000000000');
          if (error) return { success: false, error: error.message };
        }
      } catch (err) {
        return { success: false, error: (err as Error).message };
      }
    }

    setLeads([]);
    setLeadNotes([]);
    setLeadHistory([]);
    try {
      localStorage.setItem(STORAGE_LEADS, '[]');
      localStorage.setItem(STORAGE_NOTES, '[]');
      localStorage.setItem(STORAGE_HISTORY, '[]');
    } catch {
      // ignore storage sync errors
    }
    return { success: true, count };
  };

  // CSV Export
  const exportLeadsCsv = (options?: { courseId?: string; status?: string }) => {
    let filtered = [...leads];

    if (options?.courseId && options.courseId !== 'all') {
      filtered = filtered.filter((l) => l.course_id === options.courseId);
    }
    if (options?.status && options.status !== 'all') {
      filtered = filtered.filter((l) => l.status === options.status);
    }

    const headers = [
      'Lead Ref',
      'Full Name',
      'Email',
      'Phone',
      'Program',
      'College/Organization',
      'Experience Level',
      'Status',
      'Assigned Staff',
      'Next Follow-Up Date',
      'Referral Source',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'Registration Date',
    ];

    const rows = filtered.map((l) => {
      const crs = courses.find((c) => c.id === l.course_id);
      return [
        `"${l.lead_number}"`,
        `"${l.full_name.replace(/"/g, '""')}"`,
        `"${l.email}"`,
        `"${l.phone}"`,
        `"${(crs?.title || l.course_title || '').replace(/"/g, '""')}"`,
        `"${l.college_company.replace(/"/g, '""')}"`,
        `"${l.experience_level}"`,
        `"${l.status}"`,
        `"${l.assigned_staff_name || 'Unassigned'}"`,
        `"${l.next_follow_up_date || ''}"`,
        `"${l.referral_source || ''}"`,
        `"${l.utm_source || ''}"`,
        `"${l.utm_medium || ''}"`,
        `"${l.utm_campaign || ''}"`,
        `"${new Date(l.created_at).toLocaleDateString()}"`,
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `ev-cyber-academy-leads-${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Content Handlers
  const updateSiteSettings = async (newSettings: Partial<SiteSettings>): Promise<{ success: boolean }> => {
    const updated = { ...siteSettings, ...newSettings };
    setSiteSettings(updated);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('site_settings').upsert({
          key: 'hero_content',
          value: {
            badge: updated.hero_badge,
            headline_prefix: updated.hero_headline_prefix,
            headline_highlight: updated.hero_headline_highlight,
            subheadline: updated.hero_subheadline,
            primary_cta_text: updated.primary_cta_text,
            secondary_cta_text: updated.secondary_cta_text,
            trust_badge_text: updated.trust_badge_text,
          },
          updated_at: new Date().toISOString(),
        });

        await supabase.from('site_settings').upsert({
          key: 'contact_info',
          value: {
            phone: updated.contact_phone,
            email: updated.contact_email,
            whatsapp: updated.contact_whatsapp,
            counseling_hours: updated.counseling_hours,
          },
          updated_at: new Date().toISOString(),
        });

        await supabase.from('site_settings').upsert({
          key: 'quick_apply_buttons',
          value: {
            btn1_text: updated.quick_btn1_text,
            btn1_course_id: updated.quick_btn1_course_id,
            btn1_course_name: updated.quick_btn1_course_name,
            btn1_enabled: updated.quick_btn1_enabled,
            btn2_text: updated.quick_btn2_text,
            btn2_course_id: updated.quick_btn2_course_id,
            btn2_course_name: updated.quick_btn2_course_name,
            btn2_enabled: updated.quick_btn2_enabled,
          },
          updated_at: new Date().toISOString(),
        });

        await supabase.from('site_settings').upsert({
          key: 'course_card_settings',
          value: {
            banner_text: updated.default_card_banner_text,
          },
          updated_at: new Date().toISOString(),
        });

        await supabase.from('site_settings').upsert({
          key: 'intro_video_settings',
          value: {
            is_enabled: updated.show_intro_video !== false,
          },
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Failed saving site settings to Supabase:', err);
      }
    }

    return { success: true };
  };

  const saveFaq = async (faqData: Partial<Faq>): Promise<{ success: boolean }> => {
    const isNew = !faqData.id;
    const item: Faq = {
      id: faqData.id || generateUuid(),
      category: faqData.category || 'General',
      question: faqData.question || '',
      answer: faqData.answer || '',
      course_id: faqData.course_id || null,
      sort_order: faqData.sort_order ?? faqs.length + 1,
      is_active: faqData.is_active !== undefined ? faqData.is_active : true,
      created_at: faqData.created_at || new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        if (isNew) {
          const { id: _omitId, ...insertPayload } = item;
          const { data } = await supabase.from('faqs').insert([insertPayload]).select().single();
          if (data) item.id = data.id;
        } else {
          await supabase.from('faqs').update(item).eq('id', item.id);
        }
      } catch (err) {
        console.error('Failed saving FAQ to Supabase:', err);
      }
    }

    if (isNew) {
      setFaqs((prev) => [...prev, item]);
    } else {
      setFaqs((prev) => prev.map((f) => (f.id === item.id ? item : f)));
    }
    return { success: true };
  };

  const deleteFaq = async (id: string): Promise<{ success: boolean }> => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('faqs').delete().eq('id', id);
      } catch (err) {
        console.error('Failed deleting FAQ from Supabase:', err);
      }
    }
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    return { success: true };
  };

  const saveTestimonial = async (testData: Partial<Testimonial>): Promise<{ success: boolean }> => {
    const isNew = !testData.id;
    const item: Testimonial = {
      id: testData.id || generateUuid(),
      name: testData.name || '',
      role: testData.role || '',
      company: testData.company || '',
      avatar_url: testData.avatar_url || '',
      content: testData.content || '',
      rating: testData.rating || 5,
      is_featured: testData.is_featured !== undefined ? testData.is_featured : true,
      sort_order: testData.sort_order ?? testimonials.length + 1,
      created_at: testData.created_at || new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        if (isNew) {
          const { id: _omitId, ...insertPayload } = item;
          const { data } = await supabase.from('testimonials').insert([insertPayload]).select().single();
          if (data) item.id = data.id;
        } else {
          await supabase.from('testimonials').update(item).eq('id', item.id);
        }
      } catch (err) {
        console.error('Failed saving testimonial to Supabase:', err);
      }
    }

    if (isNew) {
      setTestimonials((prev) => [...prev, item]);
    } else {
      setTestimonials((prev) => prev.map((t) => (t.id === item.id ? item : t)));
    }
    return { success: true };
  };

  const deleteTestimonial = async (id: string): Promise<{ success: boolean }> => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('testimonials').delete().eq('id', id);
      } catch (err) {
        console.error('Failed deleting testimonial from Supabase:', err);
      }
    }
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    return { success: true };
  };

  const value = {
    courses,
    isLoadingCourses,
    getCourseBySlug,
    getCourseById,
    saveCourse,
    deleteCourse,
    updateCourseOrder,
    videos,
    getHeroVideo,
    getCourseVideo,
    saveVideo,
    deleteVideo,
    leads,
    isLoadingLeads,
    checkDuplicateLead,
    submitRegistration,
    updateLeadStatus,
    updateLeadFollowUp,
    assignLead,
    getLeadNotes,
    addLeadNote,
    getLeadHistory,
    deleteLead,
    deleteAllLeads,
    exportLeadsCsv,
    fetchLeads,
    leadsFetchError,
    testimonials,
    faqs,
    siteSettings,
    updateSiteSettings,
    saveFaq,
    deleteFaq,
    saveTestimonial,
    deleteTestimonial,
    refreshData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
