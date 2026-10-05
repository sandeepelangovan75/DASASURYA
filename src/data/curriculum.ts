import { Course, HeadPillar } from '../types';

export const HEAD_PILLARS: HeadPillar[] = [
  {
    id: 'head-01-knowledge-logic',
    number: 1,
    romanNumeral: 'I',
    name: 'Knowledge & Logic',
    tagline: 'First Principles & Rigorous Rationality',
    focusAreas: ['Science', 'Technology', 'Mathematics', 'Logic', 'Reasoning', 'First Principles', 'Research Skills', 'Information Literacy'],
    light: 'Knowledge, empirical discovery, rational thinking, and conceptual clarity.',
    shadow: 'Overthinking, information overload, false certainty, and intellectual ego.',
    selfCorrection: 'Empirical verification, uncertainty awareness, falsification testing, and epistemological humility.',
    accentColor: '#38BDF8', // Electric Sky
    accentBorder: 'rgba(56, 189, 248, 0.3)',
    iconName: 'Atom',
    description: 'Deconstruct complex systems to their foundational axioms. Distinguish signal from noise and build bulletproof logical deductions.'
  },
  {
    id: 'head-02-wealth-creation',
    number: 2,
    romanNumeral: 'II',
    name: 'Wealth & Creation',
    tagline: 'Asymmetric Value & Sustainable Independence',
    focusAreas: ['Financial Literacy', 'Freelancing', 'Entrepreneurship', 'Digital Products', 'Career Skills', 'Value Creation', 'Business Fundamentals', 'Responsible Money Management'],
    light: 'Financial independence, generative creation, ethical exchange, and expanding human opportunity.',
    shadow: 'Greed, exploitation, obsession with accumulation, and toxic hustle culture.',
    selfCorrection: 'Ethics, systemic sustainability, long-term compounding, and societal stewardship.',
    accentColor: '#F59E0B', // Warm Amber
    accentBorder: 'rgba(245, 158, 11, 0.3)',
    iconName: 'Coins',
    description: 'Learn responsible capital allocation, build valuable digital and physical solutions, and master sustainable financial autonomy.'
  },
  {
    id: 'head-03-vitality',
    number: 3,
    romanNumeral: 'III',
    name: 'Vitality',
    tagline: 'Physical Resilience & Sustainable Energy',
    focusAreas: ['Physical Fitness', 'Movement', 'Sleep Architecture', 'Nutrition Fundamentals', 'Healthy Routines', 'Stress Management', 'Sustainable Lifestyle'],
    light: 'Sustained energy, bodily resilience, physical capability, and restorative vitality.',
    shadow: 'Overtraining, orthorexia, body dysmorphia, chronic burnout, and rigid physical obsession.',
    selfCorrection: 'Biological balance, intentional recovery, circadian pacing, and professional clinical guidance when needed.',
    accentColor: '#10B981', // Emerald
    accentBorder: 'rgba(16, 185, 129, 0.3)',
    iconName: 'Activity',
    description: 'Build your biological instrument. Harmonize movement, restorative sleep, and nutritional nourishment to sustain decades of high-order creative work.'
  },
  {
    id: 'head-04-critical-mind',
    number: 4,
    romanNumeral: 'IV',
    name: 'Critical Mind',
    tagline: 'Cognitive Defense & Probabilistic Thought',
    focusAreas: ['Critical Thinking', 'Cognitive Biases', 'Skepticism', 'Decision-Making', 'Argument Analysis', 'Probability', 'Problem Decomposition'],
    light: 'Clarity of discernment, independent evaluation, and liberation from dogma.',
    shadow: 'Paralysis by analysis, nihilistic cynicism, chronic distrust, and intellectual isolation.',
    selfCorrection: 'Empirical evidence, intellectual openness, and proportional skepticism calibrated to risk.',
    accentColor: '#818CF8', // Indigo
    accentBorder: 'rgba(129, 140, 248, 0.3)',
    iconName: 'BrainCircuit',
    description: 'Immunize your thinking against fallacies, cognitive biases, and deceptive rhetoric. Quantify probabilities and update beliefs in light of evidence.'
  },
  {
    id: 'head-05-strategy-governance',
    number: 5,
    romanNumeral: 'V',
    name: 'Strategy & Governance',
    tagline: 'Systems Thinking & Principled Leadership',
    focusAreas: ['Strategy', 'Planning', 'Leadership', 'Systems Thinking', 'Negotiation', 'Governance', 'Decision Frameworks', 'Resource Allocation'],
    light: 'Equitable leadership, coordinated action, clear vision, and systemic flourishing.',
    shadow: 'Manipulation, authoritarian domination, political machinations, and zero-sum conquest.',
    selfCorrection: 'Transparent governance, institutional accountability, mutual benefit, and servant leadership.',
    accentColor: '#EC4899', // Rose Quartz
    accentBorder: 'rgba(236, 72, 153, 0.3)',
    iconName: 'Compass',
    description: 'Anticipate second and third-order consequences. Align collective incentives and steward resources with surgical precision and integrity.'
  },
  {
    id: 'head-06-creative-arts',
    number: 6,
    romanNumeral: 'VI',
    name: 'Creative Arts',
    tagline: 'Aesthetic Depth & Expressive Innovation',
    focusAreas: ['Music', 'Writing', 'Poetry', 'Visual Creativity', 'Storytelling', 'Design Systems', 'Imagination', 'Creative Experimentation'],
    light: 'Original aesthetic synthesis, visceral storytelling, empathy cultivation, and cultural resonance.',
    shadow: 'Creative paralysis, performative ego, elitist isolation, and self-destructive artistic mythology.',
    selfCorrection: 'Rapid iterative drafts, audience resonance, playful experimentation, and detached constructive critique.',
    accentColor: '#A855F7', // Royal Purple
    accentBorder: 'rgba(168, 85, 247, 0.3)',
    iconName: 'Palette',
    description: 'Channel imagination into tangible works. Combine sound, prose, imagery, and structural craft to evoke transcendent human understanding.'
  },
  {
    id: 'head-07-emotional-mastery',
    number: 7,
    romanNumeral: 'VII',
    name: 'Emotional Mastery',
    tagline: 'Self-Awareness & Equanimity',
    focusAreas: ['Self-Awareness', 'Emotional Literacy', 'Resilience', 'Equanimity', 'Stress Inoculation', 'Personal Boundaries', 'Relational Skills'],
    light: 'Unshakable self-awareness, emotional grounding, relational trust, and grounded compassion.',
    shadow: 'Emotional repression, pathological detachment, emotional manipulation, and codependency.',
    selfCorrection: 'Authentic expression, reflective inquiry, somatic awareness, and healthy relational boundaries.',
    accentColor: '#F43F5E', // Crimson
    accentBorder: 'rgba(244, 63, 94, 0.3)',
    iconName: 'HeartHandshake',
    description: 'Transform emotional reactivity into conscious intentionality. Master your internal state and build relationships founded on radical honesty and mutual respect.'
  },
  {
    id: 'head-08-communication',
    number: 8,
    romanNumeral: 'VIII',
    name: 'Communication',
    tagline: 'Articulate Rhetoric & Deep Listening',
    focusAreas: ['Linguistics', 'Technical Writing', 'Public Speaking', 'Presentation', 'Active Listening', 'Storytelling', 'Vocabulary', 'Executive Discourse'],
    light: 'Unambiguous transmission of ideas, mutual comprehension, inspiring discourse, and bridging ideological divides.',
    shadow: 'Sophistry, demagoguery, disinformation, weaponized rhetoric, and conversational narcissism.',
    selfCorrection: 'Uncompromising truthfulness, active listening, radical charity of interpretation, and conciseness.',
    accentColor: '#06B6D4', // Cyan
    accentBorder: 'rgba(6, 182, 212, 0.3)',
    iconName: 'MessageSquareShare',
    description: 'Deliver complex truths with effortless simplicity. Bridge differences through active listening and master the art of articulate oral and written persuasion.'
  },
  {
    id: 'head-09-universal-sciences',
    number: 9,
    romanNumeral: 'IX',
    name: 'Universal Sciences',
    tagline: 'Cosmic Order & Physical Laws',
    focusAreas: ['Astronomy', 'Fundamental Physics', 'Ecology & Earth Systems', 'Cosmology', 'Scientific Discovery', 'Universal Invariants', 'Quantum Foundations'],
    light: 'Awe for the natural cosmos, reverence for scientific inquiry, and holistic ecological consciousness.',
    shadow: 'Dogmatic scientism, reckless technological intervention, and cosmic nihilism.',
    selfCorrection: 'Rigorous peer consensus, planetary stewardship, reproducibility, and awe balanced with empirical discipline.',
    accentColor: '#6366F1', // Cosmic Indigo
    accentBorder: 'rgba(99, 102, 241, 0.3)',
    iconName: 'Globe',
    description: 'Explore the fundamental architecture of reality. Understand celestial mechanics, thermodynamics, quantum principles, and our place in the cosmic tapestry.'
  },
  {
    id: 'head-10-automation-systems',
    number: 10,
    romanNumeral: 'X',
    name: 'Automation & Systems',
    tagline: 'Algorithmic Leverage & Human Dignity',
    focusAreas: ['Programming & Algorithms', 'Artificial Intelligence', 'Workflow Automation', 'Productivity Engineering', 'Data Architectures', 'System Reliability', 'Intentional Technology'],
    light: 'Exponential human leverage, liberation from mundane drudgery, and elegant software architecture.',
    shadow: 'Fragile over-automation, algorithmic alienation, privacy erosion, and loss of fundamental craft.',
    selfCorrection: 'Human-in-the-loop governance, data sovereignty, robust fail-safes, and intentional digital minimalism.',
    accentColor: '#14B8A6', // Teal
    accentBorder: 'rgba(20, 184, 166, 0.3)',
    iconName: 'Cpu',
    description: 'Harness the power of computation and automated architectures. Build autonomous systems that amplify human agency rather than diminish human dignity.'
  }
];

export const COURSES: Course[] = [
  {
    id: 'course-01-logic-foundations',
    headId: 'head-01-knowledge-logic',
    title: 'Foundations of Rational Inquiry & First Principles',
    subtitle: 'From Axiomatic Deconstruction to Infallible Mental Models',
    description: 'A masterclass in stripping complex ideas down to fundamental truths and building sound conclusions from the ground up.',
    level: 'Foundational',
    modules: [
      {
        id: 'mod-01-deconstruction',
        courseId: 'course-01-logic-foundations',
        headId: 'head-01-knowledge-logic',
        order: 1,
        title: 'Module 1: The Anatomy of First Principles',
        description: 'Explore how ancient geometers, modern physicists, and pioneering engineers deconstruct inherited assumptions.',
        chapters: [
          {
            id: 'chap-01-first-principles',
            moduleId: 'mod-01-deconstruction',
            headId: 'head-01-knowledge-logic',
            order: 1,
            title: 'Chapter 1: The Socratic Scalpel — Deconstructing Inherited Assumptions',
            estimatedMinutes: 18,
            learningObjectives: [
              'Differentiate between reasoning by analogy and reasoning from first principles.',
              'Apply the 4-step Cartesian deconstruction protocol to an intractable problem.',
              'Identify the subtle trap of intellectual reductionism (the Shadow of Head 01).'
            ],
            pillarAlignment: {
              light: 'Intellectual sovereignty and true discovery free from conventional dogma.',
              shadow: 'Hyper-skepticism that dismantles useful heuristics without offering viable synthesis.',
              selfCorrection: 'Verify against empirical feedback and test reconstructed axioms in the real world.'
            },
            sections: [
              {
                id: 'sec-01-introduction',
                title: 'The Burden of Analogy',
                content: `Most human reasoning proceeds through imitation. When asked why a software framework requires four layers of abstraction, or why an aerospace battery pack costs $600 per kilowatt-hour, the conventional answer is almost invariably: "Because that is the prevailing standard." 

This is reasoning by analogy: copying what others have done with minor, incremental tweaks. While socially comfortable and cognitively inexpensive, analogy is fatal when navigating structural inflection points.

First principles thinking, by contrast, is the practice of boiling things down to the most fundamental truths you can verify, and asking: "What are we sure is true?" From there, you reason upward.`,
                keyDefinition: {
                  term: 'First Principle (Axiom)',
                  definition: 'A foundational, self-evident proposition that cannot be deduced from any other premise within the logical system.'
                },
                analogy: 'Think of inherited knowledge as an ornate wooden mansion built upon shifting sand. Reasoning by analogy renovates the wallpaper. First principles thinking inspects the bedrock, removes rotten timbers, and pours a reinforced concrete foundation.'
              },
              {
                id: 'sec-02-cartesian-protocol',
                title: 'The 4-Step Analytical Reduction Protocol',
                content: `To systematically deconstruct any complex problem or claim, follow this rigorous 4-stage protocol:

1. **Statement Clarification:** Write down the exact assertion without vague colloquialisms. (e.g., "Our platform cannot scale past 10,000 concurrent queries.")
2. **Assumption Strip-Mining:** Identify every implicit assumption hidden in the statement. Which depend on physical laws, and which on historical conventions?
3. **Axiomatic Grounding:** Isolate the irreducible physical or mathematical constraints. What does Shannon's limit or CPU cache line size dictate?
4. **Bottom-Up Synthesis:** Reconstruct the solution using only verified axioms, unburdened by legacy architectural choices.`,
                diagramType: 'flow',
                diagramData: {
                  steps: ['Problem Statement', 'Strip-Mine Assumptions', 'Isolate Invariant Axioms', 'Bottom-Up Synthesis']
                },
                commonMistakes: [
                  'Mistaking an established industry best-practice for an unchangeable law of physics.',
                  'Discarding valuable historical intuition out of arrogance before verifying the edge cases.',
                  'Refusing to reconstruct a viable solution after dismantling an imperfect model.'
                ]
              },
              {
                id: 'sec-03-code-analogy',
                title: 'Case Study: The 10x Battery Calculation',
                content: `When Elon Musk investigated lithium-ion battery costs in the early 2000s, market rates were roughly $600/kWh. Instead of accepting the prevailing price tag, the engineering team applied first principles:

- What are the material constituents of a battery cell? (Cobalt, nickel, aluminum, carbon, polymers, and steel).
- If bought on the London Metal Exchange as raw spot commodities, what do those elements cost? (Roughly $80/kWh).
- Conclusion: The $520 gap was not a fundamental physical barrier—it was an inefficiency in supply chains, chemical refining, and mechanical assembly.

This single realization unlocked the electric vehicle revolution.`,
                codeSnippet: {
                  language: 'typescript',
                  code: `// First Principles Material Cost Evaluator
interface MaterialConstituent {
  name: string;
  marketPricePerKg: number;
  weightPerUnitKg: number;
}

function calculateAxiomaticMaterialFloor(materials: MaterialConstituent[]): number {
  return materials.reduce((totalFloor, material) => {
    return totalFloor + (material.marketPricePerKg * material.weightPerUnitKg);
  }, 0);
}`,
                  explanation: 'By calculating the raw physical floor cost, we separate immutable thermodynamic limits from remediable operational inefficiencies.'
                }
              }
            ],
            summary: [
              'Reasoning by analogy creates linear iterations; reasoning by first principles produces structural breakthroughs.',
              'Deconstruction requires stripping away historical habits to uncover immutable physical or logical invariants.',
              'Always balance pure intellectual skepticism with real-world empirical validation.'
            ],
            quiz: [
              {
                id: 'q1-1',
                question: 'What is the primary difference between reasoning by analogy and reasoning by first principles?',
                options: [
                  'Analogy uses numbers, whereas first principles uses linguistic descriptions.',
                  'Analogy copies existing patterns with minor adjustments; first principles deconstructs to foundational physical/logical truths.',
                  'First principles requires advanced degrees, whereas analogy is purely intuitive.',
                  'Analogy is always incorrect, while first principles is never wrong.'
                ],
                correctIndex: 1,
                explanation: 'Analogy relies on existing benchmarks and conventions. First principles interrogates foundational axioms directly.',
                conceptHint: 'Review Section 1: The Burden of Analogy.'
              },
              {
                id: 'q1-2',
                question: 'What is the greatest "Shadow" trap when applying Head 01 (Knowledge & Logic)?',
                options: [
                  'Spending too much money on books.',
                  'Paralysis by analysis and intellectual ego that dismantles without building.',
                  'Relying on empirical experiments.',
                  'Communicating with too much simplicity.'
                ],
                correctIndex: 1,
                explanation: 'The shadow of pure logic is hyper-intellectualization, cynicism, and inaction without constructive synthesis.',
                conceptHint: 'Review the Pillar Alignment on Light vs Shadow.'
              }
            ],
            practice: {
              id: 'prac-01',
              title: 'Axiomatic Problem Deconstruction',
              prompt: 'Select one bottleneck or persistent challenge in your work, study, or daily life. Write down the problem as currently framed. Then list 3 implicit assumptions you have accepted without proof. Finally, identify which one is a convention rather than an immutable law.',
              starterContent: '1. Problem Statement:\n2. Accepted Assumptions:\n  a)\n  b)\n  c)\n3. The Convention Masquerading as a Law:',
              rubric: [
                'Problem statement is concrete and measurable.',
                'At least three distinct implicit assumptions are surfaced.',
                'A clear distinction is drawn between physical limits and historical conventions.'
              ],
              suggestedSolution: 'Example Problem: "I do not have time to read books." Assumption: A book must be read linearly from page 1 to 300. Convention: You can extract the core thesis in 30 minutes by reviewing TOC, conclusions, and key chapters.'
            },
            realWorldApplication: {
              id: 'app-01',
              title: 'Workplace Architecture Audit',
              scenario: 'Your organization or project uses a recurring 60-minute meeting every week that attendees describe as ineffective.',
              deliverablePrompt: 'Deconstruct the communication need from first principles. What information must actually be transmitted, who must decide, and what is the lowest-friction medium to accomplish that outcome?',
              evaluationChecklist: [
                'Identifies the genuine informational objective.',
                'Eliminates performative synchronization.',
                'Proposes an asynchronous, verifiable protocol.'
              ]
            },
            reflectionPrompt: 'Where in your life are you currently settling for an expensive or exhausting inherited convention simply because "everyone does it this way"?'
          }
        ]
      }
    ]
  },
  {
    id: 'course-02-wealth-leverage',
    headId: 'head-02-wealth-creation',
    title: 'Value Architecture & Ethical Leverage',
    subtitle: 'Building Compounding Assets in the Digital Age',
    description: 'Learn foundational economics, code and media leverage, freelance positioning, and responsible personal balance sheets.',
    level: 'Foundational',
    modules: [
      {
        id: 'mod-02-asymmetric-value',
        courseId: 'course-02-wealth-leverage',
        headId: 'head-02-wealth-creation',
        order: 1,
        title: 'Module 1: The Forms of Leverage',
        description: 'Understand how human labor, capital, code, and media multiply productive output without linear exhaustion.',
        chapters: [
          {
            id: 'chap-02-four-leverages',
            moduleId: 'mod-02-asymmetric-value',
            headId: 'head-02-wealth-creation',
            order: 1,
            title: 'Chapter 1: Permissionless Leverage — Code, Media & Capital',
            estimatedMinutes: 20,
            learningObjectives: [
              'Contrast permissioned leverage (labor, bank capital) with permissionless leverage (code, digital media).',
              'Understand the mathematical reality of marginal reproduction cost approaching zero.',
              'Adhere to wealth learning safety: reject get-rich-quick fallacies and recognize systemic risk.'
            ],
            pillarAlignment: {
              light: 'Financial independence, freedom of time, and ethical value creation for humanity.',
              shadow: 'Greed, predatory speculation, exploitative hustle culture, and zero-sum financial gambling.',
              selfCorrection: 'Transparent ethics, compounding durable skills, and long-term stewardship.'
            },
            sections: [
              {
                id: 'sec-02-1-leverage-evolution',
                title: 'The History of Human Leverage',
                content: `In an agrarian society, your economic output was strictly bounded by the number of calories your muscles could expend in daylight. 

The first historical forms of leverage were **Labor** (having others work for you) and **Capital** (investing money to buy factories or ships). Both of these required permission: someone had to agree to follow you, or a financier had to grant you a loan.

In the 21st century, a radical discontinuity occurred: the birth of **Permissionless Leverage**. Anyone with an internet connection can write code that runs while they sleep, or publish media that educates millions without asking for a broadcast license.`,
                keyDefinition: {
                  term: 'Marginal Cost of Replication',
                  definition: 'The additional cost incurred to create one extra unit of an already produced asset. In digital code and written text, this cost is effectively zero.'
                }
              },
              {
                id: 'sec-02-2-safety-warning',
                title: 'Educational Safety & Risk Realism',
                content: `**CRITICAL GUARDRAIL:** Wealth education within SAN_R-10 is purely educational. We never promise guaranteed income, quick windfalls, or risk-free returns. 

True wealth creation is a multi-year compounding game built on specific knowledge, accountable reputation, and sound judgment. Anyone selling guaranteed formulas is selling financial illusion. Always maintain adequate cash buffers and never risk what you cannot afford to lose.`,
                commonMistakes: [
                  'Confusing high-volatility financial speculation with durable skill building.',
                  'Believing leverage eliminates the need for deep domain craft.',
                  'Sacrificing physical vitality (Head 03) or personal ethics (Head 05) in pursuit of monetary speed.'
                ]
              }
            ],
            summary: [
              'Permissionless leverage (code, media) democratizes creation without requiring gatekeeper approval.',
              'Sustainable wealth is the byproduct of solving specific problems for people at scale.',
              'Protect your integrity: reject get-rich narratives and build authentic compounding capability.'
            ],
            quiz: [
              {
                id: 'q2-1',
                question: 'Which of the following is considered permissionless leverage?',
                options: [
                  'Managing a 50-person corporate committee.',
                  'Writing an open-source software library or structured educational course.',
                  'Borrowing money from a venture debt fund.',
                  'Hiring manual hourly staff.'
                ],
                correctIndex: 1,
                explanation: 'Code and media can be created and replicated globally without requiring approval from gatekeepers.',
                conceptHint: 'Review Section 1: The History of Human Leverage.'
              }
            ],
            practice: {
              id: 'prac-02',
              title: 'Personal Leverage Audit',
              prompt: 'Map your current daily activities into three buckets: 1) Linear time-for-money tasks, 2) Repetitive administrative tasks that can be automated, and 3) Compounding assets (writing, code, systems) that retain value over time.',
              starterContent: '1. Linear Hours:\n2. Candidate Automations:\n3. Compounding Assets Being Built:',
              rubric: [
                'Accurate classification of personal time.',
                'Realistic identification of at least one automatable task.',
                'A dedicated slot for building durable knowledge assets.'
              ],
              suggestedSolution: 'Actionable goal: Allocate 45 minutes every morning to building a reusable template or guide before checking client emails.'
            },
            realWorldApplication: {
              id: 'app-02',
              title: 'The Digital Micro-Product Spec',
              scenario: 'You possess unique domain expertise in a specific workflow (e.g. data cleaning, project kickoff, resume writing).',
              deliverablePrompt: 'Design a digital checklist, template, or interactive mini-tool that solves this problem with zero marginal cost of distribution.',
              evaluationChecklist: [
                'Solves an acute, specific pain point.',
                'Requires zero incremental human hours per download.',
                'Priced transparently with clear ethical value proposition.'
              ]
            },
            reflectionPrompt: 'Are you currently trading your finite life-hours for short-term compensation, or are you dedicating a percentage of your focus to building assets that compound?'
          }
        ]
      }
    ]
  },
  {
    id: 'course-03-vitality-endurance',
    headId: 'head-03-vitality',
    title: 'Biological Architecture & Ultradian Endurance',
    subtitle: 'Circadian Pacing, Deep Sleep & Cognitive Longevity',
    description: 'Master the biological foundation of intellectual output. Non-medical, evidence-based habit architectures.',
    level: 'Foundational',
    modules: [
      {
        id: 'mod-03-circadian-rhythms',
        courseId: 'course-03-vitality-endurance',
        headId: 'head-03-vitality',
        order: 1,
        title: 'Module 1: The Physiology of Cognitive Stamina',
        description: 'Synchronize cognitive sprints with biological ultradian rhythms and restorative sleep stages.',
        chapters: [
          {
            id: 'chap-03-circadian-pacing',
            moduleId: 'mod-03-circadian-rhythms',
            headId: 'head-03-vitality',
            order: 1,
            title: 'Chapter 1: The 90-Minute Ultradian Wave & Vision Resets',
            estimatedMinutes: 15,
            learningObjectives: [
              'Understand human Basic Rest-Activity Cycles (BRAC) and the 90-minute limit of intense focus.',
              'Implement optic flow and visual divergence to disengage autonomic stress response.',
              'Adhere to health learning safety: understand vitality education is preventative habit craft, not medical diagnosis.'
            ],
            pillarAlignment: {
              light: 'Resilient physical energy, mental clarity, and joyful embodiment.',
              shadow: 'Overtraining, orthorexic rigidity, neglecting social connection for wellness rituals.',
              selfCorrection: 'Intuitive flexibility, adequate rest, and consulting licensed healthcare professionals.'
            },
            sections: [
              {
                id: 'sec-03-1-brac',
                title: 'The Ultradian Rhythm of Attention',
                content: `Just as sleep cycles oscillate in 90-minute REM/non-REM waves, waking consciousness operates along an identical **Basic Rest-Activity Cycle (BRAC)**. 

During the first 20 minutes of deep intellectual effort, the brain experiences slight friction as neurochemicals (dopamine, acetylcholine) accumulate. Peaks of high-fidelity focus occur between minute 25 and 75. After roughly 90 minutes, neural ATP depletion and receptor saturation trigger cognitive drop-off.

Pushing through this boundary without rest does not double your productivity—it merely doubles your error rate and triggers sympathetic nervous system distress.`,
                keyDefinition: {
                  term: 'Ultradian Rhythm',
                  definition: 'Recurrent biological periods or cycles repeated throughout a 24-hour day, typically lasting between 90 to 120 minutes.'
                }
              },
              {
                id: 'sec-03-2-visual-reset',
                title: 'Panoramic Vision as an Antidote to Screen Stress',
                content: `When you stare at a phone or monitor, your eyes maintain **foveal convergence**—a tight focal lock. The brain interprets chronic visual convergence as a vigilance state, elevating cortisol and resting heart rate.

To reset your nervous system in under 120 seconds:
1. Step away from your display.
2. Direct your gaze toward the farthest visible horizon or outdoor sky.
3. Soften your gaze into **panoramic vision**, consciously noticing your peripheral environment without turning your head.
4. Take two deep nasal inhales followed by one prolonged oral sigh.`,
                commonMistakes: [
                  'Replacing screen work with screen leisure (e.g. checking social media during focus breaks).',
                  'Using stimulant supplements to mask fundamental chronic sleep deficit.',
                  'Treating personal fitness as a punishing aesthetic trial rather than functional vitality.'
                ]
              }
            ],
            summary: [
              'Cognitive work should be structured in 90-minute blocks separated by genuine sensory resets.',
              'Panoramic vision and outdoor daylight are the most rapid natural tools to reset focal vigilance.',
              'Vitality is the ultimate multiplier of logic, strategy, and creative output.'
            ],
            quiz: [
              {
                id: 'q3-1',
                question: 'What happens to human cognitive performance after approximately 90 minutes of continuous high-intensity focus?',
                options: [
                  'Performance improves exponentially due to hyper-focus.',
                  'Cognitive fatigue sets in, error rates climb, and autonomic stress markers rise.',
                  'Brain waves permanently shift into deep sleep.',
                  'No change occurs if sufficient caffeine is consumed.'
                ],
                correctIndex: 1,
                explanation: 'Ultradian biology limits peak cognitive sprint capacity to roughly 90 minutes before restorative cycles are needed.',
                conceptHint: 'Review Section 1: The Ultradian Rhythm of Attention.'
              }
            ],
            practice: {
              id: 'prac-03',
              title: '90-Minute Sprint & Reset Protocol',
              prompt: 'Design a sustainable schedule for your next deep-work session. Specify your start time, the single goal of your 90-minute block, and exactly what non-screen sensory reset you will perform at minute 90.',
              starterContent: '1. Deep Work Milestone:\n2. Focus Window (90m max):\n3. Sensory Reset Plan (No screens):',
              rubric: [
                'Clear single goal.',
                'Hard 90-minute boundary.',
                'Rest interval includes physical movement or optic horizon reset.'
              ],
              suggestedSolution: 'Sprint: Complete Module 1 Practice. Reset: 5-minute walk outside while keeping eyes in panoramic horizon mode.'
            },
            realWorldApplication: {
              id: 'app-03',
              title: 'Workspace Ergonomics & Lighting Audit',
              scenario: 'Evaluate your primary study desk or office for circadian alignment.',
              deliverablePrompt: 'Inspect morning light exposure, monitor height, and evening ambient blue light reduction. Propose three zero-cost adjustments.',
              evaluationChecklist: [
                'Positions desk near natural morning sunlight.',
                'Raises monitor to eye level to prevent cervical strain.',
                'Introduces warm, low-intensity lighting after sunset.'
              ]
            },
            reflectionPrompt: 'Are you treating your body as a subservient vehicle to carry your brain around, or as the foundational biological instrument of your life architecture?'
          }
        ]
      }
    ]
  },
  {
    id: 'course-04-critical-mind',
    headId: 'head-04-critical-mind',
    title: 'Cognitive Immunity & Bayesian Reasoning',
    subtitle: 'Debiasing Your Mental Software & Argument Analysis',
    description: 'Master probabilistic thinking, identify deceptive logical fallacies, and calibrate personal uncertainty.',
    level: 'Intermediate',
    modules: [
      {
        id: 'mod-04-biases-prob',
        courseId: 'course-04-critical-mind',
        headId: 'head-04-critical-mind',
        order: 1,
        title: 'Module 1: The De-Biasing Matrix',
        description: 'Expose confirmation bias, base-rate neglect, and emotional rationalization.',
        chapters: [
          {
            id: 'chap-04-bayesian-updates',
            moduleId: 'mod-04-biases-prob',
            headId: 'head-04-critical-mind',
            order: 1,
            title: 'Chapter 1: Bayesian Updating — Changing Your Mind in Light of Evidence',
            estimatedMinutes: 22,
            learningObjectives: [
              'Explain Bayes theorem intuitively using prior probability, likelihood of evidence, and posterior probability.',
              'Overcome base-rate neglect when evaluating medical, financial, or engineering metrics.',
              'Implement a "Pre-Mortem" before finalizing high-stakes decisions.'
            ],
            pillarAlignment: {
              light: 'Intellectual independence, clarity of judgment, and freedom from dogma.',
              shadow: 'Cynical nihilism, paralysis by endless skepticism, and refusal to commit.',
              selfCorrection: 'Proportional skepticism calibrated to real evidence, paired with decisive action.'
            },
            sections: [
              {
                id: 'sec-04-1-bayes',
                title: 'The Logic of Changing Your Mind',
                content: `Most people treat beliefs as sports teams: once chosen, they defend them regardless of score. Rational thinkers treat beliefs as provisional hypotheses with associated confidence levels.

Bayesian reasoning can be summarized in one sentence:
**Your new confidence should equal your prior belief, updated by how surprising the new evidence would be if your hypothesis were false.**

If a claim is extraordinary, it requires evidence that is equally difficult to explain through alternative mundane mechanisms.`,
                keyDefinition: {
                  term: 'Base-Rate Fallacy',
                  definition: 'The cognitive error of judging the probability of an outcome based solely on specific anecdotal evidence while ignoring the overall statistical frequency of that event in the general population.'
                }
              },
              {
                id: 'sec-04-2-premortem',
                title: 'The Pre-Mortem Protocol',
                content: `Invented by cognitive psychologist Gary Klein, the **Pre-Mortem** is the antidote to groupthink and optimism bias.

Before launching an initiative:
1. Gather the decision-makers.
2. Say: "Imagine we are now 12 months in the future. The project has failed catastrophically. It was an utter disaster. In the next 10 minutes, write down the comprehensive story of how and why it failed."
3. By legitimizing skepticism upfront, you extract critical risks that team members were previously too polite or intimidated to voice.`,
                commonMistakes: [
                  'Over-weighting vivid recent news stories while ignoring base rates.',
                  'Rejecting valid counter-evidence because the person delivering it has an unappealing style.',
                  'Believing skepticism means arguing against everything rather than searching for truth.'
                ]
              }
            ],
            summary: [
              'Beliefs are probability distributions, not binary dogma.',
              'Update your views when evidence warrants it; changing your mind is a mark of strength.',
              'Use the Pre-Mortem to surface vulnerabilities before committing irreversible capital.'
            ],
            quiz: [
              {
                id: 'q4-1',
                question: 'What is the purpose of conducting a Pre-Mortem before initiating a major project?',
                options: [
                  'To assign blame in advance to team members.',
                  'To assume failure has already occurred and surface hidden risks that optimism bias suppresses.',
                  'To cancel all risky initiatives immediately.',
                  'To celebrate success ahead of time.'
                ],
                correctIndex: 1,
                explanation: 'A Pre-Mortem breaks confirmation bias by asking participants to explain why the project failed, freeing them to point out flaws.',
                conceptHint: 'Review Section 2: The Pre-Mortem Protocol.'
              }
            ],
            practice: {
              id: 'prac-04',
              title: 'Execute a Personal Pre-Mortem',
              prompt: 'Pick your most ambitious current personal goal (e.g. learning a new language, launching a product, career pivot). Assume it is one year from today and you abandoned the goal completely. Write the 3 most likely reasons why failure occurred.',
              starterContent: 'Assumed Failure State (1 Year Ahead):\nReason 1:\nReason 2:\nReason 3:\nPreventative Countermeasure for Reason 1:',
              rubric: [
                'Uncompromising honesty regarding personal friction.',
                'Identifies behavioral causes rather than external bad luck.',
                'Proposes a concrete preventative countermeasure.'
              ],
              suggestedSolution: 'Failure Reason: Procrastinating because modules felt too long. Countermeasure: Reduce daily requirement to 15 focused minutes.'
            },
            realWorldApplication: {
              id: 'app-04',
              title: 'Statistical Headline Fact-Check',
              scenario: 'A viral news headline states: "Drinking Beverage X doubles your risk of rare condition Y from 1 in 1,000,000 to 2 in 1,000,000."',
              deliverablePrompt: 'Calculate the absolute risk increase versus the relative risk increase. Write a 2-paragraph analysis on how media headlines exploit the base-rate fallacy.',
              evaluationChecklist: [
                'Distinguishes absolute risk from relative risk.',
                'Identifies how percentage multipliers create panic.',
                'Formulates a rational, balanced response.'
              ]
            },
            reflectionPrompt: 'What is one belief you held passionately 5 years ago that you have since abandoned? What evidence compelled you to change your mind?'
          }
        ]
      }
    ]
  },
  {
    id: 'course-05-strategy-systems',
    headId: 'head-05-strategy-governance',
    title: 'Systems Thinking & Ethical Governance',
    subtitle: 'Second-Order Dynamics, Game Theory & Resource Allocation',
    description: 'Anticipate non-linear feedback loops, align incentive architectures, and lead with accountability.',
    level: 'Intermediate',
    modules: [
      {
        id: 'mod-05-systems-dynamics',
        courseId: 'course-05-strategy-systems',
        headId: 'head-05-strategy-governance',
        order: 1,
        title: 'Module 1: The Architecture of Second-Order Thinking',
        description: 'Move beyond simplistic cause-and-effect to map feedback loops and delayed consequences.',
        chapters: [
          {
            id: 'chap-05-second-order-loops',
            moduleId: 'mod-05-systems-dynamics',
            headId: 'head-05-strategy-governance',
            order: 1,
            title: 'Chapter 1: The Cobra Effect & Incentive Alignment',
            estimatedMinutes: 20,
            learningObjectives: [
              'Define the Cobra Effect (perverse incentives) and identify examples in modern institutions.',
              'Construct a causal loop diagram showing reinforcing and balancing feedback.',
              'Apply the "Chesterton’s Fence" principle before modifying an established system.'
            ],
            pillarAlignment: {
              light: 'Equitable stewardship, transparent governance, and systemic flourishing.',
              shadow: 'Authoritarian manipulation, political gamesmanship, and Machiavellian control.',
              selfCorrection: 'Radical institutional transparency, open accountability, and shared ownership.'
            },
            sections: [
              {
                id: 'sec-05-1-cobra',
                title: 'Perverse Incentives & The Cobra Effect',
                content: `During British colonial rule in Delhi, the government became alarmed by the number of venomous cobras roaming the city. To eradicate them, the governor offered a cash bounty for every dead cobra delivered.

At first, the strategy seemed successful: citizens turned in large numbers of snakes. However, enterprising individuals realized they could breed cobras in their basements to claim the reward. 

When the administration discovered this and cancelled the bounty, the breeders released their now-valueless cobras into the streets. The final cobra population was significantly higher than before the intervention began.

**First-order thinking asks:** "How do we get rid of cobras? Pay people for dead ones."
**Second-order thinking asks:** "What behavior does paying for dead cobras incentivize across a multi-month timeline?"`,
                keyDefinition: {
                  term: 'Perverse Incentive',
                  definition: 'An incentive that inadvertently rewards behavior contrary to the original intention of its creators.'
                }
              },
              {
                id: 'sec-05-2-chesterton',
                title: 'Chesterton’s Fence',
                content: `Writer G.K. Chesterton proposed a classic thought experiment: 

Suppose you come across a wooden fence erected across a country road. A hasty reformer says: "I don't see the use of this fence; let us tear it down immediately."

A wiser reformer replies: "If you do not see the use of it, I certainly won't let you clear it away. Go away and think. When you can come back and tell me what purpose it was built to serve, I may allow you to remove it."

Before altering any code architecture, institutional rule, or daily routine, you must first understand the problem it originally solved.`,
                commonMistakes: [
                  'Assuming people will behave according to policy statements rather than actual economic incentives.',
                  'Refactoring legacy code without understanding why the edge-case checks were written.',
                  'Using coercion and punishment instead of aligning natural human motives.'
                ]
              }
            ],
            summary: [
              'First-order thinking solves symptoms; second-order thinking anticipates the new problems created by the solution.',
              'People respond to incentives, not exhortations.',
              'Respect Chesterton’s Fence before demolishing established structures.'
            ],
            quiz: [
              {
                id: 'q5-1',
                question: 'What is the core lesson of the Cobra Effect in system design?',
                options: [
                  'Bounties are always illegal.',
                  'Simple linear incentives often trigger counter-productive secondary behaviors.',
                  'Cobras cannot be caught without automation.',
                  'First-order thinking is sufficient for complex systems.'
                ],
                correctIndex: 1,
                explanation: 'Linear incentives frequently generate perverse incentives when humans optimize for the proxy metric rather than the intended outcome.',
                conceptHint: 'Review Section 1: Perverse Incentives & The Cobra Effect.'
              }
            ],
            practice: {
              id: 'prac-05',
              title: 'Incentive Stress-Test',
              prompt: 'Consider a proposed rule in a company or school: "Employees/students are evaluated purely on lines of code written or pages read." What perverse secondary behavior will this policy inevitably cause? How would you redesign the evaluation metric?',
              starterContent: 'Perverse Behavior:\nUnintended Second-Order Cost:\nRedesigned Metric:',
              rubric: [
                'Predicts the exact gaming behavior that will emerge.',
                'Explains the systemic degradation.',
                'Proposes a balanced, multi-dimensional evaluation mechanism.'
              ],
              suggestedSolution: 'Perverse behavior: Bloating files with empty comments or verbose syntax. Redesigned metric: Quality peer reviews, bug reduction, and user impact.'
            },
            realWorldApplication: {
              id: 'app-05',
              title: 'Resource Allocation Matrix',
              scenario: 'You have 10 hours of discretionary capacity each week across your team or personal life.',
              deliverablePrompt: 'Create a 2x2 resource allocation matrix dividing activities into high/low leverage and urgent/non-urgent. Reallocate at least 3 hours from low-leverage urgent to high-leverage non-urgent.',
              evaluationChecklist: [
                'Classifies activities based on compounding second-order value.',
                'Cuts busywork.',
                'Protects strategic planning time.'
              ]
            },
            reflectionPrompt: 'Where are you currently measuring a superficial proxy metric instead of the real outcome you desire?'
          }
        ]
      }
    ]
  },
  {
    id: 'course-10-automation-mastery',
    headId: 'head-10-automation-systems',
    title: 'Algorithmic Workflows & Human Agency',
    subtitle: 'Programming, Autonomous Pipelines & Intentional Tech',
    description: 'Harness the exponential leverage of code, APIs, and AI models while protecting human discernment and dignity.',
    level: 'Foundational',
    modules: [
      {
        id: 'mod-10-programmable-life',
        courseId: 'course-10-automation-mastery',
        headId: 'head-10-automation-systems',
        order: 1,
        title: 'Module 1: The Automation Hierarchy',
        description: 'Learn when to eliminate, when to simplify, and when to script.',
        chapters: [
          {
            id: 'chap-10-automation-levels',
            moduleId: 'mod-10-programmable-life',
            headId: 'head-10-automation-systems',
            order: 1,
            title: 'Chapter 1: The Iron Law of Automation — Simplify Before You Script',
            estimatedMinutes: 22,
            learningObjectives: [
              'Apply the 3-stage Automation Funnel: Eliminate -> Standardize -> Automate.',
              'Avoid the classic developer trap of spending 40 hours automating a 5-minute task.',
              'Implement Human-in-the-Loop safeguards to ensure algorithmic oversight.'
            ],
            pillarAlignment: {
              light: 'Liberation from repetitive drudgery, amplified creative leverage, and reproducible precision.',
              shadow: 'Fragile dependency, loss of core craft capability, and algorithmic alienation.',
              selfCorrection: 'Human oversight, robust error logging, simplicity, and intentional technology boundaries.'
            },
            sections: [
              {
                id: 'sec-10-1-iron-law',
                title: 'The Iron Law: Never Automate Waste',
                content: `The most common mistake in systems automation is automating a process that should never have existed in the first place.

Before writing a single line of script, creating a database trigger, or configuring an AI pipeline, apply this strict priority sequence:

1. **Eliminate:** Can this step be completely deleted without breaking downstream dependencies? (If yes, delete it immediately).
2. **Standardize:** If it cannot be deleted, can it be reduced to a predictable, documented format?
3. **Automate:** Only when the process is minimal and deterministic should you build an automated pipeline.

Automating an inefficient process merely produces errors at machine speed.`,
                keyDefinition: {
                  term: 'Human-in-the-Loop (HITL)',
                  definition: 'A system architecture where an algorithm performs heavy synthesis, aggregation, or drafting, but a human operator verifies and approves the final execution.'
                }
              },
              {
                id: 'sec-10-2-code-pipeline',
                title: 'Idempotency & Fail-Safe Architecture',
                content: `An automated script must be **idempotent**: running it once, twice, or ten times in succession must produce the exact same final state without corrupting data or creating duplicate records.

Always include:
- Graceful error catch boundaries.
- Clear human-readable logs.
- Safe rollback fallbacks when an external API or network request fails.`,
                codeSnippet: {
                  language: 'typescript',
                  code: `// Idempotent Task Processor with Human-in-the-Loop Safeguard
interface TaskRecord {
  id: string;
  payload: string;
  status: 'draft' | 'reviewed' | 'executed';
}

function processTaskWithOversight(task: TaskRecord, humanApproved: boolean): TaskRecord {
  if (task.status === 'executed') {
    return task; // Idempotent: do not re-run
  }
  
  if (!humanApproved) {
    return { ...task, status: 'draft' }; // Safety guard
  }

  // Execute verified automated transformation
  return { ...task, status: 'executed' };
}`,
                  explanation: 'Ensuring execution occurs only after validation and is safe against repeated invocations.'
                },
                commonMistakes: [
                  'Automating an irregular task that occurs only once every six months.',
                  'Building automated bots without human review checkpoints.',
                  'Relying on black-box tools whose failure modes you cannot debug.'
                ]
              }
            ],
            summary: [
              'Eliminate first, standardize second, automate last.',
              'Idempotence and error logging are non-negotiable for system stability.',
              'Keep the human in the loop for high-consequence judgment calls.'
            ],
            quiz: [
              {
                id: 'q10-1',
                question: 'What is the very first step of the Automation Funnel before writing scripts?',
                options: [
                  'Choose the latest programming language.',
                  'Eliminate the task entirely if it produces no real downstream value.',
                  'Set up a cloud database.',
                  'Hire an outside contractor.'
                ],
                correctIndex: 1,
                explanation: 'Elimination always precedes automation. Automating waste produces fast waste.',
                conceptHint: 'Review Section 1: The Iron Law.'
              }
            ],
            practice: {
              id: 'prac-10',
              title: 'Workflow Simplification Audit',
              prompt: 'Identify one workflow you repeat weekly (e.g. file naming, data entry, email filtering). Run it through the 3-step funnel: Can any part be eliminated? Can the format be standardized? What minimal rule or tool would automate the rest?',
              starterContent: '1. Repetitive Workflow:\n2. Steps to Eliminate:\n3. Standardized Format:\n4. Proposed Automation:',
              rubric: [
                'Clear weekly task identified.',
                'Demonstrates ruthless elimination of unnecessary steps.',
                'Proposes a maintainable, lightweight automation.'
              ],
              suggestedSolution: 'Workflow: Downloading invoice PDFs and renaming them. Standardization: Filter rule in email to auto-label and save to a synchronized local directory.'
            },
            realWorldApplication: {
              id: 'app-10',
              title: 'Autonomous Daily Digest Pipeline',
              scenario: 'Design a personal system that pulls your three most critical learning bookmarks and sends a 1-line prompt every morning.',
              deliverablePrompt: 'Specify the data source, the trigger mechanism, the failure fallback, and how you prevent notification fatigue.',
              evaluationChecklist: [
                'Requires zero ongoing manual intervention.',
                'Includes a fallback if network fails.',
                'Respects personal attention boundaries.'
              ]
            },
            reflectionPrompt: 'Has your technology made you more autonomous and sovereign, or has it tethered you to an endless stream of digital notifications?'
          }
        ]
      }
    ]
  }
];
