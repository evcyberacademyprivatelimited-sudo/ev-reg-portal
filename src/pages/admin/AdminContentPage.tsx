import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import { Sliders, Save, Plus, Trash2, Edit2, MessageSquare, HelpCircle } from 'lucide-react';
import { Faq, Testimonial } from '../../types';

export const AdminContentPage: React.FC = () => {
  const { toggleMenu } = useOutletContext<{ toggleMenu: () => void }>();
  const {
    siteSettings,
    updateSiteSettings,
    testimonials,
    saveTestimonial,
    deleteTestimonial,
    faqs,
    saveFaq,
    deleteFaq,
  } = useData();
  const { success, error: notifyError } = useNotification();

  const [heroForm, setHeroForm] = useState({
    hero_badge: siteSettings.hero_badge,
    hero_headline_prefix: siteSettings.hero_headline_prefix,
    hero_headline_highlight: siteSettings.hero_headline_highlight,
    hero_subheadline: siteSettings.hero_subheadline,
    primary_cta_text: siteSettings.primary_cta_text,
    secondary_cta_text: siteSettings.secondary_cta_text,
    trust_badge_text: siteSettings.trust_badge_text,
  });

  const [isSavingHero, setIsSavingHero] = useState(false);

  // New FAQ form state
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [newFaqCategory, setNewFaqCategory] = useState('General');

  // New Testimonial form state
  const [newTestName, setNewTestName] = useState('');
  const [newTestRole, setNewTestRole] = useState('');
  const [newTestCompany, setNewTestCompany] = useState('');
  const [newTestContent, setNewTestContent] = useState('');

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingHero(true);
    await updateSiteSettings(heroForm);
    setIsSavingHero(false);
    success('Homepage hero copy and CTA text updated.');
  };

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;
    await saveFaq({
      question: newFaqQuestion,
      answer: newFaqAnswer,
      category: newFaqCategory,
      is_active: true,
    });
    setNewFaqQuestion('');
    setNewFaqAnswer('');
    success('New FAQ added.');
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName.trim() || !newTestContent.trim()) return;
    await saveTestimonial({
      name: newTestName,
      role: newTestRole || 'Security Specialist',
      company: newTestCompany || 'Corporate Cyber Team',
      content: newTestContent,
      rating: 5,
      is_featured: true,
    });
    setNewTestName('');
    setNewTestRole('');
    setNewTestCompany('');
    setNewTestContent('');
    success('Corporate testimonial added.');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-100">
      <AdminHeader
        title="Admin Sales Control &amp; CMS"
        subtitle="Dynamically update homepage headlines, CTA buttons, customer objection FAQs, and corporate testimonials."
        onMenuToggle={toggleMenu}
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 max-w-5xl">
        {/* Section 1: Hero Copy & CTA Text */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Homepage Hero Headline &amp; Conversion CTAs
              </h3>
              <p className="text-xs text-slate-500">All changes reflect immediately on the public landing page</p>
            </div>
          </div>

          <form onSubmit={handleSaveHero} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Announcement Top Badge
              </label>
              <input
                type="text"
                value={heroForm.hero_badge}
                onChange={(e) => setHeroForm({ ...heroForm, hero_badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Headline Prefix
                </label>
                <input
                  type="text"
                  value={heroForm.hero_headline_prefix}
                  onChange={(e) =>
                    setHeroForm({ ...heroForm, hero_headline_prefix: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Headline Highlight (Red Gradient)
                </label>
                <input
                  type="text"
                  value={heroForm.hero_headline_highlight}
                  onChange={(e) =>
                    setHeroForm({ ...heroForm, hero_headline_highlight: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-red-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                Value Proposition Subheadline
              </label>
              <textarea
                rows={2}
                value={heroForm.hero_subheadline}
                onChange={(e) => setHeroForm({ ...heroForm, hero_subheadline: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Primary CTA Text
                </label>
                <input
                  type="text"
                  value={heroForm.primary_cta_text}
                  onChange={(e) => setHeroForm({ ...heroForm, primary_cta_text: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Secondary CTA Text
                </label>
                <input
                  type="text"
                  value={heroForm.secondary_cta_text}
                  onChange={(e) =>
                    setHeroForm({ ...heroForm, secondary_cta_text: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSavingHero}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingHero ? 'Publishing...' : 'Save Public Sales Copy'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Section 2: Objection Handling FAQs */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Manage Objection-Handling FAQs</h3>
              <p className="text-xs text-slate-500">Address common applicant hesitations</p>
            </div>
          </div>

          {/* Add FAQ form */}
          <form onSubmit={handleAddFaq} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-700 block">Add New FAQ</span>
            <input
              type="text"
              required
              placeholder="Question: e.g. Do you offer flexible weekend batches?"
              value={newFaqQuestion}
              onChange={(e) => setNewFaqQuestion(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
            />
            <textarea
              rows={2}
              required
              placeholder="Answer: e.g. Yes, all lab sessions have evening and weekend cohorts..."
              value={newFaqAnswer}
              onChange={(e) => setNewFaqAnswer(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center gap-1 hover:bg-black transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add FAQ</span>
            </button>
          </form>

          {/* List FAQs */}
          <div className="space-y-2 text-xs">
            {faqs.map((f) => (
              <div key={f.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-900">{f.question}</h4>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">{f.answer}</p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteFaq(f.id)}
                  className="text-red-600 hover:text-red-700 p-1 shrink-0"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Testimonials */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Manage Corporate Alumni Reviews</h3>
              <p className="text-xs text-slate-500">Genuine placements and hiring testimonials</p>
            </div>
          </div>

          {/* Add Review */}
          <form onSubmit={handleAddTestimonial} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-700 block">Add Testimonial</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="Candidate Full Name"
                value={newTestName}
                onChange={(e) => setNewTestName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
              />
              <input
                type="text"
                placeholder="Job Role (e.g. SOC Analyst L2)"
                value={newTestRole}
                onChange={(e) => setNewTestRole(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
              <input
                type="text"
                placeholder="Company (e.g. Palo Alto Networks)"
                value={newTestCompany}
                onChange={(e) => setNewTestCompany(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
            <textarea
              rows={2}
              required
              placeholder="Candidate feedback and experience..."
              value={newTestContent}
              onChange={(e) => setNewTestContent(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center gap-1 hover:bg-black transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Testimonial</span>
            </button>
          </form>

          {/* List reviews */}
          <div className="space-y-2 text-xs">
            {testimonials.map((t) => (
              <div key={t.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-900">
                    {t.name} &bull; <span className="text-red-600">{t.role}</span> at {t.company}
                  </h4>
                  <p className="text-slate-600 mt-0.5 italic leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteTestimonial(t.id)}
                  className="text-red-600 hover:text-red-700 p-1 shrink-0"
                  title="Delete review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

