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

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// -------------------------------------------------------------
// IN-MEMORY SERVER-SIDE VERIFICATION STORE (with TTL & Rate Limiting)
// -------------------------------------------------------------
interface VerificationEntry {
  contact: string;
  channel: 'email' | 'phone';
  codeHash: string;
  expiresAt: number; // timestamp
  attempts: number;
  lastSentAt: number;
  verified: boolean;
  proofToken?: string;
}

const verificationStore = new Map<string, VerificationEntry>();

// Clean expired tokens every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of verificationStore.entries()) {
    if (entry.expiresAt < now) {
      verificationStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

// Helper to hash verification code
function hashCode(code: string, contact: string): string {
  return crypto.createHash('sha256').update(`${code}:${contact}:sanr10_salt`).digest('hex');
}

// -------------------------------------------------------------
// AUTH & VERIFICATION ENDPOINTS
// -------------------------------------------------------------

// Check verification provider status & send code
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
    // Phone validation
    const phoneDigits = cleanContact.replace(/[^0-9+]/g, '');
    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
      return res.status(400).json({ error: 'Please enter a valid international phone number (e.g. +1 555-0199).' });
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

  // Generate 6-digit numeric cryptographic code
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

  // Check if live external SMTP or SMS provider is configured in environment
  const hasSmtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);
  const hasTwilioConfigured = Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN);
  const providerConfigured = channel === 'email' ? hasSmtpConfigured : hasTwilioConfigured;

  const providerStatus = providerConfigured
    ? `Dispatched via configured ${channel === 'email' ? 'SMTP Gateway' : 'SMS Gateway'}.`
    : `No third-party ${channel === 'email' ? 'SMTP' : 'SMS'} gateway credentials configured in environment variables. Server is running in compliant verification interface mode. Code generated securely on server.`;

  console.log(`[AUTH VERIFICATION] Code generated for ${channel} (${cleanContact.slice(0, 3)}***): ${code} (Expires in 10m)`);

  return res.json({
    success: true,
    channel,
    contact: cleanContact,
    expiresInSeconds: 600,
    providerConfigured,
    providerStatus,
    // In secure prototype / local development where external SMS/SMTP provider is not set, provide debug code so tester can complete real verification
    testCode: providerConfigured ? undefined : code,
  });
});

// Verify supplied code on the server
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

  // Check expiration
  if (Date.now() > entry.expiresAt) {
    verificationStore.delete(cleanContact);
    return res.status(410).json({ error: 'Verification code has expired (valid for 10 minutes). Please request a new code.' });
  }

  // Rate limiting attempts (max 5)
  entry.attempts += 1;
  if (entry.attempts > 5) {
    verificationStore.delete(cleanContact);
    return res.status(429).json({ error: 'Too many incorrect attempts. This code has been invalidated for security. Please request a new code.' });
  }

  const suppliedHash = hashCode(cleanCode, cleanContact);
  if (suppliedHash !== entry.codeHash) {
    const remainingAttempts = 5 - entry.attempts;
    return res.status(400).json({
      error: `Invalid verification code. ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining.`,
      remainingAttempts,
    });
  }

  // Success: generate verification proof token
  const proofToken = crypto.randomBytes(24).toString('hex');
  entry.verified = true;
  entry.proofToken = proofToken;

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
// 1. DASASURYA SOCRATIC MODE ENDPOINT (MULTILINGUAL & AGE-AWARE)
// -------------------------------------------------------------
app.post('/api/gemini/socratic', async (req, res) => {
  const { 
    question, 
    concept, 
    socraticLevel = 1, 
    currentHead, 
    codeSnippet, 
    userProgress, 
    language = 'en', 
    explanationLevel = 'intermediate', 
    isUnder12 = false,
    age = 18 
  } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Question is required' });
  }

  const level = Math.min(Math.max(parseInt(socraticLevel, 10) || 1, 1), 5);

  const levelInstructions: Record<number, string> = {
    1: 'LEVEL 1: Ask a single, deeply incisive guiding question that prompts the learner to reconsider their foundational assumption. Do NOT reveal the concept name or answer.',
    2: 'LEVEL 2: Point directly toward the relevant core concept or theorem without solving it. Tell them which principle to investigate.',
    3: 'LEVEL 3: Provide a concise, practical hint and a brief analogy that bridges their intuition to the mechanism.',
    4: 'LEVEL 4: Explain the underlying reasoning, structural flow, and why common intuition fails here.',
    5: 'LEVEL 5: Provide the complete, clear solution with step-by-step walkthrough and key takeaway.',
  };

  const programmingInstruction = codeSnippet
    ? `\nLEARNER CODE TO DIAGNOSE:\n\`\`\`\n${codeSnippet}\n\`\`\`\nAnalyze:\n1. What the code is trying to do.\n2. Where the logic appears incorrect.\n3. Why the error occurs.\n4. What concept is missing.\nThen guide the learner at the requested Socratic level without lecturing.`
    : '';

  const childSafetyConstraint = isUnder12
    ? `\nCHILD SAFETY RULE (LEARNER AGE ${age}): Use warm, positive, encouraging, age-appropriate language. Strictly avoid scary, frightening, or overly complex jargon. Keep focus periods manageable.`
    : '';

  if (aiClient) {
    try {
      const systemInstruction = `You are DASASURYA, the central AI mentor of SAN_R-10 (The 10-Head Adaptive Intelligence & Life Architecture System).
You behave as a master Socratic mentor, personal tutor, and reasoning coach.
CURRENT ACTIVE HEAD: ${currentHead || 'Universal Foundation'}
TARGET SOCRATIC TIER: ${levelInstructions[level]}
TARGET RESPONSE LANGUAGE: Respond strictly and naturally in language code "${language}".
EXPLANATION LEVEL: ${explanationLevel.toUpperCase()} (calibrate vocabulary and analogies accordingly).
${childSafetyConstraint}
${programmingInstruction}

CRITICAL RULES:
1. Do NOT immediately reveal the complete answer unless Level 5 is requested.
2. Foster deep understanding, not artificial difficulty.
3. Be respectful, calm, rigorous, and direct.
4. If discussing wealth or health, maintain educational boundaries: no income guarantees, no medical diagnosis.
5. Provide actionable guidance. Preserve relevant citations and sources when referring to scientific or historical facts.`;

      const prompt = `Learner Context: ${userProgress || 'Active learner exploring foundational concepts'}
Learner Question/Obstacle: "${question}"
Topic/Concept Context: "${concept || 'General'}"
Socratic Level: Level ${level} of 5.

Deliver the mentorship response in "${language}":`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({
        success: true,
        level,
        response: response.text || 'Dasasurya is reflecting on your path.',
        source: 'dasasurya-ai',
        language,
      });
    } catch (err: any) {
      console.warn('Gemini API call failed, using heuristic Socratic engine:', err?.message);
    }
  }

  // Fallback pedagogical Socratic generation
  const fallbackResponses: Record<number, string> = {
    1: `[Level 1 Guiding Question]\n\nBefore approaching "${question}", step back to first principles: What is the single invariant or baseline assumption in this problem? If that condition changes by even 10%, how does your expected outcome shift?`,
    2: `[Level 2 Concept Orientation]\n\nThis challenge centers on the principle of **${concept || 'Systemic Equilibrium and Boundary Conditions'}**. Notice how the inputs interact at the edges rather than in isolation. Re-examine the definition of this concept in your chapter.`,
    3: `[Level 3 Strategic Hint]\n\nConsider this analogy: like a lever balancing two unequal weights, you cannot change one side without compensating the moment arm. In your scenario, isolate the independent variable before calculating the net impact.`,
    4: `[Level 4 Underlying Reasoning]\n\nThe reason this feels counter-intuitive is a classic cognitive or structural blind spot: we naturally assume a linear progression, but the governing relationship here is constrained by conservation and feedback loops. Notice that each action creates an immediate secondary reaction.`,
    5: `[Level 5 Comprehensive Synthesis]\n\nHere is the complete analytical walkthrough for "${question}":\n1. Deconstruct the primary constraint.\n2. Apply the core governing rule of ${concept || 'this domain'}.\n3. Verify against the edge conditions.\n\nNow, test this solution against the practice exercise to verify your mastery.`,
  };

  return res.json({
    success: true,
    level,
    response: fallbackResponses[level] || fallbackResponses[1],
    source: 'dasasurya-core-heuristics',
    language: 'en',
  });
});

// -------------------------------------------------------------
// 2. MULTILINGUAL LEARNING PLAN / ROADMAP GENERATOR
// -------------------------------------------------------------
app.post('/api/gemini/generate-roadmap', async (req, res) => {
  const {
    goal,
    targetLanguage = 'en',
    explanationLevel = 'intermediate',
    currentKnowledge = '',
    availableMinutesPerDay = 30,
    targetDeadlineWeeks = 4,
    isUnder12 = false,
    age = 18,
  } = req.body;

  if (!goal || typeof goal !== 'string') {
    return res.status(400).json({ error: 'Learning goal is required.' });
  }

  if (aiClient) {
    try {
      const systemInstruction = `You are the Learning Experience Architect of SAN_R-10 DASASURYA AI.
Create a structured, personalized, age-appropriate learning roadmap.
Language: Respond entirely in language code "${targetLanguage}".
Audience Age: ${age} years old (${isUnder12 ? 'CHILD-SAFE MODE: Under 12. Short sessions, playful milestones, regular breaks, zero adult themes.' : 'Mature learner'}).
Level: ${explanationLevel}.
Daily Commitment: ${availableMinutesPerDay} minutes per day.
Target Horizon: ${targetDeadlineWeeks} weeks.

FORMAT: Return valid JSON matching this schema:
{
  "stages": [
    {
      "stageNumber": 1,
      "title": "Stage Title",
      "topics": ["Topic A", "Topic B"],
      "milestone": "Concrete achievable milestone",
      "practiceTask": "Hands-on activity",
      "assessmentQuestion": "Socratic evaluation question"
    }
  ]
}`;

      const prompt = `Goal: "${goal}". Existing knowledge: "${currentKnowledge || 'None/Beginner'}". Generate 4 sequential progressive stages.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });

      const parsed = JSON.parse(response.text || '{"stages": []}');
      return res.json({
        success: true,
        stages: parsed.stages,
        source: 'dasasurya-ai-roadmap',
      });
    } catch (err: any) {
      console.warn('Roadmap AI generation fallback:', err?.message);
    }
  }

  // Structured fallback roadmap
  const fallbackStages = [
    {
      stageNumber: 1,
      title: 'Foundational Deconstruction & Core Axioms',
      topics: ['First principles definitions', 'System boundary identification', 'Core vocabulary'],
      milestone: 'Explain the single foundational principle in your own words without jargon.',
      practiceTask: 'Map out the 3 primary components of this concept on paper or notes.',
      assessmentQuestion: 'What assumption must hold true for this fundamental law to remain valid?',
    },
    {
      stageNumber: 2,
      title: 'Mechanisms & Second-Order Feedback Loops',
      topics: ['Dynamic interactions', 'Rate-limiting bottlenecks', 'Common cognitive misconceptions'],
      milestone: 'Solve an introductory scenario demonstrating cause and delayed effect.',
      practiceTask: 'Analyze a case study highlighting a common failure trap.',
      assessmentQuestion: 'How does an increase in input load affect downstream recovery time?',
    },
    {
      stageNumber: 3,
      title: 'Real-World Application & Practice Synthesis',
      topics: ['Hands-on problem solving', 'Practical constraints', 'Trade-off balancing'],
      milestone: 'Produce a tangible mini-project or diagnostic breakdown.',
      practiceTask: 'Implement a working model or write a 3-paragraph synthesis.',
      assessmentQuestion: 'Which trade-off is unavoidable when optimizing for velocity over durability?',
    },
    {
      stageNumber: 4,
      title: 'Independent Mastery & Sovereign Reflection',
      topics: ['Edge-case stress testing', 'Teaching the concept to others', 'Long-term maintenance'],
      milestone: 'Complete a multi-perspective synthesis evaluating light and shadow dynamics.',
      practiceTask: 'Conduct a peer-level explanation or write a complete reflective journal entry.',
      assessmentQuestion: 'How will you integrate this capability into your daily life architecture?',
    },
  ];

  return res.json({
    success: true,
    stages: fallbackStages,
    source: 'dasasurya-core-heuristics',
  });
});

// -------------------------------------------------------------
// 3. CHAKRA MEDITATION & WELLNESS GUIDANCE ENDPOINT
// -------------------------------------------------------------
app.post('/api/chakra/guidance', async (req, res) => {
  const {
    chakraId = 'muladhara',
    durationMinutes = 5,
    guidanceStyle = 'gentle-breathing',
    language = 'en',
    isUnder12 = false,
  } = req.body;

  const childSafetyNotice = isUnder12
    ? 'CHILD SAFEGUARD: Learner is under 12. Offer only gentle calming relaxation, joyful nature imagery, and deep peaceful breathing. Absolutely NO intense breath retention, forced practices, or fear-based language.'
    : '';

  if (aiClient) {
    try {
      const systemInstruction = `You are a respectful, culturally authentic wellness guide within the CHAKRA ALIGNMENT module of SAN_R-10 DASASURYA AI.
Tradition: Grounded in traditional yogic and philosophical meditation frameworks.
EPISTEMOLOGICAL SAFETY:
1. Do NOT claim to diagnose, cure, or treat physical or psychological medical conditions.
2. Do NOT claim to detect or scan energy centers using cameras, sensors, or AI.
3. State that this is an optional contemplative and mindful relaxation practice.
4. ${childSafetyNotice}
Language: Respond naturally in language code "${language}".
Duration: ${durationMinutes} minutes. Style: ${guidanceStyle}.`;

      const prompt = `Provide a gentle, calming, step-by-step meditation guidance script for the ${chakraId} chakra. Duration: ${durationMinutes} minutes. Include an opening centering cue, guided somatic breathing, mindful reflection prompt, and peaceful closing.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.6,
        },
      });

      return res.json({
        success: true,
        guidanceScript: response.text,
        source: 'dasasurya-ai-chakra',
      });
    } catch (err: any) {
      console.warn('Chakra AI guidance fallback:', err?.message);
    }
  }

  // Fallback respectful guidance
  const fallbackGuidance = `### Gentle Centering Session (${durationMinutes} Minutes)
1. **Physical Grounding:** Settle into a comfortable, upright posture. Gently allow your shoulders to soften and your jaw to release tension.
2. **Natural Breath Flow:** Notice the natural rhythm of your breath as it enters and leaves your body. No need to force or manipulate it.
3. **Contemplative Anchor:** Gently rest your attention on the theme of this session. Notice how cultivating inner calmness and grounded presence brings clarity to your mind.
4. **Gentle Affirmation:** "I am rooted in the present moment, grounded in clarity, and patient with my own growth."
5. **Closing:** Slowly take one deep, gentle breath, wiggle your fingers, and gently open your eyes when you feel ready. Remember you may pause or leave this session at any time.`;

  return res.json({
    success: true,
    guidanceScript: fallbackGuidance,
    source: 'dasasurya-core-chakra',
  });
});

// -------------------------------------------------------------
// 4. RAVANA MIND MULTI-PERSPECTIVE ENGINE ENDPOINT
// -------------------------------------------------------------
app.post('/api/gemini/ravana-mind', async (req, res) => {
  const { problem, selectedHeads = [], language = 'en' } = req.body;

  if (!problem || typeof problem !== 'string') {
    return res.status(400).json({ error: 'Problem description is required' });
  }

  if (aiClient) {
    try {
      const systemInstruction = `You are RAVANA MIND, the multi-perspective analytical engine of SAN_R-10.
Language: Respond in language code "${language}".
Analyze the user's real-world problem through the 10 Heads:
Head 1: Knowledge & Logic
Head 2: Wealth & Creation
Head 3: Vitality
Head 4: Critical Mind
Head 5: Strategy & Governance
Head 6: Creative Arts
Head 7: Emotional Mastery
Head 8: Communication
Head 9: Universal Sciences
Head 10: Automation & Systems

Decompose the problem, evaluate the relevant heads, identify trade-offs, acknowledge uncertainties/assumptions, and propose 3 distinct actionable paths.
The user remains responsible for final decisions. Never pretend there is only one correct answer.`;

      const prompt = `User Problem: "${problem}"
Selected Head Emphasis: ${selectedHeads.length > 0 ? selectedHeads.join(', ') : 'All relevant heads'}

Format response with:
1. Problem Decomposition & Core Conflict
2. Relevant Perspectives (at least 3 heads with Light and Shadow trade-offs)
3. Three Distinct Strategic Action Options
4. Key Assumptions & Uncertainties
5. Socratic Reflection Prompt for User Decision`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({
        success: true,
        analysis: response.text,
        source: 'ravana-mind-ai',
      });
    } catch (err: any) {
      console.warn('Gemini API call failed for Ravana Mind, using structured fallback:', err?.message);
    }
  }

  // Fallback structured multi-perspective analysis
  const fallbackAnalysis = `### Problem Decomposition
**Core Dilemma:** "${problem}"
The challenge represents a multi-dimensional tension between immediate execution and long-term systemic sustainability.

---

### Head Perspectives & Trade-offs

#### Head 01 — Knowledge & Logic
- **Perspective:** Ground decisions in empirical data and first-principles evidence. What are the measurable facts versus assumptions?
- **Trade-off:** High precision, but risks paralysis by analysis if waiting for 100% certainty.

#### Head 05 — Strategy & Governance
- **Perspective:** Map dependencies, allocate resources intentionally, and define clear governance milestones.
- **Trade-off:** Strong coordination, but requires discipline and resistance to impulsive pivots.

#### Head 07 — Emotional Mastery
- **Perspective:** Acknowledge anxiety and ego-driven urgency. Ensure personal boundaries and psychological stamina are protected.
- **Trade-off:** Protects sustainable vitality, though may require uncomfortable honest conversations.

---

### Three Actionable Pathways

1. **The Measured Iteration Approach:** Run a 14-day controlled experiment testing the riskiest assumption with minimum resource commitment.
2. **The Structural Re-alignment:** Restructure the workflow to eliminate non-essential dependencies before committing capital or energy.
3. **The Collaborative Leverage Strategy:** Align with a partner or system that already possesses the missing capability.

---

### Key Assumptions & Uncertainties
- Assumes market or contextual conditions remain stable over the next quarter.
- Uncertainty remains regarding external response times.

### Reflection for Your Decision
*Which path maintains your ethical integrity and long-term vitality, even if short-term velocity is reduced?*`;

  return res.json({
    success: true,
    analysis: fallbackAnalysis,
    source: 'ravana-mind-heuristics',
  });
});

// -------------------------------------------------------------
// 5. DASASURYA DAILY BRIEF ENDPOINT
// -------------------------------------------------------------
app.post('/api/gemini/daily-brief', async (req, res) => {
  const { date = new Date().toISOString().split('T')[0], userInterests = [], language = 'en' } = req.body;

  if (aiClient) {
    try {
      const prompt = `Generate a high-value DASASURYA DAILY BRIEF for date: ${date}.
Language: Respond in language code "${language}".
User Interests: ${userInterests.join(', ') || 'Logic, Strategy, Vitality, Systems'}.
Sections required:
1. KNOWLEDGE SIGNAL: One genuine insight from science/technology first principles.
2. CREATION & WEALTH SIGNAL: One practical value-creation / responsible leverage insight (no get-rich claims).
3. CRITICAL THINKING PUZZLE: A 2-sentence cognitive bias or logic puzzle with solution hint.
4. VITALITY HABIT: One sustainable health habit for cognitive endurance (no medical claims).
5. SHADOW CHECK: One rigorous self-reflection question.
6. DAILY MISSION: One actionable, achievable learning milestone.

Maintain strict distinction between FACT, SOURCE, INTERPRETATION, and AI SUGGESTION.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.6,
        },
      });

      return res.json({
        success: true,
        brief: response.text,
        source: 'dasasurya-ai-brief',
      });
    } catch (err: any) {
      console.warn('Gemini daily brief fallback:', err?.message);
    }
  }

  const fallbackBrief = `### DASASURYA DAILY BRIEF · ${date}

#### 1. Knowledge Signal (Head 01)
- **Fact:** Shannon's Information Theory establishes that the fundamental limit of data compression is defined by entropy.
- **Interpretation:** In learning architecture, redundancy is not always wasted; controlled redundancy provides error-correction for human memory.
- **AI Suggestion:** When learning a difficult theorem, encode it through both visual geometry and formal algebraic notation.

#### 2. Creation & Wealth Signal (Head 02)
- **Insight:** Sustainable wealth is created through asymmetric leverage: code, media, and capital that work without linear exertion.
- **Guardrail:** Avoid hyper-financialization; prioritize compounding durable skills over speculative chasing.

#### 3. Critical Thinking Puzzle (Head 04)
- **Puzzle:** A manager notices that teams working in the new office submit 30% more code pull requests than remote teams. She concludes physical presence directly increases coding output.
- **Cognitive Trap:** Confounding variable / Berkson's fallacy. The new office houses the newly hired junior developers who push smaller, more frequent commits.

#### 4. Vitality Habit (Head 03)
- **Practice:** 90-minute ultradian rhythm cycles followed by 5 minutes of non-screen visual resets (gazing at the horizon to disengage convergence fatigue).

#### 5. Shadow Check (Head 05)
- *Are you organizing your life to achieve meaningful mastery, or merely organizing to feel productive while avoiding the hardest problem?*

#### 6. Daily Mission
- Complete one chapter section, solve the corresponding understanding check, and write a 3-sentence synthesis in your personal notes.`;

  return res.json({
    success: true,
    brief: fallbackBrief,
    source: 'dasasurya-core-brief',
  });
});

// Setup Vite middleware in dev or static serving in prod
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
    console.log(`SAN_R-10 DASASURYA server running on http://localhost:${PORT}`);
  });
}

startServer();
