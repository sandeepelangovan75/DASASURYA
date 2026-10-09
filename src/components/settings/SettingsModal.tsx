import React, { useState } from 'react';
import { SUPPORTED_LANGUAGES } from '../../data/languages';
import { storageService } from '../../services/storageService';
import { LanguageCode, LanguagePreferences, UserAccount, UserProfile } from '../../types';
import { Settings, X, Globe, Clock, ShieldCheck, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  profile: UserProfile | null;
  onUpdateUser: (updatedUser: UserAccount) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  profile,
  onUpdateUser,
}) => {
  const [interfaceLanguage, setInterfaceLanguage] = useState<LanguageCode>(
    user.languagePreferences?.interfaceLanguage || 'en'
  );
  const [responseLanguage, setResponseLanguage] = useState<LanguageCode>(
    user.languagePreferences?.responseLanguage || 'en'
  );
  const [learningLanguage, setLearningLanguage] = useState<LanguageCode>(
    user.languagePreferences?.learningLanguage || 'en'
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const newPrefs: LanguagePreferences = {
      interfaceLanguage,
      responseLanguage,
      learningLanguage,
    };
    storageService.updateLanguagePreferences(user.id, newPrefs);

    const updatedUser = {
      ...user,
      languagePreferences: newPrefs,
    };
    onUpdateUser(updatedUser);

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#0C101A] border border-white/10 rounded-2xl p-6 space-y-5 shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-violet-400" />
            <h3 className="text-base font-bold text-white">Application Settings</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {saveSuccess && (
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Preferences saved successfully.</span>
          </div>
        )}

        <div className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="block text-slate-300 font-medium flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Interface Language</span>
            </label>
            <select
              value={interfaceLanguage}
              onChange={e => setInterfaceLanguage(e.target.value as LanguageCode)}
              className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white"
            >
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.name} ({l.nativeName})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-slate-300 font-medium flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-violet-400" />
              <span>AI Response Language</span>
            </label>
            <select
              value={responseLanguage}
              onChange={e => setResponseLanguage(e.target.value as LanguageCode)}
              className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white"
            >
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.name} ({l.nativeName})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-slate-300 font-medium flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Target Learning Language</span>
            </label>
            <select
              value={learningLanguage}
              onChange={e => setLearningLanguage(e.target.value as LanguageCode)}
              className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white"
            >
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.name} ({l.nativeName})</option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Age Safeguards:</span>
            <div className="text-slate-300">
              Age {user.age} · {user.isUnder12 ? 'Under-12 Child Safeguard' : 'Standard'}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs text-slate-400 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white rounded-lg shadow-sm"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
