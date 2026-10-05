import React, { useState } from 'react';
import { HEAD_PILLARS } from '../../data/curriculum';
import { storageService } from '../../services/storageService';
import { HeadId, UserAccount, UserProfile } from '../../types';
import { Check, Sparkles, User, Target, Clock, Briefcase } from 'lucide-react';

interface ProfileSetupModalProps {
  user: UserAccount;
  isOpen: boolean;
  onComplete: (profile: UserProfile) => void;
}

export const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({
  user,
  isOpen,
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [bio, setBio] = useState('Architecting disciplined mastery across logic, vitality, and systems.');
  const [avatarSeed, setAvatarSeed] = useState(user.username);
  const [selectedHeads, setSelectedHeads] = useState<HeadId[]>([
    'head-01-knowledge-logic',
    'head-03-vitality',
    'head-05-strategy-governance'
  ]);
  const [learningGoals, setLearningGoals] = useState('Build deep first-principles intuition and establish sustainable daily learning habits.');
  const [skillLevel, setSkillLevel] = useState<'Foundational' | 'Practitioner' | 'Advanced Architect'>('Foundational');
  const [occupation, setOccupation] = useState('');
  const [schedule, setSchedule] = useState<'15 mins/day' | '30 mins/day' | '1 hour/day' | 'Deep Weekend Immersion'>('30 mins/day');

  if (!isOpen) return null;

  const toggleHead = (id: HeadId) => {
    if (selectedHeads.includes(id)) {
      if (selectedHeads.length > 1) {
        setSelectedHeads(selectedHeads.filter(h => h !== id));
      }
    } else {
      setSelectedHeads([...selectedHeads, id]);
    }
  };

  const handleFinish = () => {
    const avatarUrl = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(avatarSeed)}`;
    const interestNames = selectedHeads.map(hId => {
      const p = HEAD_PILLARS.find(hp => hp.id === hId);
      return p ? p.name : hId;
    });

    const updatedProfile: UserProfile = {
      id: 'prof_' + user.id,
      userId: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      bio,
      avatarUrl,
      interests: interestNames,
      preferredHeads: selectedHeads,
      learningGoals,
      skillLevel,
      occupation: occupation || undefined,
      preferredSchedule: schedule,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageService.saveProfile(updatedProfile);
    storageService.addCredits(user.id, 50, 'Completed Personal Life Architecture Profile');
    onComplete(updatedProfile);
  };

  const avatarPresets = [user.username, 'sol_architect', 'zen_mind', 'nova_logic', 'aurora_vital'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#0C101A] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Onboarding progress steps */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white">
              {step}
            </span>
            <h3 className="text-base font-semibold text-white">
              {step === 1 && 'Personal Identity & Avatar'}
              {step === 2 && 'Select Your Priority Pillars (Heads)'}
              {step === 3 && 'Cadence & Learning Goals'}
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Step {step} of 3</span>
        </div>

        {/* Step 1: Identity & Avatar */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Choose Your Avatar Insignia
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-violet-500/50 overflow-hidden shrink-0 shadow-md">
                  <img
                    src={`https://api.dicebear.com/7.x/shapes/svg?seed=${avatarSeed}`}
                    alt="Selected Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {avatarPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAvatarSeed(preset)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        avatarSeed === preset
                          ? 'bg-violet-600 text-white border border-violet-400'
                          : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Personal Bio & Intent
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="What is your purpose in cultivating these ten heads?"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Current Occupation / Discipline (Optional)
                </label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. Software Engineer, Researcher, Student"
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Self-Assessed Skill Baseline
                </label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value as any)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="Foundational">Foundational (Building Core Axioms)</option>
                  <option value="Practitioner">Practitioner (Active Application)</option>
                  <option value="Advanced Architect">Advanced Architect (Systemic Mastery)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-colors"
              >
                Next: Choose Pillars →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Preferred Heads */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <p className="text-xs text-slate-300">
              Select 2 to 4 primary heads you wish to cultivate immediately. Dasasurya will adapt your daily dashboard and recommended lessons accordingly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
              {HEAD_PILLARS.map((head) => {
                const isSelected = selectedHeads.includes(head.id);
                return (
                  <button
                    key={head.id}
                    type="button"
                    onClick={() => toggleHead(head.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between ${
                      isSelected
                        ? 'bg-violet-950/40 border-violet-500/60 shadow-sm'
                        : 'bg-white/[0.02] border-white/[0.06] hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400">Head {head.number.toString().padStart(2, '0')}</span>
                        <h4 className="text-xs font-semibold text-white">{head.name}</h4>
                      </div>
                      <p className="text-[11px] text-slate-400">{head.tagline}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-violet-600 border-violet-400 text-white' : 'border-slate-600'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-colors"
              >
                Next: Cadence & Goals →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Goals & Cadence */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your Primary Learning Goal
              </label>
              <input
                type="text"
                value={learningGoals}
                onChange={(e) => setLearningGoals(e.target.value)}
                placeholder="e.g. Master mental models and algorithmic system design."
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Preferred Learning Cadence (Sustainable Pacing)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['15 mins/day', '30 mins/day', '1 hour/day', 'Deep Weekend Immersion'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSchedule(opt)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      schedule === opt
                        ? 'bg-violet-950/40 border-violet-500 text-white font-medium'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/20 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300 leading-relaxed">
                Welcome to SAN_R-10. Your profile is stored and your customized dashboard is prepared. You will receive 50 starter SAN Credits upon completion.
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-md transition-all"
              >
                Enter Sanctuary Dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
