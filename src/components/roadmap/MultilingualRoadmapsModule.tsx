import React, { useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, getLanguageName } from '../../data/languages';
import { aiService } from '../../services/aiService';
import { storageService } from '../../services/storageService';
import { 
  ExplanationLevel, 
  LanguageCode, 
  MultilingualRoadmap, 
  RoadmapStage, 
  UserAccount, 
  UserProfile 
} from '../../types';
import { 
  Globe, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  BookOpen, 
  Layers, 
  HelpCircle, 
  Trash2, 
  ChevronRight, 
  Smile, 
  ShieldCheck,
  Send,
  ArrowLeft
} from 'lucide-react';

interface MultilingualRoadmapsModuleProps {
  user: UserAccount;
  profile: UserProfile | null;
  onOpenChapter?: (chapterId: string) => void;
  onBackToDashboard: () => void;
}

export const MultilingualRoadmapsModule: React.FC<MultilingualRoadmapsModuleProps> = ({
  user,
  profile,
  onOpenChapter,
  onBackToDashboard,
}) => {
  const [roadmaps, setRoadmaps] = useState<MultilingualRoadmap[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<MultilingualRoadmap | null>(null);

  // New Roadmap Creator Form
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [goal, setGoal] = useState('');
  const [targetLanguage, setTargetLanguage] = useState<LanguageCode>(
    user.languagePreferences?.learningLanguage || 'en'
  );
  const [explanationLevel, setExplanationLevel] = useState<ExplanationLevel>('intermediate');
  const [currentKnowledge, setCurrentKnowledge] = useState('');
  const [availableMinutesPerDay, setAvailableMinutesPerDay] = useState<number>(30);
  const [targetDeadlineWeeks, setTargetDeadlineWeeks] = useState<number>(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Interactive Explanations within Roadmap
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [quickQuestion, setQuickQuestion] = useState('');
  const [explanationResponse, setExplanationResponse] = useState<string | null>(null);
  const [explainingLoading, setExplainingLoading] = useState(false);

  const isUnder12 = user.isUnder12;

  useEffect(() => {
    const list = storageService.getRoadmaps(user.id);
    setRoadmaps(list);
    if (list.length > 0) {
      setSelectedRoadmap(list[0]);
    }
  }, [user.id]);

  const handleCreateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) {
      setError('Please specify your learning goal.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await aiService.generateRoadmap({
        goal,
        targetLanguage,
        explanationLevel,
        currentKnowledge,
        availableMinutesPerDay,
        targetDeadlineWeeks,
        isUnder12,
        age: user.age,
      });

      const newRoadmap: MultilingualRoadmap = {
        id: 'rdmp_' + Date.now(),
        userId: user.id,
        goal,
        targetLanguage,
        explanationLevel,
        currentKnowledge,
        availableMinutesPerDay,
        targetDeadlineWeeks,
        isAgeAppropriate: isUnder12,
        stages: res.stages,
        createdAt: new Date().toISOString(),
      };

      storageService.saveRoadmap(newRoadmap);
      storageService.addCredits(user.id, 40, `Constructed Multilingual Roadmap: ${goal}`);

      setRoadmaps([newRoadmap, ...roadmaps]);
      setSelectedRoadmap(newRoadmap);
      setShowCreatorModal(false);
      setGoal('');
      setCurrentKnowledge('');
    } catch (err: any) {
      setError(err.message || 'Failed to generate roadmap.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoadmap = (id: string) => {
    storageService.deleteRoadmap(id);
    const updated = roadmaps.filter(r => r.id !== id);
    setRoadmaps(updated);
    setSelectedRoadmap(updated[0] || null);
  };

  // Quick Multilingual Explanation on selected topic
  const handleAskQuickExplanation = async (topicContext: string) => {
    if (!quickQuestion.trim()) return;

    setExplainingLoading(true);
    try {
      const res = await aiService.getSocraticGuidance({
        question: quickQuestion,
        concept: topicContext,
        socraticLevel: 3,
        language: selectedRoadmap?.targetLanguage || 'en',
        explanationLevel: selectedRoadmap?.explanationLevel || 'intermediate',
        isUnder12,
        age: user.age,
      });

      setExplanationResponse(res.response);
    } catch (e) {
      console.error('Explanation error', e);
    } finally {
      setExplainingLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#07090E] text-slate-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                UNIVERSAL MULTILINGUAL ROADMAPS
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-mono text-violet-400">Adaptive Curriculum Architect</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Globe className="w-7 h-7 text-cyan-400" />
              <span>Personalized Multilingual Learning Plans</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Generate structured, age-appropriate roadmaps across any supported language. Break down goals into stages, topics, milestones, and Socratic assessments.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center">
            <button
              onClick={() => setShowCreatorModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-xs font-semibold rounded-lg transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Roadmap</span>
            </button>

            <button
              onClick={onBackToDashboard}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs text-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          </div>
        </div>

        {/* Existing Roadmaps Selector Bar */}
        {roadmaps.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {roadmaps.map(rm => (
              <button
                key={rm.id}
                onClick={() => { setSelectedRoadmap(rm); setActiveStageIndex(0); setExplanationResponse(null); }}
                className={`px-4 py-2 rounded-xl text-xs font-medium border whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                  selectedRoadmap?.id === rm.id
                    ? 'bg-violet-950/60 border-violet-500 text-white shadow-sm'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
                }`}
              >
                <span>{rm.goal}</span>
                <span className="font-mono text-[10px] text-cyan-300 uppercase px-1.5 py-0.5 rounded bg-black/40">
                  {rm.targetLanguage}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Selected Roadmap Details */}
        {selectedRoadmap ? (
          <div className="space-y-6">
            
            {/* Roadmap Header Meta */}
            <div className="p-6 rounded-2xl bg-[#0C101A] border border-white/10 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                    <span>LANGUAGE: {getLanguageName(selectedRoadmap.targetLanguage)}</span>
                    <span>·</span>
                    <span className="uppercase">{selectedRoadmap.explanationLevel} TIER</span>
                    {selectedRoadmap.isAgeAppropriate && (
                      <>
                        <span>·</span>
                        <span className="text-amber-400 flex items-center gap-1">
                          <Smile className="w-3 h-3" /> Child-Safe
                        </span>
                      </>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-white mt-1">{selectedRoadmap.goal}</h2>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-center">
                  <div className="text-right text-xs font-mono text-slate-400">
                    <div>{selectedRoadmap.availableMinutesPerDay}m / day</div>
                    <div>{selectedRoadmap.targetDeadlineWeeks} Weeks Horizon</div>
                  </div>
                  <button
                    onClick={() => handleDeleteRoadmap(selectedRoadmap.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-white/5 transition-colors"
                    title="Delete roadmap"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {selectedRoadmap.currentKnowledge && (
                <p className="text-xs text-slate-300">
                  <strong className="text-slate-400">Starting Knowledge:</strong> {selectedRoadmap.currentKnowledge}
                </p>
              )}
            </div>

            {/* Stages Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Stages List (Left) */}
              <div className="lg:col-span-5 space-y-3">
                <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                  Roadmap Stages ({selectedRoadmap.stages.length})
                </h3>

                {selectedRoadmap.stages.map((stage, idx) => {
                  const isActive = idx === activeStageIndex;
                  return (
                    <div
                      key={idx}
                      onClick={() => { setActiveStageIndex(idx); setExplanationResponse(null); }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                        isActive
                          ? 'bg-violet-950/40 border-violet-500 text-white shadow-md'
                          : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-cyan-400 font-semibold">STAGE 0{stage.stageNumber}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                      <h4 className="text-sm font-bold text-white">{stage.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        Milestone: {stage.milestone}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Stage Deep Dive & Socratic Activity (Right) */}
              <div className="lg:col-span-7 space-y-4">
                {selectedRoadmap.stages[activeStageIndex] && (
                  <div className="p-6 rounded-2xl bg-[#0C101A] border border-white/10 space-y-6 shadow-xl">
                    
                    <div className="border-b border-white/[0.08] pb-4">
                      <span className="text-xs font-mono text-cyan-400 font-semibold">
                        STAGE 0{selectedRoadmap.stages[activeStageIndex].stageNumber} DEEP DIVE
                      </span>
                      <h3 className="text-xl font-bold text-white mt-1">
                        {selectedRoadmap.stages[activeStageIndex].title}
                      </h3>
                    </div>

                    {/* Topics Covered */}
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-slate-300 font-mono uppercase">
                        Core Topics to Master:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {selectedRoadmap.stages[activeStageIndex].topics.map((t, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-200"
                          >
                            • {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Milestone & Practice */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                        <strong className="text-emerald-300 font-mono block">STAGE MILESTONE</strong>
                        <p className="text-slate-200">{selectedRoadmap.stages[activeStageIndex].milestone}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-violet-950/20 border border-violet-500/20 space-y-1">
                        <strong className="text-violet-300 font-mono block">HANDS-ON PRACTICE TASK</strong>
                        <p className="text-slate-200">{selectedRoadmap.stages[activeStageIndex].practiceTask}</p>
                      </div>
                    </div>

                    {/* Socratic Assessment Question */}
                    <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-1.5 text-xs">
                      <strong className="text-amber-300 font-mono block">SOCRATIC ASSESSMENT CHECK</strong>
                      <p className="text-slate-200 italic font-serif">
                        "{selectedRoadmap.stages[activeStageIndex].assessmentQuestion}"
                      </p>
                    </div>

                    {/* In-Language Socratic Inquiry Box */}
                    <div className="pt-2 border-t border-white/[0.08] space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Ask Dasasurya in {getLanguageName(selectedRoadmap.targetLanguage)}:</span>
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">{selectedRoadmap.explanationLevel} tier</span>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={quickQuestion}
                          onChange={e => setQuickQuestion(e.target.value)}
                          placeholder={`Ask for an explanation, analogy, or code in ${selectedRoadmap.targetLanguage}...`}
                          className="flex-1 p-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                        <button
                          onClick={() => handleAskQuickExplanation(selectedRoadmap.stages[activeStageIndex].title)}
                          disabled={explainingLoading || !quickQuestion.trim()}
                          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-xs font-semibold text-white rounded-lg transition-colors flex items-center gap-1 shrink-0"
                        >
                          <Send className="w-3 h-3" />
                          <span>Ask</span>
                        </button>
                      </div>

                      {explanationResponse && (
                        <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line animate-in fade-in duration-200">
                          {explanationResponse}
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>

            </div>

          </div>
        ) : (
          <div className="p-12 rounded-2xl bg-[#0C101A] border border-white/10 text-center space-y-4">
            <Globe className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No active multilingual roadmaps yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Construct a tailored, age-appropriate learning plan in your chosen language. Specify your goal, available minutes, and target duration.
            </p>
            <button
              onClick={() => setShowCreatorModal(true)}
              className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Roadmap</span>
            </button>
          </div>
        )}

        {/* Creator Modal */}
        {showCreatorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-[#0C101A] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">Create Multilingual Learning Roadmap</h3>
                </div>
                <button onClick={() => setShowCreatorModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              {error && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateRoadmap} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    What is your specific learning goal?
                  </label>
                  <input
                    type="text"
                    required
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                    placeholder="e.g. Master Classical Systems Architecture, or Understand Photosynthesis & Energy"
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Target Language</label>
                    <select
                      value={targetLanguage}
                      onChange={e => setTargetLanguage(e.target.value as LanguageCode)}
                      className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs"
                    >
                      {SUPPORTED_LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name} ({lang.nativeName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Explanation Level</label>
                    <select
                      value={explanationLevel}
                      onChange={e => setExplanationLevel(e.target.value as ExplanationLevel)}
                      className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs"
                    >
                      <option value="beginner">Beginner (Foundations & Intuition)</option>
                      <option value="intermediate">Intermediate (Rigorous Systems)</option>
                      <option value="advanced">Advanced (Deep Theoretical Nuance)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Existing Knowledge / Familiar Concepts (Optional)
                  </label>
                  <input
                    type="text"
                    value={currentKnowledge}
                    onChange={e => setCurrentKnowledge(e.target.value)}
                    placeholder="e.g. Basic algebra, or Introductory Python programming"
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Daily Study Time</label>
                    <select
                      value={availableMinutesPerDay}
                      onChange={e => setAvailableMinutesPerDay(parseInt(e.target.value, 10))}
                      className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs font-mono"
                    >
                      <option value={15}>15 Minutes (Micro-burst)</option>
                      <option value={30}>30 Minutes (Recommended)</option>
                      <option value={45}>45 Minutes (Focused session)</option>
                      <option value={60}>60 Minutes (Deep immersion)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Target Horizon</label>
                    <select
                      value={targetDeadlineWeeks}
                      onChange={e => setTargetDeadlineWeeks(parseInt(e.target.value, 10))}
                      className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs font-mono"
                    >
                      <option value={2}>2 Weeks (Sprint)</option>
                      <option value={4}>4 Weeks (Standard Month)</option>
                      <option value={8}>8 Weeks (Deep Mastery)</option>
                      <option value={12}>12 Weeks (Quarterly Goal)</option>
                    </select>
                  </div>
                </div>

                {isUnder12 && (
                  <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20 text-[11px] text-amber-300 flex items-center gap-1.5">
                    <Smile className="w-3.5 h-3.5" />
                    <span>Under-12 Safeguards: Content will be structured into friendly bite-sized milestones with regular breaks.</span>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreatorModal(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs text-slate-400 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-xs font-semibold text-white rounded-lg shadow-sm"
                  >
                    {loading ? 'Synthesizing Roadmap...' : 'Generate Roadmap'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
