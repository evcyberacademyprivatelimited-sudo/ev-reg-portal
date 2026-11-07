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
  assignLead: (leadId: string, staffId: string, notes?: string) => Promise<{ success: boolean; error?: string }>;
  getLeadNotes: (leadId: string) => LeadNote[];
  addLeadNote: (leadId: string, noteText: string) => Promise<{ success: boolean; error?: string }>;
  getLeadHistory: (leadId: string) => LeadStatusHistory[];
  deleteLead: (leadId: string) => Promise<{ success: boolean; error?: string }>;
  exportLeadsCsv: (options?: { courseId?: string; status?: string }) => void;

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
  const { user, isSuperAdmin, staffList } = useAuth();

  // Courses state
  const [courses, setCourses] = useState<Course[]>(() => {
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
    try {
      const stored = localStorage.getItem(STORAGE_VIDEOS);
      return stored ? JSON.parse(stored) : INITIAL_VIDEOS;
    } catch {
      return INITIAL_VIDEOS;
    }
  });

  // Leads state
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_LEADS);
      return stored ? JSON.parse(stored) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);

  // Notes & History
  const [leadNotes, setLeadNotes] = useState<LeadNote[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_NOTES);
      return stored ? JSON.parse(stored) : [
        {
          id: 'note-1',
          lead_id: 'lead-1',
          author_name: 'Kavitha R. (Lead Counselor)',
          note: 'Profile evaluated. Solid computer network basics. Recommended Certified SOC Analyst L1/L2 cohort.',
          created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: 'note-2',
          lead_id: 'lead-2',
          author_name: 'Rahul Sen (Admissions Advisor)',
          note: 'Student interested in OSCP preparation. Scheduled a lab tour call for tomorrow 4 PM.',
          created_at: new Date(Date.now() - 3600000 * 10).toISOString(),
        }
      ];
    } catch {
      return [];
    }
  });

  const [leadHistory, setLeadHistory] = useState<LeadStatusHistory[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_HISTORY);
      return stored ? JSON.parse(stored) : [
        {
          id: 'hist-1',
          lead_id: 'lead-2',
          old_status: 'New',
          new_status: 'Interested',
          changed_by_name: 'Rahul Sen',
          note: 'Follow-up call completed; candidate wants to join next batch.',
          created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
        },
        {
          id: 'hist-2',
          lead_id: 'lead-3',
          old_status: 'New',
          new_status: 'Contacted',
          changed_by_name: 'Kavitha R.',
          note: 'Sent syllabus PDF via WhatsApp.',
          created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
        }
      ];
    } catch {
      return [];
    }
  });

  // Testimonials, FAQs, Settings
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_TESTIMONIALS);
      return stored ? JSON.parse(stored) : INITIAL_TESTIMONIALS;
    } catch {
      return INITIAL_TESTIMONIALS;
    }
  });

  const [faqs, setFaqs] = useState<Faq[]>(() => {
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

  // Sync state to localStorage for offline / test persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_VIDEOS, JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_LEADS, JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_NOTES, JSON.stringify(leadNotes));
  }, [leadNotes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_HISTORY, JSON.stringify(leadHistory));
  }, [leadHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_TESTIMONIALS, JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_FAQS, JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(siteSettings));
  }, [siteSettings]);

  // Load from Supabase if connected
  const refreshData = useCallback(async () => {
    if (!isSupabaseConfigured()) return;

    try {
      setIsLoadingCourses(true);
      setIsLoadingLeads(true);

      // Load Courses
      const { data: dbCourses, error: courseErr } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (!courseErr && dbCourses && dbCourses.length > 0) {
        setCourses(dbCourses as Course[]);
      }

      // Load Videos
      const { data: dbVideos } = await supabase
        .from('videos')
        .select('*')
        .order('sort_order', { ascending: true });

      if (dbVideos && dbVideos.length > 0) {
        setVideos(dbVideos as VideoItem[]);
      }

      // Load Leads
      const { data: dbLeads } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbLeads) {
        setLeads(dbLeads as Lead[]);
      }

      // Load Testimonials
      const { data: dbTestimonials } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true });

      if (dbTestimonials && dbTestimonials.length > 0) {
        setTestimonials(dbTestimonials as Testimonial[]);
      }

      // Load FAQs
      const { data: dbFaqs } = await supabase
        .from('faqs')
        .select('*')
        .order('sort_order', { ascending: true });

      if (dbFaqs && dbFaqs.length > 0) {
        setFaqs(dbFaqs as Faq[]);
      }
    } catch (err) {
      console.error('Error refreshing data from Supabase:', err);
    } finally {
      setIsLoadingCourses(false);
      setIsLoadingLeads(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

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

    const preparedCourse: Course = {
      id: courseData.id || 'crs_' + Math.random().toString(36).substring(2, 10),
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
      currency: courseData.currency || 'INR',
      status: courseData.status || 'published',
      featured: Boolean(courseData.featured),
      badge_text: courseData.badge_text || '',
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
        if (isNew) {
          const { data, error } = await supabase.from('courses').insert([preparedCourse]).select().single();
          if (error) return { success: false, error: error.message };
          if (data) setCourses((prev) => [data as Course, ...prev]);
        } else {
          const { data, error } = await supabase
            .from('courses')
            .update(preparedCourse)
            .eq('id', preparedCourse.id)
            .select()
            .single();
          if (error) return { success: false, error: error.message };
          if (data) {
            setCourses((prev) => prev.map((c) => (c.id === data.id ? (data as Course) : c)));
          }
        }
        return { success: true, data: preparedCourse };
      } catch (err) {
        return { success: false, error: (err as Error).message };
      }
    }

    // Local / Demo mode update
    if (isNew) {
      setCourses((prev) => [preparedCourse, ...prev]);
    } else {
      setCourses((prev) => prev.map((c) => (c.id === preparedCourse.id ? preparedCourse : c)));
    }
    return { success: true, data: preparedCourse };
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
      id: videoData.id || 'vid_' + Math.random().toString(36).substring(2, 10),
      title: videoData.title || 'Featured Cybersecurity Walkthrough',
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
          const { data, error } = await supabase.from('videos').insert([preparedVideo]).select().single();
          if (error) return { success: false, error: error.message };
          if (data) setVideos((prev) => [...prev, data as VideoItem]);
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
          }
        }
        return { success: true, data: preparedVideo };
      } catch (err) {
        return { success: false, error: (err as Error).message };
      }
    }

    // Local / Demo mode
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

  // Duplicate Check
  const checkDuplicateLead = async (email: string, courseId: string): Promise<DuplicateCheckResult> => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check locally first
    const match = leads.find(
      (l) => l.email.toLowerCase() === cleanEmail && l.course_id === courseId
    );

    if (match) {
      return {
        isDuplicate: true,
        existingLead: match,
        message: `An application from ${email} for this course is already on file (Lead Reference: ${match.lead_number}). Our admissions counselor is actively reviewing your file.`,
      };
    }

    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase
          .from('leads')
          .select('*')
          .eq('email', cleanEmail)
          .eq('course_id', courseId)
          .limit(1);

        if (data && data.length > 0) {
          const found = data[0] as Lead;
          return {
            isDuplicate: true,
            existingLead: found,
            message: `An application from ${email} for this course is already registered (Lead Ref: ${found.lead_number}). A counselor will contact you shortly.`,
          };
        }
      } catch (err) {
        console.error('Duplicate check error:', err);
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
    // 1. Anti-duplicate protection check
    const dupCheck = await checkDuplicateLead(leadData.email, leadData.course_id);
    if (dupCheck.isDuplicate) {
      return {
        success: false,
        isDuplicate: true,
        lead: dupCheck.existingLead,
        error: dupCheck.message,
      };
    }

    const courseObj = courses.find((c) => c.id === leadData.course_id);
    const now = new Date().toISOString();
    const nextLeadNum = 'EV-' + (1000 + leads.length + 1);

    // Auto-assign to staff member (round-robin or default lead counselor)
    const availableStaff = staffList.length > 0 ? staffList[0] : null;

    const newLead: Lead = {
      id: 'lead_' + Math.random().toString(36).substring(2, 10),
      lead_number: nextLeadNum,
      full_name: leadData.full_name.trim(),
      email: leadData.email.trim().toLowerCase(),
      phone: leadData.phone.trim(),
      course_id: leadData.course_id,
      course_title: courseObj?.title || 'Cybersecurity Program',
      college_company: leadData.college_company.trim(),
      experience_level: leadData.experience_level,
      status: 'New',
      assigned_to: availableStaff?.id || null,
      assigned_staff_name: availableStaff?.full_name || 'Unassigned',
      next_follow_up_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      referral_source: leadData.referral_source || 'Direct Website',
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
        const { data, error } = await supabase
          .from('leads')
          .insert([
            {
              full_name: newLead.full_name,
              email: newLead.email,
              phone: newLead.phone,
              course_id: newLead.course_id,
              college_company: newLead.college_company,
              experience_level: newLead.experience_level,
              status: 'New',
              assigned_to: newLead.assigned_to,
              referral_source: newLead.referral_source,
              utm_source: newLead.utm_source,
              utm_medium: newLead.utm_medium,
              utm_campaign: newLead.utm_campaign,
              utm_term: newLead.utm_term,
              utm_content: newLead.utm_content,
            },
          ])
          .select()
          .single();

        if (error) {
          return { success: false, error: error.message };
        }

        const createdLead: Lead = {
          ...(data as Lead),
          course_title: courseObj?.title,
          assigned_staff_name: availableStaff?.full_name,
        };

        setLeads((prev) => [createdLead, ...prev]);

        // Track conversion event
        await trackEvent('lead_submission', createdLead.course_id, {
          lead_number: createdLead.lead_number,
          experience_level: createdLead.experience_level,
        });

        return { success: true, lead: createdLead };
      } catch (err) {
        return { success: false, error: (err as Error).message };
      }
    }

    // Local / Demo mode
    setLeads((prev) => [newLead, ...prev]);

    // Initial status history entry
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

    // Track analytics event
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

        // Log status history
        await supabase.from('lead_status_history').insert([
          {
            lead_id: leadId,
            old_status: oldStatus,
            new_status: newStatus,
            changed_by: user?.id,
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

  // Assign lead to staff
  const assignLead = async (
    leadId: string,
    staffId: string,
    notes?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const targetStaff = staffList.find((s) => s.id === staffId);
    const now = new Date().toISOString();

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('leads')
          .update({
            assigned_to: staffId,
            updated_at: now,
          })
          .eq('id', leadId);

        if (error) return { success: false, error: error.message };

        await supabase.from('lead_assignments').insert([
          {
            lead_id: leadId,
            assigned_by: user?.id,
            assigned_to: staffId,
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

    const newNote: LeadNote = {
      id: 'note_' + Math.random().toString(36).substring(2, 9),
      lead_id: leadId,
      author_id: user?.id,
      author_name: user?.full_name || 'Admissions Counselor',
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
              author_id: user?.id,
              author_name: user?.full_name || 'Admissions Counselor',
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
    if (!isSuperAdmin) {
      return { success: false, error: 'Permission denied: Super Admin role required.' };
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
    return { success: true };
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
      'Assigned Counselor',
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
          key: 'site_config',
          value: updated,
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
      id: faqData.id || 'faq_' + Math.random().toString(36).substring(2, 9),
      category: faqData.category || 'General',
      question: faqData.question || '',
      answer: faqData.answer || '',
      course_id: faqData.course_id || null,
      sort_order: faqData.sort_order ?? faqs.length + 1,
      is_active: faqData.is_active !== undefined ? faqData.is_active : true,
      created_at: faqData.created_at || new Date().toISOString(),
    };

    if (isNew) {
      setFaqs((prev) => [...prev, item]);
    } else {
      setFaqs((prev) => prev.map((f) => (f.id === item.id ? item : f)));
    }
    return { success: true };
  };

  const deleteFaq = async (id: string): Promise<{ success: boolean }> => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    return { success: true };
  };

  const saveTestimonial = async (testData: Partial<Testimonial>): Promise<{ success: boolean }> => {
    const isNew = !testData.id;
    const item: Testimonial = {
      id: testData.id || 'test_' + Math.random().toString(36).substring(2, 9),
      name: testData.name || '',
      role: testData.role || '',
      company: testData.company || '',
      avatar_url: testData.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      content: testData.content || '',
      rating: testData.rating || 5,
      is_featured: testData.is_featured !== undefined ? testData.is_featured : true,
      sort_order: testData.sort_order ?? testimonials.length + 1,
      created_at: testData.created_at || new Date().toISOString(),
    };

    if (isNew) {
      setTestimonials((prev) => [...prev, item]);
    } else {
      setTestimonials((prev) => prev.map((t) => (t.id === item.id ? item : t)));
    }
    return { success: true };
  };

  const deleteTestimonial = async (id: string): Promise<{ success: boolean }> => {
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
    assignLead,
    getLeadNotes,
    addLeadNote,
    getLeadHistory,
    deleteLead,
    exportLeadsCsv,
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
