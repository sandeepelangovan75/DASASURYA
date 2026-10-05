import React, { useState } from 'react';
import { COURSES, HEAD_PILLARS } from '../../data/curriculum';
import { storageService } from '../../services/storageService';
import { Chapter, Course, HeadId, UserAccount } from '../../types';
import { BookOpen, CheckCircle2, ChevronRight, Layers, ArrowLeft } from 'lucide-react';

interface CurriculumExplorerProps {
  user: UserAccount;
  onSelectChapter: (chapterId: string) => void;
  onBackToDashboard: () => void;
}

export const CurriculumExplorer: React.FC<CurriculumExplorerProps> = ({
  user,
  onSelectChapter,
  onBackToDashboard,
}) => {
  const [selectedHeadId, setSelectedHeadId] = useState<HeadId>('head-01-knowledge-logic');

  const selectedHead = HEAD_PILLARS.find(h => h.id === selectedHeadId) || HEAD_PILLARS[0];
  const coursesForHead = COURSES.filter(c => c.headId === selectedHeadId);

  // If coursesForHead is empty for some heads, we provide a structured curriculum preview
  const userProgress = storageService.getProgress(user.id);

  return (
    <div className="w-full min-h-screen bg-[#07090E] text-slate-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <button
                onClick={onBackToDashboard}
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
              </button>
              <span className="text-slate-600">/</span>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                Full Curriculum Library
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              The Ten Pillars Curriculum
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Deep, structured book-style lessons designed for sequential mastery: Read, Understand, Practice, Apply, and Reflect.
            </p>
          </div>
        </div>

        {/* 10-Head Selector Bar (Horizontal scrollable or grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {HEAD_PILLARS.map((head) => {
            const isSelected = head.id === selectedHeadId;
            return (
              <button
                key={head.id}
                onClick={() => setSelectedHeadId(head.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-violet-950/40 border-violet-500/80 shadow-md ring-1 ring-violet-500/50'
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    HEAD {head.number.toString().padStart(2, '0')}
                  </span>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: head.accentColor }} />
                </div>
                <div className="font-semibold text-xs text-white truncate mt-1">
                  {head.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Head Deep-Dive Banner */}
        <div className="p-6 rounded-2xl bg-[#0C101A] border border-white/10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
            <div>
              <span className="text-xs font-mono font-semibold" style={{ color: selectedHead.accentColor }}>
                HEAD {selectedHead.number.toString().padStart(2, '0')} · {selectedHead.romanNumeral}
              </span>
              <h2 className="text-2xl font-bold text-white mt-0.5">{selectedHead.name}</h2>
              <p className="text-xs text-slate-400 mt-1">{selectedHead.tagline}</p>
            </div>
            <div className="flex flex-wrap gap-1.5 max-w-md">
              {selectedHead.focusAreas.map((f, i) => (
                <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-slate-300 font-mono">
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
              <strong className="text-emerald-400 block font-mono text-[10px]">LIGHT</strong>
              <span className="text-slate-300 text-[11px]">{selectedHead.light}</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20">
              <strong className="text-amber-400 block font-mono text-[10px]">SHADOW</strong>
              <span className="text-slate-300 text-[11px]">{selectedHead.shadow}</span>
            </div>
            <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
              <strong className="text-cyan-400 block font-mono text-[10px]">SELF-CORRECTION</strong>
              <span className="text-slate-300 text-[11px]">{selectedHead.selfCorrection}</span>
            </div>
          </div>
        </div>

        {/* Courses & Chapters for this Head */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>Structured Courses & Modules</span>
          </h3>

          {coursesForHead.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center space-y-3">
              <p className="text-slate-400 text-sm">
                Advanced chapters for <strong className="text-white">{selectedHead.name}</strong> are currently in peer review by the Dasasurya curriculum team.
              </p>
              <button
                onClick={() => setSelectedHeadId('head-01-knowledge-logic')}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-xs font-medium text-white transition-colors"
              >
                Explore Head 01 (Logic & First Principles)
              </button>
            </div>
          ) : (
            coursesForHead.map((course) => (
              <div key={course.id} className="p-6 rounded-2xl bg-[#0C101A] border border-white/10 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span className="text-cyan-400 font-semibold">{course.level} Tier</span>
                    <span>·</span>
                    <span>{course.modules.length} Module{course.modules.length > 1 ? 's' : ''}</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mt-1">{course.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{course.subtitle}</p>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{course.description}</p>
                </div>

                <div className="space-y-4">
                  {course.modules.map((mod) => (
                    <div key={mod.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-semibold text-white">{mod.title}</h5>
                        <span className="text-xs font-mono text-slate-500">{mod.chapters.length} Chapter{mod.chapters.length > 1 ? 's' : ''}</span>
                      </div>
                      <p className="text-xs text-slate-400">{mod.description}</p>

                      <div className="space-y-2 pt-2">
                        {mod.chapters.map((chap) => {
                          const chapProgress = userProgress.chapterProgress[chap.id];
                          const isDone = chapProgress?.isCompleted;
                          const percent = chapProgress?.readingProgress || 0;

                          return (
                            <div
                              key={chap.id}
                              onClick={() => onSelectChapter(chap.id)}
                              className="p-3 rounded-lg bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/15 cursor-pointer transition-all flex items-center justify-between group"
                            >
                              <div className="space-y-1 pr-4">
                                <div className="text-xs font-medium text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                                  <span>{chap.title}</span>
                                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                                </div>
                                <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                                  <span>{chap.estimatedMinutes} min read</span>
                                  <span>·</span>
                                  <span>{chap.sections.length} Sections</span>
                                  <span>·</span>
                                  <span>{percent}% Read</span>
                                </div>
                              </div>

                              <button
                                className="px-3 py-1.5 rounded-lg bg-white/5 group-hover:bg-violet-600 text-xs text-slate-300 group-hover:text-white font-medium transition-colors flex items-center gap-1 shrink-0"
                              >
                                <span>Read</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
