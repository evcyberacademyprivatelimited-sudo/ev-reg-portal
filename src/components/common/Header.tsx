import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { Shield, PhoneCall, Menu, X, ArrowRight, UserCheck, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { trackEvent } from '../../lib/analytics';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { siteSettings } = useData();

  const handleCtaClick = (source: string) => {
    trackEvent('cta_click', undefined, {
      source,
      destination: '/register',
    });
  };

  const navLinks = [
    { label: 'All Programs', path: '/programs' },
    { label: 'Inside the War Room', path: '/#video-spotlight' },
    { label: 'Curriculum & Labs', path: '/#methodology' },
    { label: 'Corporate Alumni', path: '/#testimonials' },
    { label: 'FAQs', path: '/#faqs' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro alert banner */}
      <div className="bg-slate-950 text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">
              <strong className="text-white font-semibold">Q4 Cohort Registration Active:</strong> Limited batch seats for live enterprise cyber ranges.
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5 hover:text-white transition">
              <PhoneCall className="w-3.5 h-3.5 text-red-500" />
              <span>Counselor Helpline: {siteSettings.contact_phone}</span>
            </span>
            <span className="text-slate-600">|</span>
            <Link
              to={isAuthenticated ? '/admin' : '/login'}
              className="text-slate-300 hover:text-red-400 flex items-center gap-1 transition"
            >
              <Lock className="w-3 h-3 text-red-500" />
              <span>{isAuthenticated ? 'Admin Console' : 'Counselor Login'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg p-1">
            <Logo size="md" />
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-red-600 font-bold'
                    : 'text-slate-700 hover:text-red-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`https://wa.me/${siteSettings.contact_whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20EV%20Cyber%20Academy,%20I%20would%20like%20to%20learn%20more%20about%20your%20upcoming%20cybersecurity%20cohorts.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chat with Counselor</span>
            </a>

            <Link
              to="/register"
              onClick={() => handleCtaClick('header_apply_now')}
              className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg shadow-md hover:shadow-brand transition-all duration-200 flex items-center gap-2 group cursor-pointer"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            {isAuthenticated && (
              <Link
                to="/admin"
                className="p-2 text-slate-600 hover:text-red-600 border border-slate-200 rounded-lg hover:bg-slate-100 transition"
                title={`Logged in as ${user?.full_name}`}
              >
                <UserCheck className="w-5 h-5 text-red-600" />
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/register"
              onClick={() => handleCtaClick('mobile_header_apply')}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 rounded-md"
            >
              Apply
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-red-50 hover:text-red-600 rounded-md transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <a
              href={`https://wa.me/${siteSettings.contact_whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20EV%20Cyber%20Academy`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-300 rounded-lg"
            >
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Academic Desk</span>
            </a>

            <Link
              to="/register"
              onClick={() => {
                setMobileMenuOpen(false);
                handleCtaClick('mobile_drawer_apply');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow"
            >
              <span>Apply for Next Cohort</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to={isAuthenticated ? '/admin' : '/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-900"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isAuthenticated ? 'Go to Admin Console' : 'Counselor Login'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
