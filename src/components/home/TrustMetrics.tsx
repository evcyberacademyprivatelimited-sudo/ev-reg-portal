import React from 'react';
import { Terminal, ShieldCheck, Target, Users } from 'lucide-react';

export const TrustMetrics: React.FC = () => {
  const highlights = [
    {
      icon: Terminal,
      title: 'Isolated Cyber Range',
      description: 'Dedicated cloud instances for live packet analysis & intrusion drills',
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise SIEM & EDR',
      description: 'Real telemetry parsing with Splunk, Elastic, Zeek & Sysmon',
    },
    {
      icon: Target,
      title: 'MITRE ATT&CK Mapped',
      description: 'Scenario objectives structured directly on enterprise threat frameworks',
    },
    {
      icon: Users,
      title: 'Practitioner Mentorship',
      description: 'Live interactive cohorts led by practicing defensive engineers',
    },
  ];

  return (
    <section className="bg-slate-900 border-y border-slate-800 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3.5 hover:border-red-500/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
