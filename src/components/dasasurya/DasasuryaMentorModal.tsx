import React, { useState } from 'react';
import { aiService } from '../../services/aiService';
import { UserAccount, UserProfile, UserProgress } from '../../types';
import { Sparkles, X, Send, Compass, Code, BrainCircuit, Lightbulb, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

interface DasasuryaMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  profile: UserProfile | null;
  progress: UserProgress;
  context?: {
    question?: string;
    concept?: string;
    currentHead?: string;
    codeSnippet?: string;
  };
}

export const DasasuryaMentorModal: React.FC<DasasuryaMentorModalProps> = ({
  isOpen,
  onClose,
  user,
  profile,
  progress,
  context,
}) => {
  const [question, setQuestion] = useState(context?.question || '');
  const [codeSnippet, setCodeSnippet] = useState(context?.codeSnippet || '');
  const [socraticLevel, setSocraticLevel] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<{
    level: number;
    text: string;
    source: string;
    timestamp: string;
  }[]>([]);

  if (!isOpen) return null;

  const handleAsk = async (targetLevel: number = socraticLevel) => {
    if (!question.trim() && !codeSnippet.trim()) return;

    setLoading(true);
    setSocraticLevel(targetLevel);

    const userContextSummary = `User ${profile?.fullName || user.fullName}, Goals: ${profile?.learningGoals || 'General Mastery'}, Active Head: ${context?.currentHead || 'Knowledge & Logic'}`;

    try {
      const result = await aiService.getSocraticGuidance({
        question: question || 'Please diagnose and guide my understanding of this code snippet/concept.',
        concept: context?.concept,
        socraticLevel: targetLevel,
        currentHead: context?.currentHead,
        codeSnippet: codeSnippet || undefined,
        userProgress: userContextSummary,
      });

      setResponses(prev => [
        {
          level: targetLevel,
          text: result.response,
          source: result.source,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev,
      ]);
    } catch (e) {
      console.error('Socratic error', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLevelStepUp = () => {
    if (socraticLevel < 5) {
      handleAsk(socraticLevel + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-[#0C101A] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-amber-400 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#0C101A] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">DASASURYA</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-950 text-violet-300 border border-violet-500/30">
                  Socratic Mode
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Pillar Context: <strong className="text-slate-200">{context?.currentHead || 'Universal Foundation'}</strong>
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

        {/* Level Progression Indicator Bar */}
        <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono text-[11px]">SOCRATIC PROGRESSION:</span>
          <div className="flex items-center gap-1 sm:gap-1.5">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSocraticLevel(lvl)}
                className={`px-2 py-1 rounded text-[11px] font-mono font-medium transition-all ${
                  socraticLevel === lvl
                    ? 'bg-violet-600 text-white shadow-sm'
                    : socraticLevel > lvl
                    ? 'bg-violet-950 text-violet-300 border border-violet-500/30'
                    : 'bg-white/5 text-slate-500 hover:text-slate-300'
                }`}
              >
                L{lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Responses Display Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {responses.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-full bg-violet-950/50 border border-violet-500/30 mx-auto flex items-center justify-center text-amber-300">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-white">Ask an obstacle or paste code</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Dasasurya avoids immediate full solutions to preserve your cognitive synthesis. Select your starting Socratic tier and ask your question below.
              </p>
            </div>
          ) : (
            responses.map((resp, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-[11px] font-mono">
                  <span className="text-violet-400 font-semibold">
                    {resp.level === 1 && 'LEVEL 1: GUIDING QUESTION'}
                    {resp.level === 2 && 'LEVEL 2: CONCEPT ORIENTATION'}
                    {resp.level === 3 && 'LEVEL 3: STRATEGIC HINT & ANALOGY'}
                    {resp.level === 4 && 'LEVEL 4: UNDERLYING REASONING'}
                    {resp.level === 5 && 'LEVEL 5: COMPREHENSIVE SOLUTION'}
                  </span>
                  <span className="text-slate-500">{resp.timestamp}</span>
                </div>

                <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                  {resp.text}
                </div>

                {resp.level < 5 && (
                  <div className="pt-2 border-t border-white/[0.04] flex justify-end">
                    <button
                      onClick={handleLevelStepUp}
                      disabled={loading}
                      className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition-colors"
                    >
                      <span>Need deeper guidance? Advance to Level {resp.level + 1}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Input Formulation Area */}
        <div className="p-4 bg-black/50 border-t border-white/[0.08] space-y-3">
          
          <div className="space-y-2">
            <textarea
              rows={2}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What concept, line of reasoning, or obstacle are you working through?"
              className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />

            {/* Optional Code Snippet input toggle */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Code className="w-3 h-3 text-cyan-400" />
                  <span>Code or Formula Context (Optional)</span>
                </span>
                {codeSnippet && (
                  <button onClick={() => setCodeSnippet('')} className="text-rose-400 hover:underline">
                    Clear Code
                  </button>
                )}
              </div>
              <textarea
                rows={2}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="// Paste programming problem to diagnose intent, error cause, and missing concepts..."
                className="w-full p-2 bg-black/60 border border-white/5 rounded-lg text-[11px] font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-[11px] text-slate-400">
              Active Tier: <strong className="text-slate-200">Level {socraticLevel}</strong>
            </div>

            <button
              onClick={() => handleAsk(socraticLevel)}
              disabled={loading || (!question.trim() && !codeSnippet.trim())}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-all shadow-sm flex items-center gap-1.5"
            >
              {loading ? (
                <span>Dasasurya Inquiring...</span>
              ) : (
                <>
                  <span>Consult Mentor</span>
                  <Send className="w-3 h-3" />
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
