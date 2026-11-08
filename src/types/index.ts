export type ExperienceLevel = 
  | 'Student / Fresher'
  | '0-2 Years IT/Dev'
  | '2-5 Years Tech/Security'
  | '5+ Years Professional'
  | 'Career Switcher';

export type LeadStatus = 
  | 'New'
  | 'Contacted'
  | 'Interested'
  | 'Converted'
  | 'Not Interested';

export type CourseLevel = 
  | 'Beginner'
  | 'Intermediate'
  | 'Advanced'
  | 'All Levels';

export type CourseStatus = 'published' | 'draft' | 'archived';

export type VideoPlacement = 'hero' | 'after_hero' | 'course_details';

export interface SyllabusModule {
  module: number;
  title: string;
  duration: string;
  topics: string[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  description?: string;
  level: CourseLevel;
  duration_weeks: number;
  hours_per_week: number;
  fee_amount: number;
  currency: string;
  status: CourseStatus;
  featured: boolean;
  badge_text?: string;
  certification_title: string;
  batch_start_date?: string;
  seats_remaining?: number;
  syllabus: SyllabusModule[];
  outcomes: string[];
  prerequisites: string[];
  tools_covered: string[];
  created_at: string;
  updated_at: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description?: string;
  youtube_url: string;
  youtube_video_id: string;
  placement: VideoPlacement;
  pinned_homepage: boolean;
  pinned_course_id?: string | null;
  is_active: boolean;
  autoplay: boolean;
  muted_autoplay: boolean;
  show_controls: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  lead_number: string;
  full_name: string;
  email: string;
  phone: string;
  course_id: string;
  course_title?: string;
  college_company: string;
  experience_level: ExperienceLevel;
  status: LeadStatus;
  assigned_to?: string | null;
  assigned_staff_name?: string | null;
  next_follow_up_date?: string | null;
  referral_source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  last_contacted_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  author_id?: string;
  author_name: string;
  note: string;
  created_at: string;
}

export interface LeadStatusHistory {
  id: string;
  lead_id: string;
  old_status?: string | null;
  new_status: string;
  changed_by?: string | null;
  changed_by_name?: string | null;
  note?: string;
  created_at: string;
}

export interface LeadAssignment {
  id: string;
  lead_id: string;
  assigned_by?: string;
  assigned_to?: string;
  notes?: string;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar_url?: string;
  content: string;
  rating: number;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface Faq {
  id: string;
  category: string;
  question: string;
  answer: string;
  course_id?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'staff';
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
}

export interface AnalyticsEvent {
  id: string;
  event_type: 'page_view' | 'course_view' | 'cta_click' | 'form_start' | 'lead_submission' | 'video_play';
  page_path: string;
  course_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  session_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  ref?: string;
}

export interface SiteSettings {
  hero_badge: string;
  hero_headline_prefix: string;
  hero_headline_highlight: string;
  hero_subheadline: string;
  primary_cta_text: string;
  secondary_cta_text: string;
  trust_badge_text: string;
  contact_phone: string;
  contact_email: string;
  contact_whatsapp: string;
  contact_address?: string;
  counseling_hours: string;
}

