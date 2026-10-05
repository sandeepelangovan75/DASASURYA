import React, { useState } from 'react';
import { HEAD_PILLARS } from '../../data/curriculum';
import { storageService } from '../../services/storageService';
import { Bookmark, UserAccount, UserNote, UserProfile, UserProgress } from '../../types';
import { User, Edit3, Save, Check, Award, BookOpen, Clock, FileText, Bookmark as BookmarkIcon, ArrowLeft } from 'lucide-react';

interface UserProfileViewProps {
  user: UserAccount;
  profile: UserProfile;
  progress: UserProgress;
  bookmarks: Bookmark[];
  notes: UserNote[];
  credits: number;
  onUpdateProfile: (updated: UserProfile) => void;
  onOpenChapter: (chapterId: string) => void;
  onBackToDashboard: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user,
  profile,
  progress,
  bookmarks,
  notes,
  credits,
  onUpdateProfile,
  onOpenChapter,
  onBackToDashboard,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(profile.bio);
  const [learningGoals, setLearningGoals] = useState(profile.learningGoals);
  const [occupation, setOccupation] = useState(profile.occupation || '');
  const [schedule, setSchedule] = useState(profile.preferredSchedule);
  const [skillLevel, setSkillLevel] = useState(profile.skillLevel);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    const updated: UserProfile = {
      ...profile,
      bio,
      learningGoals,
      occupation: occupation || undefined,
      preferredSchedule: schedule,
      skillLevel,
      updatedAt: new Date().toISOString(),
    };

    storageService.saveProfile(updated);
    onUpdateProfile(updated);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const completedChaptersCount = Object.values(progress.chapterProgress).filter(p => p.isCompleted).length;

  return (
    <div className="w-full min-h-screen bg-[#07090E] text-slate-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDashboard}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Architect Profile
              </h1>
              <p className="text-xs text-slate-400">
                Personal identity, learning parameters, and journal records.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            )}
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Profile parameters updated successfully.</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0C101A] border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-slate-800 border-2 border-violet-500/40 overflow-hidden shadow-lg shrink-0">
              <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2 flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-white">{profile.fullName}</h2>
                  <span className="text-xs font-mono text-cyan-400">@{profile.username} · {profile.email}</span>
                </div>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs">
                  <span>✦</span>
                  <span className="tabular-nums font-bold">{credits} XP</span>
                </div>
              </div>

              {!isEditing ? (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  {profile.bio}
                </p>
              ) : (
                <textarea
                  rows={2}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white"
                />
              )}
            </div>
          </div>

          {/* Configurable Parameters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/[0.06] text-xs">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Skill Baseline</span>
              {!isEditing ? (
                <div className="font-semibold text-white">{profile.skillLevel}</div>
              ) : (
                <select
                  value={skillLevel}
                  onChange={e => setSkillLevel(e.target.value as any)}
                  className="w-full p-1 bg-black border border-white/10 rounded text-xs text-white"
                >
                  <option value="Foundational">Foundational</option>
                  <option value="Practitioner">Practitioner</option>
                  <option value="Advanced Architect">Advanced Architect</option>
                </select>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Daily Schedule</span>
              {!isEditing ? (
                <div className="font-semibold text-white">{profile.preferredSchedule}</div>
              ) : (
                <select
                  value={schedule}
                  onChange={e => setSchedule(e.target.value as any)}
                  className="w-full p-1 bg-black border border-white/10 rounded text-xs text-white"
                >
                  <option value="15 mins/day">15 mins/day</option>
                  <option value="30 mins/day">30 mins/day</option>
                  <option value="1 hour/day">1 hour/day</option>
                  <option value="Deep Weekend Immersion">Deep Weekend Immersion</option>
                </select>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Discipline / Role</span>
              {!isEditing ? (
                <div className="font-semibold text-white">{profile.occupation || 'Self-Directed Learner'}</div>
              ) : (
                <input
                  type="text"
                  value={occupation}
                  onChange={e => setOccupation(e.target.value)}
                  placeholder="e.g. Engineer"
                  className="w-full p-1 bg-black border border-white/10 rounded text-xs text-white"
                />
              )}
            </div>
          </div>

          {/* Learning Goals */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1 text-xs">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Primary Goal</span>
            {!isEditing ? (
              <p className="text-slate-200">{profile.learningGoals}</p>
            ) : (
              <input
                type="text"
                value={learningGoals}
                onChange={e => setLearningGoals(e.target.value)}
                className="w-full p-1.5 bg-black border border-white/10 rounded text-xs text-white"
              />
            )}
          </div>
        </div>

        {/* Priority Pillars */}
        <div className="p-6 rounded-2xl bg-[#0C101A] border border-white/10 space-y-4">
          <h3 className="text-sm font-semibold text-white">Active Learning Pillars</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {profile.preferredHeads.map(hId => {
              const head = HEAD_PILLARS.find(hp => hp.id === hId);
              if (!head) return null;
              return (
                <div key={head.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">HEAD {head.number.toString().padStart(2, '0')}</span>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: head.accentColor }} />
                  </div>
                  <h4 className="text-xs font-semibold text-white">{head.name}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{head.tagline}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bookmarks & Saved Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-6 rounded-2xl bg-[#0C101A] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-white border-b border-white/[0.08] pb-3">
              <BookmarkIcon className="w-4 h-4 text-cyan-400" />
              <span>Bookmarked Lessons ({bookmarks.length})</span>
            </div>
            {bookmarks.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No bookmarks saved yet.</p>
            ) : (
              <div className="space-y-2">
                {bookmarks.map(bm => (
                  <div
                    key={bm.id}
                    onClick={() => onOpenChapter(bm.chapterId)}
                    className="p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 cursor-pointer text-xs text-slate-300 hover:text-white transition-colors"
                  >
                    {bm.chapterTitle}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-[#0C101A] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-white border-b border-white/[0.08] pb-3">
              <FileText className="w-4 h-4 text-violet-400" />
              <span>Personal Notes ({notes.length})</span>
            </div>
            {notes.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No chapter notes saved yet.</p>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto">
                {notes.map(n => (
                  <div
                    key={n.id}
                    onClick={() => onOpenChapter(n.chapterId)}
                    className="p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 cursor-pointer space-y-0.5"
                  >
                    <div className="text-xs font-medium text-white">{n.title}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{n.content}</div>
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
