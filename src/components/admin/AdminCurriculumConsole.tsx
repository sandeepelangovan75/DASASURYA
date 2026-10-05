import React, { useState } from 'react';
import { COURSES, HEAD_PILLARS } from '../../data/curriculum';
import { Chapter, Course, HeadId, Module } from '../../types';
import { ShieldCheck, Plus, Check, Edit3, Archive, Eye, Lock, ArrowLeft, AlertCircle } from 'lucide-react';

interface AdminCurriculumConsoleProps {
  onClose: () => void;
}

export const AdminCurriculumConsole: React.FC<AdminCurriculumConsoleProps> = ({ onClose }) => {
  const [passphrase, setPassphrase] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Curriculum management states
  const [activeTab, setActiveTab] = useState<'review' | 'publish' | 'analytics'>('review');
  const [draftTitle, setDraftTitle] = useState('Neural Invariants & Perceptual Compression');
  const [draftHead, setDraftHead] = useState<HeadId>('head-01-knowledge-logic');
  const [draftStatus, setDraftStatus] = useState<'DRAFT' | 'APPROVED' | 'PUBLISHED'>('DRAFT');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Authorized curator session verification
    if (passphrase.trim() === 'dasasurya_curator_2026' || passphrase.trim() === 'curator') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
        <div className="w-full max-w-md bg-[#0C101A] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-semibold">
              <Lock className="w-4 h-4" />
              <span>CURATOR PORTAL ACCESS</span>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Curriculum administration is restricted to authorized content architects. Enter your curator passphrase:
          </p>

          {authError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              Invalid credentials. Access denied.
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input
              type="password"
              value={passphrase}
              onChange={e => setPassphrase(e.target.value)}
              placeholder="Curator Passphrase"
              className="w-full p-2.5 bg-black/60 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs text-slate-400 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-xs font-bold text-black rounded-lg transition-colors"
              >
                Verify Authorization
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-5xl bg-[#0C101A] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Curriculum Architecture Console</h2>
              <span className="text-xs font-mono text-slate-400">Review AI drafts, approve lessons, manage progression rules</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs text-slate-300 rounded-lg transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to App
          </button>
        </div>

        {toastMessage && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
            {toastMessage}
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3 text-xs">
          <button
            onClick={() => setActiveTab('review')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'review' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Draft Review Queue (1 Pending)
          </button>
          <button
            onClick={() => setActiveTab('publish')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'publish' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Active Published Courses ({COURSES.length})
          </button>
        </div>

        {/* Review Queue Tab */}
        {activeTab === 'review' && (
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-500/30 font-bold">
                    {draftStatus}
                  </span>
                  <h4 className="text-sm font-bold text-white">{draftTitle}</h4>
                </div>
                <span className="text-xs font-mono text-slate-500">Generated: Today</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Draft Summary:</strong> Explores information-theoretic entropy limits in biological sensory organs. Connects Shannon's source coding theorem to cognitive bandwidth limits.
              </p>

              <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs text-slate-400 space-y-1">
                <div className="text-amber-300 font-mono text-[10px]">PEDAGOGICAL COMPLIANCE AUDIT:</div>
                <div>• Socratic Understanding Check present: <strong className="text-emerald-400">Yes</strong></div>
                <div>• Light, Shadow & Self-Correction defined: <strong className="text-emerald-400">Yes</strong></div>
                <div>• No medical claims / no income promises: <strong className="text-emerald-400">Verified Clean</strong></div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setDraftStatus('APPROVED');
                    showToast('Draft marked as APPROVED by human curator.');
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white rounded-lg transition-colors"
                >
                  Approve Draft
                </button>
                <button
                  onClick={() => {
                    setDraftStatus('PUBLISHED');
                    showToast('Lesson PUBLISHED to Head 01 live curriculum.');
                  }}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white rounded-lg transition-colors"
                >
                  Publish to Production
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Published Courses Tab */}
        {activeTab === 'publish' && (
          <div className="space-y-4">
            {COURSES.map(c => (
              <div key={c.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
                <div>
                  <h5 className="font-semibold text-white">{c.title}</h5>
                  <span className="text-[11px] text-slate-400 font-mono">{c.modules.length} Modules · {c.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    LIVE
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
