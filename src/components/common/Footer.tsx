import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Mail, Phone, MapPin, Clock, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Footer: React.FC = () => {
  const { siteSettings } = useData();

  const scrollToCourses = () => {
    const el = document.getElementById('courses');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" size="md" />
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              EV Cyber Academy Private Limited provides industry-grade cybersecurity and defense training programs. Dedicated to preparing students and technology professionals for technical security careers through hands-on cyber range labs.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-red-500" />
              <span>EV Cyber Academy Private Limited &bull; Official Registration Portal</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={scrollToCourses}
                  className="text-slate-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Courses &amp; Programs</span>
                  <ArrowRight className="w-3 h-3 text-red-500" />
                </button>
              </li>
              <li>
                <a
                  href="#overview"
                  className="text-slate-400 hover:text-white transition"
                >
                  Overview Video
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-slate-400 hover:text-white transition"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Contact EV
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span>{siteSettings.contact_address || 'Bangalore & Online Worldwide'}</span>
              </li>
              {siteSettings.contact_phone && (
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <a href={`tel:${siteSettings.contact_phone}`} className="hover:text-white transition">
                    {siteSettings.contact_phone}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <a href={`mailto:${siteSettings.contact_email}`} className="hover:text-white transition">
                  {siteSettings.contact_email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{siteSettings.counseling_hours || 'Mon - Sat: 9:00 AM - 8:00 PM IST'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} EV Cyber Academy Private Limited. All rights reserved.
          </p>

          <Link
            to="/login"
            className="text-slate-600 hover:text-slate-400 flex items-center gap-1 transition"
          >
            <Lock className="w-3 h-3" />
            <span>Admin Login</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};
