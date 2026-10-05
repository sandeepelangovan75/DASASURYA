import React, { useState, useEffect, useRef } from 'react';
import { COURSES, HEAD_PILLARS } from '../../data/curriculum';
import { storageService } from '../../services/storageService';
import { Chapter, HeadId, UserAccount, UserNote } from '../../types';
import { 
  Bookmark as BookmarkIcon, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Maximize2, 
  Minimize2, 
  Search, 
  Sliders, 
  Award,
  AlertTriangle,
  Lightbulb,
  Check,
  RotateCcw
} from 'lucide-react';

interface TextbookReaderProps {
  initialChapterId?: string;
  user: UserAccount;
  onOpenDasasuryaWithContext: (context: { question?: string; concept?: string; currentHead: string; codeSnippet?: string }) => void;
  onNavigateBack: () => void;
}

export const TextbookReader: React.FC<TextbookReaderProps> = ({
  initialChapterId,
  user,
  onOpenDasasuryaWithContext,
  onNavigateBack,
}) => {
  // Find Chapter, Course, and Head
  const [currentChapterId, setCurrentChapterId] = useState<string>(
    initialChapterId || 'chap-01-first-principles'
  );

  // Flattened chapters list for Prev / Next navigation
  const allChapters: { chapter: Chapter; courseTitle: string; moduleTitle: string }[] = [];
  COURSES.forEach(c => {
    c.modules.forEach(m => {
      m.chapters.forEach(chap => {
        allChapters.push({ chapter: chap, courseTitle: c.title, moduleTitle: m.title });
      });
    });
  });

  const currentIdx = allChapters.findIndex(c => c.chapter.id === currentChapterId);
  const activeItem = currentIdx !== -1 ? allChapters[currentIdx] : allChapters[0];
  const chapter = activeItem.chapter;

  const currentHead = HEAD_PILLARS.find(hp => hp.id === chapter.headId) || HEAD_PILLARS[0];

  // Reader UI States
  const [zenMode, setZenMode] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [colorTheme, setColorTheme] = useState<'midnight' | 'sepia' | 'obsidian'>('midnight');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notesDrawerOpen, setNotesDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Practice State
  const [practiceText, setPracticeText] = useState(chapter.practice.starterContent || '');
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);

  // Reflection State
  const [reflectionText, setReflectionText] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  // Note State
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [currentNoteText, setCurrentNoteText] = useState('');

  // Scroll Progress
  const contentRef = useRef<HTMLDivElement>(null);
  const [readPercent, setReadPercent] = useState(0);

  // Load chapter status
  useEffect(() => {
    if (!user) return;
    const progress = storageService.getProgress(user.id);
    const chapProgress = progress.chapterProgress[chapter.id];

    if (chapProgress) {
      setReadPercent(chapProgress.readingProgress || 0);
      setQuizSubmitted(chapProgress.quizCompleted || false);
      if (chapProgress.quizScore !== undefined) {
        setQuizScore(chapProgress.quizScore);
      }
      setPracticeSubmitted(chapProgress.practiceCompleted || false);
      if (chapProgress.practiceSubmission) {
        setPracticeText(chapProgress.practiceSubmission);
      }
      if (chapProgress.reflectionText) {
        setReflectionText(chapProgress.reflectionText);
        setReflectionSaved(true);
      }
    } else {
      setReadPercent(10);
      setQuizSubmitted(false);
      setQuizScore(null);
      setPracticeSubmitted(false);
      setPracticeText(chapter.practice.starterContent || '');
      setReflectionText('');
      setReflectionSaved(false);
    }

    setIsBookmarked(storageService.isBookmarked(user.id, chapter.id));

    // Load notes
    const allNotes = storageService.getNotes(user.id);
    setNotes(allNotes.filter(n => n.chapterId === chapter.id));

    // Scroll to top on chapter change
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [chapter.id, user]);

  // Handle scroll to calculate reading progress
  const handleScroll = () => {
    if (!contentRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    if (scrollHeight <= clientHeight) return;

    const totalScrollable = scrollHeight - clientHeight;
    const currentPercent = Math.min(100, Math.round((scrollTop / totalScrollable) * 100));

    if (currentPercent > readPercent) {
      setReadPercent(currentPercent);
      storageService.updateChapterReadingProgress(user.id, chapter.id, chapter.headId, currentPercent, 1);
    }
  };

  const handleToggleBookmark = () => {
    const newState = storageService.toggleBookmark(
      user.id,
      chapter.id,
      chapter.title,
      chapter.headId,
      currentHead.name
    );
    setIsBookmarked(newState);
  };

  const handleSelectQuizAnswer = (qId: string, optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [qId]: optionIdx });
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    chapter.quiz.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });

    setQuizSubmitted(true);
    setQuizScore(Math.round((score / chapter.quiz.length) * 100));
    storageService.recordQuizSubmission(user.id, chapter.id, score, chapter.quiz.length);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const handleSubmitPractice = () => {
    if (!practiceText.trim()) return;
    storageService.recordPracticeSubmission(user.id, chapter.id, practiceText);
    setPracticeSubmitted(true);
  };

  const handleSaveReflection = () => {
    if (!reflectionText.trim()) return;
    storageService.recordReflection(user.id, chapter.id, reflectionText);
    setReflectionSaved(true);
  };

  const handleAddNote = () => {
    if (!currentNoteText.trim()) return;
    const saved = storageService.saveNote({
      userId: user.id,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      headId: chapter.headId,
      title: `Reflection on Section ${notes.length + 1}`,
      content: currentNoteText,
    });
    setNotes([saved, ...notes]);
    setCurrentNoteText('');
  };

  const goToNextChapter = () => {
    if (currentIdx < allChapters.length - 1) {
      setCurrentChapterId(allChapters[currentIdx + 1].chapter.id);
    }
  };

  const goToPrevChapter = () => {
    if (currentIdx > 0) {
      setCurrentChapterId(allChapters[currentIdx - 1].chapter.id);
    }
  };

  // Color themes
  const themeClasses = {
    midnight: 'bg-[#07090E] text-slate-200',
    obsidian: 'bg-[#030407] text-slate-300',
    sepia: 'bg-[#171412] text-[#E8DEC8]',
  }[colorTheme];

  const proseThemeClasses = {
    midnight: 'text-slate-300 prose-invert',
    obsidian: 'text-slate-300 prose-invert',
    sepia: 'text-[#E8DEC8]',
  }[colorTheme];

  return (
    <div className={`w-full min-h-screen ${themeClasses} flex flex-col transition-colors duration-300`}>
      
      {/* Top Textbook Control Bar */}
      <header className="sticky top-0 z-30 h-14 bg-black/70 backdrop-blur-md border-b border-white/[0.08] px-4 flex items-center justify-between">
        
        {/* Left: Breadcrumbs & Back */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateBack}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title="Return to Dashboard"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 truncate max-w-md">
            <span className="text-cyan-400 font-semibold">{currentHead.name}</span>
            <span>/</span>
            <span className="truncate">{activeItem.moduleTitle}</span>
          </div>
        </div>

        {/* Center: Reading Progress Indicator */}
        <div className="flex items-center gap-3">
          <div className="w-32 sm:w-48 bg-black/40 h-2 rounded-full overflow-hidden border border-white/10 hidden md:block">
            <div
              className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${readPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono text-slate-400 tabular-nums">
            {readPercent}% read
          </span>
        </div>

        {/* Right: Controls (Zen, Sizing, Theme, Bookmark, Ask Dasasurya) */}
        <div className="flex items-center gap-2">
          
          {/* Ask Dasasurya about this chapter */}
          <button
            onClick={() => onOpenDasasuryaWithContext({
              concept: chapter.title,
              currentHead: currentHead.name,
              codeSnippet: chapter.sections.find(s => s.codeSnippet)?.codeSnippet?.code
            })}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors shadow-sm"
            title="Socratic inquiry on this chapter"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask Dasasurya</span>
          </button>

          {/* Bookmark Toggle */}
          <button
            onClick={handleToggleBookmark}
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked
                ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title={isBookmarked ? 'Bookmarked' : 'Add to bookmarks'}
          >
            <BookmarkIcon className="w-4 h-4 fill-current" />
          </button>

          {/* Notes Tray toggle */}
          <button
            onClick={() => setNotesDrawerOpen(!notesDrawerOpen)}
            className={`p-2 rounded-lg transition-colors ${
              notesDrawerOpen
                ? 'text-violet-400 bg-violet-500/10 border border-violet-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Chapter notes"
          >
            <FileText className="w-4 h-4" />
          </button>

          {/* Theme switcher */}
          <div className="hidden lg:flex items-center gap-1 p-0.5 rounded-lg bg-white/5 border border-white/5">
            <button
              onClick={() => setColorTheme('midnight')}
              className={`w-4 h-4 rounded-full bg-[#07090E] border ${colorTheme === 'midnight' ? 'border-cyan-400' : 'border-transparent'}`}
              title="Midnight dark mode"
            />
            <button
              onClick={() => setColorTheme('obsidian')}
              className={`w-4 h-4 rounded-full bg-[#030407] border ${colorTheme === 'obsidian' ? 'border-cyan-400' : 'border-transparent'}`}
              title="Obsidian black mode"
            />
            <button
              onClick={() => setColorTheme('sepia')}
              className={`w-4 h-4 rounded-full bg-[#171412] border ${colorTheme === 'sepia' ? 'border-amber-400' : 'border-transparent'}`}
              title="Warm Sepia mode"
            />
          </div>

          {/* Font size toggle */}
          <button
            onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
            className="p-1.5 text-xs font-serif font-bold text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
            title="Toggle text size"
          >
            {fontSize === 'normal' ? 'A+' : 'A-'}
          </button>

          {/* Zen mode toggle */}
          <button
            onClick={() => setZenMode(!zenMode)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
            title={zenMode ? 'Exit Zen Mode' : 'Distraction-Free Zen Mode'}
          >
            {zenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Reading Canvas */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar: Table of Contents & Curriculum Navigator (hidden in Zen mode) */}
        {!zenMode && sidebarOpen && (
          <aside className="w-72 bg-[#0C101A]/60 border-r border-white/[0.06] hidden md:flex flex-col justify-between shrink-0 overflow-y-auto p-4 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>TABLE OF CONTENTS</span>
                <span>{allChapters.length} CHAPTERS</span>
              </div>

              {/* Course Chapter Index */}
              <div className="space-y-1">
                {allChapters.map((item, idx) => {
                  const isCurrent = item.chapter.id === chapter.id;
                  const itemProgress = storageService.getProgress(user.id).chapterProgress[item.chapter.id];
                  const isDone = itemProgress?.isCompleted;

                  return (
                    <button
                      key={item.chapter.id}
                      onClick={() => setCurrentChapterId(item.chapter.id)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-start justify-between ${
                        isCurrent
                          ? 'bg-violet-950/60 text-white font-medium border border-violet-500/40 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <div className="space-y-0.5 truncate pr-2">
                        <div className="text-[10px] font-mono text-slate-500">
                          Chapter {idx + 1}
                        </div>
                        <div className="truncate font-sans">{item.chapter.title}</div>
                      </div>
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <span className="text-[10px] font-mono text-slate-600 shrink-0">
                          {item.chapter.estimatedMinutes}m
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Section Anchors for Active Chapter */}
            <div className="pt-4 border-t border-white/[0.06] space-y-2">
              <span className="text-[11px] font-mono text-slate-500 uppercase">Current Chapter Sections</span>
              <ul className="space-y-1 text-xs text-slate-400">
                {chapter.sections.map((sec, i) => (
                  <li key={sec.id} className="truncate hover:text-cyan-300">
                    <a href={`#${sec.id}`}>§ {i + 1}. {sec.title}</a>
                  </li>
                ))}
                <li className="hover:text-emerald-400"><a href="#light-shadow">Light, Shadow & Balance</a></li>
                <li className="hover:text-amber-400"><a href="#understanding-check">Understanding Check</a></li>
                <li className="hover:text-cyan-400"><a href="#practice-exercise">Practice Activity</a></li>
                <li className="hover:text-violet-400"><a href="#reflection-prompt">Reflection Journal</a></li>
              </ul>
            </div>
          </aside>
        )}

        {/* Center: Textbook Content Stream */}
        <main 
          ref={contentRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-10 scroll-smooth"
        >
          <article className={`mx-auto ${zenMode ? 'max-w-3xl' : 'max-w-4xl'} space-y-12`}>
            
            {/* Chapter Header */}
            <header className="space-y-4 border-b border-white/[0.08] pb-8">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <span>HEAD {currentHead.number.toString().padStart(2, '0')}</span>
                <span>·</span>
                <span>{currentHead.name}</span>
                <span>·</span>
                <span>{chapter.estimatedMinutes} MIN READ</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
                {chapter.title}
              </h1>

              {/* Learning Objectives Box */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <span className="text-xs font-mono text-slate-400 font-semibold tracking-wide">
                  LEARNING OBJECTIVES
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {chapter.learningObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">✦</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </header>

            {/* Chapter Body Sections */}
            <div className={`space-y-12 font-serif-reading ${fontSize === 'large' ? 'text-lg leading-relaxed' : 'text-base leading-relaxed'} ${proseThemeClasses}`}>
              {chapter.sections.map((section, sIdx) => (
                <section key={section.id} id={section.id} className="space-y-4">
                  
                  <h2 className="text-2xl font-serif font-semibold text-white tracking-tight pt-4">
                    § {sIdx + 1}. {section.title}
                  </h2>

                  {/* Body Text */}
                  <div className="whitespace-pre-line text-slate-300 font-serif-reading leading-relaxed">
                    {section.content}
                  </div>

                  {/* Key Definition Callout */}
                  {section.keyDefinition && (
                    <div className="my-6 p-4 rounded-xl bg-violet-950/20 border-l-4 border-violet-500 font-sans space-y-1">
                      <div className="text-xs font-mono font-bold text-violet-300 uppercase">
                        DEFINITION · {section.keyDefinition.term}
                      </div>
                      <p className="text-xs text-slate-200 leading-normal">
                        {section.keyDefinition.definition}
                      </p>
                    </div>
                  )}

                  {/* Analogy Callout */}
                  {section.analogy && (
                    <div className="my-6 p-4 rounded-xl bg-amber-950/20 border-l-4 border-amber-500 font-sans space-y-1">
                      <div className="text-xs font-mono font-bold text-amber-300 uppercase flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>CONCEPTUAL ANALOGY</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-normal">
                        {section.analogy}
                      </p>
                    </div>
                  )}

                  {/* Common Mistakes Warning */}
                  {section.commonMistakes && section.commonMistakes.length > 0 && (
                    <div className="my-6 p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 font-sans space-y-2">
                      <div className="text-xs font-mono font-bold text-rose-300 uppercase flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>COMMON COGNITIVE TRAPS</span>
                      </div>
                      <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                        {section.commonMistakes.map((cm, i) => (
                          <li key={i}>{cm}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Code Snippet Box */}
                  {section.codeSnippet && (
                    <div className="my-6 rounded-xl overflow-hidden border border-white/10 bg-black/60 font-mono text-xs">
                      <div className="px-4 py-2 bg-slate-900/80 border-b border-white/5 flex items-center justify-between text-slate-400">
                        <span>{section.codeSnippet.language}</span>
                        <button
                          onClick={() => onOpenDasasuryaWithContext({
                            question: `Diagnose and walk me through this ${section.codeSnippet!.language} example from ${section.title}`,
                            codeSnippet: section.codeSnippet!.code,
                            currentHead: currentHead.name
                          })}
                          className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" /> Diagnose with Dasasurya
                        </button>
                      </div>
                      <pre className="p-4 text-emerald-300 overflow-x-auto text-[13px] leading-relaxed">
                        {section.codeSnippet.code}
                      </pre>
                      <div className="p-3 bg-slate-950 border-t border-white/5 font-sans text-xs text-slate-400">
                        {section.codeSnippet.explanation}
                      </div>
                    </div>
                  )}

                </section>
              ))}
            </div>

            {/* LIGHT, SHADOW & SELF-CORRECTION PILLAR INTEGRATION */}
            <section id="light-shadow" className="p-6 rounded-2xl bg-[#0C101A] border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <span className="text-xs font-mono text-amber-400 font-semibold tracking-wide">
                  PILLAR SYNTHESIS · LIGHT & SHADOW DYNAMICS
                </span>
                <span className="text-xs font-mono text-slate-500">{currentHead.name}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                  <div className="font-semibold text-emerald-400 uppercase font-mono text-[10px]">The Light (Empowerment)</div>
                  <p className="text-slate-200 leading-relaxed">{chapter.pillarAlignment.light}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-1">
                  <div className="font-semibold text-amber-400 uppercase font-mono text-[10px]">The Shadow (Blind Spot)</div>
                  <p className="text-slate-200 leading-relaxed">{chapter.pillarAlignment.shadow}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-1">
                  <div className="font-semibold text-cyan-400 uppercase font-mono text-[10px]">Self-Correction (Equilibrium)</div>
                  <p className="text-slate-200 leading-relaxed">{chapter.pillarAlignment.selfCorrection}</p>
                </div>
              </div>
            </section>

            {/* Summary & Takeaways */}
            <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
                Summary & Key Takeaways
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300 list-disc list-inside">
                {chapter.summary.map((sumItem, i) => (
                  <li key={i} className="leading-relaxed">{sumItem}</li>
                ))}
              </ul>
            </section>

            {/* UNDERSTANDING CHECK (Interactive Quiz) */}
            <section id="understanding-check" className="p-6 sm:p-8 rounded-2xl bg-[#0C101A] border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Understanding Check</h3>
                  <p className="text-xs text-slate-400">Verify your grasp of foundational concepts before proceeding.</p>
                </div>
                {quizSubmitted && quizScore !== null && (
                  <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                    quizScore >= 70 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    Score: {quizScore}%
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {chapter.quiz.map((q, qIndex) => {
                  const userAnswer = selectedAnswers[q.id];
                  const isCorrect = userAnswer === q.correctIndex;

                  return (
                    <div key={q.id} className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <h4 className="text-xs sm:text-sm font-semibold text-white">
                        {qIndex + 1}. {q.question}
                      </h4>

                      <div className="space-y-2">
                        {q.options.map((opt, optIndex) => {
                          let optClasses = 'border-white/10 hover:border-white/20 bg-black/20 text-slate-300';
                          if (userAnswer === optIndex) {
                            optClasses = 'border-violet-500 bg-violet-950/40 text-white font-medium';
                          }
                          if (quizSubmitted) {
                            if (optIndex === q.correctIndex) {
                              optClasses = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-medium';
                            } else if (userAnswer === optIndex) {
                              optClasses = 'border-rose-500 bg-rose-950/40 text-rose-200';
                            }
                          }

                          return (
                            <button
                              key={optIndex}
                              disabled={quizSubmitted}
                              onClick={() => handleSelectQuizAnswer(q.id, optIndex)}
                              className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-start gap-3 ${optClasses}`}
                            >
                              <span className="w-5 h-5 rounded-md border border-white/20 flex items-center justify-center font-mono text-[10px] shrink-0">
                                {String.fromCharCode(65 + optIndex)}
                              </span>
                              <span className="leading-snug">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className={`p-3 rounded-lg text-xs leading-relaxed ${
                          isCorrect ? 'bg-emerald-950/20 text-emerald-300 border border-emerald-500/20' : 'bg-rose-950/20 text-rose-300 border border-rose-500/20'
                        }`}>
                          <div className="font-semibold mb-0.5">
                            {isCorrect ? '✓ Correct Understanding' : '✗ Re-examine the Concept'}
                          </div>
                          <div>{q.explanation}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                {!quizSubmitted ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(selectedAnswers).length < chapter.quiz.length}
                    className="px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-xs font-semibold transition-colors"
                  >
                    Submit Understanding Check
                  </button>
                ) : (
                  <button
                    onClick={handleResetQuiz}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Retake Questions
                  </button>
                )}

                <button
                  onClick={() => onOpenDasasuryaWithContext({
                    question: 'Can you ask me a Socratic level 1 question to test my understanding of this chapter?',
                    concept: chapter.title,
                    currentHead: currentHead.name
                  })}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Socratic Deep Probe
                </button>
              </div>
            </section>

            {/* PRACTICE ACTIVITY */}
            <section id="practice-exercise" className="p-6 sm:p-8 rounded-2xl bg-[#0C101A] border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">Practice Activity</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{chapter.practice.title}</h3>
                </div>
                {practiceSubmitted && (
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Completed
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {chapter.practice.prompt}
              </p>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Your Solution & Reasoning:
                </label>
                <textarea
                  rows={4}
                  value={practiceText}
                  onChange={(e) => setPracticeText(e.target.value)}
                  placeholder="Record your step-by-step breakdown..."
                  className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleSubmitPractice}
                  className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors"
                >
                  {practiceSubmitted ? 'Update Practice Submission' : 'Submit Practice Exercise (+35 XP)'}
                </button>

                {practiceSubmitted && (
                  <div className="text-xs text-slate-400">
                    <span className="text-emerald-400 font-semibold">Saved.</span> Solution reference unlocked.
                  </div>
                )}
              </div>

              {practiceSubmitted && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2 mt-4">
                  <div className="text-xs font-semibold text-amber-300 font-mono">Suggested Master Solution:</div>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-line">
                    {chapter.practice.suggestedSolution}
                  </p>
                </div>
              )}
            </section>

            {/* REAL-WORLD APPLICATION */}
            <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <span className="text-xs font-mono text-violet-400 uppercase">Real-World Application Challenge</span>
              <h4 className="text-sm font-semibold text-white">{chapter.realWorldApplication.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {chapter.realWorldApplication.scenario}
              </p>
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs text-slate-300 space-y-1">
                <strong className="text-cyan-300">Deliverable Prompt:</strong>
                <p>{chapter.realWorldApplication.deliverablePrompt}</p>
              </div>
            </section>

            {/* REFLECTION PROMPT */}
            <section id="reflection-prompt" className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0C101A] to-[#141224] border border-white/10 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
                  Socratic Reflection Journal
                </h3>
              </div>

              <blockquote className="p-4 rounded-xl bg-violet-950/20 border-l-4 border-violet-400 font-serif italic text-sm text-slate-200">
                "{chapter.reflectionPrompt}"
              </blockquote>

              <textarea
                rows={3}
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="Write your honest internal reflection. This is stored directly in your personal life architecture notes..."
                className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-400 transition-colors"
              />

              <div className="flex justify-between items-center">
                <button
                  onClick={handleSaveReflection}
                  className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors"
                >
                  {reflectionSaved ? 'Reflection Updated' : 'Record Reflection (+20 XP)'}
                </button>
                {reflectionSaved && (
                  <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Journaled to Profile
                  </span>
                )}
              </div>
            </section>

            {/* Chapter Navigation Footer (Prev / Next) */}
            <nav className="flex items-center justify-between pt-8 border-t border-white/[0.08]">
              <button
                onClick={goToPrevChapter}
                disabled={currentIdx === 0}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Previous Chapter
              </button>

              <button
                onClick={goToNextChapter}
                disabled={currentIdx === allChapters.length - 1}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-30 text-xs font-semibold text-white transition-all shadow-md flex items-center gap-1.5"
              >
                <span>Next Chapter</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </nav>

          </article>
        </main>

        {/* Right Drawer: Personal Notes for this Chapter */}
        {notesDrawerOpen && (
          <aside className="w-80 bg-[#0C101A] border-l border-white/10 flex flex-col justify-between shrink-0 p-4 space-y-4 animate-in slide-in-from-right duration-200">
            <div className="space-y-4 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <FileText className="w-3.5 h-3.5 text-violet-400" />
                  <span>Chapter Notes</span>
                </div>
                <button
                  onClick={() => setNotesDrawerOpen(false)}
                  className="text-slate-500 hover:text-slate-300 text-xs font-mono"
                >
                  ✕
                </button>
              </div>

              {/* Add Note Input */}
              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={currentNoteText}
                  onChange={(e) => setCurrentNoteText(e.target.value)}
                  placeholder="Capture an insight, theorem, or question..."
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!currentNoteText.trim()}
                  className="w-full py-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  Save Note
                </button>
              </div>

              {/* Existing Notes List */}
              <div className="space-y-3 pt-2">
                <div className="text-[11px] font-mono text-slate-500">SAVED NOTES ({notes.length})</div>
                {notes.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No notes yet for this chapter.</p>
                ) : (
                  notes.map((n) => (
                    <div key={n.id} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>{new Date(n.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <button
                          onClick={() => {
                            storageService.deleteNote(n.id);
                            setNotes(notes.filter(item => item.id !== n.id));
                          }}
                          className="hover:text-rose-400"
                        >
                          delete
                        </button>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">{n.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        )}

      </div>
    </div>
  );
};
