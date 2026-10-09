import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { ParentalConsentRecord, UserAccount, UserProfile } from '../../types';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Clock, 
  Smile, 
  Check, 
  AlertCircle, 
  BookOpen, 
  Heart, 
  ArrowLeft,
  KeyRound,
  Eye,
  Trash2
} from 'lucide-react';

interface ParentalControlsDashboardProps {
  user: UserAccount;
  profile: UserProfile | null;
  onUpdateUser: (updatedUser: UserAccount) => void;
  onAccountDeleted: () => void;
  onBackToDashboard: () => void;
}

export const ParentalControlsDashboard: React.FC<ParentalControlsDashboardProps> = ({
  user,
  profile,
  onUpdateUser,
  onAccountDeleted,
  onBackToDashboard,
}) => {
  const parentalConsent = user.parentalConsent || {
    required: user.isUnder12,
    authorized: !user.isUnder12,
    maxDailyMinutes: 30,
    allowedFeatures: {
      externalLinks: false,
      publicSharing: false,
      advancedChakra: false,
      unguidedChat: false,
    },
  };

  const [authorized, setAuthorized] = useState(parentalConsent.authorized);
  const [parentName, setParentName] = useState(parentalConsent.parentName || '');
  const [parentContact, setParentContact] = useState(parentalConsent.parentContact || '');
  const [maxDailyMinutes, setMaxDailyMinutes] = useState(parentalConsent.maxDailyMinutes);
  const [allowedFeatures, setAllowedFeatures] = useState(parentalConsent.allowedFeatures);
  const [passcodePin, setPasscodePin] = useState(parentalConsent.passcodePin || '');
  
  // PIN verification state to unlock parental settings
  const [pinInput, setPinInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(!parentalConsent.passcodePin);
  const [pinError, setPinError] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Child statistics (educational milestones ONLY, private journals NOT exposed)
  const progress = storageService.getProgress(user.id);
  const completedChaptersCount = Object.values(progress.chapterProgress).filter(p => p.isCompleted).length;
  const totalMinutes = progress.totalReadingMinutes || 0;

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === parentalConsent.passcodePin) {
      setIsUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSaveControls = () => {
    const updatedConsent: ParentalConsentRecord = {
      required: user.isUnder12,
      authorized,
      parentName: parentName || undefined,
      parentContact: parentContact || undefined,
      authorizedAt: authorized ? (parentalConsent.authorizedAt || new Date().toISOString()) : undefined,
      consentMethod: 'parental_pin',
      passcodePin: passcodePin || undefined,
      maxDailyMinutes,
      allowedFeatures,
    };

    storageService.updateParentalConsent(user.id, updatedConsent);

    const updatedUser = {
      ...user,
      parentalConsent: updatedConsent,
    };
    onUpdateUser(updatedUser);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const toggleFeature = (key: keyof ParentalConsentRecord['allowedFeatures']) => {
    setAllowedFeatures(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="w-full min-h-screen bg-[#07090E] text-slate-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
                PARENT & GUARDIAN SUPERVISION CONSOLE
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-mono text-emerald-400">Child Safety Tier Active</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <ShieldCheck className="w-7 h-7 text-amber-400" />
              <span>Parental Controls & Child Safety</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Configurable safeguards for <strong className="text-white">{user.fullName}</strong> (Age {user.age}). Supervise study limits, grant authorization, and protect privacy.
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

        {/* PIN Security Check if PIN is set */}
        {!isUnlocked && parentalConsent.passcodePin && (
          <div className="p-8 rounded-2xl bg-[#0C101A] border border-white/10 space-y-4 max-w-md mx-auto shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Enter Parental Passcode PIN</h3>
            <p className="text-xs text-slate-400">
              Parental controls are protected by a 4-digit PIN to prevent unauthorized alterations.
            </p>

            {pinError && (
              <div className="p-2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                Incorrect PIN. Please re-enter.
              </div>
            )}

            <form onSubmit={handleUnlockPin} className="space-y-3">
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                placeholder="••••"
                className="w-32 mx-auto p-2.5 bg-black/60 border border-white/10 rounded-lg text-center text-lg tracking-widest text-white focus:outline-none focus:border-amber-400 font-mono"
              />
              <button
                type="submit"
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition-colors"
              >
                Unlock Parental Controls
              </button>
            </form>
          </div>
        )}

        {isUnlocked && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {saveSuccess && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Parental controls and permissions updated successfully.</span>
              </div>
            )}

            {/* Child Educational Supervision Summary (NO private journals exposed) */}
            <div className="p-6 rounded-2xl bg-[#0C101A] border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2">
                  <Smile className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Supervised Learning Summary</h3>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">Educational Milestones Only</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Study Time Logged</span>
                  <div className="text-lg font-bold text-white font-mono">{totalMinutes} Minutes</div>
                  <p className="text-[10px] text-slate-400">Total verified learning duration</p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Completed Lessons</span>
                  <div className="text-lg font-bold text-white font-mono">{completedChaptersCount} Lessons</div>
                  <p className="text-[10px] text-slate-400">Curriculum milestones reached</p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Child Safety Status</span>
                  <div className="text-lg font-bold text-emerald-400 font-mono">
                    {authorized ? 'Authorized' : 'Pending Parent Pass'}
                  </div>
                  <p className="text-[10px] text-slate-400">Feature gate strictly enforced</p>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                * Note: To respect the child's psychological boundaries and encourage genuine self-reflection, private voluntary wellness reflections and notes are kept private and isolated from supervisory dashboards.
              </p>
            </div>

            {/* Parent Guardian Details & Authorization Switch */}
            <div className="p-6 rounded-2xl bg-[#0C101A] border border-white/10 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <h3 className="text-sm font-bold text-white">Guardian Credentials & Authorization Status</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-300 font-medium">Grant Account Authorization:</span>
                  <button
                    type="button"
                    onClick={() => setAuthorized(!authorized)}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                      authorized ? 'bg-emerald-600' : 'bg-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      authorized ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Parent / Guardian Full Name</label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={e => setParentName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Parent Contact (Email / Phone)</label>
                  <input
                    type="text"
                    value={parentContact}
                    onChange={e => setParentContact(e.target.value)}
                    placeholder="guardian@example.com"
                    className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Permitted Features & Study Limits */}
            <div className="p-6 rounded-2xl bg-[#0C101A] border border-white/10 space-y-5 shadow-xl">
              <div className="border-b border-white/[0.08] pb-3">
                <h3 className="text-sm font-bold text-white">Daily Limits & Safety Restrictions</h3>
                <p className="text-xs text-slate-400">Customize what interactions are permitted for this learner.</p>
              </div>

              {/* Daily Study Minutes Limit */}
              <div className="space-y-2 text-xs">
                <label className="block text-slate-300 font-medium">
                  Maximum Daily Study Duration: <strong className="text-cyan-400 font-mono">{maxDailyMinutes} Minutes</strong>
                </label>
                <div className="flex gap-2">
                  {[15, 30, 45, 60].map(mins => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setMaxDailyMinutes(mins)}
                      className={`px-3 py-1.5 rounded-lg border font-mono text-xs ${
                        maxDailyMinutes === mins
                          ? 'bg-cyan-950 text-cyan-300 border-cyan-500'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white">External Web References & Links</span>
                    <p className="text-[11px] text-slate-400">Allow reading lessons referencing external research citations.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowedFeatures.externalLinks}
                    onChange={() => toggleFeature('externalLinks')}
                    className="w-4 h-4 accent-violet-600 rounded"
                  />
                </div>

                <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white">Public Sharing & Profile Exposure</span>
                    <p className="text-[11px] text-slate-400">Always disabled by default for children under 12.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowedFeatures.publicSharing}
                    onChange={() => toggleFeature('publicSharing')}
                    className="w-4 h-4 accent-violet-600 rounded"
                  />
                </div>

                <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white">Advanced Chakra Contemplation</span>
                    <p className="text-[11px] text-slate-400">When disabled, child receives only simplified gentle nature relaxation.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowedFeatures.advancedChakra}
                    onChange={() => toggleFeature('advancedChakra')}
                    className="w-4 h-4 accent-violet-600 rounded"
                  />
                </div>
              </div>

              {/* 4-digit Passcode PIN Setup */}
              <div className="pt-2 border-t border-white/[0.08] space-y-2 text-xs">
                <label className="block text-slate-300 font-medium">
                  Parent Security Passcode PIN (4 Digits)
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={passcodePin}
                  onChange={e => setPasscodePin(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="e.g. 8492"
                  className="w-32 p-2 bg-black/40 border border-white/10 rounded-lg text-white font-mono text-center tracking-widest text-xs"
                />
                <p className="text-[11px] text-slate-500">
                  Protects this dashboard from being modified by the child.
                </p>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={handleSaveControls}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition-colors shadow-md"
                >
                  Save & Apply Safety Policies
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
