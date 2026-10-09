import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  return (
    <footer className="w-full bg-[#05070A] border-t border-white/[0.06] text-slate-400 text-xs py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Disclaimers & Ethics row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Wealth & Creation Notice</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Educational content under Head 02 is strictly for financial literacy and ethical value creation. SAN_R-10 never provides financial advice, speculative tips, or guaranteed income claims.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Info className="w-3.5 h-3.5" />
              <span>Vitality & Chakra Wellness</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              The CHAKRA Alignment and Vitality modules offer traditional contemplative relaxation and mindful breathing. They do not diagnose or treat medical conditions.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-cyan-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Child Safeguards & Privacy</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Children under 12 operate under age-appropriate curated pathways with parental consent and data minimization. Zero commercial data sharing or profiling.
            </p>
          </div>
        </div>

        {/* Links & Brand */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.04]">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-200 tracking-tight text-sm">
              SAN_R-10
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400 text-xs">DASASURYA Adaptive Intelligence</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-400">
            <button onClick={() => onNavigate('home')} className="hover:text-slate-200 transition-colors">
              Concept
            </button>
            <button onClick={() => onNavigate('tenheads')} className="hover:text-slate-200 transition-colors">
              Ten Pillars
            </button>
            <button onClick={() => onNavigate('methodology')} className="hover:text-slate-200 transition-colors">
              Learning Architecture
            </button>
            <button onClick={() => onNavigate('chakra')} className="hover:text-amber-300 transition-colors">
              Chakra Alignment
            </button>
            <button onClick={() => onNavigate('security')} className="hover:text-cyan-300 transition-colors">
              Privacy & Languages
            </button>
            <button onClick={() => onNavigate('faq')} className="hover:text-slate-200 transition-colors">
              FAQ
            </button>
            {/* Discreet admin portal link */}
            <button 
              onClick={onOpenAdmin}
              className="text-slate-600 hover:text-slate-400 text-[11px] transition-colors"
              title="Curriculum Administration"
            >
              Curator Portal
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} SAN_R-10 Architecture. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};
