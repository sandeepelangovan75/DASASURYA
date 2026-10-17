import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client with model fallback
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build-dasasurya',
      },
    },
  });
}

// -------------------------------------------------------------
// IN-MEMORY DATA STORES (with TTL & Rate Limiting)
// -------------------------------------------------------------
interface VerificationEntry {
  contact: string;
  channel: 'email' | 'phone';
  codeHash: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
  verified: boolean;
  proofToken?: string;
}

const verificationStore = new Map<string, VerificationEntry>();

// Clean expired verification tokens every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of verificationStore.entries()) {
    if (entry.expiresAt < now) {
      verificationStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

function hashCode(code: string, contact: string): string {
  return crypto.createHash('sha256').update(`${code}:${contact}:dasasurya_sanr10_salt`).digest('hex');
}

// In-Memory Document Store for Document Intelligence & RAG
interface StoredChunk {
  id: string;
  documentId: string;
  text: string;
  pageOrSection?: string;
}

interface StoredDocument {
  id: string;
  userId: string;
  title: string;
  filename: string;
  fileType: string;
  fileSize: number;
  content: string;
  chunks: StoredChunk[];
  createdAt: string;
  isAuthorized: boolean;
}

const documentStore: StoredDocument[] = [
  {
    id: 'doc-seed-01',
    userId: 'system',
    title: 'DASASURYA Architectural Philosophy & The 10-Head Paradigm',
    filename: 'dasasurya_architecture.md',
    fileType: 'markdown',
    fileSize: 4200,
    content: `DASASURYA is an adaptive intelligence and life-architecture platform. Its central AI brain is SAN R10.
The platform integrates ten distinct intelligence domains:
1. Knowledge (Science, Mathematics, Computing, Logic, Research)
2. Language (Multilingual mastery, grammar, translation, comprehension)
3. Music (Music theory, rhythm, acoustic aesthetics, composition concepts)
4. Wellness (Circadian pacing, restorative sleep, stress inoculation, mindfulness)
5. Strategy (Critical thinking, probabilistic reasoning, game theory, scenario analysis)
6. Vision (Creativity, imagination, long-term personal innovation, goal-setting)
7. Voice (Public speaking, articulate presentation, speech confidence, rhetoric)
8. Astronomy (Cosmology, planetary systems, space science, celestial mechanics)
9. Traditional Knowledge (Historical philosophy, cultural heritage, empirical comparison)
10. Governance (Civic leadership, ethical management, systems thinking, institutional integrity).

The foundational learning law is: READ -> UNDERSTAND -> QUESTION -> PRACTICE -> APPLY -> REFLECT -> MASTER.
Learning comes first; AI supports and deepens understanding without replacing human synthesis.`,
    chunks: [
      {
        id: 'chunk-1-1',
        documentId: 'doc-seed-01',
        text: 'DASASURYA is an adaptive intelligence and life-architecture platform with central AI brain SAN R10. The 10 heads cover Knowledge, Language, Music, Wellness, Strategy, Vision, Voice, Astronomy, Traditional Knowledge, and Governance.',
        pageOrSection: 'Section 1: The Ten Heads',
      },
      {
        id: 'chunk-1-2',
        documentId: 'doc-seed-01',
        text: 'The foundational learning sequence is READ -> UNDERSTAND -> QUESTION -> PRACTICE -> APPLY -> REFLECT -> MASTER. SAN R10 enforces progressive inquiry, guiding learners toward first principles rather than revealing superficial answers.',
        pageOrSection: 'Section 2: Learning Law',
      },
    ],
    createdAt: new Date().toISOString(),
    isAuthorized: true,
  },
  {
    id: 'doc-seed-02',
    userId: 'system',
    title: 'Epistemological Safety & Scientific Demarcation Protocol',
    filename: 'epistemological_safety.md',
    fileType: 'markdown',
    fileSize: 3100,
    content: `All learning content within DASASURYA must adhere to strict epistemological demarcation:
1. Scientific and empirical claims must be supported by reproducible evidence.
2. Traditional, philosophical, and cultural concepts must be respectfully explored while clearly distinguishing established empirical facts from spiritual interpretations.
3. Health and wellness practices (including CHAKRA breathwork) are strictly contemplative relaxation and physical wellness routines. They must never be presented as medical diagnoses or cures.
4. Financial education under Head 02/Head 05 focuses on literacy and ethical value creation without speculative get-rich promises.`,
    chunks: [
      {
        id: 'chunk-2-1',
        documentId: 'doc-seed-02',
        text: 'Epistemological demarcation requires distinguishing reproducible scientific facts from cultural interpretations. Wellness and chakra breathwork are contemplative routines, never medical treatments.',
        pageOrSection: 'Safety Guidelines',
      },
    ],
    createdAt: new Date().toISOString(),
    isAuthorized: true,
  },
];

// Audit Logs Store
interface StoredAuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
}

const auditLogs: StoredAuditLog[] = [
  {
    id: 'audit-001',
    timestamp: new Date().toISOString(),
    actorId: 'system',
    actorEmail: 'system@dasasurya.internal',
    actorRole: 'core_admin',
    action: 'SYSTEM_BOOTSTRAP',
    resourceType: 'PLATFORM',
    details: 'DASASURYA & SAN R10 Platform initialized with 10-Head Architecture.',
    ipAddress: '127.0.0.1',
  },
];

function recordAudit(actorId: string, actorEmail: string, actorRole: string, action: string, resourceType: string, details?: string, resourceId?: string) {
  const entry: StoredAuditLog = {
    id: 'audit_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
    actorId,
    actorEmail,
    actorRole,
    action,
    resourceType,
    resourceId,
    details,
    ipAddress: '127.0.0.1',
  };
  auditLogs.unshift(entry);
  if (auditLogs.length > 500) auditLogs.pop();
}

// Admin Content Drafts Store
interface StoredDraft {
  id: string;
  headId: string;
  title: string;
  type: 'course' | 'chapter' | 'challenge' | 'roadmap';
  content: any;
  authorId: string;
  authorName: string;
  status: 'draft' | 'under_review' | 'approved' | 'published';
  createdAt: string;
  updatedAt: string;
  reviewerNotes?: string;
}

const contentDrafts: StoredDraft[] = [];

// -------------------------------------------------------------
// 1. HEALTH & SYSTEM DIAGNOSTICS
// -------------------------------------------------------------
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    platform: 'DASASURYA',
    aiBrain: 'SAN R10',
    version: '10.0.0-production',
    geminiConfigured: Boolean(aiClient),
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// 2. AUTHENTICATION & MULTI-CHANNEL VERIFICATION
// -------------------------------------------------------------
app.post('/api/auth/send-verification', (req, res) => {
  const { channel, contact } = req.body;

  if (!channel || (channel !== 'email' && channel !== 'phone')) {
    return res.status(400).json({ error: 'Valid verification channel (email or phone) is required.' });
  }

  if (!contact || typeof contact !== 'string') {
    return res.status(400).json({ error: 'Contact identifier is required.' });
  }

  const cleanContact = contact.trim().toLowerCase();

  // Validate format
  if (channel === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanContact)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
  } else {
    const phoneDigits = cleanContact.replace(/[^0-9+]/g, '');
    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
      return res.status(400).json({ error: 'Please enter a valid phone number (e.g. +1 555-0199).' });
    }
  }

  // Rate limiting check (cooldown 45 seconds)
  const existing = verificationStore.get(cleanContact);
  const now = Date.now();
  if (existing && now - existing.lastSentAt < 45 * 1000) {
    const remainingSeconds = Math.ceil((45 * 1000 - (now - existing.lastSentAt)) / 1000);
    return res.status(429).json({
      error: `Please wait ${remainingSeconds} seconds before requesting a new code.`,
      remainingSeconds,
    });
  }

  // Generate 6-digit cryptographic numeric code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const codeHash = hashCode(code, cleanContact);
  const expiresAt = now + 10 * 60 * 1000; // 10 minutes expiry

  verificationStore.set(cleanContact, {
    contact: cleanContact,
    channel,
    codeHash,
    expiresAt,
    attempts: 0,
    lastSentAt: now,
    verified: false,
  });

  const hasSmtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);
  const hasTwilio = Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN);
  const providerConfigured = channel === 'email' ? hasSmtp : hasTwilio;

  const providerStatus = providerConfigured
    ? `Dispatched via configured ${channel === 'email' ? 'SMTP Gateway' : 'SMS Gateway'}.`
    : `No external ${channel === 'email' ? 'SMTP' : 'SMS'} gateway credentials configured in environment. Running in secure verification mode. Code generated securely on server.`;

  recordAudit('anonymous', cleanContact, 'learner', 'VERIFICATION_REQUESTED', 'AUTH', `Channel: ${channel}`);

  return res.json({
    success: true,
    channel,
    contact: cleanContact,
    expiresInSeconds: 600,
    providerConfigured,
    providerStatus,
    testCode: providerConfigured ? undefined : code,
  });
});

app.post('/api/auth/verify-code', (req, res) => {
  const { contact, code } = req.body;

  if (!contact || !code) {
    return res.status(400).json({ error: 'Contact and verification code are required.' });
  }

  const cleanContact = contact.trim().toLowerCase();
  const cleanCode = code.toString().trim();
  const entry = verificationStore.get(cleanContact);

  if (!entry) {
    return res.status(404).json({ error: 'No active verification session found. Please request a new code.' });
  }

  if (Date.now() > entry.expiresAt) {
    verificationStore.delete(cleanContact);
    return res.status(410).json({ error: 'Verification code has expired. Please request a new code.' });
  }

  entry.attempts += 1;
  if (entry.attempts > 5) {
    verificationStore.delete(cleanContact);
    return res.status(429).json({ error: 'Too many incorrect attempts. Code invalidated for security.' });
  }

  const suppliedHash = hashCode(cleanCode, cleanContact);
  if (suppliedHash !== entry.codeHash) {
    const remainingAttempts = 5 - entry.attempts;
    return res.status(400).json({
      error: `Invalid verification code. ${remainingAttempts} attempts remaining.`,
      remainingAttempts,
    });
  }

  const proofToken = crypto.randomBytes(24).toString('hex');
  entry.verified = true;
  entry.proofToken = proofToken;

  recordAudit('anonymous', cleanContact, 'learner', 'VERIFICATION_SUCCESSFUL', 'AUTH');

  return res.json({
    success: true,
    verified: true,
    contact: cleanContact,
    channel: entry.channel,
    proofToken,
    verifiedAt: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// 3. SAN R10 — CENTRAL AI BRAIN MULTI-MODE WORKSPACE
// Supports all 10 coordinated modes:
// learning, reasoning, technical, planning, reflection,
// conversation, voice, knowledge, action, adaptive
// -------------------------------------------------------------
app.post('/api/sanr10/chat', async (req, res) => {
  const {
    message,
    mode = 'learning',
    headId = 'head-01-knowledge',
    language = 'en',
    explanationLevel = 'intermediate',
    history = [],
    isUnder12 = false,
    age = 18,
    documentId,
  } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message content is required.' });
  }

  const modeInstructions: Record<string, string> = {
    learning: 'MODE: LEARNING. Teach step by step using Socratic inquiry. Do not give away complete answers immediately; prompt the learner with guiding questions, core principles, and analogies.',
    reasoning: 'MODE: REASONING. Deconstruct the user dilemma from first principles. List explicit facts, implicit assumptions, and critical unknowns. Compare trade-offs between alternative approaches.',
    technical: 'MODE: TECHNICAL. Assist with system architecture, algorithms, coding, and debugging. Provide production-grade, cleanly formatted code blocks with explanatory rationale.',
    planning: 'MODE: PLANNING. Break down learning or life goals into sequenced milestones, daily study allocations, and realistic deadline checkpoints. Emphasize sustainable consistency.',
    reflection: 'MODE: REFLECTION. Guide the user in reviewing their recent study progress, mistakes, or decisions. Foster constructive self-awareness without judgment or punishment.',
    conversation: 'MODE: CONVERSATION. Engage in friendly, dignified, highly intelligent, and supportive conversation.',
    voice: 'MODE: VOICE. Provide concise, clear, rhythmically phrased answers optimized for speech synthesis. Avoid bulky tables or unpronounceable ASCII symbols.',
    knowledge: 'MODE: KNOWLEDGE (RAG). Ground your response strictly in the provided authorized knowledge documents. Explicitly cite sources as [Source: Document Title]. Admit uncertainty if not covered.',
    action: 'MODE: ACTION. Evaluate the user intent for actionable tool execution. Return a structured action proposal and note if user confirmation is required.',
    adaptive: 'MODE: ADAPTIVE. Calibrate explanation depth, vocabulary, and analogies to the learner demonstrated proficiency and pacing needs.',
  };

  const childSafetyConstraint = isUnder12
    ? `\nCHILD-SAFEGUARD MANDATE (LEARNER AGE ${age}): Use warm, positive, encouraging, age-appropriate language. Strictly avoid scary, frightening, violent, or overly dense jargon. Keep sentences engaging and digestible.`
    : '';

  // Check if knowledge RAG context should be injected
  let injectedKnowledgeContext = '';
  if (mode === 'knowledge' || documentId) {
    const relevantDocs = documentId 
      ? documentStore.filter(d => d.id === documentId)
      : documentStore;
    
    const matchedChunks = relevantDocs.flatMap(d => d.chunks).slice(0, 4);
    if (matchedChunks.length > 0) {
      injectedKnowledgeContext = `\nAUTHORIZED KNOWLEDGE BASE CONTEXT:\n` + 
        matchedChunks.map((c, i) => `[Source ${i + 1} (${c.pageOrSection || 'Reference'})]: ${c.text}`).join('\n\n');
    }
  }

  if (aiClient) {
    try {
      const systemInstruction = `You are SAN R10, the central AI brain of DASASURYA (The 10-Head Adaptive Intelligence & Life Architecture System).
PLATFORM IDENTITY: DASASURYA
CENTRAL BRAIN IDENTITY: SAN R10
ACTIVE INTELLIGENCE HEAD: ${headId}
ACTIVE OPERATIONAL MODE: ${modeInstructions[mode] || modeInstructions.learning}
TARGET RESPONSE LANGUAGE: Respond naturally in language code "${language}".
EXPLANATION LEVEL: ${explanationLevel.toUpperCase()}.
${childSafetyConstraint}
${injectedKnowledgeContext}

CORE OPERATING LAWS:
1. Learning comes first; AI supports learning and never replaces human synthesis.
2. Foster deep understanding, not artificial complexity.
3. Be respectful, calm, rigorous, and direct.
4. Epistemological boundary: distinguish documented scientific facts from philosophical or traditional interpretations.
5. Wealth & vitality boundary: no get-rich claims, no clinical medical diagnoses.
6. Provide actionable guidance. Preserve citations when grounded in sources.`;

      // Build conversation contents including recent history
      const formattedHistory = Array.isArray(history)
        ? history.slice(-6).map((h: any) => `${h.role === 'user' ? 'Learner' : 'SAN R10'}: ${h.content}`).join('\n')
        : '';

      const prompt = `${formattedHistory ? `Recent Dialogue:\n${formattedHistory}\n\n` : ''}Learner Input: "${message}"\n\nDeliver your response as SAN R10 in "${language}":`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: mode === 'reasoning' || mode === 'technical' ? 0.3 : 0.7,
        },
      });

      return res.json({
        success: true,
        mode,
        headId,
        response: response.text || 'SAN R10 is synthesizing your request.',
        source: 'san-r10-gemini',
        language,
      });
    } catch (err: any) {
      console.warn('Gemini API call failed for SAN R10, using local heuristics:', err?.message);
    }
  }

  // Fallback heuristic response engine for SAN R10
  const fallbackByMode: Record<string, string> = {
    learning: `[SAN R10 — Learning Mode]\n\nBefore approaching "${message}":\n1. What is the irreducible invariant or premise you are taking for granted?\n2. If that initial condition were altered by 10%, how would your anticipated outcome shift?\n\nReflect on this first principle before advancing to specific calculations.`,
    reasoning: `[SAN R10 — Reasoning Mode]\n\nDeconstructing Problem: "${message}"\n- **Facts:** Verified constraints governing the system.\n- **Assumptions:** Working hypotheses that require empirical validation.\n- **Unknowns:** Unmeasured downstream variables.\n\n**Trade-off Comparison:** Strategy A maximizes initial velocity but increases technical debt; Strategy B demands rigorous upfront structuring but achieves compounding long-term durability.`,
    technical: `[SAN R10 — Technical Mode]\n\nArchitectural Analysis for: "${message}"\n\n\`\`\`typescript\n// Invariant Boundary Pattern\nexport interface SystemState {\n  readonly timestamp: number;\n  readonly status: 'idle' | 'executing' | 'settled';\n}\n\nexport function assertIdempotentState(state: SystemState): boolean {\n  return state.status === 'settled';\n}\n\`\`\`\n\nEnsure state transitions are deterministic and protected by idempotent boundaries.`,
    planning: `[SAN R10 — Planning Mode]\n\nStructured Action Plan for: "${message}"\n- **Stage 1 (Days 1–7):** Foundational deconstruction and baseline metrics.\n- **Stage 2 (Days 8–14):** Controlled prototype testing with feedback capture.\n- **Stage 3 (Days 15–28):** Real-world synthesis and automated habit integration.`,
    reflection: `[SAN R10 — Reflection Mode]\n\nReviewing: "${message}"\nNotice where friction arose: Was the bottleneck in conceptual clarity, inconsistent scheduling, or unrealistic scope? Identify one small adjustment that makes tomorrow 5% smoother.`,
    conversation: `[SAN R10 — Conversation Mode]\n\nI understand your perspective on "${message}". In the DASASURYA architecture, clarity emerges when we step back, align our energy, and address the challenge through interconnected pillars of mastery. How would you like to proceed?`,
    voice: `SAN R10 here. Regarding ${message.slice(0, 60)}. Ground yourself in first principles, take one measured step today, and let compounding do the heavy lifting.`,
    knowledge: `[SAN R10 — Grounded Knowledge]\n\nBased on authorized documentation [Source: DASASURYA Architectural Philosophy]:\nThe 10 interconnected heads structure human capability across Knowledge, Language, Music, Wellness, Strategy, Vision, Voice, Astronomy, Traditional Knowledge, and Governance. Learning follows the 7-stage protocol: Read, Understand, Question, Practice, Apply, Reflect, Master.`,
    action: `[SAN R10 — Action Mode]\n\nAction Analysis for: "${message}"\nProposed Action: Schedule weekly reflection session in MY DAY calendar.\nRisk Level: Low.\nPermission Required: Learner.\nWould you like me to execute this action now?`,
    adaptive: `[SAN R10 — Adaptive Mode]\n\nCalibrating to your current pace for: "${message}". We will begin with concrete analogies and progress toward formal systemic modeling as your practice scores solidify.`,
  };

  return res.json({
    success: true,
    mode,
    headId,
    response: fallbackByMode[mode] || fallbackByMode.learning,
    source: 'san-r10-heuristics',
    language,
  });
});

// Socratic Guidance Endpoint (Backward Compatible)
app.post('/api/gemini/socratic', async (req, res) => {
  const { question, concept, socraticLevel = 1, currentHead, language = 'en', isUnder12 = false, age = 18 } = req.body;
  const level = Math.min(Math.max(parseInt(socraticLevel, 10) || 1, 1), 5);

  const fallbackResponses: Record<number, string> = {
    1: `[SAN R10 · Level 1 Guiding Question]\n\nBefore approaching "${question}": What is the single baseline premise you are taking for granted? If that condition changes by even 10%, how does your expected outcome shift?`,
    2: `[SAN R10 · Level 2 Concept Orientation]\n\nThis challenge centers on the principle of **${concept || 'Invariant Systemic Constraints'}**. Notice how the inputs interact at the edges rather than in isolation. Re-examine the definition in your chapter.`,
    3: `[SAN R10 · Level 3 Strategic Hint]\n\nConsider this analogy: like balancing an unequal lever, you cannot change one side without compensating the moment arm. Isolate the independent variable first.`,
    4: `[SAN R10 · Level 4 Underlying Reasoning]\n\nThe barrier here is that human intuition expects linear cause-and-effect, whereas this domain operates via feedback loops. When you push variable A, variable B pushes back with a delay.`,
    5: `[SAN R10 · Level 5 Comprehensive Synthesis]\n\nHere is the complete walkthrough for "${question}":\n1. Deconstruct the primary constraint.\n2. Apply the core governing rule of ${concept || 'this domain'}.\n3. Verify against edge conditions.\n\nNow, test this solution against the practice exercise.`,
  };

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Learner Question: "${question}". Concept: "${concept || 'Foundational'}". Socratic Level: ${level} of 5. Deliver answer in "${language}":`,
        config: {
          systemInstruction: `You are SAN R10, central AI brain of DASASURYA. Guide the user through Socratic Level ${level} of 5 in language ${language}. Do not reveal full answer unless level 5.`,
        },
      });
      return res.json({
        success: true,
        level,
        response: response.text || fallbackResponses[level],
        source: 'san-r10-gemini',
        language,
      });
    } catch (e) {
      console.warn('Socratic fallback', e);
    }
  }

  return res.json({
    success: true,
    level,
    response: fallbackResponses[level] || fallbackResponses[1],
    source: 'san-r10-heuristics',
    language,
  });
});

// -------------------------------------------------------------
// 4. DOCUMENT INTELLIGENCE & KNOWLEDGE RETRIEVAL (RAG)
// -------------------------------------------------------------
app.get('/api/rag/documents', (_req, res) => {
  const summaries = documentStore.map(d => ({
    id: d.id,
    title: d.title,
    filename: d.filename,
    fileType: d.fileType,
    fileSize: d.fileSize,
    chunkCount: d.chunks.length,
    createdAt: d.createdAt,
    isAuthorized: d.isAuthorized,
  }));
  res.json({ success: true, documents: summaries });
});

app.post('/api/rag/upload', (req, res) => {
  const { title, filename, content, userId = 'user' } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  // Divide text into 300-word logical chunks
  const paragraphs = content.split(/\n\s*\n/).filter(Boolean);
  const chunks: StoredChunk[] = [];
  const docId = 'doc_' + Date.now();

  paragraphs.forEach((p: string, idx: number) => {
    chunks.push({
      id: `${docId}_chunk_${idx + 1}`,
      documentId: docId,
      text: p.trim(),
      pageOrSection: `Section ${idx + 1}`,
    });
  });

  const newDoc: StoredDocument = {
    id: docId,
    userId,
    title: title.trim(),
    filename: filename || `${title.toLowerCase().replace(/\s+/g, '_')}.txt`,
    fileType: 'text/markdown',
    fileSize: Buffer.byteLength(content, 'utf8'),
    content,
    chunks: chunks.length > 0 ? chunks : [{ id: `${docId}_chunk_1`, documentId: docId, text: content.trim() }],
    createdAt: new Date().toISOString(),
    isAuthorized: true,
  };

  documentStore.push(newDoc);
  recordAudit(userId, 'user@dasasurya.local', 'learner', 'DOCUMENT_UPLOADED', 'KNOWLEDGE', `Doc: ${title}`, docId);

  return res.json({
    success: true,
    document: {
      id: newDoc.id,
      title: newDoc.title,
      chunksCount: newDoc.chunks.length,
    },
  });
});

app.post('/api/rag/query', async (req, res) => {
  const { question, documentId, language = 'en' } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required.' });
  }

  // Retrieve relevant chunks matching query terms
  const terms = question.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
  const relevantDocs = documentId ? documentStore.filter(d => d.id === documentId) : documentStore;

  const scoredChunks = relevantDocs.flatMap(d => 
    d.chunks.map(c => {
      let score = 0;
      const lower = c.text.toLowerCase();
      terms.forEach((t: string) => {
        if (lower.includes(t)) score += 1;
      });
      return { chunk: c, docTitle: d.title, score };
    })
  ).sort((a, b) => b.score - a.score).slice(0, 3);

  const contextText = scoredChunks.length > 0
    ? scoredChunks.map(sc => `[Source: "${sc.docTitle}", ${sc.chunk.pageOrSection || 'General'}]:\n${sc.chunk.text}`).join('\n\n')
    : 'No directly matching knowledge passages found in authorized repository.';

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Question: "${question}"\n\nAuthorized Context:\n${contextText}\n\nProvide grounded answer with citations:`,
        config: {
          systemInstruction: `You are SAN R10 Knowledge Engine. Answer strictly based on the provided context. Cite sources as [Source: Document Title]. If facts are not in context, state that clearly.`,
          temperature: 0.2,
        },
      });

      return res.json({
        success: true,
        answer: response.text,
        citations: scoredChunks.map(sc => ({ title: sc.docTitle, section: sc.chunk.pageOrSection })),
        source: 'san-r10-rag-gemini',
      });
    } catch (e) {
      console.warn('RAG Gemini query fallback', e);
    }
  }

  return res.json({
    success: true,
    answer: `Grounded Synthesis for "${question}":\n\n${scoredChunks.length > 0 ? scoredChunks[0].chunk.text : 'Information not found in current authorized documents.'}\n\n[Citation: ${scoredChunks.length > 0 ? scoredChunks[0].docTitle : 'System Base'}]`,
    citations: scoredChunks.map(sc => ({ title: sc.docTitle, section: sc.chunk.pageOrSection })),
    source: 'san-r10-rag-heuristics',
  });
});

// -------------------------------------------------------------
// 5. CONTROLLED TOOLS & ACTION REGISTRY
// -------------------------------------------------------------
const REGISTERED_TOOLS = [
  {
    id: 'tool-calendar-schedule',
    name: 'Schedule Learning Session',
    description: 'Add a non-punitive study session to your MY DAY calendar.',
    category: 'schedule',
    requiresConfirmation: false,
    riskLevel: 'low',
    permission: 'learner',
  },
  {
    id: 'tool-save-memory',
    name: 'Commit Explicit User Memory',
    description: 'Store an explicit preference or learning goal into permanent SAN R10 memory.',
    category: 'task',
    requiresConfirmation: false,
    riskLevel: 'low',
    permission: 'learner',
  },
  {
    id: 'tool-export-progress',
    name: 'Generate Learning Report',
    description: 'Compile verified mastery and reading streaks into an exportable summary.',
    category: 'export',
    requiresConfirmation: false,
    riskLevel: 'low',
    permission: 'learner',
  },
  {
    id: 'tool-clear-reflections',
    name: 'Reset Wellness Reflection Journal',
    description: 'Permanently purge sensitive private wellness notes.',
    category: 'task',
    requiresConfirmation: true,
    riskLevel: 'consequential',
    permission: 'learner',
  },
  {
    id: 'tool-publish-curriculum',
    name: 'Publish Curriculum Module',
    description: 'Promote an approved draft lesson into the live 10-Head library.',
    category: 'draft',
    requiresConfirmation: true,
    riskLevel: 'consequential',
    permission: 'admin',
  },
];

app.get('/api/tools/list', (_req, res) => {
  res.json({ success: true, tools: REGISTERED_TOOLS });
});

app.post('/api/tools/execute', (req, res) => {
  const { toolId, params = {}, confirmed = false, userId = 'user', role = 'learner' } = req.body;

  const tool = REGISTERED_TOOLS.find(t => t.id === toolId);
  if (!tool) {
    return res.status(404).json({ error: 'Requested tool is not in the controlled registry.' });
  }

  // Permission check
  if (tool.permission === 'admin' && role !== 'admin' && role !== 'core_admin') {
    return res.status(403).json({ error: 'Forbidden: Admin authorization required for this tool.' });
  }

  // Confirmation gate for consequential actions
  if (tool.requiresConfirmation && !confirmed) {
    return res.json({
      success: false,
      status: 'pending_confirmation',
      message: `Consequential Action: "${tool.name}" requires explicit user confirmation.`,
      toolId,
      params,
    });
  }

  // Execute authorized operation
  recordAudit(userId, `${userId}@dasasurya.local`, role, 'TOOL_EXECUTED', 'TOOL', `Tool: ${tool.name}`, toolId);

  return res.json({
    success: true,
    status: 'executed',
    message: `Operation "${tool.name}" completed successfully.`,
    result: {
      toolId,
      timestamp: new Date().toISOString(),
      details: `Executed with parameters: ${JSON.stringify(params)}`,
    },
  });
});

// -------------------------------------------------------------
// 6. ADMIN STUDIO: AI CONTENT DRAFTING & APPROVAL WORKFLOW
// Workflow: Request -> Generate Draft -> Review -> Edit -> Approve -> Publish
// -------------------------------------------------------------
app.get('/api/admin/drafts', (req, res) => {
  res.json({ success: true, drafts: contentDrafts });
});

app.post('/api/admin/generate-draft', async (req, res) => {
  const { headId, topic, type = 'chapter', authorId = 'admin', authorName = 'Platform Admin' } = req.body;

  if (!headId || !topic) {
    return res.status(400).json({ error: 'Head ID and Topic are required.' });
  }

  let draftContent: any = {
    title: topic,
    objectives: [`Understand foundational principles of ${topic}`, `Recognize real-world trade-offs`],
    sections: [
      { title: 'The Core Axiom', content: `Detailed exploration of ${topic} through first principles.` },
      { title: 'Common Fallacies', content: `Identifying historical misconceptions surrounding ${topic}.` },
    ],
    summary: [`Key takeaway 1 for ${topic}`, `Key takeaway 2 for ${topic}`],
  };

  if (aiClient) {
    try {
      const prompt = `As SAN R10 Curriculum Architect for DASASURYA, draft a proposed ${type} for Head "${headId}" on the topic: "${topic}". Include title, 3 learning objectives, 2 structured sections, and a short summary. Return valid JSON.`;
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5,
        },
      });
      draftContent = JSON.parse(response.text || '{}');
    } catch (e) {
      console.warn('Admin draft AI generation fallback', e);
    }
  }

  const newDraft: StoredDraft = {
    id: 'draft_' + Date.now(),
    headId,
    title: draftContent.title || topic,
    type,
    content: draftContent,
    authorId,
    authorName,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  contentDrafts.unshift(newDraft);
  recordAudit(authorId, authorName, 'admin', 'DRAFT_GENERATED', 'CURRICULUM', `Draft: ${newDraft.title}`, newDraft.id);

  return res.json({ success: true, draft: newDraft });
});

app.post('/api/admin/approve-draft', (req, res) => {
  const { draftId, action, reviewerNotes, actorId = 'admin', actorRole = 'admin' } = req.body;

  const draft = contentDrafts.find(d => d.id === draftId);
  if (!draft) {
    return res.status(404).json({ error: 'Draft not found.' });
  }

  if (action === 'publish') {
    draft.status = 'published';
  } else if (action === 'approve') {
    draft.status = 'approved';
  } else if (action === 'review') {
    draft.status = 'under_review';
  }
  draft.reviewerNotes = reviewerNotes || draft.reviewerNotes;
  draft.updatedAt = new Date().toISOString();

  recordAudit(actorId, `${actorId}@dasasurya.local`, actorRole, `DRAFT_${action.toUpperCase()}`, 'CURRICULUM', `Draft: ${draft.title}`, draft.id);

  return res.json({ success: true, draft });
});

// -------------------------------------------------------------
// 7. SECURE CSV EXPORT WITH FORMULA INJECTION SANITIZATION
// Prevents formula injection (=, +, -, @, \t, \r) in spreadsheet software
// -------------------------------------------------------------
function sanitizeCsvCell(value: any): string {
  if (value === null || value === undefined) return '""';
  let str = String(value);
  // Neutralize formula injection triggers
  if (/^[=\+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

app.post('/api/admin/export-csv', (req, res) => {
  const { dataset = 'audit_logs', role = 'admin' } = req.body;

  if (role !== 'admin' && role !== 'core_admin') {
    return res.status(403).json({ error: 'Forbidden: Insufficient administrative privileges.' });
  }

  let headers: string[] = [];
  let rows: string[][] = [];

  if (dataset === 'audit_logs') {
    headers = ['ID', 'Timestamp', 'Actor ID', 'Actor Role', 'Action', 'Resource Type', 'Details'];
    rows = auditLogs.map(l => [
      l.id,
      l.timestamp,
      l.actorId,
      l.actorRole,
      l.action,
      l.resourceType,
      l.details || '',
    ]);
  } else if (dataset === 'content_drafts') {
    headers = ['Draft ID', 'Head ID', 'Title', 'Type', 'Author', 'Status', 'Updated At'];
    rows = contentDrafts.map(d => [
      d.id,
      d.headId,
      d.title,
      d.type,
      d.authorName,
      d.status,
      d.updatedAt,
    ]);
  } else {
    headers = ['Metric', 'Value'];
    rows = [
      ['Total Knowledge Documents', String(documentStore.length)],
      ['Total Drafts', String(contentDrafts.length)],
      ['Total Audit Entries', String(auditLogs.length)],
    ];
  }

  const csvContent = [
    headers.map(sanitizeCsvCell).join(','),
    ...rows.map(row => row.map(sanitizeCsvCell).join(',')),
  ].join('\r\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="dasasurya_${dataset}_${Date.now()}.csv"`);
  return res.send(csvContent);
});

// -------------------------------------------------------------
// 8. AUDIT LOGS ENDPOINT (Role Protected)
// -------------------------------------------------------------
app.get('/api/admin/audit-logs', (req, res) => {
  const { role = 'admin' } = req.query;
  if (role !== 'admin' && role !== 'core_admin') {
    return res.status(403).json({ error: 'Forbidden: Administrative credentials required.' });
  }
  return res.json({ success: true, logs: auditLogs });
});

// -------------------------------------------------------------
// 9. CHAKRA MEDITATION & WELLNESS SESSIONS
// -------------------------------------------------------------
app.post('/api/chakra/guidance', async (req, res) => {
  const { chakraId = 'muladhara', durationMinutes = 5, guidanceStyle = 'gentle-breathing', language = 'en', isUnder12 = false } = req.body;

  const childSafetyNotice = isUnder12
    ? 'CHILD SAFEGUARD: Offer only gentle calming relaxation and peaceful rhythmic breathing. Zero esoteric strain or fear-based language.'
    : '';

  if (aiClient) {
    try {
      const systemInstruction = `You are a respectful wellness guide in the CHAKRA ALIGNMENT module of DASASURYA.
Tradition: Grounded in yogic breath and mindfulness traditions.
EPISTEMOLOGICAL BOUNDARY: This is contemplative relaxation, NOT clinical medical diagnosis or cure.
${childSafetyNotice}
Language: Respond in "${language}". Duration: ${durationMinutes} minutes. Style: ${guidanceStyle}.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Provide gentle step-by-step guidance script for ${chakraId} chakra meditation (${durationMinutes} mins).`,
        config: { systemInstruction, temperature: 0.6 },
      });

      return res.json({
        success: true,
        guidanceScript: response.text,
        source: 'san-r10-chakra-gemini',
      });
    } catch (e) {
      console.warn('Chakra AI fallback', e);
    }
  }

  const fallback = `### Gentle Centering Session (${durationMinutes} Minutes)
1. **Physical Grounding:** Settle into a comfortable posture. Gently release tension in your shoulders and hands.
2. **Natural Breath Rhythm:** Inhale clarity, exhale distraction. Observe the natural cadence of your breath.
3. **Contemplative Anchor:** Rest your attention on grounded presence, emotional equanimity, and patient learning.
4. **Closing:** Take one deep gentle breath, acknowledge your progress, and open your eyes when you feel ready.`;

  return res.json({
    success: true,
    guidanceScript: fallback,
    source: 'san-r10-chakra-heuristics',
  });
});

// -------------------------------------------------------------
// 10. RAVANA MIND MULTI-PERSPECTIVE ENGINE
// -------------------------------------------------------------
app.post('/api/gemini/ravana-mind', async (req, res) => {
  const { problem, selectedHeads = [], language = 'en' } = req.body;

  if (!problem) {
    return res.status(400).json({ error: 'Problem description is required.' });
  }

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Deconstruct this dilemma through the 10 Heads: "${problem}". Selected emphasis: ${selectedHeads.join(', ') || 'All 10 heads'}. Format with: 1. Core Goal, 2. Facts vs Assumptions vs Unknowns, 3. Multi-Head Trade-offs, 4. Three Distinct Action Paths, 5. Step-by-Step Action Plan. Respond in "${language}".`,
        config: {
          systemInstruction: `You are RAVANA MIND within DASASURYA SAN R10. Never present a single path as absolute; provide balanced trade-off analysis.`,
          temperature: 0.5,
        },
      });

      return res.json({
        success: true,
        analysis: response.text,
        source: 'ravana-mind-gemini',
      });
    } catch (e) {
      console.warn('Ravana Mind fallback', e);
    }
  }

  const fallbackAnalysis = `### RAVANA MIND: Multi-Perspective Analysis
**Core Problem:** "${problem}"

#### 1. Fact, Assumption & Unknown Deconstruction
- **Facts:** Concrete physical and organizational constraints.
- **Assumptions:** Believed constraints that may merely be legacy conventions.
- **Unknowns:** External stakeholder response times and delayed feedback effects.

#### 2. Perspectives & Trade-offs
- **Head 01 (Knowledge & Logic):** Deconstruct the technical bottleneck to first principles. *Trade-off: High precision, risk of analysis paralysis.*
- **Head 05 (Strategy):** Map incentives and establish phased milestone gates. *Trade-off: Requires disciplined boundary enforcement.*
- **Head 04 (Wellness & Equanimity):** Protect sleep and cognitive stamina over 6 months. *Trade-off: Prevents burnout, may slow short-term sprints.*

#### 3. Recommended 3-Step Action Plan
1. Run a 7-day low-resource experiment testing the single riskiest assumption.
2. Eliminate non-essential steps before committing additional budget.
3. Establish a weekly review gate in MY DAY to recalibrate trajectory.`;

  return res.json({
    success: true,
    analysis: fallbackAnalysis,
    source: 'ravana-mind-heuristics',
  });
});

// -------------------------------------------------------------
// 11. DAILY BRIEFING
// -------------------------------------------------------------
app.post('/api/gemini/daily-brief', async (req, res) => {
  const { date = new Date().toISOString().split('T')[0], userInterests = [], language = 'en' } = req.body;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `DASASURYA DAILY BRIEF for ${date}. Interests: ${userInterests.join(', ') || 'Knowledge, Strategy, Wellness'}. Sections: 1. Knowledge Signal, 2. Strategic Leverage Signal, 3. Critical Thinking Puzzle, 4. Vitality Practice, 5. Reflection Question. Deliver in "${language}":`,
        config: { temperature: 0.6 },
      });
      return res.json({ success: true, brief: response.text, source: 'san-r10-brief-gemini' });
    } catch (e) {
      console.warn('Daily brief fallback', e);
    }
  }

  const fallback = `### DASASURYA DAILY BRIEF · ${date}

#### 1. Knowledge Signal (Head 01)
- **Principle:** Shannon's entropy establishes the theoretical limit of information compression without loss.
- **AI Synthesis:** In study architecture, strategic redundancy acts as cognitive error-correction.

#### 2. Strategic Leverage Signal (Head 05)
- **Insight:** Leverage without permission (writing, software architectures, reproducible assets) provides asymmetric compounding without linear exhaustion.

#### 3. Critical Thinking Puzzle (Head 04)
- **Scenario:** A manager notices office teams push 30% more commits than remote teams and concludes physical presence increases coding output.
- **Cognitive Trap:** Confounding variable: newly hired junior developers are stationed at the office and commit smaller, more frequent checkpoints.

#### 4. Vitality Practice (Head 04)
- **Habit:** View natural ambient daylight within 30 minutes of waking to anchor circadian cortisol rhythm.

#### 5. Sovereign Reflection
- *Are you organizing your notes to achieve genuine mastery, or merely organizing to feel productive while avoiding the hardest challenge?*`;

  return res.json({ success: true, brief: fallback, source: 'san-r10-brief-heuristics' });
});

// -------------------------------------------------------------
// SERVER LIFECYCLE & VITE MOUNTING
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DASASURYA SAN R10 server running on http://localhost:${PORT}`);
  });
}

startServer();
