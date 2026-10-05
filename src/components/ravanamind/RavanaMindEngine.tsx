import React, { useState, useEffect } from 'react';
import { HEAD_PILLARS } from '../../data/curriculum';
import { aiService } from '../../services/aiService';
import { storageService } from '../../services/storageService';
import { HeadId, RavanaMindAnalysis, UserAccount } from '../../types';
import { BrainCircuit, Sparkles, Check, ArrowRight, ShieldAlert, History, Save, Send } from 'lucide-react';

interface RavanaMindEngineProps {
  user: UserAccount;
  onBackToDashboard: () => void;
}

export const RavanaMindEngine: React.FC<RavanaMindEngineProps> = ({
  user,
  onBackToDashboard,
}) => {
  const [problem, setProblem] = useState('');
  const [selectedHeads, setSelectedHeads] = useState<HeadId[]>([
    'head-01-knowledge-logic',
    'head-02-wealth-creation',
    'head-03-vitality',
    'head-05-strategy-governance',
  ]);
  const [loading, setLoading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<RavanaMindAnalysis | null>(null);
  const [userDecision, setUserDecision] = useState('');
  const [userReflection, setUserReflection] = useState('');
  const [history, setHistory] = useState<RavanaMindAnalysis[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const past = storageService.getRavanaMindAnalyses(user.id);
    setHistory(past);
    if (past.length > 0) {
      setCurrentAnalysis(past[0]);
      setUserDecision(past[0].userDecision || '');
      setUserReflection(past[0].reflectionNotes || '');
    }
  }, [user.id]);

  const toggleHead = (id: HeadId) => {
    if (selectedHeads.includes(id)) {
      if (selectedHeads.length > 2) {
        setSelectedHeads(selectedHeads.filter(h => h !== id));
      }
    } else {
      setSelectedHeads([...selectedHeads, id]);
    }
  };

  const handleDeconstruct = async () => {
    if (!problem.trim()) return;

    setLoading(true);
    setSavedSuccess(false);

    try {
      const selectedNames = selectedHeads.map(hId => {
        const p = HEAD_PILLARS.find(hp => hp.id === hId);
        return p ? p.name : hId;
      });

      const res = await aiService.getRavanaMindAnalysis({
        problem,
        selectedHeads: selectedNames,
      });

      const newAnalysis: RavanaMindAnalysis = {
        id: 'rm_' + Date.now(),
        userId: user.id,
        problem,
        selectedHeads,
        analysisText: res.analysis,
        createdAt: new Date().toISOString(),
      };

      storageService.saveRavanaMindAnalysis(newAnalysis);
      setCurrentAnalysis(newAnalysis);
      setHistory([newAnalysis, ...history]);
      setUserDecision('');
      setUserReflection('');
    } catch (err) {
      console.error('Ravana Mind error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDecision = () => {
    if (!currentAnalysis) return;
    const updated: RavanaMindAnalysis = {
      ...currentAnalysis,
      userDecision,
      reflectionNotes: userReflection,
    };
    storageService.saveRavanaMindAnalysis(updated);
    setCurrentAnalysis(updated);
    setHistory(history.map(item => item.id === updated.id ? updated : item));
    setSavedSuccess(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#07090E] text-slate-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-violet-400 uppercase tracking-wider font-semibold">
                Multi-Perspective Analytical Matrix
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-mono text-slate-400">10 Heads Synergy</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <BrainCircuit className="w-8 h-8 text-violet-400" />
              <span>RAVANA MIND</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Decompose complex real-world problems through multiple intellectual disciplines. Expose hidden assumptions, weigh trade-offs, and design actionable paths.
            </p>
          </div>

          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs text-slate-300 rounded-lg transition-colors"
          >
            ← Return to Dashboard
          </button>
        </div>

        {/* Input & Deconstruction Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0C101A] border border-white/10 shadow-lg space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Describe Your Intractable Dilemma or High-Stakes Decision:
              </label>
              <textarea
                rows={4}
                value={problem}
                onChange={e => setProblem(e.target.value)}
                placeholder="e.g. Should I accept an executive promotion that requires 60 hours/week, or preserve my personal bandwidth to build an open-source educational protocol?"
                className="w-full p-3.5 bg-black/40 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Select Head Perspectives */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Select Lenses to Evaluate (2 to 6 recommended):</span>
                <span className="font-mono text-[11px] text-violet-400">{selectedHeads.length} Selected</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {HEAD_PILLARS.map(head => {
                  const isSelected = selectedHeads.includes(head.id);
                  return (
                    <button
                      key={head.id}
                      type="button"
                      onClick={() => toggleHead(head.id)}
                      className={`p-2 rounded-lg border text-left text-xs transition-all ${
                        isSelected
                          ? 'bg-violet-950/60 border-violet-500 text-white font-medium shadow-sm'
                          : 'bg-black/20 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-[10px] font-mono text-slate-500">H{head.number.toString().padStart(2, '0')}</div>
                      <div className="truncate">{head.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>The system evaluates trade-offs; you retain full final agency.</span>
              </div>

              <button
                onClick={handleDeconstruct}
                disabled={loading || !problem.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-all shadow-md flex items-center gap-2"
              >
                {loading ? (
                  <span>Deconstructing Dilemma...</span>
                ) : (
                  <>
                    <span>Execute Ravana Mind Analysis</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* History Drawer */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-[#0C101A] border border-white/10 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <History className="w-4 h-4 text-cyan-400" />
                <span>Past Dilemma Analyses</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">{history.length} records</span>
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-6 text-center">
                No past analyses recorded. Submit your first dilemma on the left.
              </p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {history.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentAnalysis(item);
                      setUserDecision(item.userDecision || '');
                      setUserReflection(item.reflectionNotes || '');
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-colors space-y-1 ${
                      currentAnalysis?.id === item.id
                        ? 'bg-violet-950/40 border-violet-500 text-white'
                        : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="line-clamp-2 text-xs font-medium text-slate-200">
                      "{item.problem}"
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()} · {item.selectedHeads.length} Heads
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Multi-Perspective Analysis Output */}
        {currentAnalysis && (
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0C101A] border border-white/10 shadow-2xl space-y-8 animate-in fade-in duration-300">
            
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                  Analysis Matrix Breakdown
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  "{currentAnalysis.problem}"
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {new Date(currentAnalysis.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Analysis Text Stream */}
            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line space-y-4">
              {currentAnalysis.analysisText}
            </div>

            {/* User Decision Capture */}
            <div className="pt-6 border-t border-white/[0.08] space-y-4 bg-black/40 p-5 rounded-xl border border-white/5">
              <div className="space-y-1">
                <span className="text-xs font-mono text-amber-400 font-semibold uppercase">
                  User Sovereign Decision & Commitments
                </span>
                <p className="text-xs text-slate-400">
                  After reviewing the multi-perspective trade-offs, record your informed decision:
                </p>
              </div>

              <textarea
                rows={3}
                value={userDecision}
                onChange={e => setUserDecision(e.target.value)}
                placeholder="What path do you choose to execute? Which trade-offs are you consciously accepting?"
                className="w-full p-3 bg-black/60 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleSaveDecision}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Commit Decision to Journal</span>
                </button>

                {savedSuccess && (
                  <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Decision Saved to Life Architecture
                  </span>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
