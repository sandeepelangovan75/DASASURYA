export interface SocraticRequest {
  question: string;
  concept?: string;
  socraticLevel: number;
  currentHead?: string;
  codeSnippet?: string;
  userProgress?: string;
}

export interface SocraticResponse {
  success: boolean;
  level: number;
  response: string;
  source: string;
}

export interface RavanaMindRequest {
  problem: string;
  selectedHeads?: string[];
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

export const aiService = {
  async getSocraticGuidance(req: SocraticRequest): Promise<SocraticResponse> {
    try {
      const res = await fetch('/api/gemini/socratic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      return await res.json();
    } catch (err: any) {
      console.warn('Network call to Socratic endpoint failed, using client-side pedagogical fallback:', err);
      return {
        success: true,
        level: req.socraticLevel,
        response: this.getHeuristicFallback(req.socraticLevel, req.question, req.concept),
        source: 'dasasurya-local-pedagogy',
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

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      return await res.json();
    } catch (err: any) {
      console.warn('Network call to Ravana Mind endpoint failed, using client fallback:', err);
      return {
        success: true,
        analysis: `### Multi-Perspective Decomposition
**Core Dilemma:** "${req.problem}"

#### Perspective I: Knowledge & Logic (Head 01)
- Axiom Check: What are the irreducible constraints? Distinguish unalterable physical realities from social conventions.
- Trade-off: High empirical precision, but beware infinite regression without action.

#### Perspective II: Strategy & Governance (Head 05)
- Second-Order Analysis: What incentive loops will your initial solution create?
- Trade-off: Structured coordination, but requires discipline to enforce boundaries.

#### Perspective III: Vitality & Emotional Mastery (Heads 03 & 07)
- Capacity Audit: Does this path preserve your circadian stamina and psychological equanimity over 12 months?

### Action Pathways
1. **Low-Risk Probe:** Run a 7-day micro-experiment to validate your primary assumption.
2. **Structural Simplification:** Eliminate non-essential dependencies before committing capital.
3. **Decisive Commitment:** Choose the path of highest long-term leverage, acknowledging immediate short-term friction.`,
        source: 'ravana-mind-local-heuristics',
      };
    }
  },

  async getDailyBrief(userInterests: string[] = []): Promise<DailyBriefResponse> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch('/api/gemini/daily-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: today, userInterests }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      return await res.json();
    } catch (err: any) {
      console.warn('Network call to Daily Brief failed, using local brief:', err);
      return {
        success: true,
        brief: `### DASASURYA DAILY BRIEF · Focus & Compounding

#### 1. Knowledge Signal (Head 01)
- **Fact:** Deep neural networks and human brains both require distinct consolidation phases (sleep/pruning) to convert working memory into durable synaptic weights.
- **AI Suggestion:** After completing a dense chapter, disengage for 10 minutes rather than immediately switching to another screen task.

#### 2. Creation & Wealth Signal (Head 02)
- **Insight:** Leverage without permission (writing, software architectures, reproducible assets) provides asymmetric upside without linear exhaustion.
- **Safety Note:** True compounding requires patience; reject schemes promising overnight returns.

#### 3. Critical Thinking Puzzle (Head 04)
- **Challenge:** You observe that startup founders who wake up at 5:00 AM are 20% more likely to be featured in magazines. Does early rising cause business success, or is this survivorship and publicity bias?

#### 4. Vitality Habit (Head 03)
- **Practice:** Hydrate with 500ml water and view natural ambient light within 30 minutes of waking to anchor circadian cortisol rhythms.

#### 5. Shadow Check (Head 05)
- *Are you organizing your notes to avoid the discomfort of actually applying what you learned?*`,
        source: 'dasasurya-local-brief',
      };
    }
  },

  getHeuristicFallback(level: number, question: string, concept?: string): string {
    switch (level) {
      case 1:
        return `[Level 1 Guiding Question]\n\nRegarding "${question}":\nWhat is the single most basic premise you are taking for granted? If that premise were 180 degrees inverted, how would the problem look?`;
      case 2:
        return `[Level 2 Concept Orientation]\n\nInvestigate the core principle of **${concept || 'Invariant Constraints'}**.\nNotice where inputs cross system boundaries. What conservation law or balancing mechanism governs that boundary?`;
      case 3:
        return `[Level 3 Strategic Hint]\n\nConsider this analogy: You are trying to optimize an engine by polishing the paint. Isolate the mechanical bottleneck (the rate-limiting step) before adjusting surface parameters.`;
      case 4:
        return `[Level 4 Underlying Reasoning]\n\nThe barrier here is that human intuition expects linear cause-and-effect, whereas this domain operates via feedback loops. When you push on variable A, the system pushes back through variable B with a delay.`;
      case 5:
      default:
        return `[Level 5 Comprehensive Synthesis]\n\nHere is the step-by-step resolution for "${question}":\n1. Identify the fundamental invariant.\n2. Deconstruct conflicting assumptions.\n3. Formulate the minimal viable synthesis.\n\nNow, test this understanding against the interactive chapter practice to solidify the neural pathway.`;
    }
  }
};
