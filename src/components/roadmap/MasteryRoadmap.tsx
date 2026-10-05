import React from 'react';
import { COURSES, HEAD_PILLARS } from '../../data/curriculum';
import { storageService } from '../../services/storageService';
import { UserAccount, UserProfile, UserProgress } from '../../types';
import { Award, CheckCircle2, ChevronRight, Compass, Layers, Milestone, RotateCcw, Target } from 'lucide-react';

interface MasteryRoadmapProps {
  user: UserAccount;
  profile: UserProfile | null;
  progress: UserProgress;
  onSelectChapter: (chapterId: string) => void;
  onBackToDashboard: () => void;
}

export const MasteryRoadmap: React.FC<MasteryRoadmapProps> = ({
  user,
  profile,
  progress,
  onSelectChapter,
  onBackToDashboard,
}) => {
  const completedChaptersCount = Object.values(progress.chapterProgress).filter(p => p.isCompleted).length;
  
  // Calculate Level Tier
  let currentLevelTitle = 'Novice Synthesizer (Tier I)';
  let nextLevelThreshold = 3;
  if (completedChaptersCount >= 6) {
    currentLevelTitle = 'Master Architect (Tier III)';
    nextLevelThreshold = 10;
  } else if (completedChaptersCount >= 3) {
    currentLevelTitle = 'Disciplined Practitioner (Tier II)';
    nextLevelThreshold = 6;
  }

  // Active focus head
  const activeHeadId = progress.lastActiveHeadId || profile?.preferredHeads?.[0] || 'head-01-knowledge-logic';
  const activeHead = HEAD_PILLARS.find(hp => hp.id === activeHeadId) || HEAD_PILLARS[0];

  return (
    <div className="w-full min-h-screen bg-[#07090E] text-slate-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase font-semibold">
              <Milestone className="w-4 h-4" />
              <span>Multi-Dimensional Life Roadmap</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              My Mastery Roadmap
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Visualizing your long-term progression across all ten intellectual and operational domains.
            </p>
          </div>

          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs text-slate-300 rounded-lg transition-colors"
          >
            ← Return to Dashboard
          </button>
        </div>

        {/* Current State & Milestones Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-[#0C101A] border border-white/10 space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Current Tier</span>
            <div className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>{currentLevelTitle}</span>
            </div>
            <p className="text-xs text-slate-400">
              {completedChaptersCount} of {nextLevelThreshold} chapters completed toward next elevation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0C101A] border border-white/10 space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Active Focus Pillar</span>
            <div className="text-lg font-bold text-cyan-300 flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span>{activeHead.name}</span>
            </div>
            <p className="text-xs text-slate-400">
              Head {activeHead.number.toString().padStart(2, '0')} · {activeHead.tagline}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0C101A] border border-white/10 space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Long-Term Goal</span>
            <div className="text-sm font-semibold text-white truncate">
              {profile?.learningGoals || 'Holistic Life Architecture'}
            </div>
            <p className="text-xs text-slate-400">
              Schedule: <strong className="text-slate-200">{profile?.preferredSchedule || '30 mins/day'}</strong>
            </p>
          </div>

        </div>

        {/* Dynamic Progression Path Across Courses */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0C101A] border border-white/10 space-y-8">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-violet-400" />
              <h3 className="text-base font-bold text-white">Sequential Learning Path</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">10 Heads Architecture</span>
          </div>

          <div className="space-y-6">
            {COURSES.map((course, cIdx) => (
              <div key={course.id} className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-violet-950 border border-violet-500/40 text-violet-300 flex items-center justify-center font-mono text-xs font-bold">
                    0{cIdx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{course.title}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">{course.level} Tier</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pl-9">
                  {course.modules.flatMap(m => m.chapters).map((chap) => {
                    const chapProgress = progress.chapterProgress[chap.id];
                    const isCompleted = chapProgress?.isCompleted;
                    const readingPercent = chapProgress?.readingProgress || 0;

                    return (
                      <div
                        key={chap.id}
                        onClick={() => onSelectChapter(chap.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                          isCompleted
                            ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-400'
                            : readingPercent > 0
                            ? 'bg-violet-950/20 border-violet-500/40 hover:border-violet-400'
                            : 'bg-white/[0.02] border-white/[0.06] hover:border-white/15'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-slate-400">{chap.estimatedMinutes}m read</span>
                            {isCompleted ? (
                              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Mastered
                              </span>
                            ) : (
                              <span className="text-cyan-400">{readingPercent}% Read</span>
                            )}
                          </div>
                          <h5 className="text-xs font-bold text-white line-clamp-2">{chap.title}</h5>
                        </div>

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                          <span>{chap.sections.length} Sections</span>
                          <span className="text-violet-400 hover:underline flex items-center gap-0.5">
                            Open <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Revision Engine */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>SPACED REVISION ENGINE</span>
            </div>
            <h4 className="text-sm font-semibold text-white">Consolidate First Principles</h4>
            <p className="text-xs text-slate-400">
              Revisiting the Socratic deconstruction exercise after 7 days increases conceptual retention by over 400%.
            </p>
          </div>

          <button
            onClick={() => onSelectChapter('chap-01-first-principles')}
            className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-medium transition-colors shrink-0"
          >
            Review Chapter 1 →
          </button>
        </div>

      </div>
    </div>
  );
};
