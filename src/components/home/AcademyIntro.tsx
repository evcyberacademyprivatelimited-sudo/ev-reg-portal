import React from 'react';
import { ShieldCheck, Award, Target, Server, Cpu, CheckCircle2 } from 'lucide-react';

export const AcademyIntro: React.FC = () => {
  return (
    <section id="methodology" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Academy Ethos & Founder Vision */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              <span>The EV Cyber Academy Standard</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Built by Enterprise Practitioners. Engineered for Real-World Security Operations.
            </h2>

            <p className="text-slate-600 text-base leading-relaxed">
              Most cybersecurity training in the market consists of recorded video lectures from 2018 and multiple-choice quizzes that bear zero resemblance to modern Security Operations Centers or adversary evasion.
            </p>

            <p className="text-slate-600 text-base leading-relaxed">
              At <strong className="text-slate-900 font-semibold">EV Cyber Academy</strong>, we run cohorts like live enterprise security teams. From Day 1, our candidates operate inside private cloud ranges, investigate live-fire malware outbreaks, reverse engineer adversary beacons, and defend Active Directory environments against advanced persistent threats.
            </p>

            {/* Differentiating Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm mb-1.5">
                  <Target className="w-4 h-4 text-red-600" />
                  <span>MITRE ATT&CK Mapped Labs</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every lab scenario maps directly to active adversary techniques used in real-world corporate breaches.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm mb-1.5">
                  <Server className="w-4 h-4 text-red-600" />
                  <span>Live Production SIEM Stacks</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Full hands-on telemetry: Splunk, Elastic, CrowdStrike, Zeek, and Sysmon event parsing.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm mb-1.5">
                  <Cpu className="w-4 h-4 text-red-600" />
                  <span>Red Team Exploitation Chains</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Active Directory Kerberos forging, AMSI bypasses, and multi-tier command and control operations.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm mb-1.5">
                  <Award className="w-4 h-4 text-red-600" />
                  <span>1-on-1 Interview Drills</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mock technical interviews with enterprise hiring leads, technical portfolio optimization & direct job referrals.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Founder Quote & Credibility Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-slate-950 p-8 text-white border border-slate-800 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-600 text-white font-black flex items-center justify-center text-lg shadow-md border-2 border-red-500">
                    EV
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Admissions & Academic Board</h4>
                    <p className="text-xs text-slate-400">EV Cyber Academy Leadership</p>
                  </div>
                </div>

                <blockquote className="text-sm text-slate-300 italic leading-relaxed border-l-2 border-red-600 pl-4">
                  &ldquo;Cybersecurity is not an academic theory you study from a book. It is a live-contact operational discipline. If your training doesn&apos;t involve isolating actual ransomware beacons or bypassing active defense policies, you are not ready for a real corporate SOC or Red Team role.&rdquo;
                </blockquote>

                <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Practicing Enterprise Security Analysts &amp; Red Team Mentors</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Dedicated 24/7 Discord Cyber Range Lab Support</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Official Certification of Practical Competency</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

