import React, { useState, useEffect } from 'react';
import { COURSES, HEAD_PILLARS } from '../../data/curriculum';
import { storageService } from '../../services/storageService';
import { Chapter, UserAccount, UserProfile, UserProgress } from '../../types';
import { SunMedium, CheckCircle2, Circle, BookOpen, Dumbbell, Compass, HeartHandshake, ArrowRight, Sparkles } from 'lucide-react';

interface MyDayArchitectureProps {
  user: UserAccount;
  profile: UserProfile | null;
  progress: UserProgress;
  onOpenChapter: (chapterId: string) => void;
  onBackToDashboard: () => void;
}

export const MyDayArchitecture: React.FC<MyDayArchitectureProps> = ({
  user,
  profile,
  progress,
  onOpenChapter,
  onBackToDashboard,
}) => {
  // Today's Date String
  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const [priority, setPriority] = useState('Deep work sprint on foundational axioms.');
  const [learningCompleted, setLearningCompleted] = useState(false);
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [vitalityCompleted, setVitalityCompleted] = useState(false);
  const [reflectionCompleted, setReflectionCompleted] = useState(false);

  // Active chapter
  const activeChapterId = progress.lastActiveChapterId || 'chap-01-first-principles';
  const chapEntry = progress.chapterProgress[activeChapterId];

  useEffect(() => {
    if (chapEntry) {
      if (chapEntry.readingProgress >= 80) setLearningCompleted(true);
      if (chapEntry.practiceCompleted) setPracticeCompleted(true);
      if (chapEntry.reflectionText) setReflectionCompleted(true);
    }
  }, [chapEntry]);

  // Find chapter title
  let activeTitle = 'Chapter 1: The Socratic Scalpel';
  for (const c of COURSES) {
    for (const m of c.modules) {
      const found = m.chapters.find(ch => ch.id === activeChapterId);
      if (found) {
        activeTitle = found.title;
        break;
      }
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#07090E] text-slate-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <SunMedium className="w-4 h-4" />
              <span>SUSTAINABLE DAILY ARCHITECTURE</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              My Day · {todayStr}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              A calm, deliberate rhythm designed for lifelong endurance without anxiety or burnout.
            </p>
          </div>

          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs text-slate-300 rounded-lg transition-colors"
          >
            ← Return to Dashboard
          </button>
        </div>

        {/* Today's Single Core Priority */}
        <div className="p-6 rounded-2xl bg-[#0C101A] border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-cyan-400 uppercase font-semibold">Today’s Essential Priority</span>
            <span className="text-slate-500 font-mono">1 Item Limit</span>
          </div>

          <input
            type="text"
            value={priority}
            onChange={e => setPriority(e.target.value)}
            className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-cyan-400 transition-colors"
          />
          <p className="text-[11px] text-slate-400">
            If you accomplish only this single outcome today, your day is a deliberate success.
          </p>
        </div>

        {/* The 4 Architectural Pillars of the Day */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase font-mono tracking-wider">
            Daily Rhythm Pillars
          </h3>

          {/* 1. Today's Learning */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-semibold text-white">1. Today’s Learning</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {profile?.preferredSchedule || '30m Cadence'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Continue reading <strong className="text-white">{activeTitle}</strong>. Absorb the axioms and analogical explanations.
              </p>
              <button
                onClick={() => onOpenChapter(activeChapterId)}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Open Lesson in Reader</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={() => setLearningCompleted(!learningCompleted)}
              className="p-1 text-slate-500 hover:text-white transition-colors"
              title="Toggle completion"
            >
              {learningCompleted ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : (
                <Circle className="w-6 h-6 text-slate-600" />
              )}
            </button>
          </div>

          {/* 2. Today's Practice */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-violet-400" />
                <h4 className="text-sm font-semibold text-white">2. Today’s Practice & Application</h4>
              </div>
              <p className="text-xs text-slate-300">
                Complete the understanding check or practice decomposition for this chapter to convert reading into synaptic strength.
              </p>
              <button
                onClick={() => onOpenChapter(activeChapterId)}
                className="text-xs text-violet-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Navigate to Practice Activity</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={() => setPracticeCompleted(!practiceCompleted)}
              className="p-1 text-slate-500 hover:text-white transition-colors"
              title="Toggle completion"
            >
              {practiceCompleted ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : (
                <Circle className="w-6 h-6 text-slate-600" />
              )}
            </button>
          </div>

          {/* 3. Today's Vitality Habit */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-semibold text-white">3. Today’s Vitality Habit (Head 03)</h4>
              </div>
              <p className="text-xs text-slate-300">
                Execute at least one 5-minute panoramic horizon vision reset and hydrate with mineral water between 90-minute focus blocks.
              </p>
            </div>

            <button
              onClick={() => setVitalityCompleted(!vitalityCompleted)}
              className="p-1 text-slate-500 hover:text-white transition-colors"
              title="Toggle completion"
            >
              {vitalityCompleted ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : (
                <Circle className="w-6 h-6 text-slate-600" />
              )}
            </button>
          </div>

          {/* 4. Today's Reflection */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-semibold text-white">4. Today’s Socratic Reflection</h4>
              </div>
              <p className="text-xs text-slate-300 italic font-serif">
                "Where did you notice the shadow of your primary intellectual discipline today?"
              </p>
            </div>

            <button
              onClick={() => setReflectionCompleted(!reflectionCompleted)}
              className="p-1 text-slate-500 hover:text-white transition-colors"
              title="Toggle completion"
            >
              {reflectionCompleted ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : (
                <Circle className="w-6 h-6 text-slate-600" />
              )}
            </button>
          </div>

        </div>

        {/* Ethical Non-Toxic Philosophy Note */}
        <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/20 text-xs text-slate-300 leading-relaxed">
          <strong className="text-violet-300 font-semibold">SAN_R-10 Architecture Guarantee:</strong> We reject punitive guilt trips and toxic hustle culture. If life interrupts your schedule, your progress is preserved, your calendar adjusts calmly, and your dignity remains intact.
        </div>

      </div>
    </div>
  );
};
