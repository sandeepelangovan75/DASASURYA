import React, { useState, useEffect } from 'react';
import { aiService } from '../../services/aiService';
import { SunMedium, X, Sparkles, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';

interface DailyBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInterests: string[];
}

export const DailyBriefingModal: React.FC<DailyBriefingModalProps> = ({
  isOpen,
  onClose,
  userInterests,
}) => {
  const [briefText, setBriefText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<string>('dasasurya-core-brief');

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const loadBrief = async () => {
    setLoading(true);
    try {
      const res = await aiService.getDailyBrief(userInterests);
      setBriefText(res.brief);
      setSource(res.source);
    } catch (e) {
      console.error('Failed to load brief', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !briefText) {
      loadBrief();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-[#0C101A] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-violet-600 flex items-center justify-center text-white shadow-md">
              <SunMedium className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">DASASURYA DAILY BRIEF</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30">
                  {today}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Grounded signals across science, creation, critical thought, vitality, and shadow reflection.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Epistemological Label Legend */}
        <div className="px-5 py-2.5 bg-white/[0.02] border-b border-white/[0.06] flex flex-wrap items-center gap-4 text-[10px] font-mono">
          <span className="text-slate-400">RIGOROUS LABELING:</span>
          <span className="text-sky-300 font-semibold">• FACT</span>
          <span className="text-emerald-300 font-semibold">• SOURCE</span>
          <span className="text-amber-300 font-semibold">• INTERPRETATION</span>
          <span className="text-violet-300 font-semibold">• AI SUGGESTION</span>
        </div>

        {/* Content Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Synthesizing daily signals for {today}...</p>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-200 font-sans leading-relaxed whitespace-pre-line space-y-4">
              {briefText}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-black/50 border-t border-white/[0.08] flex items-center justify-between">
          <button
            onClick={loadBrief}
            disabled={loading}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Regenerate Signals</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
};
