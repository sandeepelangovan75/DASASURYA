import { 
  ChakraGuidanceStyle, 
  ChakraId, 
  ExplanationLevel, 
  HeadId, 
  LanguageCode, 
  RoadmapStage, 
  SanR10Mode 
} from '../types';

export interface SanR10ChatRequest {
  message: string;
  mode: SanR10Mode;
  headId?: HeadId;
  language?: LanguageCode;
  explanationLevel?: ExplanationLevel;
  history?: { role: 'user' | 'assistant'; content: string }[];
  isUnder12?: boolean;
  age?: number;
  documentId?: string;
}

export interface SanR10ChatResponse {
  success: boolean;
  mode: SanR10Mode;
  headId?: string;
  response: string;
  source: string;
  language?: string;
}

export interface SocraticRequest {
  question: string;
  concept?: string;
  socraticLevel: number;
  currentHead?: string;
  codeSnippet?: string;
  userProgress?: string;
  language?: LanguageCode;
  explanationLevel?: ExplanationLevel;
  isUnder12?: boolean;
  age?: number;
}

export interface SocraticResponse {
  success: boolean;
  level: number;
  response: string;
  source: string;
  language?: string;
}

export interface RavanaMindRequest {
  problem: string;
  selectedHeads?: string[];
  language?: LanguageCode;
}

export interface RavanaMindResponse {
  success: boolean;
  analysis: string;
  source: string;
}

export interface DailyBriefResponse {
  success: boolean;
  brief: string;
  source: string;
}

export interface RoadmapGenerationRequest {
  goal: string;
  targetLanguage: LanguageCode;
  explanationLevel: ExplanationLevel;
  currentKnowledge?: string;
  availableMinutesPerDay?: number;
  targetDeadlineWeeks?: number;
  isUnder12?: boolean;
  age?: number;
}

export interface RoadmapGenerationResponse {
  success: boolean;
  stages: RoadmapStage[];
  source: string;
}

export interface ChakraGuidanceRequest {
  chakraId: ChakraId;
  durationMinutes: number;
  guidanceStyle: ChakraGuidanceStyle;
  language?: LanguageCode;
  isUnder12?: boolean;
}

export interface ChakraGuidanceResponse {
  success: boolean;
  guidanceScript: string;
  source: string;
}

export interface KnowledgeDocSummary {
  id: string;
  title: string;
  filename: string;
  fileType: string;
  fileSize: number;
  chunkCount: number;
  createdAt: string;
  isAuthorized: boolean;
}

export interface KnowledgeQueryResponse {
  success: boolean;
  answer: string;
  citations: { title: string; section?: string }[];
  source: string;
}

export interface ToolActionItem {
  id: string;
  name: string;
  description: string;
  category: string;
  requiresConfirmation: boolean;
  riskLevel: 'low' | 'consequential';
  permission: string;
}

export const aiService = {
  // SAN R10 10-Mode Chat Engine
  async chatSanR10(req: SanR10ChatRequest): Promise<SanR10ChatResponse> {
    try {
      const res = await fetch('/api/sanr10/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      if (!res.ok) throw new Error(`Server status ${res.status}`);
      return await res.json();
    } catch (err: any) {
      console.warn('SAN R10 API call fallback', err);
      return {
        success: true,
        mode: req.mode,
        headId: req.headId,
        response: this.getModeFallback(req.mode, req.message, req.headId),
        source: 'san-r10-local-heuristics',
        language: req.language || 'en',
      };
    }
  },

  // Document Intelligence (RAG)
  async getDocuments(): Promise<KnowledgeDocSummary[]> {
    try {
      const res = await fetch('/api/rag/documents');
      if (!res.ok) throw new Error('Failed to load documents');
      const data = await res.json();
      return data.documents || [];
    } catch (e) {
      console.warn('Failed to fetch documents', e);
      return [];
    }
  },

  async uploadDocument(doc: { title: string; filename: string; content: string; userId?: string }): Promise<any> {
    const res = await fetch('/api/rag/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
    });
    if (!res.ok) throw new Error('Upload failed');
    return await res.json();
  },

  async queryKnowledge(question: string, documentId?: string, language: string = 'en'): Promise<KnowledgeQueryResponse> {
    try {
      const res = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, documentId, language }),
      });
      if (!res.ok) throw new Error('Query failed');
      return await res.json();
    } catch (e) {
      return {
        success: true,
        answer: `[SAN R10 Grounded Synthesis]\n\nBased on authorized documentation: The 10 interconnected heads structure human capability across Knowledge, Language, Music, Wellness, Strategy, Vision, Voice, Astronomy, Traditional Knowledge, and Governance. Learning follows the 7-stage protocol: Read, Understand, Question, Practice, Apply, Reflect, Master.`,
        citations: [{ title: 'DASASURYA Architectural Philosophy', section: 'Core Structure' }],
        source: 'san-r10-local-knowledge',
      };
    }
  },

  // Tools Registry
  async getRegisteredTools(): Promise<ToolActionItem[]> {
    try {
      const res = await fetch('/api/tools/list');
      if (!res.ok) throw new Error('Failed to load tools');
      const data = await res.json();
      return data.tools || [];
    } catch (e) {
      return [];
    }
  },

  async executeTool(toolId: string, params: any = {}, confirmed: boolean = false, role: string = 'learner'): Promise<any> {
    const res = await fetch('/api/tools/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolId, params, confirmed, role }),
    });
    return await res.json();
  },

  // Socratic Guidance
  async getSocraticGuidance(req: SocraticRequest): Promise<SocraticResponse> {
    try {
      const res = await fetch('/api/gemini/socratic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      return await res.json();
    } catch (err: any) {
      return {
        success: true,
        level: req.socraticLevel,
        response: this.getHeuristicFallback(req.socraticLevel, req.question, req.concept, req.language),
        source: 'dasasurya-local-pedagogy',
        language: req.language || 'en',
      };
    }
  },

  async generateRoadmap(req: RoadmapGenerationRequest): Promise<RoadmapGenerationResponse> {
    try {
      const res = await fetch('/api/gemini/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      return await res.json();
    } catch (err: any) {
      return {
        success: true,
        stages: [
          {
            stageNumber: 1,
            title: 'Foundational Deconstruction & Axioms',
            topics: ['Core Definitions', 'System Invariants', 'Axiomatic Mapping'],
            milestone: `Articulate the core mechanism of "${req.goal}" in your own words.`,
            practiceTask: 'Deconstruct a real-world scenario into primary constraints.',
            assessmentQuestion: 'What root assumption is required for this principle to hold?',
          },
          {
            stageNumber: 2,
            title: 'Feedback Loops & Trade-offs',
            topics: ['Interaction Dynamics', 'Common Pitfalls', 'Equilibrium States'],
            milestone: 'Identify where systems break down under stress.',
            practiceTask: 'Run a mini-audit on a simulated problem.',
            assessmentQuestion: 'How does changing the rate-limiting step shift overall output?',
          },
          {
            stageNumber: 3,
            title: 'Applied Synthesis & Practice',
            topics: ['Hands-on Application', 'Practical Scenarios', 'Trade-off Calibration'],
            milestone: 'Construct a viable solution model or project blueprint.',
            practiceTask: 'Build an experimental artifact and measure results.',
            assessmentQuestion: 'Which trade-off are you consciously accepting?',
          },
          {
            stageNumber: 4,
            title: 'Sovereign Mastery & Reflection',
            topics: ['Edge Cases', 'System Integration', 'Continuous Practice'],
            milestone: 'Teach the concept clearly or integrate it into your life architecture.',
            practiceTask: 'Write a comprehensive reflection and action protocol.',
            assessmentQuestion: 'How does this mastery sustain your long-term autonomy?',
          },
        ],
        source: 'dasasurya-local-roadmap',
      };
    }
  },

  async getChakraGuidance(req: ChakraGuidanceRequest): Promise<ChakraGuidanceResponse> {
    try {
      const res = await fetch('/api/chakra/guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      return await res.json();
    } catch (err: any) {
      return {
        success: true,
        guidanceScript: `### Gentle Centering Session (${req.durationMinutes} Minutes)
1. **Physical Grounding:** Settle into a comfortable posture. Release tension in your shoulders, jaw, and hands.
2. **Natural Breath Flow:** Observe the natural rhythm of your breath. Inhale clarity, exhale distraction.
3. **Contemplative Anchor:** Rest your attention gently on inner balance, emotional equanimity, and presence.
4. **Closing:** Take one soft, gentle breath and open your eyes when you feel ready.`,
        source: 'dasasurya-local-chakra',
      };
    }
  },

  async getRavanaMindAnalysis(req: RavanaMindRequest): Promise<RavanaMindResponse> {
    try {
      const res = await fetch('/api/gemini/ravana-mind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      return await res.json();
    } catch (err: any) {
      return {
        success: true,
        analysis: `### RAVANA MIND: Multi-Perspective Analysis
**Core Dilemma:** "${req.problem}"

#### 1. Fact, Assumption & Unknown Deconstruction
- **Facts:** Quantified physical and resource limits.
- **Assumptions:** Historical conventions treated as unbreakable laws.
- **Unknowns:** Unmeasured downstream second-order feedback effects.

#### 2. Perspectives & Trade-offs
- **Head 01 (Knowledge):** Deconstruct the technical bottleneck to first principles.
- **Head 05 (Strategy):** Map incentives and establish milestone gates.
- **Head 04 (Wellness):** Ensure biological stamina is protected over 12 months.

#### 3. Action Pathways
1. Low-Risk Probe: Run a 7-day micro-experiment testing the primary assumption.
2. Structural Simplification: Eliminate non-essential steps before committing capital.
3. Strategic Alignment: Partner with or leverage existing verified architectures.`,
        source: 'ravana-mind-local-heuristics',
      };
    }
  },

  async getDailyBrief(userInterests: string[] = [], language: LanguageCode = 'en'): Promise<DailyBriefResponse> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch('/api/gemini/daily-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: today, userInterests, language }),
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      return await res.json();
    } catch (err: any) {
      return {
        success: true,
        brief: `### DASASURYA DAILY BRIEF · Focus & Compounding

#### 1. Knowledge Signal (Head 01)
- **Principle:** Deep neural networks and human brains both require distinct consolidation phases (sleep/pruning) to convert working memory into durable synaptic weights.
- **AI Suggestion:** After completing a dense chapter, disengage for 10 minutes rather than switching immediately to another screen.

#### 2. Strategic Leverage Signal (Head 05)
- **Insight:** Leverage without permission (writing, software architectures, reproducible assets) provides asymmetric upside without linear exhaustion.

#### 3. Critical Thinking Puzzle (Head 05)
- **Challenge:** You observe that startup founders who wake up at 5:00 AM are 20% more likely to be featured in magazines. Is early rising the cause, or is this survivorship and publicity bias?

#### 4. Vitality Habit (Head 04)
- **Practice:** Hydrate with 500ml water and view natural ambient light within 30 minutes of waking to anchor circadian cortisol rhythm.

#### 5. Sovereign Reflection
- *Are you organizing your notes to avoid the discomfort of actually applying what you learned?*`,
        source: 'dasasurya-local-brief',
      };
    }
  },

  // Web Speech API: Text-to-Speech
  speakText(text: string, lang: string = 'en-US'): { stop: () => void } {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not available in this browser');
      return { stop: () => {} };
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/```[\s\S]*?```/g, 'Code block omitted.').replace(/[#*_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 500));
    utterance.lang = lang;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
    return {
      stop: () => window.speechSynthesis.cancel(),
    };
  },

  // Web Speech API: Speech-to-Text
  listenSpeech(
    lang: string = 'en-US',
    onResult: (text: string) => void,
    onError: (err: any) => void
  ): { stop: () => void } {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onError(new Error('Speech recognition is not supported in this browser environment.'));
      return { stop: () => {} };
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      recognition.onerror = (event: any) => {
        onError(event.error);
      };

      recognition.start();
      return {
        stop: () => {
          try {
            recognition.stop();
          } catch (e) {}
        },
      };
    } catch (err) {
      onError(err);
      return { stop: () => {} };
    }
  },

  getModeFallback(mode: SanR10Mode, message: string, headId?: string): string {
    switch (mode) {
      case 'learning':
        return `[SAN R10 · Learning Mode · ${headId || 'Universal'}]\n\nTo master "${message}", step back to first principles:\n1. What is the fundamental invariant in this system?\n2. What assumption can we test before calculating specifics?\n\nExplain your baseline assumption and we will advance to the core mechanism.`;
      case 'reasoning':
        return `[SAN R10 · Reasoning Mode]\n\nDeconstructing: "${message}"\n- **Facts:** Verified constraints governing the system.\n- **Assumptions:** Unverified heuristics that require scrutiny.\n- **Unknowns:** Delayed downstream feedback loops.\n\nCompare options A and B by evaluating risk asymmetry and long-term durability.`;
      case 'technical':
        return `[SAN R10 · Technical Mode]\n\n\`\`\`typescript\n// Invariant Boundary Definition\nexport interface SystemState {\n  readonly timestamp: number;\n  readonly status: 'idle' | 'executing' | 'settled';\n}\n\`\`\`\n\nEnsure state transitions are deterministic and protected by idempotent bounds.`;
      case 'planning':
        return `[SAN R10 · Planning Mode]\n\nRoadmap for: "${message}"\n- Stage 1: Deconstruction & baseline metrics (Days 1–7)\n- Stage 2: Controlled prototype experiment (Days 8–14)\n- Stage 3: Applied synthesis and habit integration (Days 15–28)`;
      case 'reflection':
        return `[SAN R10 · Reflection Mode]\n\nReflecting on: "${message}"\nIdentify where the friction occurred: Was it a lack of clear definitions, conflicting incentives, or excessive scope? Name one constructive adjustment for tomorrow.`;
      case 'voice':
        return `SAN R10 online. Regarding ${message.slice(0, 50)}. Ground yourself in first principles and take one measured step today.`;
      case 'knowledge':
        return `[SAN R10 · Grounded Knowledge]\n\nBased on authorized documentation [Source: DASASURYA Architecture]:\nThe 10 interconnected heads structure human capability across Knowledge, Language, Music, Wellness, Strategy, Vision, Voice, Astronomy, Traditional Knowledge, and Governance.`;
      case 'action':
        return `[SAN R10 · Action Proposal]\n\nAction: Log learning milestone in MY DAY calendar.\nRisk Level: Low.\nPermission: Learner.\nReply "Confirm" to commit this action.`;
      default:
        return `[SAN R10 · Adaptive Intelligence]\n\nI have received your request regarding "${message}". Let us deconstruct this systematically across the relevant intelligence heads.`;
    }
  },

  getHeuristicFallback(level: number, question: string, concept?: string, language: string = 'en'): string {
    switch (level) {
      case 1:
        return `[SAN R10 · Level 1 Guiding Question]\n\nRegarding "${question}":\nWhat is the single most basic premise you are taking for granted? If that premise were 180 degrees inverted, how would the problem look?`;
      case 2:
        return `[SAN R10 · Level 2 Concept Orientation]\n\nInvestigate the core principle of **${concept || 'Invariant Constraints'}**.\nNotice where inputs cross system boundaries. What conservation law or balancing mechanism governs that boundary?`;
      case 3:
        return `[SAN R10 · Level 3 Strategic Hint]\n\nConsider this analogy: You are trying to optimize an engine by polishing the paint. Isolate the mechanical bottleneck (the rate-limiting step) before adjusting surface parameters.`;
      case 4:
        return `[SAN R10 · Level 4 Underlying Reasoning]\n\nThe barrier here is that human intuition expects linear cause-and-effect, whereas this domain operates via feedback loops. When you push on variable A, the system pushes back through variable B with a delay.`;
      case 5:
      default:
        return `[SAN R10 · Level 5 Comprehensive Synthesis]\n\nHere is the step-by-step resolution for "${question}":\n1. Identify the fundamental invariant.\n2. Deconstruct conflicting assumptions.\n3. Formulate the minimal viable synthesis.\n\nNow, test this understanding against the interactive chapter practice to solidify the neural pathway.`;
    }
  }
};
