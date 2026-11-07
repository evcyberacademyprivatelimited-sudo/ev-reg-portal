import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const FaqSection: React.FC = () => {
  const { faqs, siteSettings } = useData();
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const activeFaqs = faqs.filter((f) => f.is_active);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faqs" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-red-600" />
            <span>Clear Answers &amp; Objection Handling</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>

          <p className="text-slate-600 text-base">
            Everything you need to know about our cyber ranges, admissions criteria, prerequisites, and cohort schedule.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {activeFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-base hover:text-red-600 transition-colors"
                >
                  <span className="flex-1">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'transform rotate-180 text-red-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Direct Counselor Help Callout */}
        <div className="mt-10 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Have a specific question about your technical background?</h4>
            <p className="text-xs text-slate-500 mt-0.5">Our academic counselors will evaluate your profile and advise you honestly.</p>
          </div>
          <a
            href={`https://wa.me/${siteSettings.contact_whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20EV%20Cyber%20Academy,%20I%20have%20questions%20regarding%20course%20prerequisites.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition flex items-center gap-2 shrink-0 shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Ask Academic Counselor</span>
          </a>
        </div>
      </div>
    </section>
  );
};
