import React, { useState } from 'react';
import { UserAccount, UserProfile } from '../../types';
import { Sparkles, Compass, BookOpen, Calendar, SunMedium, User, LogOut, Menu, X, BrainCircuit, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  user: UserAccount | null;
  profile: UserProfile | null;
  credits: number;
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: (mode: 'signin' | 'register') => void;
  onSignOut: () => void;
  onOpenDailyBrief: () => void;
  onOpenDasasurya: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  profile,
  credits,
  activeView,
  onNavigate,
  onOpenAuth,
  onSignOut,
  onOpenDailyBrief,
  onOpenDasasurya,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07090E]/90 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Brand Wordmark (Single text element with subtle insignia) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick(user ? 'dashboard' : 'home')}
            className="flex items-center gap-2.5 text-left group transition-transform active:scale-98"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white font-serif font-bold text-base shadow-sm ring-1 ring-white/20">
              S
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                SAN_R-10
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-400 font-mono">
                DASASURYA
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-6 Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {user ? (
            <>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`transition-colors whitespace-nowrap hover:text-white ${
                  activeView === 'dashboard' ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1' : 'text-slate-300'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavClick('learn')}
                className={`transition-colors whitespace-nowrap hover:text-white ${
                  activeView === 'learn' || activeView === 'reader' ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1' : 'text-slate-300'
                }`}
              >
                Learn
              </button>
              <button
                onClick={() => handleNavClick('myday')}
                className={`transition-colors whitespace-nowrap hover:text-white ${
                  activeView === 'myday' ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1' : 'text-slate-300'
                }`}
              >
                My Day
              </button>
              <button
                onClick={() => handleNavClick('ravanamind')}
                className={`transition-colors whitespace-nowrap hover:text-white flex items-center gap-1.5 ${
                  activeView === 'ravanamind' ? 'text-violet-400 border-b-2 border-violet-400 pb-1' : 'text-slate-300'
                }`}
              >
                <BrainCircuit className="w-4 h-4 text-violet-400" />
                Ravana Mind
              </button>
              <button
                onClick={() => handleNavClick('roadmap')}
                className={`transition-colors whitespace-nowrap hover:text-white ${
                  activeView === 'roadmap' ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1' : 'text-slate-300'
                }`}
              >
                Mastery Roadmap
              </button>
              <button
                onClick={() => handleNavClick('calendar')}
                className={`transition-colors whitespace-nowrap hover:text-white ${
                  activeView === 'calendar' ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1' : 'text-slate-300'
                }`}
              >
                Calendar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavClick('home')}
                className="text-slate-300 hover:text-white transition-colors"
              >
                Concept
              </button>
              <button
                onClick={() => handleNavClick('tenheads')}
                className="text-slate-300 hover:text-white transition-colors"
              >
                Ten Heads
              </button>
              <button
                onClick={() => handleNavClick('methodology')}
                className="text-slate-300 hover:text-white transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => handleNavClick('faq')}
                className="text-slate-300 hover:text-white transition-colors"
              >
                FAQ
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Daily Brief trigger */}
              <button
                onClick={onOpenDailyBrief}
                title="Daily Dasasurya Briefing"
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-colors"
              >
                <SunMedium className="w-3.5 h-3.5" />
                <span>Daily Brief</span>
              </button>

              {/* Dasasurya Socratic Mentor trigger */}
              <button
                onClick={onOpenDasasurya}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Ask</span> Dasasurya
              </button>

              {/* San Credits Counter */}
              <button
                onClick={() => handleNavClick('credits')}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium text-amber-400 bg-black/40 border border-amber-500/30 hover:border-amber-400 transition-colors"
                title="SAN Credits earned"
              >
                <span>✦</span>
                <span className="tabular-nums">{credits}</span>
              </button>

              {/* User Profile / Menu */}
              <button
                onClick={() => handleNavClick('profile')}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
              >
                <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center overflow-hidden">
                  {profile?.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-slate-300" />
                  )}
                </div>
                <span className="hidden xl:inline text-xs font-medium text-slate-300 truncate max-w-[100px]">
                  {profile?.username || user.username}
                </span>
              </button>

              {/* Sign Out */}
              <button
                onClick={onSignOut}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('signin')}
                className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 transition-colors whitespace-nowrap"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="text-xs sm:text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 px-3.5 py-1.5 rounded-lg transition-all shadow-sm whitespace-nowrap"
              >
                Create Account
              </button>
            </>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0C101A] px-4 pt-3 pb-5 space-y-2">
          {user ? (
            <>
              <button
                onClick={() => handleNavClick('dashboard')}
                className="w-full text-left px-3 py-2 rounded-md text-sm text-slate-200 hover:bg-white/5"
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavClick('learn')}
                className="w-full text-left px-3 py-2 rounded-md text-sm text-slate-200 hover:bg-white/5"
              >
                Textbook Curriculum
              </button>
              <button
                onClick={() => handleNavClick('myday')}
                className="w-full text-left px-3 py-2 rounded-md text-sm text-slate-200 hover:bg-white/5"
              >
                My Day (Daily Architecture)
              </button>
              <button
                onClick={() => handleNavClick('ravanamind')}
                className="w-full text-left px-3 py-2 rounded-md text-sm text-violet-300 hover:bg-white/5 flex items-center gap-2"
              >
                <BrainCircuit className="w-4 h-4 text-violet-400" />
                Ravana Mind (Multi-Perspective)
              </button>
              <button
                onClick={() => handleNavClick('roadmap')}
                className="w-full text-left px-3 py-2 rounded-md text-sm text-slate-200 hover:bg-white/5"
              >
                Mastery Roadmap
              </button>
              <button
                onClick={() => handleNavClick('calendar')}
                className="w-full text-left px-3 py-2 rounded-md text-sm text-slate-200 hover:bg-white/5"
              >
                Integrated Calendar
              </button>
              <button
                onClick={() => handleNavClick('credits')}
                className="w-full text-left px-3 py-2 rounded-md text-sm text-amber-300 hover:bg-white/5 flex items-center justify-between"
              >
                <span>SAN Credits</span>
                <span className="font-mono">{credits} XP</span>
              </button>
              <button
                onClick={() => handleNavClick('profile')}
                className="w-full text-left px-3 py-2 rounded-md text-sm text-slate-200 hover:bg-white/5"
              >
                My Profile & Notes
              </button>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={onOpenDailyBrief}
                  className="text-xs text-amber-300 hover:underline flex items-center gap-1"
                >
                  <SunMedium className="w-3.5 h-3.5" /> Daily Briefing
                </button>
                <button
                  onClick={onSignOut}
                  className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavClick('home')}
                className="w-full text-left px-3 py-2 rounded-md text-sm text-slate-200 hover:bg-white/5"
              >
                Concept & Vision
              </button>
              <button
                onClick={() => handleNavClick('tenheads')}
                className="w-full text-left px-3 py-2 rounded-md text-sm text-slate-200 hover:bg-white/5"
              >
                The Ten Heads
              </button>
              <button
                onClick={() => handleNavClick('methodology')}
                className="w-full text-left px-3 py-2 rounded-md text-sm text-slate-200 hover:bg-white/5"
              >
                How Learning Works
              </button>
              <button
                onClick={() => handleNavClick('faq')}
                className="w-full text-left px-3 py-2 rounded-md text-sm text-slate-200 hover:bg-white/5"
              >
                FAQ
              </button>
              <div className="pt-2 border-t border-white/10 space-y-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAuth('signin'); }}
                  className="w-full py-2 text-center text-sm font-medium text-slate-200 bg-white/5 rounded-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAuth('register'); }}
                  className="w-full py-2 text-center text-sm font-medium text-white bg-violet-600 rounded-lg"
                >
                  Create Account
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};
