-- ==============================================================================
-- EV CYBER ACADEMY – COMPLETE PRODUCTION POSTGRESQL SCHEMA
-- Migration: 20261107000000_init_schema.sql
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Staff & Admins)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'staff')) DEFAULT 'staff',
    phone TEXT,
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. COURSES
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    tagline TEXT NOT NULL,
    summary TEXT NOT NULL,
    description TEXT,
    level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'All Levels')) DEFAULT 'Intermediate',
    duration_weeks INT NOT NULL DEFAULT 12,
    hours_per_week INT NOT NULL DEFAULT 8,
    fee_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL CHECK (status IN ('published', 'draft', 'archived')) DEFAULT 'published',
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    badge_text TEXT,
    certification_title TEXT NOT NULL,
    batch_start_date DATE,
    seats_remaining INT DEFAULT 20,
    syllabus JSONB NOT NULL DEFAULT '[]'::jsonb,
    outcomes JSONB NOT NULL DEFAULT '[]'::jsonb,
    prerequisites JSONB NOT NULL DEFAULT '[]'::jsonb,
    tools_covered JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. VIDEOS (Admin Controlled YouTube Management)
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    youtube_url TEXT NOT NULL,
    youtube_video_id TEXT NOT NULL,
    placement TEXT NOT NULL CHECK (placement IN ('hero', 'after_hero', 'course_details')) DEFAULT 'hero',
    pinned_homepage BOOLEAN NOT NULL DEFAULT FALSE,
    pinned_course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    autoplay BOOLEAN NOT NULL DEFAULT TRUE,
    muted_autoplay BOOLEAN NOT NULL DEFAULT TRUE,
    show_controls BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. LEAD SOURCES
CREATE TABLE IF NOT EXISTS public.lead_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. LEADS
CREATE SEQUENCE IF NOT EXISTS lead_number_seq START WITH 1001;

CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_number TEXT UNIQUE NOT NULL DEFAULT ('EV-' || NEXTVAL('lead_number_seq')::TEXT),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE RESTRICT,
    college_company TEXT NOT NULL,
    experience_level TEXT NOT NULL CHECK (experience_level IN ('Student / Fresher', '0-2 Years IT/Dev', '2-5 Years Tech/Security', '5+ Years Professional', 'Career Switcher')),
    status TEXT NOT NULL CHECK (status IN ('New', 'Contacted', 'Interested', 'Converted', 'Not Interested')) DEFAULT 'New',
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    next_follow_up_date DATE,
    referral_source TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    last_contacted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Index for lead lookup & anti-duplicate check
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_course_id ON public.leads(course_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);

-- 6. LEAD NOTES
CREATE TABLE IF NOT EXISTS public.lead_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 7. LEAD ASSIGNMENTS HISTORY
CREATE TABLE IF NOT EXISTS public.lead_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 8. LEAD STATUS HISTORY
CREATE TABLE IF NOT EXISTS public.lead_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    changed_by_name TEXT,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 9. TESTIMONIALS (Admin Managed)
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    avatar_url TEXT,
    content TEXT NOT NULL,
    rating INT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    is_featured BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 10. FAQS (Admin Managed)
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL DEFAULT 'General',
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 11. SITE CONTENT / SALES BANNER SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 12. CONVERSION ANALYTICS EVENTS
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'course_view', 'cta_click', 'form_start', 'lead_submission', 'video_play')),
    page_path TEXT NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    session_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics_events(created_at DESC);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'role', 'staff')
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = EXCLUDED.full_name;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Helper functions for role checking
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'super_admin' AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Authenticated users can read their own or staff directory; Super admins manage all
CREATE POLICY "Public staff directory read" ON public.profiles
    FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "Super admin manage profiles" ON public.profiles
    FOR ALL TO authenticated USING (public.is_super_admin());

-- Courses: Anyone can read published courses; Staff/Admin can manage
CREATE POLICY "Anyone can view published courses" ON public.courses
    FOR SELECT TO anon, authenticated
    USING (status = 'published' OR public.is_staff());

CREATE POLICY "Staff manage courses" ON public.courses
    FOR ALL TO authenticated
    USING (public.is_staff());

-- Videos: Anyone can view active videos; Staff/Admin can manage
CREATE POLICY "Anyone can view active videos" ON public.videos
    FOR SELECT TO anon, authenticated
    USING (is_active = TRUE OR public.is_staff());

CREATE POLICY "Staff manage videos" ON public.videos
    FOR ALL TO authenticated
    USING (public.is_staff());

-- Testimonials & FAQs: Anyone can view active
CREATE POLICY "Anyone can view testimonials" ON public.testimonials
    FOR SELECT TO anon, authenticated USING (TRUE);

CREATE POLICY "Staff manage testimonials" ON public.testimonials
    FOR ALL TO authenticated USING (public.is_staff());

CREATE POLICY "Anyone can view active faqs" ON public.faqs
    FOR SELECT TO anon, authenticated USING (is_active = TRUE OR public.is_staff());

CREATE POLICY "Staff manage faqs" ON public.faqs
    FOR ALL TO authenticated USING (public.is_staff());

-- Site settings: Anyone can read; Staff can manage
CREATE POLICY "Anyone can read site settings" ON public.site_settings
    FOR SELECT TO anon, authenticated USING (TRUE);

CREATE POLICY "Staff manage site settings" ON public.site_settings
    FOR ALL TO authenticated USING (public.is_staff());

-- Leads: Public can INSERT only (registration form); Staff can SELECT / UPDATE
CREATE POLICY "Public can submit leads" ON public.leads
    FOR INSERT TO anon, authenticated
    WITH CHECK (TRUE);

CREATE POLICY "Staff view leads" ON public.leads
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin() 
        OR assigned_to = auth.uid()
        OR assigned_to IS NULL
    );

CREATE POLICY "Staff update leads" ON public.leads
    FOR UPDATE TO authenticated
    USING (
        public.is_super_admin() 
        OR assigned_to = auth.uid()
        OR assigned_to IS NULL
    );

CREATE POLICY "Super admin delete leads" ON public.leads
    FOR DELETE TO authenticated
    USING (public.is_super_admin());

-- Lead Notes: Staff can view and add notes
CREATE POLICY "Staff view notes" ON public.lead_notes
    FOR SELECT TO authenticated
    USING (public.is_staff());

CREATE POLICY "Staff insert notes" ON public.lead_notes
    FOR INSERT TO authenticated
    WITH CHECK (public.is_staff());

-- Lead Status History & Assignments: Staff can view and insert
CREATE POLICY "Staff view history" ON public.lead_status_history
    FOR SELECT TO authenticated
    USING (public.is_staff());

CREATE POLICY "Staff insert history" ON public.lead_status_history
    FOR INSERT TO authenticated
    WITH CHECK (public.is_staff());

CREATE POLICY "Staff view assignments" ON public.lead_assignments
    FOR SELECT TO authenticated
    USING (public.is_staff());

CREATE POLICY "Staff insert assignments" ON public.lead_assignments
    FOR INSERT TO authenticated
    WITH CHECK (public.is_staff());

-- Analytics: Public can insert events; Staff can view
CREATE POLICY "Public insert analytics" ON public.analytics_events
    FOR INSERT TO anon, authenticated
    WITH CHECK (TRUE);

CREATE POLICY "Staff view analytics" ON public.analytics_events
    FOR SELECT TO authenticated
    USING (public.is_staff());
