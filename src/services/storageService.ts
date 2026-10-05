import { Bookmark, CalendarEvent, RavanaMindAnalysis, SanCreditRecord, UserAccount, UserNote, UserProfile, UserProgress, HeadId } from '../types';
import { HEAD_PILLARS, COURSES } from '../data/curriculum';

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

// 1. ACCOUNT & AUTH SERVICE
export const storageService = {
  // Accounts
  getAccounts(): UserAccount[] {
    return getFromStorage<UserAccount[]>(STORAGE_KEYS.ACCOUNTS, []);
  },

  registerAccount(user: { fullName: string; username: string; email: string; password: string }): { success: boolean; user?: UserAccount; error?: string } {
    const accounts = this.getAccounts();
    const cleanEmail = user.email.trim().toLowerCase();
    const cleanUsername = user.username.trim().toLowerCase();

    if (accounts.some(a => a.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email address already exists.' };
    }
    if (accounts.some(a => a.username.toLowerCase() === cleanUsername)) {
      return { success: false, error: 'This username is already taken. Please choose another.' };
    }

    // In local prototype, create secure simple hash
    const newUser: UserAccount = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      fullName: user.fullName.trim(),
      username: cleanUsername,
      email: cleanEmail,
      passwordHash: btoa(user.password), // Obfuscated prototype storage
      role: 'learner',
      createdAt: new Date().toISOString(),
    };

    accounts.push(newUser);
    setToStorage(STORAGE_KEYS.ACCOUNTS, accounts);

    // Initialize Default Profile
    const profile: UserProfile = {
      id: 'prof_' + newUser.id,
      userId: newUser.id,
      fullName: newUser.fullName,
      username: newUser.username,
      email: newUser.email,
      bio: 'Lifelong learner building mastery through the 10 Heads.',
      avatarUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${newUser.username}`,
      interests: ['Knowledge & Logic', 'Vitality', 'Strategy', 'Systems'],
      preferredHeads: ['head-01-knowledge-logic', 'head-03-vitality', 'head-05-strategy-governance'],
      learningGoals: 'Master first-principles thinking and build sustainable daily learning architecture.',
      skillLevel: 'Foundational',
      preferredSchedule: '30 mins/day',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.saveProfile(profile);

    // Set active session
    this.setActiveSession(newUser.id);

    // Award welcome credits
    this.addCredits(newUser.id, 50, 'Welcome to SAN_R-10 Architecture');

    // Create Initial Calendar Starter Event
    const today = new Date().toISOString().split('T')[0];
    this.createCalendarEvent({
      id: 'cal_' + Date.now(),
      userId: newUser.id,
      title: 'Introductory Chapter: The Socratic Scalpel',
      type: 'learning',
      date: today,
      time: '18:00',
      chapterId: 'chap-01-first-principles',
      isCompleted: false,
      notes: 'Begin reading in Head 01',
    });

    return { success: true, user: newUser };
  },

  authenticate(loginIdentifier: string, password: string): { success: boolean; user?: UserAccount; error?: string } {
    const cleanId = loginIdentifier.trim().toLowerCase();
    const accounts = this.getAccounts();
    const account = accounts.find(a => a.email.toLowerCase() === cleanId || a.username.toLowerCase() === cleanId);

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
      return false; // Removed
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
      return true; // Added
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
  }
};
