import { 
  Bookmark, 
  CalendarEvent, 
  ChakraSession, 
  ConsentRecord, 
  LanguageCode, 
  LanguagePreferences, 
  MultilingualRoadmap, 
  ParentalConsentRecord, 
  RavanaMindAnalysis, 
  SanCreditRecord, 
  UserAccount, 
  UserNote, 
  UserProfile, 
  UserProgress, 
  VerificationChannel, 
  WellnessJournalEntry, 
  HeadId 
} from '../types';
import { HEAD_PILLARS, COURSES } from '../data/curriculum';
import { DEFAULT_LANGUAGE_PREFERENCES } from '../data/languages';

const STORAGE_KEYS = {
  ACCOUNTS: 'sanr10_accounts_v1',
  SESSION: 'sanr10_active_session_v1',
  PROFILES: 'sanr10_profiles_v1',
  PROGRESS: 'sanr10_progress_v1',
  NOTES: 'sanr10_notes_v1',
  BOOKMARKS: 'sanr10_bookmarks_v1',
  CALENDAR: 'sanr10_calendar_v1',
  CREDITS: 'sanr10_credits_v1',
  RAVANA_MIND: 'sanr10_ravana_mind_v1',
  ROADMAPS: 'sanr10_roadmaps_v1',
  CHAKRA_SESSIONS: 'sanr10_chakra_sessions_v1',
  WELLNESS_JOURNAL: 'sanr10_wellness_journal_v1',
  ADMIN_MODULES: 'sanr10_admin_modules_v1',
};

// Safe JSON helpers
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
}

export function calculateAge(dobString: string): number {
  if (!dobString) return 20;
  const dob = new Date(dobString);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

// 1. ACCOUNT & AUTH SERVICE
export const storageService = {
  // Accounts
  getAccounts(): UserAccount[] {
    return getFromStorage<UserAccount[]>(STORAGE_KEYS.ACCOUNTS, []);
  },

  registerAccount(user: { 
    fullName: string; 
    username: string; 
    email: string; 
    phone?: string;
    verificationChannel: VerificationChannel;
    password: string;
    dateOfBirth: string;
    preferredLanguage?: LanguageCode;
    parentName?: string;
    parentContact?: string;
  }): { success: boolean; user?: UserAccount; error?: string } {
    const accounts = this.getAccounts();
    const cleanEmail = user.email.trim().toLowerCase();
    const cleanUsername = user.username.trim().toLowerCase();
    const cleanPhone = user.phone ? user.phone.trim() : undefined;

    if (cleanEmail && accounts.some(a => a.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email address already exists.' };
    }
    if (accounts.some(a => a.username.toLowerCase() === cleanUsername)) {
      return { success: false, error: 'This username is already taken. Please choose another.' };
    }

    const age = calculateAge(user.dateOfBirth);
    const isUnder12 = age < 12;
    const isMinor = age < 18;

    const initialLangPrefs: LanguagePreferences = {
      interfaceLanguage: user.preferredLanguage || 'en',
      responseLanguage: user.preferredLanguage || 'en',
      learningLanguage: user.preferredLanguage || 'en',
    };

    const parentalConsent: ParentalConsentRecord = {
      required: isUnder12,
      authorized: !isUnder12, // If not under 12, no parental gate is required
      parentName: user.parentName || undefined,
      parentContact: user.parentContact || undefined,
      authorizedAt: !isUnder12 ? new Date().toISOString() : undefined,
      consentMethod: !isUnder12 ? undefined : 'email_authorization',
      passcodePin: undefined,
      maxDailyMinutes: isUnder12 ? 30 : 120,
      allowedFeatures: {
        externalLinks: !isUnder12,
        publicSharing: false,
        advancedChakra: !isUnder12,
        unguidedChat: !isUnder12,
      },
    };

    const consentRecords: ConsentRecord[] = [
      {
        policyVersion: '2026.1',
        consentedAt: new Date().toISOString(),
        types: ['terms_of_service', 'privacy_policy', 'age_safety_policy', 'data_retention'],
      },
    ];

    const newUser: UserAccount = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      fullName: user.fullName.trim(),
      username: cleanUsername,
      email: cleanEmail,
      phone: cleanPhone,
      verificationChannel: user.verificationChannel,
      isVerified: true, // Activated upon verification completion
      verifiedAt: new Date().toISOString(),
      dateOfBirth: user.dateOfBirth,
      age,
      isUnder12,
      isMinor,
      passwordHash: btoa(user.password),
      role: 'learner',
      parentalConsent,
      consentRecords,
      languagePreferences: initialLangPrefs,
      createdAt: new Date().toISOString(),
    };

    accounts.push(newUser);
    setToStorage(STORAGE_KEYS.ACCOUNTS, accounts);

    // Initialize Profile
    const profile: UserProfile = {
      id: 'prof_' + newUser.id,
      userId: newUser.id,
      fullName: newUser.fullName,
      username: newUser.username,
      email: newUser.email,
      phone: cleanPhone,
      bio: isUnder12 
        ? 'Young explorer building foundational wisdom and calm habits.' 
        : 'Lifelong learner building mastery through the 10 Heads.',
      avatarUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${newUser.username}`,
      interests: ['Knowledge & Logic', 'Vitality', 'Strategy', 'Systems'],
      preferredHeads: ['head-01-knowledge-logic', 'head-03-vitality', 'head-05-strategy-governance'],
      learningGoals: isUnder12 
        ? 'Discover how science, curiosity, and good habits work together.' 
        : 'Master first-principles thinking and build sustainable daily learning architecture.',
      skillLevel: 'Foundational',
      preferredSchedule: isUnder12 ? '15 mins/day' : '30 mins/day',
      dateOfBirth: user.dateOfBirth,
      age,
      isUnder12,
      languagePreferences: initialLangPrefs,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.saveProfile(profile);
    this.setActiveSession(newUser.id);
    this.addCredits(newUser.id, 50, 'Welcome to SAN_R-10 Architecture');

    // Create Initial Calendar Starter Event
    const today = new Date().toISOString().split('T')[0];
    this.createCalendarEvent({
      id: 'cal_' + Date.now(),
      userId: newUser.id,
      title: isUnder12 ? 'Welcome Lesson: The Wonder of Curiosity' : 'Introductory Chapter: The Socratic Scalpel',
      type: 'learning',
      date: today,
      time: '17:00',
      chapterId: 'chap-01-first-principles',
      isCompleted: false,
      notes: 'Begin reading in Head 01',
    });

    return { success: true, user: newUser };
  },

  authenticate(loginIdentifier: string, password: string): { success: boolean; user?: UserAccount; error?: string } {
    const cleanId = loginIdentifier.trim().toLowerCase();
    const accounts = this.getAccounts();
    const account = accounts.find(a => 
      a.email.toLowerCase() === cleanId || 
      a.username.toLowerCase() === cleanId || 
      (a.phone && a.phone.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, ''))
    );

    if (!account) {
      return { success: false, error: 'Invalid credentials. No matching account found.' };
    }

    if (account.passwordHash !== btoa(password)) {
      return { success: false, error: 'Invalid credentials. Password does not match.' };
    }

    this.setActiveSession(account.id);
    return { success: true, user: account };
  },

  getActiveUser(): UserAccount | null {
    const activeId = getFromStorage<string | null>(STORAGE_KEYS.SESSION, null);
    if (!activeId) return null;
    const accounts = this.getAccounts();
    return accounts.find(a => a.id === activeId) || null;
  },

  setActiveSession(userId: string | null): void {
    setToStorage(STORAGE_KEYS.SESSION, userId);
  },

  signOut(): void {
    this.setActiveSession(null);
  },

  // Profile
  getProfile(userId: string): UserProfile | null {
    const profiles = getFromStorage<Record<string, UserProfile>>(STORAGE_KEYS.PROFILES, {});
    return profiles[userId] || null;
  },

  saveProfile(profile: UserProfile): void {
    const profiles = getFromStorage<Record<string, UserProfile>>(STORAGE_KEYS.PROFILES, {});
    profiles[profile.userId] = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    setToStorage(STORAGE_KEYS.PROFILES, profiles);
  },

  updateLanguagePreferences(userId: string, prefs: LanguagePreferences): void {
    const accounts = this.getAccounts();
    const accIdx = accounts.findIndex(a => a.id === userId);
    if (accIdx !== -1) {
      accounts[accIdx].languagePreferences = prefs;
      setToStorage(STORAGE_KEYS.ACCOUNTS, accounts);
    }

    const prof = this.getProfile(userId);
    if (prof) {
      prof.languagePreferences = prefs;
      this.saveProfile(prof);
    }
  },

  updateParentalConsent(userId: string, consentUpdate: Partial<ParentalConsentRecord>): void {
    const accounts = this.getAccounts();
    const idx = accounts.findIndex(a => a.id === userId);
    if (idx !== -1) {
      accounts[idx].parentalConsent = {
        ...accounts[idx].parentalConsent!,
        ...consentUpdate,
      };
      setToStorage(STORAGE_KEYS.ACCOUNTS, accounts);
    }
  },

  withdrawConsent(userId: string, consentType: string): void {
    const accounts = this.getAccounts();
    const idx = accounts.findIndex(a => a.id === userId);
    if (idx !== -1) {
      accounts[idx].consentRecords.push({
        policyVersion: '2026.1',
        consentedAt: new Date().toISOString(),
        withdrawnAt: new Date().toISOString(),
        types: [consentType],
      });
      setToStorage(STORAGE_KEYS.ACCOUNTS, accounts);
    }
  },

  saveAccount(user: UserAccount): void {
    const accounts = this.getAccounts();
    const idx = accounts.findIndex(a => a.id === user.id);
    if (idx !== -1) {
      accounts[idx] = user;
    } else {
      accounts.push(user);
    }
    setToStorage(STORAGE_KEYS.ACCOUNTS, accounts);
  },

  // Learning Progress
  getProgress(userId: string): UserProgress {
    const allProgress = getFromStorage<Record<string, UserProgress>>(STORAGE_KEYS.PROGRESS, {});
    if (!allProgress[userId]) {
      const initial: UserProgress = {
        userId,
        chapterProgress: {},
        lastActiveChapterId: 'chap-01-first-principles',
        lastActiveHeadId: 'head-01-knowledge-logic',
        streakDays: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        totalReadingMinutes: 0,
      };
      allProgress[userId] = initial;
      setToStorage(STORAGE_KEYS.PROGRESS, allProgress);
    }
    return allProgress[userId];
  },

  updateChapterReadingProgress(userId: string, chapterId: string, headId: HeadId, progressPercent: number, readingMinutes: number = 0): void {
    const allProgress = getFromStorage<Record<string, UserProgress>>(STORAGE_KEYS.PROGRESS, {});
    const userProgress = this.getProgress(userId);

    const prev = userProgress.chapterProgress[chapterId] || {
      readingProgress: 0,
      isCompleted: false,
      quizCompleted: false,
      practiceCompleted: false,
      applicationCompleted: false,
    };

    const newReading = Math.max(prev.readingProgress, Math.min(100, Math.round(progressPercent)));
    const isNowComplete = newReading >= 100 && prev.quizCompleted && prev.practiceCompleted;

    userProgress.chapterProgress[chapterId] = {
      ...prev,
      readingProgress: newReading,
      isCompleted: isNowComplete || prev.isCompleted,
      completedAt: (isNowComplete && !prev.completedAt) ? new Date().toISOString() : prev.completedAt,
    };

    userProgress.lastActiveChapterId = chapterId;
    userProgress.lastActiveHeadId = headId;
    userProgress.totalReadingMinutes = (userProgress.totalReadingMinutes || 0) + readingMinutes;

    allProgress[userId] = userProgress;
    setToStorage(STORAGE_KEYS.PROGRESS, allProgress);
  },

  recordQuizSubmission(userId: string, chapterId: string, score: number, totalQuestions: number): void {
    const allProgress = getFromStorage<Record<string, UserProgress>>(STORAGE_KEYS.PROGRESS, {});
    const userProgress = this.getProgress(userId);
    const prev = userProgress.chapterProgress[chapterId] || {
      readingProgress: 0,
      isCompleted: false,
      quizCompleted: false,
      practiceCompleted: false,
      applicationCompleted: false,
    };

    const percent = Math.round((score / totalQuestions) * 100);
    const quizCompleted = percent >= 50;

    userProgress.chapterProgress[chapterId] = {
      ...prev,
      quizScore: percent,
      quizCompleted,
      isCompleted: (prev.readingProgress >= 90 && quizCompleted && prev.practiceCompleted),
    };

    allProgress[userId] = userProgress;
    setToStorage(STORAGE_KEYS.PROGRESS, allProgress);

    if (quizCompleted && !prev.quizCompleted) {
      this.addCredits(userId, 25, `Understanding Check Passed: ${chapterId}`);
    }
  },

  recordPracticeSubmission(userId: string, chapterId: string, submissionText: string): void {
    const allProgress = getFromStorage<Record<string, UserProgress>>(STORAGE_KEYS.PROGRESS, {});
    const userProgress = this.getProgress(userId);
    const prev = userProgress.chapterProgress[chapterId] || {
      readingProgress: 0,
      isCompleted: false,
      quizCompleted: false,
      practiceCompleted: false,
      applicationCompleted: false,
    };

    const isFirstTime = !prev.practiceCompleted;

    userProgress.chapterProgress[chapterId] = {
      ...prev,
      practiceCompleted: true,
      practiceSubmission: submissionText,
      isCompleted: (prev.readingProgress >= 90 && prev.quizCompleted),
    };

    allProgress[userId] = userProgress;
    setToStorage(STORAGE_KEYS.PROGRESS, allProgress);

    if (isFirstTime) {
      this.addCredits(userId, 35, `Practice Exercise Completed: ${chapterId}`);
    }
  },

  recordReflection(userId: string, chapterId: string, reflectionText: string): void {
    const allProgress = getFromStorage<Record<string, UserProgress>>(STORAGE_KEYS.PROGRESS, {});
    const userProgress = this.getProgress(userId);
    const prev = userProgress.chapterProgress[chapterId] || {
      readingProgress: 0,
      isCompleted: false,
      quizCompleted: false,
      practiceCompleted: false,
      applicationCompleted: false,
    };

    const isFirst = !prev.reflectionText;

    userProgress.chapterProgress[chapterId] = {
      ...prev,
      reflectionText,
    };

    allProgress[userId] = userProgress;
    setToStorage(STORAGE_KEYS.PROGRESS, allProgress);

    if (isFirst) {
      this.addCredits(userId, 20, `Chapter Reflection Journaled: ${chapterId}`);
    }
  },

  // Notes
  getNotes(userId: string): UserNote[] {
    const notes = getFromStorage<UserNote[]>(STORAGE_KEYS.NOTES, []);
    return notes.filter(n => n.userId === userId);
  },

  saveNote(note: Omit<UserNote, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): UserNote {
    const notes = getFromStorage<UserNote[]>(STORAGE_KEYS.NOTES, []);
    const now = new Date().toISOString();

    if (note.id) {
      const idx = notes.findIndex(n => n.id === note.id);
      if (idx !== -1) {
        notes[idx] = {
          ...notes[idx],
          title: note.title,
          content: note.content,
          updatedAt: now,
        };
        setToStorage(STORAGE_KEYS.NOTES, notes);
        return notes[idx];
      }
    }

    const newNote: UserNote = {
      id: 'note_' + Date.now(),
      userId: note.userId,
      chapterId: note.chapterId,
      chapterTitle: note.chapterTitle,
      headId: note.headId,
      title: note.title,
      content: note.content,
      createdAt: now,
      updatedAt: now,
    };

    notes.unshift(newNote);
    setToStorage(STORAGE_KEYS.NOTES, notes);
    return newNote;
  },

  deleteNote(noteId: string): void {
    const notes = getFromStorage<UserNote[]>(STORAGE_KEYS.NOTES, []);
    setToStorage(STORAGE_KEYS.NOTES, notes.filter(n => n.id !== noteId));
  },

  // Bookmarks
  getBookmarks(userId: string): Bookmark[] {
    const bookmarks = getFromStorage<Bookmark[]>(STORAGE_KEYS.BOOKMARKS, []);
    return bookmarks.filter(b => b.userId === userId);
  },

  toggleBookmark(userId: string, chapterId: string, chapterTitle: string, headId: HeadId, headName: string): boolean {
    const bookmarks = getFromStorage<Bookmark[]>(STORAGE_KEYS.BOOKMARKS, []);
    const idx = bookmarks.findIndex(b => b.userId === userId && b.chapterId === chapterId);

    if (idx !== -1) {
      bookmarks.splice(idx, 1);
      setToStorage(STORAGE_KEYS.BOOKMARKS, bookmarks);
      return false;
    } else {
      bookmarks.unshift({
        id: 'bm_' + Date.now(),
        userId,
        chapterId,
        chapterTitle,
        headId,
        headName,
        createdAt: new Date().toISOString(),
      });
      setToStorage(STORAGE_KEYS.BOOKMARKS, bookmarks);
      return true;
    }
  },

  isBookmarked(userId: string, chapterId: string): boolean {
    const bookmarks = this.getBookmarks(userId);
    return bookmarks.some(b => b.chapterId === chapterId);
  },

  // Calendar
  getCalendarEvents(userId: string): CalendarEvent[] {
    const events = getFromStorage<CalendarEvent[]>(STORAGE_KEYS.CALENDAR, []);
    return events.filter(e => e.userId === userId);
  },

  createCalendarEvent(event: CalendarEvent): void {
    const events = getFromStorage<CalendarEvent[]>(STORAGE_KEYS.CALENDAR, []);
    events.push(event);
    setToStorage(STORAGE_KEYS.CALENDAR, events);
  },

  updateCalendarEvent(eventId: string, updates: Partial<CalendarEvent>): void {
    const events = getFromStorage<CalendarEvent[]>(STORAGE_KEYS.CALENDAR, []);
    const idx = events.findIndex(e => e.id === eventId);
    if (idx !== -1) {
      events[idx] = { ...events[idx], ...updates };
      setToStorage(STORAGE_KEYS.CALENDAR, events);
    }
  },

  deleteCalendarEvent(eventId: string): void {
    const events = getFromStorage<CalendarEvent[]>(STORAGE_KEYS.CALENDAR, []);
    setToStorage(STORAGE_KEYS.CALENDAR, events.filter(e => e.id !== eventId));
  },

  // Credits
  getCredits(userId: string): { total: number; history: SanCreditRecord[] } {
    const records = getFromStorage<SanCreditRecord[]>(STORAGE_KEYS.CREDITS, []);
    const userRecords = records.filter(r => r.userId === userId);
    const total = userRecords.reduce((acc, curr) => acc + curr.amount, 0);
    return { total, history: userRecords.reverse() };
  },

  addCredits(userId: string, amount: number, action: string): void {
    const records = getFromStorage<SanCreditRecord[]>(STORAGE_KEYS.CREDITS, []);
    const newRecord: SanCreditRecord = {
      id: 'cred_' + Date.now(),
      userId,
      amount,
      action,
      timestamp: new Date().toISOString(),
    };
    records.push(newRecord);
    setToStorage(STORAGE_KEYS.CREDITS, records);
  },

  // Ravana Mind Analyses
  getRavanaMindAnalyses(userId: string): RavanaMindAnalysis[] {
    const all = getFromStorage<RavanaMindAnalysis[]>(STORAGE_KEYS.RAVANA_MIND, []);
    return all.filter(a => a.userId === userId);
  },

  saveRavanaMindAnalysis(analysis: RavanaMindAnalysis): void {
    const all = getFromStorage<RavanaMindAnalysis[]>(STORAGE_KEYS.RAVANA_MIND, []);
    const idx = all.findIndex(a => a.id === analysis.id);
    if (idx !== -1) {
      all[idx] = analysis;
    } else {
      all.unshift(analysis);
    }
    setToStorage(STORAGE_KEYS.RAVANA_MIND, all);
  },

  // -----------------------------------------------------------
  // MULTILINGUAL ROADMAPS
  // -----------------------------------------------------------
  getRoadmaps(userId: string): MultilingualRoadmap[] {
    const all = getFromStorage<MultilingualRoadmap[]>(STORAGE_KEYS.ROADMAPS, []);
    return all.filter(r => r.userId === userId);
  },

  saveRoadmap(roadmap: MultilingualRoadmap): void {
    const all = getFromStorage<MultilingualRoadmap[]>(STORAGE_KEYS.ROADMAPS, []);
    const idx = all.findIndex(r => r.id === roadmap.id);
    if (idx !== -1) {
      all[idx] = roadmap;
    } else {
      all.unshift(roadmap);
    }
    setToStorage(STORAGE_KEYS.ROADMAPS, all);
  },

  deleteRoadmap(roadmapId: string): void {
    const all = getFromStorage<MultilingualRoadmap[]>(STORAGE_KEYS.ROADMAPS, []);
    setToStorage(STORAGE_KEYS.ROADMAPS, all.filter(r => r.id !== roadmapId));
  },

  // -----------------------------------------------------------
  // CHAKRA SESSIONS & WELLNESS JOURNAL
  // -----------------------------------------------------------
  getChakraSessions(userId: string): ChakraSession[] {
    const all = getFromStorage<ChakraSession[]>(STORAGE_KEYS.CHAKRA_SESSIONS, []);
    return all.filter(s => s.userId === userId);
  },

  saveChakraSession(session: ChakraSession): void {
    const all = getFromStorage<ChakraSession[]>(STORAGE_KEYS.CHAKRA_SESSIONS, []);
    all.unshift(session);
    setToStorage(STORAGE_KEYS.CHAKRA_SESSIONS, all);
  },

  getWellnessEntries(userId: string): WellnessJournalEntry[] {
    const all = getFromStorage<WellnessJournalEntry[]>(STORAGE_KEYS.WELLNESS_JOURNAL, []);
    return all.filter(e => e.userId === userId);
  },

  saveWellnessEntry(entry: WellnessJournalEntry): void {
    const all = getFromStorage<WellnessJournalEntry[]>(STORAGE_KEYS.WELLNESS_JOURNAL, []);
    all.unshift(entry);
    setToStorage(STORAGE_KEYS.WELLNESS_JOURNAL, all);
  },

  deleteWellnessEntry(entryId: string): void {
    const all = getFromStorage<WellnessJournalEntry[]>(STORAGE_KEYS.WELLNESS_JOURNAL, []);
    setToStorage(STORAGE_KEYS.WELLNESS_JOURNAL, all.filter(e => e.id !== entryId));
  },

  // -----------------------------------------------------------
  // DATA SOVEREIGNTY: EXPORT & ACCOUNT CLOSURE
  // -----------------------------------------------------------
  exportUserData(userId: string): Record<string, any> {
    const user = this.getAccounts().find(a => a.id === userId);
    const profile = this.getProfile(userId);
    const progress = this.getProgress(userId);
    const notes = this.getNotes(userId);
    const bookmarks = this.getBookmarks(userId);
    const calendar = this.getCalendarEvents(userId);
    const credits = this.getCredits(userId);
    const ravanaMind = this.getRavanaMindAnalyses(userId);
    const roadmaps = this.getRoadmaps(userId);
    const chakraSessions = this.getChakraSessions(userId);
    const wellness = this.getWellnessEntries(userId);

    // Filter out password hash and secrets
    const safeUser = user ? { ...user, passwordHash: undefined } : null;

    return {
      metadata: {
        system: 'SAN_R-10 DASASURYA AI',
        exportedAt: new Date().toISOString(),
        version: '2026.1',
      },
      user: safeUser,
      profile,
      progress,
      notes,
      bookmarks,
      calendar,
      credits,
      ravanaMind,
      roadmaps,
      chakraSessions,
      wellnessJournal: wellness,
    };
  },

  deleteAccount(userId: string): void {
    // Purge across all data stores
    setToStorage(STORAGE_KEYS.ACCOUNTS, this.getAccounts().filter(a => a.id !== userId));

    const profiles = getFromStorage<Record<string, UserProfile>>(STORAGE_KEYS.PROFILES, {});
    delete profiles[userId];
    setToStorage(STORAGE_KEYS.PROFILES, profiles);

    const progress = getFromStorage<Record<string, UserProgress>>(STORAGE_KEYS.PROGRESS, {});
    delete progress[userId];
    setToStorage(STORAGE_KEYS.PROGRESS, progress);

    setToStorage(STORAGE_KEYS.NOTES, getFromStorage<UserNote[]>(STORAGE_KEYS.NOTES, []).filter(n => n.userId !== userId));
    setToStorage(STORAGE_KEYS.BOOKMARKS, getFromStorage<Bookmark[]>(STORAGE_KEYS.BOOKMARKS, []).filter(b => b.userId !== userId));
    setToStorage(STORAGE_KEYS.CALENDAR, getFromStorage<CalendarEvent[]>(STORAGE_KEYS.CALENDAR, []).filter(c => c.userId !== userId));
    setToStorage(STORAGE_KEYS.CREDITS, getFromStorage<SanCreditRecord[]>(STORAGE_KEYS.CREDITS, []).filter(cr => cr.userId !== userId));
    setToStorage(STORAGE_KEYS.RAVANA_MIND, getFromStorage<RavanaMindAnalysis[]>(STORAGE_KEYS.RAVANA_MIND, []).filter(r => r.userId !== userId));
    setToStorage(STORAGE_KEYS.ROADMAPS, getFromStorage<MultilingualRoadmap[]>(STORAGE_KEYS.ROADMAPS, []).filter(rm => rm.userId !== userId));
    setToStorage(STORAGE_KEYS.CHAKRA_SESSIONS, getFromStorage<ChakraSession[]>(STORAGE_KEYS.CHAKRA_SESSIONS, []).filter(cs => cs.userId !== userId));
    setToStorage(STORAGE_KEYS.WELLNESS_JOURNAL, getFromStorage<WellnessJournalEntry[]>(STORAGE_KEYS.WELLNESS_JOURNAL, []).filter(w => w.userId !== userId));

    if (this.getActiveUser()?.id === userId) {
      this.setActiveSession(null);
    }
  }
};
