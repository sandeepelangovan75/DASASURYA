import React from 'react';
import { storageService } from '../../services/storageService';
import { UserAccount } from '../../types';
import { Award, CheckCircle2, History, ShieldCheck, Sparkles, Star } from 'lucide-react';

interface SanCreditsViewProps {
  user: UserAccount;
  onBackToDashboard: () => void;
}

export const SanCreditsView: React.FC<SanCreditsViewProps> = ({
  user,
  onBackToDashboard,
}) => {
  const { total, history } = storageService.getCredits(user.id);

  const achievements = [
    { title: 'The Socratic Scalpel', desc: 'Deconstructed first principles in Head 01', earned: total >= 50, icon: '✦' },
    { title: 'Consistent Architect', desc: 'Logged 3 consecutive study sessions', earned: total >= 120, icon: '★' },
    { title: 'Reflective Sovereign', desc: 'Recorded 3 personal chapter reflections', earned: total >= 200, icon: '❖' },
    { title: 'Multi-Perspective Mind', desc: 'Executed 1 full Ravana Mind deconstruction', earned: total >= 300, icon: '▲' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#07090E] text-slate-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Ethical Progression System</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              SAN Credits & Milestones
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              An encouraging progression model devoid of manipulative timers, loot boxes, or punitive streaks.
            </p>
          </div>

          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs text-slate-300 rounded-lg transition-colors"
          >
            ← Return to Dashboard
          </button>
        </div>

        {/* Total Credits Display Banner */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-amber-950/30 via-[#0C101A] to-violet-950/30 border border-amber-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-mono text-amber-400 uppercase font-semibold">Accumulated Balance</span>
            <div className="text-4xl sm:text-5xl font-extrabold text-white font-mono tabular-nums flex items-center justify-center sm:justify-start gap-2">
              <span className="text-amber-400">✦</span>
              <span>{total}</span>
              <span className="text-base text-slate-400 font-sans font-normal">XP</span>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Earned solely through genuine intellectual effort: reading lessons, passing checks, and submitting reflection journals.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs text-slate-300 shrink-0">
            <div className="font-semibold text-amber-300 font-mono">EARNING RATES:</div>
            <div>• Passing Chapter Check: <strong className="text-white">+25 XP</strong></div>
            <div>• Submitting Practice: <strong className="text-white">+35 XP</strong></div>
            <div>• Journaling Reflection: <strong className="text-white">+20 XP</strong></div>
            <div>• Completing Study Session: <strong className="text-white">+15 XP</strong></div>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
            Mastery Milestone Badges
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((ach, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                  ach.earned
                    ? 'bg-amber-950/20 border-amber-500/40 text-white'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-500 opacity-60'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                  ach.earned ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-slate-600'
                }`}>
                  {ach.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{ach.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{ach.desc}</p>
                  <span className={`text-[10px] font-mono mt-1 block ${ach.earned ? 'text-amber-400' : 'text-slate-600'}`}>
                    {ach.earned ? '✓ Unlocked' : 'In Progress'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History Log */}
        <div className="p-6 rounded-2xl bg-[#0C101A] border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <History className="w-4 h-4 text-cyan-400" />
              <span>Credit Verification Log</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">{history.length} records</span>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {history.map((record) => (
              <div
                key={record.id}
                className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono"
              >
                <div className="space-y-0.5">
                  <span className="text-slate-300">{record.action}</span>
                  <div className="text-[10px] text-slate-500">
                    {new Date(record.timestamp).toLocaleString()}
                  </div>
                </div>
                <span className="text-amber-400 font-bold">+{record.amount} XP</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
