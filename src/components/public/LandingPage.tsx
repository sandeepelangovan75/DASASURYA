import React from 'react';
import { HEAD_PILLARS } from '../../data/curriculum';
import { BookOpen, BrainCircuit, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Compass, Target, Layers } from 'lucide-react';
import heroConceptImage from '../../assets/images/dasasurya_hero_concept_1791218014939.jpg';

interface LandingPageProps {
  onOpenAuth: (mode: 'signin' | 'register') => void;
  onExploreHead: (headId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onExploreHead }) => {
  return (
    <div className="w-full min-h-screen bg-[#07090E] text-slate-200">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06]">
        {/* Subtle background ambient gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-violet-900/20 via-indigo-900/15 to-transparent blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300 text-xs font-medium tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Ten-Dimensional Adaptive Intelligence System</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] font-sans">
                Mastery is built through{' '}
                <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                  ten interconnected minds.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                SAN_R-10 is a modern life-architecture and structured educational platform guided by <span className="text-white font-medium">Dasasurya</span>. Built on the philosophy that true understanding requires reading, questioning, practicing, and synthesizing across all dimensions of human capability.
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-6 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 transition-all shadow-lg shadow-violet-950/50 flex items-center gap-2 group"
                >
                  <span>Begin Your Journey</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="px-6 py-3 rounded-lg text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  Sign In to Dashboard
                </button>
              </div>

              {/* Core Philosophy Banner */}
              <div className="pt-6 border-t border-white/[0.08] flex items-center flex-wrap gap-y-2 gap-x-4 text-xs font-medium text-slate-400">
                <span className="text-slate-300">The 7-Step Protocol:</span>
                <span className="text-slate-200">READ</span>
                <span>→</span>
                <span className="text-slate-200">UNDERSTAND</span>
                <span>→</span>
                <span className="text-slate-200">QUESTION</span>
                <span>→</span>
                <span className="text-slate-200">PRACTICE</span>
                <span>→</span>
                <span className="text-slate-200">APPLY</span>
                <span>→</span>
                <span className="text-slate-200">REFLECT</span>
                <span>→</span>
                <span className="text-cyan-400 font-semibold">MASTER</span>
              </div>

            </div>

            {/* Visual Anchor */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-slate-900/80 group">
                <img
                  src={heroConceptImage}
                  alt="DASASURYA sanctum of adaptive intelligence"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-[#07090E]/30 to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">DASASURYA Engine</span>
                    <span className="text-amber-400 font-mono">10 Pillars Active</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                    Socratic inquiry mode active. AI supports your learning; it never replaces your cognitive synthesis.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Ten Heads (Pillars) Showcase */}
      <section id="tenheads" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-violet-400 font-mono font-medium">
              The Ten Pillars of Mastery
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              A complete architecture for thought and action
            </h3>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Every head represents a distinct intellectual and practical domain. Crucially, each pillar is mapped across its <span className="text-emerald-400 font-medium">Light</span>, its cognitive <span className="text-amber-400 font-medium">Shadow</span>, and its ethical <span className="text-cyan-400 font-medium">Self-Correction</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HEAD_PILLARS.map((head) => (
              <div
                key={head.id}
                className="group relative p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-500 group-hover:text-slate-300 transition-colors">
                      HEAD {head.number.toString().padStart(2, '0')} · {head.romanNumeral}
                    </span>
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: head.accentColor }}
                    />
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {head.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {head.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {head.description}
                  </p>

                  {/* Light, Shadow, Self-Correction Preview */}
                  <div className="space-y-2 pt-3 border-t border-white/[0.06] text-[11px]">
                    <div className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-medium shrink-0">Light:</span>
                      <span className="text-slate-300">{head.light}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-medium shrink-0">Shadow:</span>
                      <span className="text-slate-300">{head.shadow}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-cyan-400 font-medium shrink-0">Correction:</span>
                      <span className="text-slate-300">{head.selfCorrection}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-white/[0.05]">
                  <button
                    onClick={() => onOpenAuth('register')}
                    className="w-full py-2 text-center text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    Explore Pillar Curriculum →
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Socratic AI Mentor & Ravana Mind Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-gradient-to-b from-transparent via-violet-950/10 to-transparent">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-amber-400">
              <Compass className="w-4 h-4" />
              <span>SOCRATIC MENTORSHIP & MULTI-PERSPECTIVE ENGINE</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              DASASURYA does not give you fish. It teaches you oceanic navigation.
            </h3>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              When you encounter an obstacle in code, logic, or life architecture, DASASURYA adheres to a strict 5-level Socratic progression:
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
                <span className="w-6 h-6 rounded-md bg-violet-600/30 text-violet-300 flex items-center justify-center font-mono text-xs shrink-0 font-bold">1</span>
                <div>
                  <h5 className="text-xs font-semibold text-white">Level 1: Guiding Question</h5>
                  <p className="text-[11px] text-slate-400">Challenges your foundational assumption without revealing the solution.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
                <span className="w-6 h-6 rounded-md bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-mono text-xs shrink-0 font-bold">2</span>
                <div>
                  <h5 className="text-xs font-semibold text-white">Level 2: Concept Pointer</h5>
                  <p className="text-[11px] text-slate-400">Identifies the governing law or theorem you need to investigate.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
                <span className="w-6 h-6 rounded-md bg-cyan-600/30 text-cyan-300 flex items-center justify-center font-mono text-xs shrink-0 font-bold">3</span>
                <div>
                  <h5 className="text-xs font-semibold text-white">Level 3: Strategic Hint & Analogy</h5>
                  <p className="text-[11px] text-slate-400">Provides an intuitive bridge to help you isolate the variable.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
                <span className="w-6 h-6 rounded-md bg-amber-600/30 text-amber-300 flex items-center justify-center font-mono text-xs shrink-0 font-bold">4</span>
                <div>
                  <h5 className="text-xs font-semibold text-white">Level 4: Structural Reasoning</h5>
                  <p className="text-[11px] text-slate-400">Explains why typical intuition fails and reveals the feedback loop.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
                <span className="w-6 h-6 rounded-md bg-emerald-600/30 text-emerald-300 flex items-center justify-center font-mono text-xs shrink-0 font-bold">5</span>
                <div>
                  <h5 className="text-xs font-semibold text-white">Level 5: Comprehensive Synthesis</h5>
                  <p className="text-[11px] text-slate-400">Complete walkthrough and code solution after you have made your genuine attempt.</p>
                </div>
              </div>
            </div>

          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 rounded-2xl bg-[#0C101A] border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-violet-400" />
                  <span className="font-semibold text-white text-sm">RAVANA MIND Engine</span>
                </div>
                <span className="text-xs font-mono text-cyan-400">Multi-Perspective Deconstructor</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Most failures occur not because a solution was poorly executed, but because it was conceived through only a single narrow lens. RAVANA MIND takes your real-world dilemma and shines all 10 heads upon it:
              </p>

              <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-3 font-mono text-xs">
                <div className="text-slate-400">
                  <span className="text-amber-400">Input:</span> "Should I quit my salaried engineering role to build an independent SaaS product?"
                </div>
                <div className="text-slate-300 text-[11px] space-y-1.5">
                  <div><strong className="text-sky-300">Head 01 (Logic):</strong> Verify the unit economics and user willingness-to-pay before leaving.</div>
                  <div><strong className="text-amber-300">Head 02 (Wealth):</strong> Build 12 months of non-negotiable living runway first.</div>
                  <div><strong className="text-emerald-300">Head 03 (Vitality):</strong> Do not sacrifice sleep and restorative routines for launch velocity.</div>
                  <div><strong className="text-rose-300">Head 05 (Strategy):</strong> Negotiate a 4-day contract arrangement to bridge transition risk.</div>
                </div>
              </div>

              <button
                onClick={() => onOpenAuth('register')}
                className="w-full py-2.5 text-center text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors shadow-sm"
              >
                Experience RAVANA MIND in Your Profile →
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">Frequently Asked Questions</h3>
            <p className="text-slate-400 text-xs sm:text-sm">Clear answers regarding SAN_R-10 and the Dasasurya system.</p>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <h4 className="text-sm font-semibold text-white">Is SAN_R-10 a mythological platform?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                No. SAN_R-10 is a modern educational and life-architecture platform. The ten-head concept draws symbolic inspiration from multi-dimensional mastery, but every lesson, module, and feature is grounded in modern science, systems engineering, philosophy, and practical human development.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <h4 className="text-sm font-semibold text-white">Why are there no one-click demo accounts?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                SAN_R-10 is an intentional learning system designed for genuine human growth. Because your reading progress, chapter notes, bookmarks, reflection journals, and calendar are personal to you, creating an account ensures your data is genuinely stored and tailored to your specific goals.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <h4 className="text-sm font-semibold text-white">How does the Socratic mentorship protect deep learning?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Generic chatbots often dump complete solutions immediately, depriving your brain of the struggle required to form durable neural synapses. Dasasurya guides you progressively through questions, concept pointers, and hints before revealing solutions—fostering genuine self-reliance.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <h4 className="text-sm font-semibold text-white">What are SAN Credits?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                SAN Credits are an ethical progress marker earned through completing chapters, passing understanding checks, submitting practice exercises, and journaling reflections. There are no gambling mechanics, paywalls, or anxiety-inducing penalties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Step into the 10-Head Life Architecture
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Create your account today. Design your profile, choose your initial learning domains, and begin reading structured textbook modules with Dasasurya.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button
              onClick={() => onOpenAuth('register')}
              className="px-7 py-3 rounded-lg text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-all shadow-lg shadow-violet-950/50"
            >
              Create Your Account Now
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
