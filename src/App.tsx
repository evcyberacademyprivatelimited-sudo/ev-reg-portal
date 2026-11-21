import React, { lazy, Suspense } from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { CampaignCoursePage } from './pages/CampaignCoursePage';

// Lazy-loaded Admin Routes (code-split to keep public landing bundle lightweight)
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminCoursesPage = lazy(() => import('./pages/admin/AdminCoursesPage').then(m => ({ default: m.AdminCoursesPage })));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage').then(m => ({ default: m.AdminSettingsPage })));

const AdminLoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6">
    <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center animate-pulse">
      <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  </div>
);

// Layout for the single-page student registration portal
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 selection:bg-red-600 selection:text-white">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Admin Authentication */}
      <Route
        path="/login"
        element={
          <Suspense fallback={<AdminLoadingFallback />}>
            <LoginPage />
          </Suspense>
        }
      />

      {/* Admin Panel – Extremely Simple Management */}
      <Route
        path="/admin"
        element={
          <Suspense fallback={<AdminLoadingFallback />}>
            <AdminLayout />
          </Suspense>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="courses" element={<AdminCoursesPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        {/* Redirect any legacy admin sub-routes */}
        <Route path="leads" element={<Navigate to="/admin" replace />} />
        <Route path="videos" element={<Navigate to="/admin/settings" replace />} />
        <Route path="analytics" element={<Navigate to="/admin" replace />} />
        <Route path="content" element={<Navigate to="/admin/settings" replace />} />
      </Route>

      {/* Legacy redirects above dynamic /:slug */}
      <Route path="/programs" element={<Navigate to="/" replace />} />
      <Route path="/courses/*" element={<Navigate to="/" replace />} />
      <Route path="/register" element={<Navigate to="/" replace />} />
      <Route path="/registration-success" element={<Navigate to="/" replace />} />

      {/* Student Website & Campaign Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/:slug" element={<CampaignCoursePage />} />
      </Route>

      {/* Global Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
