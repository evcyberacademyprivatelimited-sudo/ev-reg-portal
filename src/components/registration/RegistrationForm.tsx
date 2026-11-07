import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import { ExperienceLevel } from '../../types';
import { validateRegistrationForm } from '../../lib/validation';
import { captureUtmParams } from '../../lib/utm';
import { trackEvent } from '../../lib/analytics';
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Loader2,
  Clock,
} from 'lucide-react';

interface RegistrationFormProps {
  preselectedCourseId?: string;
  onSuccess?: (leadId: string) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  preselectedCourseId,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { courses, submitRegistration, checkDuplicateLead } = useData();
  const { success, error: notifyError } = useNotification();

  const queryCourse = searchParams.get('course') || preselectedCourseId || '';

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    course_id: queryCourse,
    college_company: '',
    experience_level: 'Student / Fresher' as ExperienceLevel,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStartedForm, setHasStartedForm] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Sync course selection if query param changes or preselected prop arrives
  useEffect(() => {
    if (queryCourse && !formData.course_id) {
      setFormData((prev) => ({ ...prev, course_id: queryCourse }));
    }
  }, [queryCourse, formData.course_id]);

  // Track form start on first interaction
  const handleFormInteraction = () => {
    if (!hasStartedForm) {
      setHasStartedForm(true);
      trackEvent('form_start', formData.course_id);
    }
  };

  const experienceOptions: ExperienceLevel[] = [
    'Student / Fresher',
    '0-2 Years IT/Dev',
    '2-5 Years Tech/Security',
    '5+ Years Professional',
    'Career Switcher',
  ];

  const handleBlurEmailOrCourse = async () => {
    if (formData.email && formData.course_id) {
      const dupCheck = await checkDuplicateLead(formData.email, formData.course_id);
      if (dupCheck.isDuplicate) {
        setDuplicateWarning(dupCheck.message || 'You have already applied for this course.');
      } else {
        setDuplicateWarning(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDuplicateWarning(null);

    // Validate
    const validation = validateRegistrationForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      notifyError('Please fix the errors indicated in the form.');
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // Extract UTM / campaign params automatically
      const utm = captureUtmParams();

      const result = await submitRegistration({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        course_id: formData.course_id,
        college_company: formData.college_company,
        experience_level: formData.experience_level,
        referral_source: utm.ref || 'Direct Web Registration',
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
        utm_term: utm.utm_term,
        utm_content: utm.utm_content,
      });

      if (!result.success) {
        if (result.isDuplicate) {
          setDuplicateWarning(
            result.error ||
              'An active application for this program is already registered with this email.'
          );
        } else {
          notifyError('Submission Error', result.error || 'Failed to submit registration.');
        }
        setIsSubmitting(false);
        return;
      }

      success(
        'Registration Recorded!',
        `Your application reference is ${result.lead?.lead_number}. An admissions counselor will reach out shortly.`
      );

      if (onSuccess && result.lead?.id) {
        onSuccess(result.lead.id);
      } else {
        navigate(`/registration-success?leadId=${result.lead?.id}&leadNum=${result.lead?.lead_number}`);
      }
    } catch (err) {
      notifyError('Unexpected error during registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCourse = courses.find((c) => c.id === formData.course_id);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
      {/* Form Header */}
      <div className="bg-slate-950 text-white p-6 sm:p-8 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500 mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Priority Admissions Application</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Reserve Your Cyber Range Seat
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
          Fill in your details below. No upfront payment required. Our academic admissions lead will verify your prerequisites and schedule your lab walkthrough.
        </p>

        {selectedCourse && (
          <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200 truncate">{selectedCourse.title}</span>
            <span className="text-emerald-400 font-bold shrink-0 ml-2">
              Fee: ₹{selectedCourse.fee_amount.toLocaleString('en-IN')}
            </span>
          </div>
        )}
      </div>

      {/* Duplicate Alert Notice if detected */}
      {duplicateWarning && (
        <div className="m-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold">Existing Application On Record</p>
            <p className="leading-relaxed text-amber-800">{duplicateWarning}</p>
            <p className="text-amber-700 font-medium pt-1">
              Need urgent assistance? Chat with an admissions lead directly on WhatsApp.
            </p>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} onFocus={handleFormInteraction} className="p-6 sm:p-8 space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Full Name <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border bg-slate-50/50 focus:bg-white transition focus:outline-none focus:ring-2 ${
                errors.full_name
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-slate-300 focus:border-red-600 focus:ring-red-600/10'
              }`}
            />
          </div>
          {errors.full_name && (
            <p className="text-xs text-red-600 mt-1 font-medium">{errors.full_name}</p>
          )}
        </div>

        {/* Email & Phone in 2 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onBlur={handleBlurEmailOrCourse}
                className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border bg-slate-50/50 focus:bg-white transition focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500/20'
                    : 'border-slate-300 focus:border-red-600 focus:ring-red-600/10'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              WhatsApp / Mobile Number <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border bg-slate-50/50 focus:bg-white transition focus:outline-none focus:ring-2 ${
                  errors.phone
                    ? 'border-red-500 focus:ring-red-500/20'
                    : 'border-slate-300 focus:border-red-600 focus:ring-red-600/10'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Course Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Select Cybersecurity Program <span className="text-red-600">*</span>
          </label>
          <select
            required
            value={formData.course_id}
            onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
            onBlur={handleBlurEmailOrCourse}
            className={`w-full px-4 py-3 text-sm rounded-xl border bg-slate-50/50 focus:bg-white transition focus:outline-none focus:ring-2 ${
              errors.course_id
                ? 'border-red-500 focus:ring-red-500/20'
                : 'border-slate-300 focus:border-red-600 focus:ring-red-600/10'
            }`}
          >
            <option value="">-- Choose Course Cohort --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title} ({course.level} &bull; {course.duration_weeks} Weeks &bull; ₹
                {course.fee_amount.toLocaleString('en-IN')})
              </option>
            ))}
          </select>
          {errors.course_id && (
            <p className="text-xs text-red-600 mt-1 font-medium">{errors.course_id}</p>
          )}
        </div>

        {/* College / Organization & Experience Level in 2 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              College or Company Name <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                placeholder="e.g. Infosys / SRM University"
                value={formData.college_company}
                onChange={(e) => setFormData({ ...formData, college_company: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border bg-slate-50/50 focus:bg-white transition focus:outline-none focus:ring-2 ${
                  errors.college_company
                    ? 'border-red-500 focus:ring-red-500/20'
                    : 'border-slate-300 focus:border-red-600 focus:ring-red-600/10'
                }`}
              />
            </div>
            {errors.college_company && (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.college_company}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Technical Experience Level <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={formData.experience_level}
                onChange={(e) =>
                  setFormData({ ...formData, experience_level: e.target.value as ExperienceLevel })
                }
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white transition focus:outline-none focus:ring-2 focus:border-red-600 focus:ring-red-600/10"
              >
                {experienceOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 text-white font-black text-base shadow-xl hover:shadow-brand transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Submitting Your Application...</span>
              </>
            ) : (
              <>
                <span>Complete Free Application &amp; Reserve Seat</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>

        <div className="text-center space-y-1 text-xs text-slate-500">
          <p className="flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Admissions counselor callback scheduled within 24 hours of submission.</span>
          </p>
          <p className="text-[11px] text-slate-400">
            Strictly zero third-party spam. Your contact details are protected under EV privacy standards.
          </p>
        </div>
      </form>
    </div>
  );
};

