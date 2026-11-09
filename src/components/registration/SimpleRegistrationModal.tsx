import React, { useState } from 'react';
import { X, CheckCircle2, User, Mail, Phone, ArrowRight, Loader2, BookOpen } from 'lucide-react';
import { Course } from '../../types';
import { useData } from '../../context/DataContext';

interface SimpleRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: Course | null;
}

export const SimpleRegistrationModal: React.FC<SimpleRegistrationModalProps> = ({
  isOpen,
  onClose,
  selectedCourse,
}) => {
  const { courses, submitRegistration } = useData();

  const [courseId, setCourseId] = useState<string>(selectedCourse?.id || '');
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedLeadNumber, setSubmittedLeadNumber] = useState<string | null>(null);

  // Sync selected course when modal opens
  React.useEffect(() => {
    if (selectedCourse) {
      setCourseId(selectedCourse.id);
    } else if (courses.length > 0 && !courseId) {
      setCourseId(courses[0].id);
    }
  }, [selectedCourse, courses, courseId]);

  // Handle Escape key to close modal
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setStudentName('');
        setEmail('');
        setContactNumber('');
        setErrorMessage(null);
        setSubmittedLeadNumber(null);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentCourse = courses.find((c) => c.id === courseId) || selectedCourse;

  const handleResetAndClose = () => {
    setStudentName('');
    setEmail('');
    setContactNumber('');
    setErrorMessage(null);
    setSubmittedLeadNumber(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!studentName.trim() || !email.trim() || !contactNumber.trim()) {
      setErrorMessage('Please fill in your name, email address, and contact number.');
      return;
    }

    if (!courseId) {
      setErrorMessage('Please select a course to register.');
      return;
    }

    setIsSubmitting(true);

    const result = await submitRegistration({
      full_name: studentName.trim(),
      email: email.trim().toLowerCase(),
      phone: contactNumber.trim(),
      course_id: courseId,
      college_company: 'Not Specified',
      experience_level: 'Student / Fresher',
      referral_source: 'Website Course Page',
    });

    setIsSubmitting(false);

    if (result.success && result.lead) {
      setSubmittedLeadNumber(result.lead.lead_number);
    } else {
      setErrorMessage(
        result.error || 'Failed to submit registration. Please try again or contact us directly.'
      );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={handleResetAndClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#090d16] rounded-3xl shadow-2xl border border-slate-800 text-white overflow-hidden animate-fade-in"
      >
        {/* Ambient Red Glow in corner */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-red-600/15 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button (z-50 ensure it is always above all modal content and clickable) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleResetAndClose();
          }}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-50 p-2 text-slate-400 hover:text-white hover:bg-slate-800/90 rounded-full transition cursor-pointer"
          aria-label="Close form"
        >
          <X className="w-5 h-5 pointer-events-none" />
        </button>

        {submittedLeadNumber ? (
          /* Success Screen */
          <div className="p-8 sm:p-10 text-center space-y-6 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-950/50">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-black text-white tracking-tight">
                Registration Successful
              </h3>

              <div className="inline-block px-3 py-1 rounded-full bg-red-950/60 border border-red-800/60 text-red-400 text-xs font-mono font-bold tracking-wider">
                Application Ref: {submittedLeadNumber}
              </div>

              <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto leading-relaxed pt-2 font-normal">
                Thank you for registering your interest with EV Cyber Academy. Our team will contact you shortly.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition cursor-pointer border border-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <div className="p-6 sm:p-8 space-y-6 relative z-10">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-500">
                EV Cyber Academy Private Limited
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight mt-0.5">
                Course Registration
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your details to register your application.
              </p>
            </div>

            {/* Selected Course Display */}
            {currentCourse && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-900/40 text-red-400 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Selected Course
                    </p>
                    <p className="text-xs font-bold text-white truncate">
                      {currentCourse.title}
                    </p>
                  </div>
                </div>

                {courses.length > 1 && (
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 focus:outline-none focus:border-red-500 shrink-0"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                        {c.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs leading-relaxed">
                {errorMessage}
              </div>
            )}

            {/* Simple Form (Only 3 inputs) */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Student Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                  Student Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition"
                  />
                </div>
              </div>

              {/* 2. Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition"
                  />
                </div>
              </div>

              {/* 3. Contact Number */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 via-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:from-red-700 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-red-950/50 hover:shadow-red-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Registration...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-500 pt-1 font-mono">
                Your application will be sent directly to the EV Cyber Academy admissions desk.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
