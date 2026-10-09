import React, { useState } from 'react';
import { SUPPORTED_LANGUAGES, getLanguageName } from '../../data/languages';
import { storageService } from '../../services/storageService';
import { LanguageCode, LanguagePreferences, UserAccount, UserProfile } from '../../types';
import { 
  ShieldCheck, 
  Download, 
  Trash2, 
  Lock, 
  Mail, 
  Phone, 
  Calendar, 
  Globe, 
  FileText, 
  AlertTriangle, 
  Check, 
  ArrowLeft 
} from 'lucide-react';

interface SecurityPrivacyModuleProps {
  user: UserAccount;
  profile: UserProfile | null;
  onUpdateUser: (updatedUser: UserAccount) => void;
  onAccountDeleted: () => void;
  onBackToDashboard: () => void;
}

export const SecurityPrivacyModule: React.FC<SecurityPrivacyModuleProps> = ({
  user,
  profile,
  onUpdateUser,
  onAccountDeleted,
  onBackToDashboard,
}) => {
  // Independent Language Preferences
  const [interfaceLanguage, setInterfaceLanguage] = useState<LanguageCode>(
    user.languagePreferences?.interfaceLanguage || 'en'
  );
  const [responseLanguage, setResponseLanguage] = useState<LanguageCode>(
    user.languagePreferences?.responseLanguage || 'en'
  );
  const [learningLanguage, setLearningLanguage] = useState<LanguageCode>(
    user.languagePreferences?.learningLanguage || 'en'
  );
  const [langSaved, setLangSaved] = useState(false);

  // Deletion Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Consent Withdrawal
  const [withdrawalMessage, setWithdrawalMessage] = useState<string | null>(null);

  const handleSaveLanguagePreferences = () => {
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

    setLangSaved(true);
    setTimeout(() => setLangSaved(false), 3000);
  };

  const handleExportData = () => {
    const fullData = storageService.exportUserData(user.id);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sanr10_complete_export_${user.username}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleWithdrawConsent = (type: string) => {
    storageService.withdrawConsent(user.id, type);
    setWithdrawalMessage(`Consent for ${type.replace(/_/g, ' ')} recorded as withdrawn.`);
    setTimeout(() => setWithdrawalMessage(null), 4000);
  };

  const handleExecuteAccountDeletion = () => {
    if (deleteConfirmText.trim().toLowerCase() !== user.username.toLowerCase()) return;
    storageService.deleteAccount(user.id);
    onAccountDeleted();
  };

  return (
    <div className="w-full min-h-screen bg-[#07090E] text-slate-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                SECURITY & PRIVACY ARCHITECTURE
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-mono text-emerald-400">Data Sovereignty Active</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <ShieldCheck className="w-7 h-7 text-cyan-400" />
              <span>Identity, Privacy & Control</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Manage verified credentials, configure independent language dimensions, export personal learning records, or exercise account closure rights.
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

        {withdrawalMessage && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{withdrawalMessage}</span>
          </div>
        )}

        {/* Verified Identity Card */}
        <div className="p-6 rounded-2xl bg-[#0C101A] border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Verified Identity Record</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              ✓ Verified via {user.verificationChannel.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-0.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Display Name</span>
              <div className="font-semibold text-white">{user.fullName}</div>
              <span className="text-[10px] font-mono text-slate-400">@{user.username}</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-0.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Verification Contact</span>
              <div className="font-semibold text-white truncate">
                {user.verificationChannel === 'email' ? user.email : user.phone || 'Phone Verified'}
              </div>
              <span className="text-[10px] font-mono text-emerald-400">Active Channel</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-0.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Age Classification</span>
              <div className="font-semibold text-white">Age {user.age}</div>
              <span className="text-[10px] font-mono text-cyan-400">
                {user.isUnder12 ? 'Under-12 Child Safeguard' : user.isMinor ? 'Minor Experience' : 'Standard Adult'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-0.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Verification Date</span>
              <div className="font-semibold text-white font-mono">
                {user.verifiedAt ? new Date(user.verifiedAt).toLocaleDateString() : 'Active'}
              </div>
              <span className="text-[10px] font-mono text-slate-400">Cryptographically Validated</span>
            </div>
          </div>
        </div>

        {/* Independent Language Preferences (Requirement 1: Choose interface, response, and learning language independently) */}
        <div className="p-6 rounded-2xl bg-[#0C101A] border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-bold text-white">Multilingual Dimensions Configuration</h3>
            </div>
            {langSaved && (
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Preferences Saved
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Configure each linguistic dimension independently. For example, navigate in Spanish while learning concepts in English and receiving Socratic guidance in Hindi.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
            {/* 1. Interface Language */}
            <div className="space-y-1">
              <label className="block text-slate-300 font-medium">Interface Language</label>
              <select
                value={interfaceLanguage}
                onChange={e => setInterfaceLanguage(e.target.value as LanguageCode)}
                className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500">Navigation, headers, and dashboard labels.</p>
            </div>

            {/* 2. Response Language */}
            <div className="space-y-1">
              <label className="block text-slate-300 font-medium">Response Language</label>
              <select
                value={responseLanguage}
                onChange={e => setResponseLanguage(e.target.value as LanguageCode)}
                className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500">Language DASASURYA uses to answer your queries.</p>
            </div>

            {/* 3. Learning Language */}
            <div className="space-y-1">
              <label className="block text-slate-300 font-medium">Learning Language</label>
              <select
                value={learningLanguage}
                onChange={e => setLearningLanguage(e.target.value as LanguageCode)}
                className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500">Target language for generating learning plans and quizzes.</p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveLanguagePreferences}
              className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              Update Language Preferences
            </button>
          </div>
        </div>

        {/* Data Sovereignty & Export */}
        <div className="p-6 rounded-2xl bg-[#0C101A] border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Data Sovereignty & Full Export</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">JSON Format</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            You own your intellectual records. Export your complete profile, reading progress, chapter notes, bookmarks, calendar sessions, multilingual roadmaps, and private wellness journal entries in an open format.
          </p>

          <div className="pt-1">
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Complete Personal Data Archive (JSON)</span>
            </button>
          </div>
        </div>

        {/* Consent Records & Legal Transparency */}
        <div className="p-6 rounded-2xl bg-[#0C101A] border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Consent Records & Transparency</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Policy v2026.1</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white">Age-Aware Personalization & Learning Analytics</span>
                <p className="text-[11px] text-slate-400">Used strictly to calibrate study pacing, curriculum depth, and safety tiers.</p>
              </div>
              <button
                onClick={() => handleWithdrawConsent('learning_analytics')}
                className="text-[11px] text-amber-400 hover:underline shrink-0 ml-2"
              >
                Withdraw Consent
              </button>
            </div>

            <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white">Wellness Journal Storage Isolation</span>
                <p className="text-[11px] text-slate-400">Contemplative chakra reflections are kept private and never used for advertising.</p>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">Strictly Isolated</span>
            </div>
          </div>
        </div>

        {/* Danger Zone: Account Deletion */}
        <div className="p-6 rounded-2xl bg-rose-950/15 border border-rose-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="text-sm font-bold">Account Closure & Data Erasure</h3>
            </div>
            <span className="text-[10px] font-mono text-rose-400 font-semibold uppercase">Irreversible</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Permanently delete your SAN_R-10 account. This permanently purges your profile, reading progress, notes, roadmaps, and wellness entries across all storage systems.
          </p>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Initiate Permanent Account Deletion</span>
          </button>
        </div>

        {/* Deletion Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="w-full max-w-md bg-[#0C101A] border border-rose-500/40 rounded-2xl p-6 space-y-4 shadow-2xl">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Confirm Irreversible Deletion</span>
                </h3>
                <p className="text-xs text-slate-300">
                  To confirm permanent erasure of all records for user <strong className="text-white">@{user.username}</strong>, type your username below:
                </p>
              </div>

              <input
                type="text"
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder={user.username}
                className="w-full p-2.5 bg-black/60 border border-white/10 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-rose-500"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs text-slate-400 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteConfirmText.trim().toLowerCase() !== user.username.toLowerCase()}
                  onClick={handleExecuteAccountDeletion}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-xs font-semibold text-white rounded-lg"
                >
                  Permanently Delete Everything
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
