export type HeadId = 
  | 'head-01-knowledge-logic'
  | 'head-02-wealth-creation'
  | 'head-03-vitality'
  | 'head-04-critical-mind'
  | 'head-05-strategy-governance'
  | 'head-06-creative-arts'
  | 'head-07-emotional-mastery'
  | 'head-08-communication'
  | 'head-09-universal-sciences'
  | 'head-10-automation-systems';

// -------------------------------------------------------------
// MULTILINGUAL TYPES
// -------------------------------------------------------------
export type LanguageCode =
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'hi'
  | 'ta'
  | 'te'
  | 'bn'
  | 'zh'
  | 'ja'
  | 'ar'
  | 'pt'
  | 'ru'
  | 'it'
  | 'ko'
  | 'sa';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  direction?: 'ltr' | 'rtl';
}

export type ExplanationLevel = 'beginner' | 'intermediate' | 'advanced';

export interface LanguagePreferences {
  interfaceLanguage: LanguageCode;
  responseLanguage: LanguageCode;
  learningLanguage: LanguageCode;
}

export interface RoadmapStage {
  stageNumber: number;
  title: string;
  topics: string[];
  milestone: string;
  practiceTask: string;
  assessmentQuestion: string;
}

export interface MultilingualRoadmap {
  id: string;
  userId: string;
  goal: string;
  targetLanguage: LanguageCode;
  explanationLevel: ExplanationLevel;
  currentKnowledge: string;
  availableMinutesPerDay: number;
  targetDeadlineWeeks: number;
  isAgeAppropriate: boolean;
  stages: RoadmapStage[];
  createdAt: string;
}

// -------------------------------------------------------------
// VERIFICATION, AGE & PARENTAL TYPES
// -------------------------------------------------------------
export type VerificationChannel = 'email' | 'phone';
export type VerificationStatus = 'unverified' | 'pending' | 'verified';

export interface ParentalConsentRecord {
  required: boolean;
  authorized: boolean;
  parentName?: string;
  parentContact?: string;
  authorizedAt?: string;
  consentMethod?: 'email_authorization' | 'digital_signature' | 'parental_pin';
  passcodePin?: string;
  maxDailyMinutes: number;
  allowedFeatures: {
    externalLinks: boolean;
    publicSharing: boolean;
    advancedChakra: boolean;
    unguidedChat: boolean;
  };
}

export interface ConsentRecord {
  policyVersion: string;
  consentedAt: string;
  withdrawnAt?: string;
  types: string[]; // e.g. ['terms', 'privacy', 'age_policy', 'data_retention']
}

// -------------------------------------------------------------
// CHAKRA ALIGNMENT MODULE TYPES
// -------------------------------------------------------------
export type ChakraId =
  | 'muladhara'
  | 'svadhisthana'
  | 'manipura'
  | 'anahata'
  | 'vishuddha'
  | 'ajna'
  | 'sahasrara';

export interface ChakraInfo {
  id: ChakraId;
  name: string;
  sanskritName: string;
  translation: string;
  element: string;
  traditionalTheme: string;
  symbolism: string;
  traditionalColor: string;
  hexColor: string;
  scientificDistinction: string;
  gentlePractice: string;
  childSafePractice: string;
  reflectionThemes: string[];
}

export type ChakraGuidanceStyle = 'gentle-breathing' | 'mindful-focus' | 'silent-contemplation';

export interface ChakraSession {
  id: string;
  userId: string;
  chakraId: ChakraId;
  durationMinutes: number;
  guidanceStyle: ChakraGuidanceStyle;
  language: LanguageCode;
  completedDurationSeconds: number;
  completed: boolean;
  terminatedEarly: boolean;
  date: string;
  reflectionNote?: string;
}

export interface WellnessJournalEntry {
  id: string;
  userId: string;
  chakraId?: ChakraId;
  chakraName?: string;
  focusRating: number; // 1 to 5
  calmnessRating: number; // 1 to 5
  voluntaryReflection: string;
  date: string;
  private: boolean;
}

export interface HeadPillar {
  id: HeadId;
  number: number;
  romanNumeral: string;
  name: string;
  tagline: string;
  focusAreas: string[];
  light: string;
  shadow: string;
  selfCorrection: string;
  accentColor: string;
  accentBorder: string;
  iconName: string;
  description: string;
}

export interface SectionContent {
  id: string;
  title: string;
  content: string; // Markdown or rich formatted text
  keyDefinition?: {
    term: string;
    definition: string;
  };
  analogy?: string;
  diagramType?: 'flow' | 'matrix' | 'spectrum' | 'cycles';
  diagramData?: any;
  commonMistakes?: string[];
  codeSnippet?: {
    language: string;
    code: string;
    explanation: string;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptHint: string;
}

export interface PracticeExercise {
  id: string;
  title: string;
  prompt: string;
  starterContent?: string;
  rubric: string[];
  suggestedSolution: string;
}

export interface RealWorldApplication {
  id: string;
  title: string;
  scenario: string;
  deliverablePrompt: string;
  evaluationChecklist: string[];
}

export interface Chapter {
  id: string;
  moduleId: string;
  headId: HeadId;
  order: number;
  title: string;
  estimatedMinutes: number;
  learningObjectives: string[];
  sections: SectionContent[];
  pillarAlignment: {
    light: string;
    shadow: string;
    selfCorrection: string;
  };
  summary: string[];
  quiz: QuizQuestion[];
  practice: PracticeExercise;
  realWorldApplication: RealWorldApplication;
  reflectionPrompt: string;
}

export interface Module {
  id: string;
  courseId: string;
  headId: HeadId;
  order: number;
  title: string;
  description: string;
  chapters: Chapter[];
}

export interface Course {
  id: string;
  headId: HeadId;
  title: string;
  subtitle: string;
  description: string;
  level: 'Foundational' | 'Beginner' | 'Intermediate' | 'Advanced';
  modules: Module[];
}

export interface UserProgress {
  userId: string;
  chapterProgress: Record<string, {
    readingProgress: number; // 0-100%
    isCompleted: boolean;
    completedAt?: string;
    quizScore?: number;
    quizCompleted: boolean;
    practiceCompleted: boolean;
    practiceSubmission?: string;
    applicationCompleted: boolean;
    reflectionText?: string;
  }>;
  lastActiveChapterId?: string;
  lastActiveHeadId?: HeadId;
  streakDays: number;
  lastActiveDate: string;
  totalReadingMinutes: number;
}

export interface UserNote {
  id: string;
  userId: string;
  chapterId: string;
  chapterTitle: string;
  headId: HeadId;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  chapterId: string;
  chapterTitle: string;
  headId: HeadId;
  headName: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  type: 'learning' | 'practice' | 'review' | 'reflection' | 'vitality';
  date: string; // YYYY-MM-DD
  time?: string;
  chapterId?: string;
  isCompleted: boolean;
  isMissed?: boolean;
  notes?: string;
}

export interface SanCreditRecord {
  id: string;
  userId: string;
  amount: number;
  action: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  bio: string;
  avatarUrl: string;
  interests: string[];
  preferredHeads: HeadId[];
  learningGoals: string;
  skillLevel: 'Foundational' | 'Practitioner' | 'Advanced Architect';
  occupation?: string;
  studyCareerGoal?: string;
  preferredSchedule: '15 mins/day' | '30 mins/day' | '1 hour/day' | 'Deep Weekend Immersion';
  dateOfBirth?: string;
  age?: number;
  isUnder12?: boolean;
  languagePreferences: LanguagePreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserAccount {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  verificationChannel: VerificationChannel;
  isVerified: boolean;
  verifiedAt?: string;
  dateOfBirth: string; // YYYY-MM-DD
  age: number;
  isUnder12: boolean;
  isMinor: boolean;
  passwordHash: string;
  role: 'learner' | 'curator_admin';
  parentalConsent?: ParentalConsentRecord;
  consentRecords: ConsentRecord[];
  languagePreferences: LanguagePreferences;
  createdAt: string;
}

export interface RavanaMindAnalysis {
  id: string;
  userId: string;
  problem: string;
  selectedHeads: HeadId[];
  analysisText: string;
  userDecision?: string;
  reflectionNotes?: string;
  createdAt: string;
}
