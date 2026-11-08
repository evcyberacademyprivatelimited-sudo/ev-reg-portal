import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Layout for the single-page student registration portal
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
      {/* Student Website – Single-Page Course Registration Experience */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        {/* Seamless redirects for any legacy multi-page links */}
        <Route path="/programs" element={<Navigate to="/" replace />} />
        <Route path="/courses/*" element={<Navigate to="/" replace />} />
        <Route path="/register" element={<Navigate to="/" replace />} />
        <Route path="/registration-success" element={<Navigate to="/" replace />} />
      </Route>

      {/* Admin Authentication */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Panel – Extremely Simple Management */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="courses" element={<AdminCoursesPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        {/* Redirect any legacy admin sub-routes */}
        <Route path="leads" element={<Navigate to="/admin" replace />} />
        <Route path="videos" element={<Navigate to="/admin/settings" replace />} />
        <Route path="analytics" element={<Navigate to="/admin" replace />} />
        <Route path="content" element={<Navigate to="/admin/settings" replace />} />
      </Route>

      {/* Global Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
