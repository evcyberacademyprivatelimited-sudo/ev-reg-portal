import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import {
  Settings,
  Video,
  Save,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Clock,
  Play,
  Sparkles,
  MousePointerClick,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { toggleMenu } = useOutletContext<{ toggleMenu: () => void }>();
  const { siteSettings, updateSiteSettings, videos, saveVideo, courses } = useData();
  const { success, error: notifyError } = useNotification();

  // Quick Apply Buttons Form (Admin Editable)
  const [buttonsForm, setButtonsForm] = useState({
    quick_btn1_text:
      siteSettings.quick_btn1_text || 'Apply for ₹499 - 14 Days Ethical Hacking Program',
    quick_btn1_course_id: siteSettings.quick_btn1_course_id || '',
    quick_btn1_course_name:
      siteSettings.quick_btn1_course_name || '14-Day Ethical Hacking Program',
    quick_btn1_enabled: siteSettings.quick_btn1_enabled !== false,
    quick_btn2_text:
      siteSettings.quick_btn2_text || 'Apply to Full Ethical Hacking Course',
    quick_btn2_course_id: siteSettings.quick_btn2_course_id || '',
    quick_btn2_course_name:
      siteSettings.quick_btn2_course_name || 'Full Ethical Hacking Course',
    quick_btn2_enabled: siteSettings.quick_btn2_enabled !== false,
  });

  // Contact form
  const [contactForm, setContactForm] = useState({
    contact_phone: siteSettings.contact_phone || '',
    contact_email: siteSettings.contact_email || 'admissions@evcyberacademy.com',
    contact_whatsapp: siteSettings.contact_whatsapp || '',
    contact_address: siteSettings.contact_address || 'Bangalore & Online Worldwide',
    counseling_hours: siteSettings.counseling_hours || 'Mon - Sat: 9:00 AM - 8:00 PM IST',
  });

  // Promotional video form
  const currentHeroVideo = videos.find((v) => v.placement === 'hero' || v.pinned_homepage) || videos[0];
  const [videoUrl, setVideoUrl] = useState(
    currentHeroVideo?.youtube_url || 'https://www.youtube.com/watch?v=inWWhr5tnEA'
  );

  const [isSavingButtons, setIsSavingButtons] = useState(false);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [isSavingVideo, setIsSavingVideo] = useState(false);

  const handleSaveButtons = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingButtons(true);
    const res = await updateSiteSettings(buttonsForm);
    setIsSavingButtons(false);
    if (res.success) {
      success('Quick apply buttons updated successfully.');
    } else {
      notifyError('Failed to update quick apply buttons.');
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingContact(true);
    const res = await updateSiteSettings(contactForm);
    setIsSavingContact(false);
    if (res.success) {
      success('Contact settings updated.');
    } else {
      notifyError('Failed to update contact settings.');
    }
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;

    setIsSavingVideo(true);

    // Save or update primary video
    const videoPayload = {
      ...(currentHeroVideo?.id ? { id: currentHeroVideo.id } : {}),
      title: 'EV Cyber Academy Overview',
      youtube_url: videoUrl.trim(),
      youtube_video_id: videoUrl.trim(),
      placement: 'hero' as const,
      pinned_homepage: true,
      is_active: true,
      autoplay: false,
      muted_autoplay: true,
      show_controls: true,
    };

    const res = await saveVideo(videoPayload);
    setIsSavingVideo(false);

    if (res.success) {
      success('Promotional video updated.');
    } else {
      notifyError('Failed to update video', res.error);
    }
  };

  const isConnected = isSupabaseConfigured();

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-100">
      <AdminHeader
        title="Settings"
        subtitle="Manage the action buttons, introduction video, contact details, and database status for EV Cyber Academy Private Limited."
        onMenuToggle={toggleMenu}
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 max-w-4xl mx-auto w-full">
        {/* =========================================================================
            1. HOMEPAGE QUICK APPLY ACTION BUTTONS (ADMIN EDITABLE)
        ========================================================================== */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <MousePointerClick className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Homepage Quick Apply Action Buttons
              </h3>
              <p className="text-xs text-slate-500">
                Configure the 2 primary call-to-action buttons displayed at the very top of the student website
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveButtons} className="space-y-6 text-xs">
            {/* Button 1 Configuration */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
                  1st Button (Red Gradient Action)
                </span>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={buttonsForm.quick_btn1_enabled}
                    onChange={(e) =>
                      setButtonsForm({ ...buttonsForm, quick_btn1_enabled: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                  />
                  <span>Show Button 1</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Button Label / Text
                  </label>
                  <input
                    type="text"
                    required
                    value={buttonsForm.quick_btn1_text}
                    onChange={(e) =>
                      setButtonsForm({ ...buttonsForm, quick_btn1_text: e.target.value })
                    }
                    placeholder="e.g. Apply for ₹499 - 14 Days Ethical Hacking Program"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Linked Target Course
                  </label>
                  <select
                    value={buttonsForm.quick_btn1_course_id}
                    onChange={(e) => {
                      const selected = courses.find((c) => c.id === e.target.value);
                      setButtonsForm({
                        ...buttonsForm,
                        quick_btn1_course_id: e.target.value,
                        quick_btn1_course_name: selected?.title || buttonsForm.quick_btn1_course_name,
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
                  >
                    <option value="">-- Auto-Match 14-Day Program --</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Button 2 Configuration */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-900 inline-block" />
                  2nd Button (Corporate Slate Action)
                </span>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={buttonsForm.quick_btn2_enabled}
                    onChange={(e) =>
                      setButtonsForm({ ...buttonsForm, quick_btn2_enabled: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                  />
                  <span>Show Button 2</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Button Label / Text
                  </label>
                  <input
                    type="text"
                    required
                    value={buttonsForm.quick_btn2_text}
                    onChange={(e) =>
                      setButtonsForm({ ...buttonsForm, quick_btn2_text: e.target.value })
                    }
                    placeholder="e.g. Apply to Full Ethical Hacking Course"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Linked Target Course
                  </label>
                  <select
                    value={buttonsForm.quick_btn2_course_id}
                    onChange={(e) => {
                      const selected = courses.find((c) => c.id === e.target.value);
                      setButtonsForm({
                        ...buttonsForm,
                        quick_btn2_course_id: e.target.value,
                        quick_btn2_course_name: selected?.title || buttonsForm.quick_btn2_course_name,
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
                  >
                    <option value="">-- Auto-Match Full Course --</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSavingButtons}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingButtons ? 'Saving...' : 'Save Quick Apply Buttons'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* =========================================================================
            2. INTRODUCTION / PROMOTIONAL VIDEO
        ========================================================================== */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Introduction / Promotional Video
              </h3>
              <p className="text-xs text-slate-500">
                Shown in the Introduction to EV Cyber Academy video section
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveVideo} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                YouTube Video URL or Video ID
              </label>
              <div className="relative">
                <Play className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/watch?v=... or Video ID"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Paste any standard YouTube watch link, share link, or video ID.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSavingVideo}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingVideo ? 'Updating...' : 'Update Video'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* =========================================================================
            3. OFFICIAL CONTACT INFORMATION
        ========================================================================== */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Settings className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Contact Information
              </h3>
              <p className="text-xs text-slate-500">
                Displayed in the Contact Us section and footer of the website
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveContact} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Contact Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  value={contactForm.contact_phone}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, contact_phone: e.target.value })
                  }
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Official Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="admissions@evcyberacademy.com"
                  value={contactForm.contact_email}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, contact_email: e.target.value })
                  }
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                WhatsApp Number (with Country Code)
              </label>
              <input
                type="text"
                placeholder="e.g. +919876543210"
                value={contactForm.contact_whatsapp}
                onChange={(e) =>
                  setContactForm({ ...contactForm, contact_whatsapp: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Office Hours
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Mon - Sat: 9:00 AM - 8:00 PM IST"
                  value={contactForm.counseling_hours}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, counseling_hours: e.target.value })
                  }
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Office Location / Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Bangalore & Online Worldwide"
                  value={contactForm.contact_address}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, contact_address: e.target.value })
                  }
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2 pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSavingContact}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingContact ? 'Saving...' : 'Save Contact Details'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* =========================================================================
            4. DATABASE CONNECTION STATUS
        ========================================================================== */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <p className="font-bold text-slate-900">Database Connection</p>
            <p className="text-slate-500">Supabase PostgreSQL Engine</p>
          </div>

          <span
            className={`px-3 py-1 rounded-full font-bold border flex items-center gap-1.5 ${
              isConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {isConnected ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Connected</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Local Storage Mode</span>
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
