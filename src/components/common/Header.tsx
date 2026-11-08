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
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Official Logo */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center focus:outline-none"
          >
            <Logo variant="light" size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              type="button"
              onClick={() => scrollToSection('courses')}
              className="text-sm font-semibold text-slate-300 hover:text-white hover:text-red-400 transition cursor-pointer"
            >
              Courses &amp; Programs
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('overview')}
              className="text-sm font-semibold text-slate-300 hover:text-white hover:text-red-400 transition cursor-pointer"
            >
              Overview Video
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="text-sm font-semibold text-slate-300 hover:text-white hover:text-red-400 transition cursor-pointer"
            >
              Contact Us
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="px-4 py-2 text-xs font-bold text-slate-200 hover:text-white border border-slate-700/80 rounded-xl bg-slate-900/60 hover:bg-slate-800 transition cursor-pointer"
            >
              Contact for Courses
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('courses')}
              className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:from-red-700 rounded-xl shadow-lg shadow-red-950/50 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {isAuthenticated && (
              <Link
                to="/admin"
                className="p-2 text-slate-400 hover:text-red-400 border border-slate-800 rounded-xl hover:bg-slate-900 transition"
                title="Go to Admin Panel"
              >
                <Lock className="w-4 h-4 text-red-500" />
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => scrollToSection('courses')}
              className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 rounded-lg shadow-sm"
            >
              Apply
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-3 shadow-2xl">
          <nav className="flex flex-col space-y-2">
            <button
              type="button"
              onClick={() => scrollToSection('courses')}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-red-400 rounded-lg transition"
            >
              Courses &amp; Programs
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('overview')}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-red-400 rounded-lg transition"
            >
              Overview Video
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-red-400 rounded-lg transition"
            >
              Contact Us
            </button>
          </nav>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <button
              type="button"
              onClick={() => scrollToSection('courses')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 rounded-xl shadow-lg"
            >
              <span>Apply for Course</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-300 border border-slate-800 rounded-xl bg-slate-900 hover:bg-slate-800"
            >
              <PhoneCall className="w-3.5 h-3.5 text-red-500" />
              <span>Contact for Courses</span>
            </button>

            {isAuthenticated && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-400 hover:text-red-400"
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
