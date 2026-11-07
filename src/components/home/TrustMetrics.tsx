import React from 'react';
import { Users, Briefcase, Award, Star, Terminal } from 'lucide-react';

export const TrustMetrics: React.FC = () => {
  const metrics = [
    {
      icon: Users,
      value: '2,500+',
      label: 'Security Engineers Trained',
      subtext: 'Across enterprise cohorts',
    },
    {
      icon: Briefcase,
      value: '94%',
      label: 'Placement Success Rate',
      subtext: 'Within 90 days of completion',
    },
    {
      icon: Terminal,
      value: '450+',
      label: 'Live Incident Range Drills',
      subtext: 'Real-world adversary telemetry',
    },
    {
      icon: Star,
      value: '4.9 / 5',
      label: 'Average Cohort Rating',
      subtext: 'Verified alumni feedback',
    },
  ];

  return (
    <section className="bg-slate-900 border-y border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {metrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center flex flex-col items-center justify-center space-y-2 hover:border-red-500/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {item.value}
                </div>
                <div className="text-sm font-semibold text-slate-200">
                  {item.label}
                </div>
                <div className="text-xs text-slate-400">
                  {item.subtext}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
