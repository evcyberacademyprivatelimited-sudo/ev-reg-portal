import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { ShieldCheck, Mail, Phone, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Footer: React.FC = () => {
  const { courses, siteSettings } = useData();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" size="md" />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              EV Cyber Academy is an industry-grade cyber defense and offensive security training institution. We train university graduates, software engineers, and IT specialists in live-fire cyber ranges and modern security operations.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-red-500" />
                <span>Authorized Cyber Defense Center</span>
              </div>
            </div>
          </div>

          {/* Programs */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Programs</h4>
            <ul className="space-y-2.5 text-sm">
              {courses.slice(0, 5).map((course) => (
                <li key={course.id}>
                  <Link
                    to={`/courses/${course.slug}`}
                    className="text-slate-400 hover:text-white transition flex items-center justify-between group"
                  >
                    <span className="line-clamp-1">{course.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-red-400 transition" />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/programs"
                  className="text-red-400 hover:text-red-300 font-semibold text-xs inline-flex items-center gap-1 mt-1"
                >
                  View All Programs &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Admissions</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/register" className="text-slate-400 hover:text-white transition">
                  Apply for Next Batch
                </Link>
              </li>
              <li>
                <Link to="/#methodology" className="text-slate-400 hover:text-white transition">
                  Cyber Range Labs & Architecture
                </Link>
              </li>
              <li>
                <Link to="/#testimonials" className="text-slate-400 hover:text-white transition">
                  Corporate Alumni Placement
                </Link>
              </li>
              <li>
                <Link to="/#faqs" className="text-slate-400 hover:text-white transition">
                  Admissions FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Admissions Office</h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{siteSettings.contact_address || 'Bangalore & Online Global Cohorts'}</span>
              </li>
              {siteSettings.contact_phone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-red-500 shrink-0" />
                  <a href={`tel:${siteSettings.contact_phone}`} className="hover:text-white transition">
                    {siteSettings.contact_phone}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <a href={`mailto:${siteSettings.contact_email}`} className="hover:text-white transition">
                  {siteSettings.contact_email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-red-500 shrink-0" />
                <span>{siteSettings.counseling_hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and disclaimer */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} EV Cyber Academy. All rights reserved. Strict ethical use policies apply.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">Security Clearance & Compliance Compliant</span>
            <span>Zero Unethical Compromise Tolerance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

