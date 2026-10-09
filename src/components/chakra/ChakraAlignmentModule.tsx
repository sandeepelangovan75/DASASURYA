import React, { useState, useEffect, useRef } from 'react';
import { SEVEN_CHAKRAS, CHAKRA_SAFETY_DISCLAIMER } from '../../data/chakras';
import { SUPPORTED_LANGUAGES } from '../../data/languages';
import { aiService } from '../../services/aiService';
import { storageService } from '../../services/storageService';
import { 
  ChakraGuidanceStyle, 
  ChakraId, 
  ChakraInfo, 
  ChakraSession, 
  LanguageCode, 
  UserAccount, 
  UserProfile, 
  WellnessJournalEntry 
} from '../../types';
import { 
  Sparkles, 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Download, 
  Trash2, 
  ShieldCheck, 
  Info, 
  Heart, 
  Clock, 
  Globe, 
  Smile, 
  CheckCircle2, 
  Star,
  ArrowLeft
} from 'lucide-react';

interface ChakraAlignmentModuleProps {
  user: UserAccount;
  profile: UserProfile | null;
  onBackToDashboard: () => void;
}

export const ChakraAlignmentModule: React.FC<ChakraAlignmentModuleProps> = ({
  user,
  profile,
  onBackToDashboard,
}) => {
  const [selectedChakraId, setSelectedChakraId] = useState<ChakraId>('muladhara');
  const [activeTab, setActiveTab] = useState<'guide' | 'session' | 'journal'>('guide');

  // Session Runner States
  const [sessionDurationMinutes, setSessionDurationMinutes] = useState<number>(5);
  const [guidanceStyle, setGuidanceStyle] = useState<ChakraGuidanceStyle>('gentle-breathing');
  const [sessionLanguage, setSessionLanguage] = useState<LanguageCode>(
    user.languagePreferences?.responseLanguage || 'en'
  );
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(300);
  const [guidanceScript, setGuidanceScript] = useState<string>('');
  const [loadingScript, setLoadingScript] = useState(false);

  // Post-Session Reflection
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [focusRating, setFocusRating] = useState<number>(4);
  const [calmnessRating, setCalmnessRating] = useState<number>(5);
  const [reflectionNote, setReflectionNote] = useState('');

  // Wellness Journal Records
  const [journalEntries, setJournalEntries] = useState<WellnessJournalEntry[]>([]);
  const [completedSessions, setCompletedSessions] = useState<ChakraSession[]>([]);

  const isUnder12 = user.isUnder12;
  const activeChakra = SEVEN_CHAKRAS.find(c => c.id === selectedChakraId) || SEVEN_CHAKRAS[0];

  // Web Audio chime generator
  const audioContextRef = useRef<AudioContext | null>(null);

  const playGentleBell = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, ctx.currentTime); // Gentle calming resonance
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.0);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 3.2);
    } catch (e) {
      console.warn('Audio bell playback not supported in sandbox environment');
    }
  };

  useEffect(() => {
    setJournalEntries(storageService.getWellnessEntries(user.id));
    setCompletedSessions(storageService.getChakraSessions(user.id));
  }, [user.id]);

  // Session timer ticker
  useEffect(() => {
    if (!isSessionActive || isPaused) return;

    if (secondsRemaining <= 0) {
      handleCompleteSession(false);
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isSessionActive, isPaused, secondsRemaining]);

  const handleStartSession = async () => {
    setSecondsRemaining(sessionDurationMinutes * 60);
    setIsSessionActive(true);
    setIsPaused(false);
    playGentleBell();

    setLoadingScript(true);
    try {
      const res = await aiService.getChakraGuidance({
        chakraId: selectedChakraId,
        durationMinutes: sessionDurationMinutes,
        guidanceStyle,
        language: sessionLanguage,
        isUnder12,
      });
      setGuidanceScript(res.guidanceScript);
    } catch (e) {
      console.warn('Error fetching guidance script', e);
    } finally {
      setLoadingScript(false);
    }
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
  };

  // Immediate Leave / Stop Session at any time (Requirement F/G)
  const handleStopSession = (voluntaryExit: boolean = true) => {
    setIsSessionActive(false);
    setIsPaused(false);

    const elapsedSeconds = sessionDurationMinutes * 60 - secondsRemaining;
    const sessionRecord: ChakraSession = {
      id: 'chk_sess_' + Date.now(),
      userId: user.id,
      chakraId: selectedChakraId,
      durationMinutes: sessionDurationMinutes,
      guidanceStyle,
      language: sessionLanguage,
      completedDurationSeconds: Math.max(0, elapsedSeconds),
      completed: !voluntaryExit,
      terminatedEarly: voluntaryExit,
      date: new Date().toISOString(),
    };

    storageService.saveChakraSession(sessionRecord);
    setCompletedSessions([sessionRecord, ...completedSessions]);

    if (!voluntaryExit) {
      setShowReflectionModal(true);
    }
  };

  const handleCompleteSession = (early: boolean) => {
    handleStopSession(early);
    playGentleBell();
  };

  const handleSaveReflection = () => {
    const entry: WellnessJournalEntry = {
      id: 'well_' + Date.now(),
      userId: user.id,
      chakraId: selectedChakraId,
      chakraName: activeChakra.name,
      focusRating,
      calmnessRating,
      voluntaryReflection: reflectionNote,
      date: new Date().toISOString(),
      private: true,
    };

    storageService.saveWellnessEntry(entry);
    setJournalEntries([entry, ...journalEntries]);
    storageService.addCredits(user.id, 20, `Completed Mindful Chakra Reflection: ${activeChakra.name}`);
    setShowReflectionModal(false);
    setReflectionNote('');
    setActiveTab('journal');
  };

  const handleDeleteJournalEntry = (id: string) => {
    storageService.deleteWellnessEntry(id);
    setJournalEntries(journalEntries.filter(e => e.id !== id));
  };

  const handleExportJournal = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(journalEntries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sanr10_wellness_journal_${user.username}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full min-h-screen bg-[#07090E] text-slate-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
                CHAKRA_ALIGNMENT · HOLISTIC WELLNESS
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-mono text-emerald-400">Traditional Contemplative Guide</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Sparkles className="w-7 h-7 text-amber-400" />
              <span>Chakra Alignment & Mindful Reflection</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              An optional, culturally grounded self-reflection and gentle relaxation module rooted in traditional frameworks. Clearly distinguished from medical care.
            </p>
          </div>

          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs text-slate-300 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-center"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
        </div>

        {/* Epistemological & Safety Transparency Banner */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-slate-300">
            <span className="font-semibold text-white">Transparency & Medical Safety Notice:</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              This module provides traditional contemplative mindfulness and breathing exercises. We do NOT diagnose or treat physical/mental health conditions, nor do we claim to detect or measure energy centres via camera, microphone, or AI inference. You may leave any session at any time.
            </p>
          </div>
        </div>

        {/* Tab Switcher: Guide vs Session vs Private Journal */}
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3 text-xs">
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'guide'
                ? 'bg-violet-600/30 text-white border border-violet-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Seven-Chakra Educational Guide
          </button>

          <button
            onClick={() => setActiveTab('session')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'session'
                ? 'bg-violet-600/30 text-white border border-violet-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Guided Mindful Sessions
          </button>

          <button
            onClick={() => setActiveTab('journal')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'journal'
                ? 'bg-violet-600/30 text-white border border-violet-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Private Wellness Journal ({journalEntries.length})
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: SEVEN-CHAKRA EDUCATIONAL GUIDE */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            
            {/* Chakra Selector Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {SEVEN_CHAKRAS.map((ch, idx) => {
                const isSelected = ch.id === selectedChakraId;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChakraId(ch.id)}
                    className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                      isSelected
                        ? 'bg-white/[0.08] border-white/40 shadow-lg'
                        : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500">#{idx + 1}</span>
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ch.hexColor }} />
                    </div>
                    <div className="text-xs font-semibold text-white truncate">{ch.name}</div>
                    <div className="text-[10px] text-slate-400 truncate font-serif italic">{ch.sanskritName.split(' ')[0]}</div>
                  </button>
                );
              })}
            </div>

            {/* Detailed Selected Chakra Deep Dive */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0C101A] border border-white/10 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: activeChakra.hexColor }} />
                    <span className="text-xs font-mono uppercase text-slate-400">{activeChakra.sanskritName}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">{activeChakra.name}</h2>
                  <p className="text-xs text-cyan-400 font-mono">Meaning: {activeChakra.translation} · Element: {activeChakra.element}</p>
                </div>

                <button
                  onClick={() => setActiveTab('session')}
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg transition-all shadow-sm flex items-center gap-2 self-start sm:self-center"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Centering Session</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs text-slate-300">
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                    <strong className="text-white block font-mono text-[11px] uppercase text-amber-300">
                      Traditional Theme & Symbolism:
                    </strong>
                    <p className="leading-relaxed">{activeChakra.traditionalTheme}</p>
                    <p className="text-slate-400 text-[11px] leading-relaxed pt-1">{activeChakra.symbolism}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/20 space-y-1.5">
                    <strong className="text-sky-300 block font-mono text-[11px] uppercase">
                      Scientific & Psychological Grounding:
                    </strong>
                    <p className="leading-relaxed text-slate-200">{activeChakra.scientificDistinction}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1.5">
                    <strong className="text-emerald-300 block font-mono text-[11px] uppercase">
                      Recommended Gentle Somatic Practice:
                    </strong>
                    <p className="leading-relaxed text-slate-200">
                      {isUnder12 ? activeChakra.childSafePractice : activeChakra.gentlePractice}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/20 space-y-2">
                    <strong className="text-violet-300 block font-mono text-[11px] uppercase">
                      Contemplative Reflection Prompts:
                    </strong>
                    <ul className="space-y-1.5 list-disc list-inside text-slate-300 leading-relaxed">
                      {activeChakra.reflectionThemes.map((theme, i) => (
                        <li key={i}>{theme}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: GUIDED MINDFUL SESSIONS RUNNER */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'session' && (
          <div className="space-y-6">
            {!isSessionActive ? (
              /* Session Configuration Panel */
              <div className="p-6 sm:p-8 rounded-2xl bg-[#0C101A] border border-white/10 space-y-6 shadow-xl">
                <div>
                  <h3 className="text-lg font-bold text-white">Configure Your Centering Session</h3>
                  <p className="text-xs text-slate-400">
                    Select your focus chakra, pace, and guidance style. You may pause or exit the session at any time with complete freedom.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  {/* Focus Chakra */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Focus Chakra</label>
                    <select
                      value={selectedChakraId}
                      onChange={e => setSelectedChakraId(e.target.value as ChakraId)}
                      className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white"
                    >
                      {SEVEN_CHAKRAS.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.sanskritName.split(' ')[0]})</option>
                      ))}
                    </select>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Session Duration</label>
                    <select
                      value={sessionDurationMinutes}
                      onChange={e => setSessionDurationMinutes(parseInt(e.target.value, 10))}
                      className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white font-mono"
                    >
                      <option value={3}>3 Minutes (Short Reset)</option>
                      <option value={5}>5 Minutes (Balanced Grounding)</option>
                      <option value={10}>10 Minutes (Deeper Reflection)</option>
                      <option value={15}>15 Minutes (Comprehensive Immersion)</option>
                    </select>
                  </div>

                  {/* Guidance Style */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Guidance Style</label>
                    <select
                      value={guidanceStyle}
                      onChange={e => setGuidanceStyle(e.target.value as ChakraGuidanceStyle)}
                      className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white"
                    >
                      <option value="gentle-breathing">Gentle Somatic Breathing</option>
                      <option value="mindful-focus">Mindful Focal Reflection</option>
                      <option value="silent-contemplation">Silent Contemplation with Bell</option>
                    </select>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Language</label>
                    <select
                      value={sessionLanguage}
                      onChange={e => setSessionLanguage(e.target.value as LanguageCode)}
                      className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white"
                    >
                      {SUPPORTED_LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name} ({lang.nativeName})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {isUnder12 && (
                  <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                    <Smile className="w-4 h-4" />
                    <span>Child-Safe Mode Active: Guidance is simplified, gentle, and focuses on nature, smiles, and peaceful rest.</span>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleStartSession}
                    className="px-6 py-2.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-xs font-semibold rounded-lg transition-all shadow-md flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Begin Session ({sessionDurationMinutes} min)</span>
                  </button>
                </div>
              </div>
            ) : (
              /* ACTIVE SESSION RUNNER */
              <div className="p-8 rounded-2xl bg-[#0C101A] border border-white/10 space-y-8 text-center max-w-2xl mx-auto shadow-2xl">
                
                <div className="space-y-1">
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                    Active Centering: {activeChakra.name}
                  </span>
                  <div className="text-4xl font-bold font-mono text-white tabular-nums">
                    {formatTime(secondsRemaining)}
                  </div>
                  <p className="text-xs text-slate-400">
                    Focus: <strong className="text-slate-200">{activeChakra.traditionalTheme}</strong>
                  </p>
                </div>

                {/* Gentle Breathing Expanding Circle Visualizer */}
                <div className="py-6 flex items-center justify-center">
                  <div className="relative flex items-center justify-center">
                    {/* Pulsing outer aura */}
                    <div 
                      className="w-48 h-48 rounded-full border border-white/10 flex items-center justify-center transition-transform duration-1000"
                      style={{
                        transform: isPaused ? 'scale(1)' : 'scale(1.15)',
                        boxShadow: `0 0 35px ${activeChakra.hexColor}33`,
                      }}
                    >
                      {/* Inner glowing circle */}
                      <div 
                        className="w-32 h-32 rounded-full flex items-center justify-center text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-inner"
                        style={{
                          backgroundColor: `${activeChakra.hexColor}22`,
                          border: `2px solid ${activeChakra.hexColor}88`,
                        }}
                      >
                        {isPaused ? 'Paused' : 'Inhale · Exhale'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI / Guided Text Prompts */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 leading-relaxed font-serif max-h-36 overflow-y-auto">
                  {loadingScript ? (
                    <span className="text-slate-500 italic">Synthesizing gentle guidance script...</span>
                  ) : (
                    <div className="whitespace-pre-line">{guidanceScript}</div>
                  )}
                </div>

                {/* Controls (Play/Pause & IMMEDIATE STOP AT ANY TIME) */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <button
                    onClick={handlePauseToggle}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-medium text-white rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
                    <span>{isPaused ? 'Resume' : 'Pause'}</span>
                  </button>

                  <button
                    onClick={() => handleStopSession(true)}
                    className="px-5 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    title="Stop or exit the session immediately at any time"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop / Leave Session</span>
                  </button>

                  <button
                    onClick={() => handleCompleteSession(false)}
                    className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Finish Early & Journal
                  </button>
                </div>

              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: PRIVATE WELLNESS JOURNAL & SOVEREIGNTY */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'journal' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Private Wellness Journal</h3>
                <p className="text-xs text-slate-400">
                  Voluntary reflections and calm ratings. Stored completely private and isolated from your educational metrics.
                </p>
              </div>

              {journalEntries.length > 0 && (
                <button
                  onClick={handleExportJournal}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs text-slate-300 rounded-lg transition-colors flex items-center gap-1.5 border border-white/5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Journal (JSON)</span>
                </button>
              )}
            </div>

            {journalEntries.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center space-y-3">
                <p className="text-xs text-slate-400">
                  No wellness entries recorded yet. After completing any guided session, you can record private notes here.
                </p>
                <button
                  onClick={() => setActiveTab('session')}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-xs text-white font-medium rounded-lg"
                >
                  Start a Centering Session
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {journalEntries.map(entry => (
                  <div
                    key={entry.id}
                    className="p-4 rounded-xl bg-[#0C101A] border border-white/10 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{entry.chakraName || 'General Reflection'}</span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(entry.date).toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteJournalEntry(entry.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        title="Delete journal entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
                      <span>Focus: <strong className="text-cyan-400">{entry.focusRating}/5</strong></span>
                      <span>Calmness: <strong className="text-emerald-400">{entry.calmnessRating}/5</strong></span>
                    </div>

                    {entry.voluntaryReflection && (
                      <p className="text-slate-200 leading-relaxed font-sans pt-1">
                        "{entry.voluntaryReflection}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* Post-Session Reflection Modal */}
        {showReflectionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#0C101A] border border-white/10 rounded-2xl p-6 space-y-5 shadow-2xl">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold">Session Concluded</span>
                <h3 className="text-lg font-bold text-white">Voluntary Wellness Reflection</h3>
                <p className="text-xs text-slate-400">
                  How do you feel after this session? (Optional; you may skip or save privately).
                </p>
              </div>

              {/* Ratings */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Calmness Level: <strong className="text-emerald-400 font-mono">{calmnessRating}/5</strong>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={calmnessRating}
                    onChange={e => setCalmnessRating(parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Mental Focus: <strong className="text-cyan-400 font-mono">{focusRating}/5</strong>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={focusRating}
                    onChange={e => setFocusRating(parseInt(e.target.value, 10))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Voluntary Personal Note (Private)
                  </label>
                  <textarea
                    rows={3}
                    value={reflectionNote}
                    onChange={e => setReflectionNote(e.target.value)}
                    placeholder="Notice any shifts in your breath, thoughts, or feelings..."
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReflectionModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs text-slate-400 rounded-lg"
                >
                  Skip Reflection
                </button>
                <button
                  type="button"
                  onClick={handleSaveReflection}
                  className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white rounded-lg shadow-sm"
                >
                  Save to Wellness Journal
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
