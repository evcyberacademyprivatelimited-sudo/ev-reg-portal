import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = useData();

  const activeTestimonials = testimonials.filter((t) => t.is_featured);

  return (
    <section id="testimonials" className="py-20 bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-red-500" />
            <span>Alumni In Production</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Trained in Our Labs. Hired by Global Security Leaders.
          </h2>

          <p className="text-slate-400 text-base">
            Read unfiltered career journeys from engineers who transitioned into high-impact corporate cybersecurity roles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeTestimonials.map((item) => (
            <div
              key={item.id}
              className="relative p-8 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between hover:border-red-500/40 transition-colors shadow-xl"
            >
              <Quote className="w-8 h-8 text-red-500/20 absolute top-6 right-6 pointer-events-none" />

              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-sm text-slate-300 leading-relaxed italic">
                  &ldquo;{item.content}&rdquo;
                </p>
              </div>

              {/* Author footer */}
              <div className="flex items-center gap-3.5 pt-6 mt-6 border-t border-slate-800/80">
                <img
                  src={item.avatar_url}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-700"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                  <p className="text-xs text-red-400 font-medium">{item.role}</p>
                  <p className="text-[11px] text-slate-400">{item.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

