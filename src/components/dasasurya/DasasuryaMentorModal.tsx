import React, { useState } from 'react';
import { aiService } from '../../services/aiService';
import { SUPPORTED_LANGUAGES } from '../../data/languages';
import { ExplanationLevel, LanguageCode, RoadmapStage, UserAccount, UserProfile, UserProgress } from '../../types';
import { 
  Sparkles, 
  X, 
  Send, 
  Compass, 
  Code, 
  BrainCircuit, 
  Lightbulb, 
  CheckCircle2, 
  ChevronRight, 
  Globe, 
  Sliders, 
  ShieldAlert, 
  Map, 
  BookOpen, 
  RotateCcw,
  Layers
} from 'lucide-react';

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
  // Navigation tabs: Socratic vs Roadmap Planner
  const [activeTab, setActiveTab] = useState<'socratic' | 'roadmap'>('socratic');

  // Language & Pedagogical Level Preferences
  const [targetLanguage, setTargetLanguage] = useState<LanguageCode>(
    user.languagePreferences?.responseLanguage || 'en'
  );
  const [explanationLevel, setExplanationLevel] = useState<ExplanationLevel>('intermediate');

  // Socratic Q&A States
  const [question, setQuestion] = useState(context?.question || '');
  const [codeSnippet, setCodeSnippet] = useState(context?.codeSnippet || '');
  const [socraticLevel, setSocraticLevel] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<{
    level: number;
    text: string;
    source: string;
    language: string;
    timestamp: string;
  }[]>([]);

  // Roadmap Planner States
  const [roadmapGoal, setRoadmapGoal] = useState('');
  const [currentKnowledge, setCurrentKnowledge] = useState('');
  const [availableMinutes, setAvailableMinutes] = useState(30);
  const [targetWeeks, setTargetWeeks] = useState(4);
  const [generatedStages, setGeneratedStages] = useState<RoadmapStage[]>([]);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);

  if (!isOpen) return null;

  const handleAsk = async (targetLevel: number = socraticLevel) => {
    if (!question.trim() && !codeSnippet.trim()) return;

    setLoading(true);
    setSocraticLevel(targetLevel);

    const userContextSummary = `User ${profile?.fullName || user.fullName}, Goals: ${profile?.learningGoals || 'General Mastery'}, Active Head: ${context?.currentHead || 'Knowledge & Logic'}, Age: ${user.age || 18}`;

    try {
      const result = await aiService.getSocraticGuidance({
        question: question || 'Please diagnose and guide my understanding of this code snippet/concept.',
        concept: context?.concept,
        socraticLevel: targetLevel,
        currentHead: context?.currentHead,
        codeSnippet: codeSnippet || undefined,
        userProgress: userContextSummary,
        language: targetLanguage,
        explanationLevel,
        isUnder12: user.isUnder12,
        age: user.age || 18,
      });

      setResponses(prev => [
        {
          level: targetLevel,
          text: result.response,
          source: result.source,
          language: targetLanguage,
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

  const handleGenerateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roadmapGoal.trim()) return;

    setLoadingRoadmap(true);
    try {
      const res = await aiService.generateRoadmap({
        goal: roadmapGoal,
        targetLanguage,
        explanationLevel,
        currentKnowledge,
        availableMinutesPerDay: availableMinutes,
        targetDeadlineWeeks: targetWeeks,
        isUnder12: user.isUnder12,
        age: user.age || 18,
      });

      if (res.stages) {
        setGeneratedStages(res.stages);
      }
    } catch (err) {
      console.error('Roadmap error', err);
    } finally {
      setLoadingRoadmap(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-[#0C101A] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden"
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
                  {activeTab === 'socratic' ? 'Socratic Mentor' : 'Multilingual Roadmap'}
                </span>
                {user.isUnder12 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-emerald-400" />
                    <span>Child-Safe Mode</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Pillar Context: <strong className="text-slate-200">{context?.currentHead || 'Universal Foundation'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch buttons */}
            <div className="flex items-center bg-black/60 border border-white/10 rounded-lg p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('socratic')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeTab === 'socratic' ? 'bg-violet-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Socratic Tutoring
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('roadmap')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeTab === 'roadmap' ? 'bg-violet-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Learning Plan
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Controls Bar: Language & Explanation Level */}
        <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] text-slate-400 font-mono">Response Language:</span>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value as LanguageCode)}
              className="bg-black/50 border border-white/15 rounded-md px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>

          {/* Explanation Level */}
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-[11px] text-slate-400 font-mono">Depth:</span>
            {(['beginner', 'intermediate', 'advanced'] as ExplanationLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setExplanationLevel(lvl)}
                className={`px-2 py-0.5 rounded text-[11px] capitalize transition-colors ${
                  explanationLevel === lvl
                    ? 'bg-violet-600 text-white font-semibold'
                    : 'bg-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Socratic Progression (if on socratic tab) */}
          {activeTab === 'socratic' && (
            <div className="flex items-center gap-1">
              <span className="text-slate-500 font-mono text-[10px]">TIER:</span>
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSocraticLevel(lvl)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all ${
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
          )}

        </div>

        {/* Tab Content 1: Socratic Tutoring */}
        {activeTab === 'socratic' && (
          <>
            {/* Responses Display Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {responses.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-violet-950/50 border border-violet-500/30 mx-auto flex items-center justify-center text-amber-300">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">Ask an obstacle or paste code</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    Dasasurya guides through progressive Socratic inquiry to preserve your personal cognitive synthesis. Language responses adapt dynamically.
                  </p>
                  {user.isUnder12 && (
                    <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 max-w-sm mx-auto text-[11px] text-emerald-300">
                      Child Safeguards active: Dasasurya communicates with friendly, encouraging, and clear explanations.
                    </div>
                  )}
                </div>
              ) : (
                responses.map((resp, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-[11px] font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-violet-400 font-semibold">
                          {resp.level === 1 && 'LEVEL 1: GUIDING QUESTION'}
                          {resp.level === 2 && 'LEVEL 2: CONCEPT ORIENTATION'}
                          {resp.level === 3 && 'LEVEL 3: STRATEGIC HINT & ANALOGY'}
                          {resp.level === 4 && 'LEVEL 4: UNDERLYING REASONING'}
                          {resp.level === 5 && 'LEVEL 5: COMPREHENSIVE SOLUTION'}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-slate-400 border border-white/5 uppercase">
                          {resp.language}
                        </span>
                      </div>
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
                  placeholder="What concept, reasoning dilemma, or challenge are you working through?"
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />

                {/* Code Snippet input */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Code className="w-3 h-3 text-cyan-400" />
                      <span>Code Diagnostic Context (Optional)</span>
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
                  Target Tier: <strong className="text-slate-200">Level {socraticLevel}</strong> · Language: <strong className="text-cyan-400 uppercase">{targetLanguage}</strong>
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
          </>
        )}

        {/* Tab Content 2: Multilingual Roadmap Planner */}
        {activeTab === 'roadmap' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            <form onSubmit={handleGenerateRoadmap} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Map className="w-4 h-4 text-cyan-400" />
                  <span>Generate Personalized Learning Plan</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Dasasurya designs a structured 4-stage roadmap with verifiable milestones, hands-on practice tasks, and socratic self-assessments.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1">
                    Your Learning Goal or Target Mastery
                  </label>
                  <input
                    type="text"
                    required
                    value={roadmapGoal}
                    onChange={(e) => setRoadmapGoal(e.target.value)}
                    placeholder="e.g. Master Asymmetric Software Leverage, Cognitive Biases in Decision Making, Yogic Breath Dynamics"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 mb-1">
                      Existing Knowledge
                    </label>
                    <input
                      type="text"
                      value={currentKnowledge}
                      onChange={(e) => setCurrentKnowledge(e.target.value)}
                      placeholder="e.g. Total beginner / Basic calculus"
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 mb-1">
                      Study Time / Day
                    </label>
                    <select
                      value={availableMinutes}
                      onChange={(e) => setAvailableMinutes(parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value={15}>15 minutes (Gentle)</option>
                      <option value={30}>30 minutes (Standard)</option>
                      <option value={45}>45 minutes (Focused)</option>
                      <option value={60}>60 minutes (Deep Work)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 mb-1">
                      Target Horizon
                    </label>
                    <select
                      value={targetWeeks}
                      onChange={(e) => setTargetWeeks(parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value={2}>2 Weeks (Sprint)</option>
                      <option value={4}>4 Weeks (1 Month)</option>
                      <option value={8}>8 Weeks (Quarterly)</option>
                      <option value={12}>12 Weeks (Mastery)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={loadingRoadmap || !roadmapGoal.trim()}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  {loadingRoadmap ? (
                    <span>Architecting Roadmap...</span>
                  ) : (
                    <>
                      <span>Generate Plan in {targetLanguage.toUpperCase()}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Generated Stages Display */}
            {generatedStages.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                    Synthesized 4-Stage Pathway
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Target: {roadmapGoal} · {targetLanguage.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {generatedStages.map((st) => (
                    <div key={st.stageNumber} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-[10px] font-mono">
                            {st.stageNumber}
                          </span>
                          <span>{st.title}</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">STAGE {st.stageNumber}</span>
                      </div>

                      {/* Topics */}
                      <div className="flex flex-wrap gap-1.5">
                        {st.topics.map((t, idx) => (
                          <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5">
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                        <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
                          <span className="text-[10px] font-mono text-amber-400 uppercase">Concrete Milestone</span>
                          <p className="text-slate-300 text-[11px] leading-relaxed">{st.milestone}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
                          <span className="text-[10px] font-mono text-emerald-400 uppercase">Practice Task</span>
                          <p className="text-slate-300 text-[11px] leading-relaxed">{st.practiceTask}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
                          <span className="text-[10px] font-mono text-cyan-400 uppercase">Socratic Assessment</span>
                          <p className="text-slate-300 text-[11px] leading-relaxed">{st.assessmentQuestion}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
