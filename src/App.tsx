import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { ProgramsPage } from './pages/ProgramsPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { RegisterPage } from './pages/RegisterPage';
import { RegistrationSuccessPage } from './pages/RegistrationSuccessPage';
import { LoginPage } from './pages/LoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminLeadsPage } from './pages/admin/AdminLeadsPage';
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage';
import { AdminVideosPage } from './pages/admin/AdminVideosPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminContentPage } from './pages/admin/AdminContentPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Layout for public pages
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-red-600 selection:text-white">
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
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/courses/:slug" element={<CourseDetailPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/registration-success" element={<RegistrationSuccessPage />} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin CRM Console */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="leads" element={<AdminLeadsPage />} />
        <Route path="courses" element={<AdminCoursesPage />} />
        <Route path="videos" element={<AdminVideosPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="content" element={<AdminContentPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

