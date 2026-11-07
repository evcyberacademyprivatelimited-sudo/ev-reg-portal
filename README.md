# EV CYBER ACADEMY – REGISTRATION & LEAD MANAGEMENT PLATFORM

A production-ready, sales-focused course registration and lead management platform engineered for **EV Cyber Academy**. Built with React, Vite, TypeScript, Tailwind CSS, and Supabase PostgreSQL.

---

## 🛡️ Live Architecture & Overview

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router v6
- **Database & Auth:** Supabase PostgreSQL with strict Row Level Security (RLS) & Role-Based Access Control (RBAC)
- **Deployment:** Vercel-ready with single-page routing rewrite rules & security headers (`vercel.json`)
- **Brand Identity:** Corporate EdTech platform styling with black, white, and crimson red accents (`#dc2626`). Authentic cybersecurity engineering—zero hacker graphics, skulls, or Matrix tropes.
- **Official Branding:** Uses the official uploaded EV logo (`/off-logo.jpeg`) with responsive text branding fallback.

---

## 🚀 Key Functional Modules

### 1. High-Converting Public Website
- **Home Landing Page:** Strong value proposition, trust metrics (2,500+ trained, 94% placement rate), dynamically loaded course cohorts, founder & academy ethos, corporate alumni reviews, and objection-handling FAQs.
- **Program Catalog:** Searchable & filterable course directory categorized by experience level (Beginner, Intermediate, Advanced).
- **Course Details Sales Page:** Dedicated high-conversion landing page for every course with:
  - Sticky registration CTA bar (desktop & mobile)
  - Interactive multi-phase syllabus accordions
  - Tools covered badges (Splunk, CrowdStrike Falcon, Zeek, BloodHound, etc.)
  - Target outcomes & prerequisites
  - Embedded YouTube video walkthrough
  - Direct WhatsApp counseling triggers
- **Admissions Application Modal & Page:**
  - Fast intake: Name, email, phone, college/company, tech experience level.
  - Automatic attribution: Captures Lead ID, course ID, timestamp, referral source, and UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`).
  - **Duplicate Registration Protection:** Checks recent applications for identical email + course to avoid duplicate submissions.
  - No payment gateway—optimized for admissions lead generation and counselor follow-up.
- **Registration Success Page:**
  - Displays unique Lead Reference ID (e.g. `EV-1005`)
  - Clear 3-step post-registration roadmap
  - 1-click WhatsApp counselor connect

---

### 2. Admin-Controlled YouTube Video Management
- Dedicated **Video Management** section in the Admin Console.
- **Automatic URL / ID Parser:** Accepts standard `youtube.com/watch?v=...`, `youtu.be/...`, or 11-char video IDs.
- **Privacy-Enhanced Embedding:** Uses `youtube-nocookie.com` domain by default.
- **Browser Autoplay Compliance:** Enforces muted autoplay with controls visible, providing a clear user option to enable sound to avoid browser blocking.
- **Admin Controls:**
  - Pin to Homepage Hero or After Hero
  - Pin to individual course detail pages
  - Live embed preview before publishing
  - Toggle autoplay, muted autoplay, and publication visibility

---

### 3. Admissions Lead CRM & Pipeline Command
- **Pipeline Stages:** `New` → `Contacted` → `Interested` → `Converted` → `Not Interested`
- **Instant Actions:**
  - **Direct Call:** `tel:` trigger to call candidate instantly
  - **WhatsApp Outreach:** Generates pre-filled candidate message
  - **Email:** One-click pre-addressed email
- **Internal Counselor Notes:** Threaded internal notes with counselor attribution and timestamp.
- **Status & Audit History:** Tracks every status transition, who executed it, and notes.
- **Staff Assignment:** Assign leads to specific academic counselors.
- **CSV Export:** Filter leads by course and status, and export to CSV.

---

### 4. Admin Sales & Content Control (CMS)
- Dynamic editing of Homepage Hero headline prefix, red gradient highlight, and subheadline.
- Dynamic CTA text and destination control.
- Testimonial manager (add, toggle featured, delete).
- FAQ objection-handling manager.
- Course creation and editing (manage syllabus modules, pricing, seat counters, and publication state).

---

### 5. Conversion Tracking & Analytics
- Funnel visualization: **Visits → Course Views → Video Plays → CTA Clicks → Form Starts → Leads Submitted → Converted**
- Real-time conversion percentages across each milestone.
- Automatic UTM source, medium, and campaign attribution breakdown.

---

### 6. Authentication & RBAC (Role-Based Access Control)
- **Super Admin:** Full system control (manage courses, configure CMS, view all leads, delete records, switch roles).
- **Counselor Staff:** Scoped permissions (triage assigned leads, add counselor notes, progress pipeline stages).
- **1-Click Demo Logins:** Instant evaluation buttons on `/login` to test both Super Admin and Staff permissions without needing manual email verification.

---

## 🗄️ Database Setup (Supabase PostgreSQL)

The repository includes complete production SQL migrations and seed data in `supabase/`:

1. Log in to [Supabase](https://supabase.com) and create a new project.
2. Navigate to **SQL Editor**.
3. Open and run `supabase/migrations/20261107000000_init_schema.sql`.
   - Creates `profiles`, `courses`, `videos`, `leads`, `lead_notes`, `lead_assignments`, `lead_status_history`, `testimonials`, `faqs`, `site_settings`, `analytics_events`.
   - Enables Row Level Security (RLS) on all tables.
   - Configures public submission policies and staff access policies.
   - Installs the user creation trigger.
4. Run `supabase/seed.sql` to populate initial courses, videos, FAQs, testimonials, and sample leads.
5. In Supabase **Project Settings → API**, copy your **Project URL** and **anon public key**.
6. Set them in `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

*Note: The platform includes a built-in offline/demo store. If Supabase environment variables are omitted, the application runs seamlessly in local mode with full interactivity and persistence.*

---

## 💻 Local Development

```bash
# 1. Clone repository
git clone https://github.com/your-username/ev-cyber-academy-portal.git
cd ev-cyber-academy-portal

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Open in browser
http://localhost:5173
```

### Production Build & Preview
```bash
# Compile TypeScript & bundle with Vite
npm run build

# Preview production build locally
npm run preview
```

---

## ☁️ Deployment Guide (Vercel)

1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. In the Project Settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
6. Click **Deploy**. Vercel will build and launch your platform with HTTPS and edge routing.

---

## 📂 Project Structure

```
├── public/
│   ├── off-logo.jpeg             # Official EV Cyber Academy logo
├── src/
│   ├── assets/                   # Logos and static visual assets
│   ├── components/
│   │   ├── admin/                # LeadTable, LeadDetailModal, VideoEditorModal, CourseEditorModal
│   │   ├── common/               # Header, Footer, Logo, YouTubeEmbed, StickyCtaBar
│   │   ├── courses/              # CourseCard, CourseHero, CourseCurriculum, CourseKeyHighlights
│   │   ├── home/                 # HeroSection, TrustMetrics, FeaturedCourses, AcademyIntro, etc.
│   │   └── registration/         # RegistrationForm, DuplicateNotice
│   ├── context/
│   │   ├── AuthContext.tsx       # Supabase Auth + RBAC + Demo role switching
│   │   ├── DataContext.tsx       # Live courses, leads, CRM actions, CSV export, videos
│   │   └── NotificationContext.tsx # Toast alerts
│   ├── lib/
│   │   ├── analytics.ts          # Conversion events tracking
│   │   ├── mockData.ts           # Initial seed data
│   │   ├── supabase.ts           # Supabase client initialization
│   │   ├── utm.ts                # Automatic UTM & referral parameter extraction
│   │   ├── validation.ts         # Lead form validation rules
│   │   └── youtube.ts            # YouTube URL parsing & privacy embed helpers
│   ├── pages/
│   │   ├── admin/                # AdminDashboard, AdminLeads, AdminCourses, AdminVideos, etc.
│   │   ├── CourseDetailPage.tsx  # Sales-focused course landing page
│   │   ├── HomePage.tsx          # Academy home page
│   │   ├── LoginPage.tsx         # Staff & Admin authentication
│   │   ├── ProgramsPage.tsx      # All courses catalog
│   │   ├── RegisterPage.tsx      # Registration page
│   │   └── RegistrationSuccessPage.tsx # Post-registration roadmap
│   ├── types/                    # TypeScript interfaces
│   ├── App.tsx                   # Routes
│   ├── main.tsx
│   └── index.css
├── supabase/
│   ├── migrations/
│   │   └── 20261107000000_init_schema.sql # Complete PostgreSQL schema & RLS
│   └── seed.sql                  # Initial seed data
├── .env.example
├── vercel.json
├── package.json
└── tsconfig.json
```

---

## ⚖️ License & Ethical Standard

All materials and cyber ranges are designed exclusively for defensive engineering, authorized adversary emulation, and educational preparation. EV Cyber Academy maintains zero tolerance for unauthorized testing or malicious use.
