import React from 'react';
import { COURSES, HEAD_PILLARS } from '../../data/curriculum';
import { Bookmark, Chapter, HeadId, UserAccount, UserNote, UserProfile, UserProgress } from '../../types';
import { BookOpen, Sparkles, CheckCircle2, Bookmark as BookmarkIcon, FileText, ArrowRight, Compass, BrainCircuit, Calendar, Award } from 'lucide-react';

interface PersonalDashboardProps {
  user: UserAccount;
  profile: UserProfile | null;
  progress: UserProgress;
  bookmarks: Bookmark[];
  notes: UserNote[];
  credits: number;
  onOpenChapter: (chapterId: string) => void;
  onNavigate: (view: string) => void;
  onOpenDasasurya: () => void;
  onOpenRavanaMind: () => void;
}

export const PersonalDashboard: React.FC<PersonalDashboardProps> = ({
  user,
  profile,
  progress,
  bookmarks,
  notes,
  credits,
  onOpenChapter,
  onNavigate,
  onOpenDasasurya,
  onOpenRavanaMind,
}) => {
  // Determine Last Active Chapter
  const lastActiveChapterId = progress.lastActiveChapterId || 'chap-01-first-principles';
  let continueChapter: Chapter | null = null;
  let continueCourseTitle = '';

  for (const course of COURSES) {
    for (const mod of course.modules) {
      const found = mod.chapters.find(c => c.id === lastActiveChapterId);
      if (found) {
        continueChapter = found;
        continueCourseTitle = course.title;
        break;
      }
    }
    if (continueChapter) break;
  }

  // If no chapter found, default to first chapter of first course
  if (!continueChapter && COURSES[0]?.modules[0]?.chapters[0]) {
    continueChapter = COURSES[0].modules[0].chapters[0];
    continueCourseTitle = COURSES[0].title;
  }

  const currentProgressEntry = continueChapter ? progress.chapterProgress[continueChapter.id] : null;
  const continuePercent = currentProgressEntry ? currentProgressEntry.readingProgress : 0;

  // Recommended Lesson (Head matching user's preferred head that isn't complete yet)
  const preferredHeadId = profile?.preferredHeads?.[0] || 'head-01-knowledge-logic';
  const matchingPillar = HEAD_PILLARS.find(hp => hp.id === preferredHeadId) || HEAD_PILLARS[0];

  // Calculate real metrics
  const completedChaptersCount = Object.values(progress.chapterProgress).filter(p => p.isCompleted).length;
  const quizzesTakenCount = Object.values(progress.chapterProgress).filter(p => p.quizCompleted).length;
  const practiceCount = Object.values(progress.chapterProgress).filter(p => p.practiceCompleted).length;

  // Days of current week representation
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayDayIndex = (new Date().getDay() + 6) % 7; // Monday = 0

  return (
    <div className="w-full min-h-screen bg-[#07090E] text-slate-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                Sanctuary Active
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400 font-mono">Streak: {progress.streakDays} Day{progress.streakDays > 1 ? 's' : ''}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome, {profile?.fullName || user.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              {profile?.bio || 'Cultivating intellectual clarity, vitality, and systemic leverage through the 10 Heads.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDasasurya}
              className="px-4 py-2 rounded-lg text-xs font-medium text-white bg-violet-600 hover:bg-violet-500 transition-colors shadow-sm flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Socratic Mentor</span>
            </button>
            <button
              onClick={onOpenRavanaMind}
              className="px-4 py-2 rounded-lg text-xs font-medium text-violet-300 bg-violet-950/40 hover:bg-violet-900/50 border border-violet-500/30 transition-colors flex items-center gap-2"
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Ravana Mind</span>
            </button>
          </div>
        </div>

        {/* 2-Column Core Grid: Continue Learning + Today's Recommendation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Continue Learning Card */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0C101A] border border-white/10 shadow-lg flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-cyan-400 uppercase tracking-wider">Continue Learning</span>
                <span className="text-slate-400 font-mono">{continuePercent}% Completed</span>
              </div>

              {continueChapter ? (
                <div>
                  <h3 className="text-xl font-bold text-white leading-snug">
                    {continueChapter.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Course: {continueCourseTitle} · {continueChapter.estimatedMinutes} min read
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Select any chapter to begin your journey.</p>
              )}

              {/* Progress bar */}
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, continuePercent)}%` }}
                />
              </div>

              {continueChapter && (
                <div className="text-xs text-slate-300 space-y-1 pt-1">
                  <div className="text-slate-400 text-[11px]">Primary Learning Objectives:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-300">
                    {continueChapter.learningObjectives.slice(0, 2).map((obj, i) => (
                      <li key={i} className="truncate">{obj}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {continueChapter && (
              <div className="pt-2">
                <button
                  onClick={() => onOpenChapter(continueChapter!.id)}
                  className="w-full py-2.5 px-4 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-white/10"
                >
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Resume Reading Chapter →</span>
                </button>
              </div>
            )}
          </div>

          {/* Today's Learning Recommendation */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-[#0C101A] to-[#121829] border border-white/10 shadow-lg flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Today’s Recommended Pillar</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">ADAPTIVE</span>
              </div>

              <div>
                <span className="text-xs font-mono text-slate-400">Head {matchingPillar.number.toString().padStart(2, '0')}</span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {matchingPillar.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {matchingPillar.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="text-[11px] font-medium text-violet-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Dasasurya Adaptive Rationale:</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Based on your interest in <strong className="text-slate-200">{matchingPillar.focusAreas[0]}</strong>, consolidating these foundational theorems will unlock higher leverage in subsequent modules.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('learn')}
              className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <span>Explore Curriculum Modules →</span>
            </button>
          </div>

        </div>

        {/* Real Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-slate-400 text-xs font-mono">Chapters Completed</div>
            <div className="text-2xl font-bold text-white mt-1 tabular-nums">
              {completedChaptersCount}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1">Verified mastery</div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-slate-400 text-xs font-mono">Checks Passed</div>
            <div className="text-2xl font-bold text-white mt-1 tabular-nums">
              {quizzesTakenCount}
            </div>
            <div className="text-[11px] text-cyan-400 mt-1">Socratic evaluations</div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-slate-400 text-xs font-mono">Practices Completed</div>
            <div className="text-2xl font-bold text-white mt-1 tabular-nums">
              {practiceCount}
            </div>
            <div className="text-[11px] text-violet-400 mt-1">Real-world applications</div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-slate-400 text-xs font-mono">SAN Credits Earned</div>
            <div className="text-2xl font-bold text-amber-400 mt-1 tabular-nums">
              {credits}
            </div>
            <div className="text-[11px] text-amber-500/80 mt-1">Ethical progression XP</div>
          </div>
        </div>

        {/* My Heads + Weekly Cadence */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* My Heads Grid */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0C101A] border border-white/10 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">My Priority Pillars</h3>
              <button 
                onClick={() => onNavigate('profile')} 
                className="text-xs text-violet-400 hover:underline"
              >
                Customize Pillars
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(profile?.preferredHeads || ['head-01-knowledge-logic', 'head-03-vitality']).map((hId) => {
                const head = HEAD_PILLARS.find(hp => hp.id === hId);
                if (!head) return null;
                return (
                  <div
                    key={head.id}
                    onClick={() => onNavigate('learn')}
                    className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/15 cursor-pointer transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500">HEAD {head.number.toString().padStart(2, '0')}</span>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: head.accentColor }} />
                    </div>
                    <div className="font-semibold text-white text-xs">{head.name}</div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{head.tagline}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly Learning Activity */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0C101A] border border-white/10 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Weekly Learning Rhythm</h3>
              <span className="text-xs text-slate-400 font-mono">{profile?.preferredSchedule || '30 mins/day'}</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Sustainable progress comes from non-punitive consistency. Your daily architecture for this week:
            </p>

            <div className="grid grid-cols-7 gap-2 pt-2">
              {days.map((day, idx) => {
                const isToday = idx === todayDayIndex;
                const isPast = idx < todayDayIndex;
                return (
                  <div
                    key={day}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${
                      isToday
                        ? 'bg-violet-950/60 border-violet-400 text-white font-semibold ring-1 ring-violet-500/50'
                        : isPast
                        ? 'bg-white/[0.03] border-white/10 text-slate-300'
                        : 'bg-black/20 border-white/5 text-slate-600'
                    }`}
                  >
                    <span className="text-[10px] font-mono">{day}</span>
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      isToday ? 'bg-cyan-400 animate-pulse' : isPast ? 'bg-emerald-400' : 'bg-slate-700'
                    }`} />
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Reading: <strong className="text-slate-200">{progress.totalReadingMinutes || 18}m</strong></span>
              <button onClick={() => onNavigate('calendar')} className="text-cyan-400 hover:underline">
                View Calendar →
              </button>
            </div>
          </div>

        </div>

        {/* Bookmarks and Notes Quick Access */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Bookmarks */}
          <div className="p-6 rounded-2xl bg-[#0C101A] border border-white/10 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookmarkIcon className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">Saved Bookmarks</h3>
              </div>
              <span className="text-xs font-mono text-slate-500">{bookmarks.length} saved</span>
            </div>

            {bookmarks.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No bookmarked chapters yet. While reading, click the bookmark icon to save key lessons here.
              </p>
            ) : (
              <div className="space-y-2">
                {bookmarks.slice(0, 4).map((bm) => (
                  <div
                    key={bm.id}
                    onClick={() => onOpenChapter(bm.chapterId)}
                    className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-medium text-white hover:text-cyan-300 transition-colors">
                        {bm.chapterTitle}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono">{bm.headName}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chapter Notes */}
          <div className="p-6 rounded-2xl bg-[#0C101A] border border-white/10 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-semibold text-white">Personal Chapter Notes</h3>
              </div>
              <span className="text-xs font-mono text-slate-500">{notes.length} notes</span>
            </div>

            {notes.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No notes saved yet. Use the textbook note-taking tray to capture insights as you read.
              </p>
            ) : (
              <div className="space-y-2">
                {notes.slice(0, 4).map((note) => (
                  <div
                    key={note.id}
                    onClick={() => onOpenChapter(note.chapterId)}
                    className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] cursor-pointer transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-medium text-white">{note.title}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{note.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
