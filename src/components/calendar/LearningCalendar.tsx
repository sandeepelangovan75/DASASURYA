import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { CalendarEvent, UserAccount } from '../../types';
import { Calendar as CalendarIcon, CheckCircle2, Circle, Clock, Plus, RotateCcw, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface LearningCalendarProps {
  user: UserAccount;
  onOpenChapter: (chapterId: string) => void;
  onBackToDashboard: () => void;
}

export const LearningCalendar: React.FC<LearningCalendarProps> = ({
  user,
  onOpenChapter,
  onBackToDashboard,
}) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'learning' | 'practice' | 'review' | 'reflection' | 'vitality'>('learning');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('18:00');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setEvents(storageService.getCalendarEvents(user.id));
  }, [user.id]);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const event: CalendarEvent = {
      id: 'cal_' + Date.now(),
      userId: user.id,
      title: newTitle,
      type: newType,
      date: newDate,
      time: newTime,
      isCompleted: false,
    };

    storageService.createCalendarEvent(event);
    setEvents([...events, event]);
    setNewTitle('');
    setShowAddModal(false);
  };

  const handleToggleComplete = (eventId: string, current: boolean) => {
    storageService.updateCalendarEvent(eventId, { isCompleted: !current });
    setEvents(events.map(ev => ev.id === eventId ? { ...ev, isCompleted: !current } : ev));
    if (!current) {
      storageService.addCredits(user.id, 15, 'Completed Scheduled Study Session');
    }
  };

  const handleReschedule = (eventId: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    storageService.updateCalendarEvent(eventId, {
      date: tomorrowStr,
      isMissed: false,
    });

    setEvents(events.map(ev => ev.id === eventId ? { ...ev, date: tomorrowStr, isMissed: false } : ev));
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full min-h-screen bg-[#07090E] text-slate-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase font-semibold">
              <CalendarIcon className="w-4 h-4" />
              <span>Integrated Learning Schedule</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Learning Calendar
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Schedule sessions, reviews, and vitality practices. Missed days are calmly rescheduled without punitive shaming.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Session</span>
            </button>
            <button
              onClick={onBackToDashboard}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs text-slate-300 rounded-lg transition-colors"
            >
              ← Dashboard
            </button>
          </div>
        </div>

        {/* Schedule Creation Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#0C101A] border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <h3 className="text-base font-semibold text-white">Schedule Learning Session</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Session Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Read Chapter 1 & Practice Axiomatic Reduction"
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Type</label>
                    <select
                      value={newType}
                      onChange={e => setNewType(e.target.value as any)}
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                    >
                      <option value="learning">Reading / Lesson</option>
                      <option value="practice">Practice Exercise</option>
                      <option value="review">Spaced Review</option>
                      <option value="reflection">Socratic Reflection</option>
                      <option value="vitality">Vitality Routine</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onChange={e => setNewDate(e.target.value)}
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Time (Optional)</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs text-slate-400 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white rounded-lg"
                  >
                    Add to Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Scheduled Sessions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
              Upcoming & Past Sessions ({events.length})
            </h3>
            <span className="text-xs text-slate-400 font-mono">Today: {today}</span>
          </div>

          {events.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center space-y-3">
              <p className="text-slate-400 text-sm">No scheduled sessions. Click "Schedule Session" to plan your week.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((ev) => {
                const isPast = ev.date < today && !ev.isCompleted;
                const isToday = ev.date === today;

                return (
                  <div
                    key={ev.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      ev.isCompleted
                        ? 'bg-emerald-950/15 border-emerald-500/20 text-slate-300'
                        : isPast
                        ? 'bg-amber-950/20 border-amber-500/30 text-white'
                        : isToday
                        ? 'bg-violet-950/30 border-violet-500/40 text-white'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleComplete(ev.id, ev.isCompleted)}
                        className="mt-0.5 text-slate-500 hover:text-white"
                        title="Toggle complete"
                      >
                        {ev.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-600 hover:text-cyan-400" />
                        )}
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase ${
                            ev.type === 'learning' ? 'bg-cyan-950 text-cyan-300' :
                            ev.type === 'practice' ? 'bg-violet-950 text-violet-300' :
                            ev.type === 'vitality' ? 'bg-emerald-950 text-emerald-300' :
                            'bg-amber-950 text-amber-300'
                          }`}>
                            {ev.type}
                          </span>
                          <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {ev.date} {ev.time && `· ${ev.time}`}
                          </span>
                        </div>

                        <h4 className={`text-sm font-semibold ${ev.isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                          {ev.title}
                        </h4>

                        {isPast && (
                          <p className="text-[11px] text-amber-300 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Life happens. Missed session preserved with zero penalty.</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {isPast && !ev.isCompleted && (
                        <button
                          onClick={() => handleReschedule(ev.id)}
                          className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium rounded-lg border border-amber-500/30 flex items-center gap-1 transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reschedule for Tomorrow</span>
                        </button>
                      )}

                      {ev.chapterId && (
                        <button
                          onClick={() => onOpenChapter(ev.chapterId!)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs text-cyan-300 rounded-lg transition-colors"
                        >
                          Open Lesson
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
