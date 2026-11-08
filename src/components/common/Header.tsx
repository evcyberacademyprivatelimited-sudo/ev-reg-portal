import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Menu, X, ArrowRight, Lock, PhoneCall } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { siteSettings } = useData();

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Official Logo */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center focus:outline-none"
          >
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              type="button"
              onClick={() => scrollToSection('courses')}
              className="text-sm font-semibold text-slate-700 hover:text-red-600 transition cursor-pointer"
            >
              Courses &amp; Programs
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('overview')}
              className="text-sm font-semibold text-slate-700 hover:text-red-600 transition cursor-pointer"
            >
              Overview Video
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="text-sm font-semibold text-slate-700 hover:text-red-600 transition cursor-pointer"
            >
              Contact Us
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-300 rounded-xl hover:bg-slate-50 transition cursor-pointer"
            >
              Contact for Courses
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('courses')}
              className="px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {isAuthenticated && (
              <Link
                to="/admin"
                className="p-2 text-slate-500 hover:text-red-600 border border-slate-200 rounded-xl hover:bg-slate-100 transition"
                title="Go to Admin Panel"
              >
                <Lock className="w-4 h-4 text-red-600" />
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => scrollToSection('courses')}
              className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 rounded-lg"
            >
              Apply
            </button>

            <button
              type="button"
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
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <nav className="flex flex-col space-y-2">
            <button
              type="button"
              onClick={() => scrollToSection('courses')}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
            >
              Courses &amp; Programs
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('overview')}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
            >
              Overview Video
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
            >
              Contact Us
            </button>
          </nav>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              type="button"
              onClick={() => scrollToSection('courses')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow"
            >
              <span>Apply for Course</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-300 rounded-xl"
            >
              <PhoneCall className="w-3.5 h-3.5 text-slate-600" />
              <span>Contact for Courses</span>
            </button>

            {isAuthenticated && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-600 hover:text-red-600"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
