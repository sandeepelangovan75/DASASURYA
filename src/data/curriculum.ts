import { Course, HeadPillar } from '../types';

// =============================================================
// THE TEN CANONICAL INTELLIGENCE HEADS OF DASASURYA
// Grounded in Section 3 of Master Specification
// =============================================================

export const HEAD_PILLARS: HeadPillar[] = [
  {
    id: 'head-01-knowledge',
    number: 1,
    romanNumeral: 'I',
    name: 'Knowledge',
    tagline: 'Science, Mathematics, Computing & First Principles',
    focusAreas: ['Science', 'Mathematics', 'Computing', 'Engineering', 'Artificial Intelligence', 'Research Methodology', 'First Principles', 'Information Literacy'],
    light: 'Empirical discovery, conceptual rigor, rational inquiry, and clarity of thought.',
    shadow: 'Overthinking, information overload, false certainty, and intellectual reductionism.',
    selfCorrection: 'Empirical verification, falsification testing, uncertainty awareness, and epistemological humility.',
    accentColor: '#38BDF8', // Electric Sky
    accentBorder: 'rgba(56, 189, 248, 0.3)',
    iconName: 'Atom',
    description: 'Deconstruct complex systems to their foundational axioms. Distinguish signal from noise and build bulletproof logical deductions.'
  },
  {
    id: 'head-02-language',
    number: 2,
    romanNumeral: 'II',
    name: 'Language',
    tagline: 'Multilingual Mastery, Grammar, Translation & Comprehension',
    focusAreas: ['Multilingual Learning', 'Grammar Systems', 'Vocabulary Acquisition', 'Translation', 'Reading Comprehension', 'Semantic Precision', 'Linguistic Roots', 'Written Composition'],
    light: 'Effortless intercultural dialogue, expressive richness, precision of meaning, and linguistic empathy.',
    shadow: 'Pedantic semantics, linguistic elitism, dogmatic prescriptivism, and superficial polyglotism.',
    selfCorrection: 'Active conversation, immersion in authentic texts, charitable interpretation, and communicative utility.',
    accentColor: '#F59E0B', // Warm Amber
    accentBorder: 'rgba(245, 158, 11, 0.3)',
    iconName: 'Globe',
    description: 'Master the architecture of human language. Internalize grammar, expand cross-lingual vocabulary, and bridge civilizations through fluent translation.'
  },
  {
    id: 'head-03-music',
    number: 3,
    romanNumeral: 'III',
    name: 'Music',
    tagline: 'Music Theory, Rhythm, Sound Design & Creative Acoustics',
    focusAreas: ['Music Theory', 'Rhythm & Meter', 'Harmonic Progression', 'Active Listening', 'Acoustic Physics', 'Composition Concepts', 'Sound Synthesis', 'Creative Exploration'],
    light: 'Harmonic resonance, rhythmic fluency, emotional elevation through sound, and transcendent listening.',
    shadow: 'Audio sensory overload, creative self-doubt, elitist musical gatekeeping, and acoustic distraction.',
    selfCorrection: 'Daily ear training, playful micro-composition, structured practice, and deep silence resets.',
    accentColor: '#A855F7', // Royal Purple
    accentBorder: 'rgba(168, 85, 247, 0.3)',
    iconName: 'Music',
    description: 'Explore the mathematical and aesthetic universe of sound. Learn interval harmonics, rhythmic patterns, acoustic physics, and expressive composition.'
  },
  {
    id: 'head-04-wellness',
    number: 4,
    romanNumeral: 'IV',
    name: 'Wellness',
    tagline: 'Circadian Pacing, Sleep Architecture, Breathwork & Mindfulness',
    focusAreas: ['Healthy Routines', 'Sleep Architecture', 'Stress Management', 'Mindful Breathwork', 'Habit Development', 'Physical Movement', 'Personal Wellbeing Education', 'Non-Clinical Balance'],
    light: 'Bodily resilience, emotional equanimity, restorative sleep, and sustainable cognitive stamina.',
    shadow: 'Orthorexia, rigid wellness anxiety, health hypochondria, and substituting wellness for medical care.',
    selfCorrection: 'Gentle consistency, biological rhythm listening, evidence-based habits, and consulting licensed clinicians.',
    accentColor: '#10B981', // Emerald
    accentBorder: 'rgba(16, 185, 129, 0.3)',
    iconName: 'Heart',
    description: 'Nourish the biological instrument that supports high-order intelligence. Cultivate restorative sleep, rhythmic breath awareness, and calm mindfulness.'
  },
  {
    id: 'head-05-strategy',
    number: 5,
    romanNumeral: 'V',
    name: 'Strategy',
    tagline: 'Critical Thinking, Game Theory, Planning & Scenario Analysis',
    focusAreas: ['Critical Thinking', 'Logical Reasoning', 'Scenario Planning', 'Decision-Making Frameworks', 'Cognitive Bias Inoculation', 'Game Theory', 'Probabilistic Forecasting', 'Second-Order Effects'],
    light: 'Foresight, principled leadership, unassailable logic, and sustainable resource allocation.',
    shadow: 'Paralysis by analysis, cynical opportunism, manipulative machinations, and zero-sum conquest.',
    selfCorrection: 'Long-term stewardship, transparent reasoning, mutual benefit, and testing assumptions against reality.',
    accentColor: '#818CF8', // Indigo
    accentBorder: 'rgba(129, 140, 248, 0.3)',
    iconName: 'Compass',
    description: 'Anticipate second and third-order consequences. Map dependencies, neutralize cognitive biases, and make high-stakes decisions with probabilistic clarity.'
  },
  {
    id: 'head-06-vision',
    number: 6,
    romanNumeral: 'VI',
    name: 'Vision',
    tagline: 'Creativity, Long-Term Innovation & Future Architecture',
    focusAreas: ['Creative Synthesis', 'Imagination', 'Future Planning', 'System Innovation', 'Life Architecture', 'Goal-Setting', 'Technological Trends', 'Generative Design'],
    light: 'Audacious creativity, inspirational horizons, regenerative futures, and transformative life architecture.',
    shadow: 'Utopian daydreaming, ungrounded ambition, reality distortion, and chronic non-execution.',
    selfCorrection: 'Anchoring visions in tangible milestones, iterative prototyping, and daily disciplined execution.',
    accentColor: '#EC4899', // Rose Quartz
    accentBorder: 'rgba(236, 72, 153, 0.3)',
    iconName: 'Sparkles',
    description: 'Channel creative imagination into enduring realities. Craft 5-year and 10-year life architectures that align daily actions with visionary goals.'
  },
  {
    id: 'head-07-voice',
    number: 7,
    romanNumeral: 'VII',
    name: 'Voice',
    tagline: 'Public Speaking, Articulate Rhetoric, Presentation & Speech Skills',
    focusAreas: ['Public Speaking', 'Conversation Practice', 'Pronunciation & Diction', 'Presentation Architecture', 'Speech Recognition', 'Executive Presence', 'Storytelling', 'Communication Confidence'],
    light: 'Magnetic articulation, empathic listening, inspiring discourse, and bridging human misunderstandings.',
    shadow: 'Demagoguery, weaponized rhetoric, conversational narcissism, and empty performative eloquence.',
    selfCorrection: 'Uncompromising adherence to truth, active empathic listening, and concise economy of language.',
    accentColor: '#06B6D4', // Cyan
    accentBorder: 'rgba(6, 182, 212, 0.3)',
    iconName: 'Mic',
    description: 'Master the vocal instrument and the art of spoken persuasion. Deliver complex ideas with clarity, command respect, and inspire cooperative action.'
  },
  {
    id: 'head-08-astronomy',
    number: 8,
    romanNumeral: 'VIII',
    name: 'Astronomy',
    tagline: 'Cosmology, Celestial Mechanics, Planetary Systems & Space Science',
    focusAreas: ['Space Science', 'Celestial Mechanics', 'Planetary Systems', 'Cosmology', 'Observational Astronomy', 'Astrophysics Foundations', 'Stellar Evolution', 'Scientific Exploration'],
    light: 'Cosmic awe, reverence for the physical universe, mathematical perspective, and ecological humility.',
    shadow: 'Existential nihilism, detached abstraction, and escapism from planetary responsibilities.',
    selfCorrection: 'Empirical observation, peer-reviewed astrophysics consensus, and caring for our fragile home planet.',
    accentColor: '#6366F1', // Cosmic Indigo
    accentBorder: 'rgba(99, 102, 241, 0.3)',
    iconName: 'Telescope',
    description: 'Gaze into the cosmic arena. Understand orbital dynamics, stellar lifecycles, planetary formation, and humanity place in the expanding cosmos.'
  },
  {
    id: 'head-09-traditional-knowledge',
    number: 9,
    romanNumeral: 'IX',
    name: 'Traditional Knowledge',
    tagline: 'History, Cultural Heritage, Philosophy & Empirical Comparison',
    focusAreas: ['Historical Heritage', 'Philosophical Systems', 'Traditional Craft', 'Indigenous Ecological Knowledge', 'Comparative Philosophy', 'Critical Historical Analysis', 'Cultural Memory', 'Evidence Demarcation'],
    light: 'Deep historical roots, wisdom across millennia, cultural appreciation, and nuanced philosophical grounding.',
    shadow: 'Blind traditionalism, uncritical superstition, historical revisionism, and rejecting modern science.',
    selfCorrection: 'Rigorous empirical comparison, distinguishing verifiable history from myth, and respectful intellectual discernment.',
    accentColor: '#D97706', // Ancient Amber
    accentBorder: 'rgba(217, 119, 6, 0.3)',
    iconName: 'BookMarked',
    description: 'Explore the ancestral reservoir of human thought. Examine ancient philosophy, traditional ecological wisdom, and critically compare with modern discoveries.'
  },
  {
    id: 'head-10-governance',
    number: 10,
    romanNumeral: 'X',
    name: 'Governance',
    tagline: 'Civic Systems, Ethical Leadership, Institutional Design & Integrity',
    focusAreas: ['Civic Education', 'Ethical Leadership', 'Systems Governance', 'Responsible Management', 'Public Policy Concepts', 'Institutional Accountability', 'Conflict Resolution', 'Democratic Principles'],
    light: 'Transparent administration, institutional integrity, equitable stewardship, and flourishing common good.',
    shadow: 'Bureaucratic ossification, authoritarian corruption, regulatory capture, and self-serving political intrigue.',
    selfCorrection: 'Radical transparency, democratic checks and balances, independent audit trails, and servant leadership.',
    accentColor: '#14B8A6', // Teal
    accentBorder: 'rgba(20, 184, 166, 0.3)',
    iconName: 'Shield',
    description: 'Design and steward systems that endure. Learn civic responsibility, institutional governance, ethical leadership, and conflict resolution.'
  }
];

// Helper to look up head pillar, including backward-compatible aliases
export function getHeadById(headId: string): HeadPillar {
  const normalized = headId.toLowerCase();
  
  if (normalized.includes('knowledge') || normalized.includes('01')) return HEAD_PILLARS[0];
  if (normalized.includes('language') || normalized.includes('02')) return HEAD_PILLARS[1];
  if (normalized.includes('music') || normalized.includes('03')) return HEAD_PILLARS[2];
  if (normalized.includes('wellness') || normalized.includes('vitality') || normalized.includes('04')) return HEAD_PILLARS[3];
  if (normalized.includes('strategy') || normalized.includes('critical') || normalized.includes('05')) return HEAD_PILLARS[4];
  if (normalized.includes('vision') || normalized.includes('06')) return HEAD_PILLARS[5];
  if (normalized.includes('voice') || normalized.includes('communication') || normalized.includes('07')) return HEAD_PILLARS[6];
  if (normalized.includes('astronomy') || normalized.includes('universal') || normalized.includes('08')) return HEAD_PILLARS[7];
  if (normalized.includes('traditional') || normalized.includes('09')) return HEAD_PILLARS[8];
  if (normalized.includes('governance') || normalized.includes('automation') || normalized.includes('10')) return HEAD_PILLARS[9];

  return HEAD_PILLARS[0];
}

// =============================================================
// COMPREHENSIVE 10-HEAD DIGITAL LIBRARY COURSES
// Adheres strictly to the 10-stage learning sequence:
// 1. Introduction & learning objectives
// 2. Readable lesson content
// 3. Explanations with examples
// 4. Key concepts & glossary
// 5. Questions to test understanding
// 6. Practice exercises
// 7. Real-world application
// 8. Reflection & feedback
// 9. Short mastery assessment
// 10. Recommendations for next lesson.
// =============================================================

export const COURSES: Course[] = [
  // Course 1: Head 1 — Knowledge
  {
    id: 'course-01-first-principles',
    headId: 'head-01-knowledge',
    title: 'Foundations of Rational Inquiry & First Principles',
    subtitle: 'From Axiomatic Deconstruction to Infallible Mental Models',
    description: 'A masterclass in stripping complex ideas down to fundamental truths and building sound conclusions from the ground up.',
    level: 'Foundational',
    modules: [
      {
        id: 'mod-01-first-principles',
        courseId: 'course-01-first-principles',
        headId: 'head-01-knowledge',
        order: 1,
        title: 'Module 1: The Anatomy of First Principles',
        description: 'Explore how pioneering scientists and engineers deconstruct inherited assumptions.',
        chapters: [
          {
            id: 'chap-01-first-principles',
            moduleId: 'mod-01-first-principles',
            headId: 'head-01-knowledge',
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
                content: `Most human reasoning proceeds through imitation. When asked why a software architecture requires three intermediary layers, or why an industrial manufacturing line costs $500 per unit, the conventional answer is almost invariably: "Because that is the prevailing standard." 

This is reasoning by analogy: copying what others have done with minor, incremental tweaks. While socially comfortable and cognitively inexpensive, analogy is fatal when navigating structural inflection points.

First principles thinking, by contrast, is the practice of boiling things down to the most fundamental truths you can verify, and asking: "What are we sure is true?" From there, you reason upward.`,
                keyDefinition: {
                  term: 'First Principle (Axiom)',
                  definition: 'A foundational, self-evident proposition that cannot be deduced from any other premise within the logical system.'
                },
                analogy: 'Think of inherited knowledge as an ornate mansion built upon shifting sand. Reasoning by analogy renovates the wallpaper. First principles thinking inspects the bedrock and pours a reinforced foundation.'
              },
              {
                id: 'sec-02-reduction-protocol',
                title: 'The 4-Step Analytical Reduction Protocol',
                content: `To systematically deconstruct any complex problem, follow this 4-stage protocol:

1. **Statement Clarification:** Write down the exact assertion without vague colloquialisms.
2. **Assumption Strip-Mining:** Identify every implicit assumption hidden in the statement. Which depend on physical laws, and which on historical conventions?
3. **Axiomatic Grounding:** Isolate the irreducible physical or mathematical constraints.
4. **Bottom-Up Synthesis:** Reconstruct the solution using only verified axioms, unburdened by legacy architectural choices.`,
                diagramType: 'flow',
                diagramData: {
                  steps: ['Problem Statement', 'Strip-Mine Assumptions', 'Isolate Invariant Axioms', 'Bottom-Up Synthesis']
                },
                commonMistakes: [
                  'Mistaking an established industry convention for an unchangeable law of physics.',
                  'Discarding valuable historical intuition out of arrogance before verifying edge cases.',
                  'Refusing to reconstruct a viable solution after dismantling an imperfect model.'
                ]
              }
            ],
            summary: [
              'Reasoning by analogy creates linear iterations; first principles thinking produces structural breakthroughs.',
              'Deconstruction requires stripping away historical habits to uncover immutable invariants.',
              'Always balance intellectual skepticism with real-world empirical validation.'
            ],
            quiz: [
              {
                id: 'q1-1',
                question: 'What is the primary difference between reasoning by analogy and reasoning by first principles?',
                options: [
                  'Analogy uses numbers; first principles uses words.',
                  'Analogy copies existing patterns with minor tweaks; first principles deconstructs to foundational truths.',
                  'First principles requires advanced degrees, while analogy is purely intuitive.',
                  'Analogy is always incorrect, while first principles is never wrong.'
                ],
                correctIndex: 1,
                explanation: 'Analogy relies on existing benchmarks. First principles interrogates foundational axioms directly.',
                conceptHint: 'Review Section 1: The Burden of Analogy.'
              }
            ],
            practice: {
              id: 'prac-01',
              title: 'Axiomatic Problem Deconstruction',
              prompt: 'Select one bottleneck or persistent challenge in your work or study. Write down the problem as currently framed. List 3 implicit assumptions you have accepted without proof. Then identify which one is merely a convention rather than an immutable law.',
              starterContent: '1. Problem Statement:\n2. Accepted Assumptions:\n  a)\n  b)\n  c)\n3. The Convention Masquerading as a Law:',
              rubric: [
                'Problem statement is concrete and measurable.',
                'At least three distinct implicit assumptions are surfaced.',
                'A clear distinction is drawn between physical limits and historical conventions.'
              ],
              suggestedSolution: 'Problem: "I do not have time to read books." Assumption: A book must be read linearly from page 1 to 300. Convention: You can extract the core thesis in 30 minutes by reviewing TOC, conclusions, and key chapters.'
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

  // Course 2: Head 2 — Language
  {
    id: 'course-02-universal-language',
    headId: 'head-02-language',
    title: 'Universal Multilingual Learning & Linguistic Architecture',
    subtitle: 'From Phonetic Foundations to Semantic Translation Mastery',
    description: 'Learn the architectural principles of human language, rapid vocabulary acquisition, sentence syntax, and cross-cultural communication.',
    level: 'Foundational',
    modules: [
      {
        id: 'mod-02-language-acquisition',
        courseId: 'course-02-universal-language',
        headId: 'head-02-language',
        order: 1,
        title: 'Module 1: The Polyglot Matrix',
        description: 'How the human mind decodes and acquires foreign syntax with compounding velocity.',
        chapters: [
          {
            id: 'chap-02-linguistic-roots',
            moduleId: 'mod-02-language-acquisition',
            headId: 'head-02-language',
            order: 1,
            title: 'Chapter 1: The Root-Morpheme Engine — Deconstructing Vocabulary',
            estimatedMinutes: 20,
            learningObjectives: [
              'Understand how root morphemes unlock hundreds of words across language families.',
              'Apply spaced-retrieval cognitive anchors to foreign vocabulary.',
              'Maintain cultural respect while translating nuanced idioms.'
            ],
            pillarAlignment: {
              light: 'Effortless cross-cultural bridge building and expressive precision.',
              shadow: 'Superficial memorization without contextual understanding.',
              selfCorrection: 'Immerse in authentic literature and active dialogue with native speakers.'
            },
            sections: [
              {
                id: 'sec-02-roots',
                title: 'The Morpheme Multiplier',
                content: `Language is not a collection of random syllables; it is a generative, recursive tree. When you memorize isolated words, you learn linearly ($1+1+1$). When you learn foundational morphological roots (such as Indo-European, Semitic, or Sino-Tibetan roots), you learn exponentially ($N \\times M$).

For instance, the Latin root *vertere* (to turn) generates *convert, divert, invert, revert, advertise, versatile, aversion, universe*. Master the root, and you automatically recognize the semantic trajectory of thirty related terms.`,
                keyDefinition: {
                  term: 'Morpheme',
                  definition: 'The smallest meaningful morphological unit in a language that cannot be further divided.'
                }
              }
            ],
            summary: [
              'Root-based study compounds vocabulary at 10x the velocity of rote memorization.',
              'Grammar is the generative skeleton; vocabulary is the muscle.',
              'Contextual usage always trumps dictionary literalism.'
            ],
            quiz: [
              {
                id: 'q2-1',
                question: 'Why does morpheme-based study outperform isolated word flashcards?',
                options: [
                  'Flashcards use too much paper.',
                  'Morphemes form generative semantic clusters that unlock dozens of words simultaneously.',
                  'Morphemes require no grammar rules.',
                  'Only ancient languages have morphemes.'
                ],
                correctIndex: 1,
                explanation: 'A single root unlocks dozens of derivative words across related linguistic families.',
                conceptHint: 'Review Section 1: The Morpheme Multiplier.'
              }
            ],
            practice: {
              id: 'prac-02',
              title: 'Root Cluster Mapping',
              prompt: 'Select one root in your target learning language (e.g. "scrib/script" in Latin or "vid/ved" in Sanskrit/Indo-European). List 5 modern derivatives and explain how each incorporates the root meaning.',
              starterContent: '1. Root:\n2. Five Derivatives:\n  a)\n  b)\n  c)\n  d)\n  e)\n3. Shared Semantic Invariant:',
              rubric: ['Accurate root identified', 'Five legitimate derivatives mapped', 'Shared semantic meaning explained'],
              suggestedSolution: 'Root: Scrib/Script (to write). Derivatives: Inscribe, Transcript, Prescribe, Postscript, Description. Invariant: Marking or recording structured symbols.'
            },
            realWorldApplication: {
              id: 'app-02',
              title: 'Multilingual Context Brief',
              scenario: 'You are presenting a technical proposal to a team operating in a secondary language.',
              deliverablePrompt: 'Create a bilingual glossary of 5 critical technical terms with concise contextual definitions and non-colloquial explanations.',
              evaluationChecklist: ['Avoids culturally ambiguous idioms.', 'Preserves technical precision.', 'Easy to verify.']
            },
            reflectionPrompt: 'How has learning another language expanded the boundary of what you are capable of thinking?'
          }
        ]
      }
    ]
  },

  // Course 3: Head 3 — Music
  {
    id: 'course-03-music-theory',
    headId: 'head-03-music',
    title: 'Acoustic Architecture & Music Theory',
    subtitle: 'From Harmonic Ratios to Creative Composition',
    description: 'Explore the mathematical foundation of intervals, rhythmic subdivisions, timbre, and emotive acoustic design.',
    level: 'Foundational',
    modules: [
      {
        id: 'mod-03-harmonics',
        courseId: 'course-03-music-theory',
        headId: 'head-03-music',
        order: 1,
        title: 'Module 1: The Physics of Harmony',
        description: 'How string vibration ratios and frequency harmonics create musical intervals.',
        chapters: [
          {
            id: 'chap-03-harmonic-series',
            moduleId: 'mod-03-harmonics',
            headId: 'head-03-music',
            order: 1,
            title: 'Chapter 1: The Harmonic Series — The Mathematical Bedrock of Tone',
            estimatedMinutes: 16,
            learningObjectives: [
              'Understand the integer frequency ratios underlying the octave, fifth, and fourth.',
              'Distinguish between just intonation and equal temperament.',
              'Hear the overtone series in everyday acoustic instruments.'
            ],
            pillarAlignment: {
              light: 'Harmonic listening and emotional transcendence through sound.',
              shadow: 'Obsessing over theoretical purity while losing expressive feeling.',
              selfCorrection: 'Play and listen with childlike wonder; prioritize acoustic resonance.'
            },
            sections: [
              {
                id: 'sec-03-series',
                title: 'The Integer Symphony',
                content: `When a string vibrates, it vibrates not only as a whole, but in halves ($2:1$), thirds ($3:2$), fourths ($4:3$), and fifths ($5:4$). These integer fractions create the overtone series: the natural acoustic law that governs every musical instrument from an ancient sitar to an orchestral cello.

Harmony is mathematics made audible to the human soul.`,
                keyDefinition: {
                  term: 'Fundamental Frequency ($f_0$)',
                  definition: 'The lowest frequency of a periodic waveform, perceived as the primary musical pitch.'
                }
              }
            ],
            summary: [
              'All acoustic timbres are composed of sine-wave harmonics.',
              'Intervals are simple mathematical ratios ($2:1$ Octave, $3:2$ Fifth).',
              'Active listening transforms passive hearing into conscious acoustic appreciation.'
            ],
            quiz: [
              {
                id: 'q3-1',
                question: 'What is the frequency ratio of an exact musical octave?',
                options: ['1:1', '2:1', '3:2', '4:3'],
                correctIndex: 1,
                explanation: 'An octave doubles the frequency ($2:1$).',
                conceptHint: 'Review Section 1: The Integer Symphony.'
              }
            ],
            practice: {
              id: 'prac-03',
              title: 'Active Listening Frequency Audit',
              prompt: 'Listen to any piece of acoustic music for 3 minutes with eyes closed. Identify the fundamental bass instrument, the melodic lead, and note where rhythmic syncopation creates tension.',
              starterContent: '1. Piece Selected:\n2. Bass Foundation:\n3. Melodic Register:\n4. Rhythmic Tension Moments:',
              rubric: ['Piece chosen', 'Acoustic layers separated', 'Tension points noted'],
              suggestedSolution: 'Cello provides $2:1$ foundational weight; violin carries melodic tension; piano syncopation resolves on beat 3.'
            },
            realWorldApplication: {
              id: 'app-03',
              title: 'Acoustic Soundscape Design',
              scenario: 'Design a 15-minute ambient focus soundscape for deep learning sessions.',
              deliverablePrompt: 'Specify the frequency range, rhythmic tempo (BPM), and harmonic elements that promote cognitive endurance without distraction.',
              evaluationChecklist: ['Low frequency stability', 'Tempo between 55-65 BPM', 'Zero vocal interference']
            },
            reflectionPrompt: 'What role does intentional acoustic silence play in your daily cognitive clarity?'
          }
        ]
      }
    ]
  },

  // Course 4: Head 4 — Wellness
  {
    id: 'course-04-circadian-vitality',
    headId: 'head-04-wellness',
    title: 'Circadian Pacing & Restorative Biology',
    subtitle: 'Building a Decades-Long Cognitive Instrument',
    description: 'Learn evidence-based sleep architecture, gentle breathwork dynamics, stress inoculation, and mindful daily pacing.',
    level: 'Foundational',
    modules: [
      {
        id: 'mod-04-circadian-rhythm',
        courseId: 'course-04-circadian-vitality',
        headId: 'head-04-wellness',
        order: 1,
        title: 'Module 1: Circadian Pacing',
        description: 'How light, movement, and temperature anchor cognitive stamina.',
        chapters: [
          {
            id: 'chap-04-sleep-architecture',
            moduleId: 'mod-04-circadian-rhythm',
            headId: 'head-04-wellness',
            order: 1,
            title: 'Chapter 1: The 90-Minute Rhythm — Ultradian Cycles & Brain Recovery',
            estimatedMinutes: 19,
            learningObjectives: [
              'Understand the 90-minute ultradian focus and recovery cycle.',
              'Implement morning photon viewing to anchor cortisol and melatonin rhythms.',
              'Epistemological safeguard: distinguish lifestyle habits from clinical medicine.'
            ],
            pillarAlignment: {
              light: 'Boundless daily energy, deep sleep recovery, and calm focus.',
              shadow: 'Orthorexic obsession with sleep scores and fitness tracking anxiety.',
              selfCorrection: 'Practice non-judgmental awareness; prioritize consistency over perfection.'
            },
            sections: [
              {
                id: 'sec-04-circadian',
                title: 'The Master Pacemaker: The Suprachiasmatic Nucleus',
                content: `Your brain contains a master clock comprised of roughly 20,000 neurons in the hypothalamus: the suprachiasmatic nucleus (SCN). The SCN does not read a wrist watch; it reads photons entering your retinal ganglion cells.

Viewing natural outdoor light within 30 minutes of waking triggers a healthy cortisol pulse that boosts daytime alertness and starts a 14-hour timer for evening melatonin secretion.`,
                keyDefinition: {
                  term: 'Zeitgeber',
                  definition: 'An environmental cue, such as natural light, temperature, or physical movement, that synchronizes an organism biological rhythm.'
                }
              }
            ],
            summary: [
              'Morning light is the single most powerful circadian synchronizer.',
              'Cognitive work naturally occurs in 90-minute ultradian waves.',
              'Mindfulness and breathwork downregulate sympathetic nervous arousal.'
            ],
            quiz: [
              {
                id: 'q4-1',
                question: 'What is the primary biological Zeitgeber for the human master circadian clock?',
                options: ['Cold coffee', 'Natural ambient photons entering the eyes', 'Screen blue light at midnight', 'High carbohydrate meals'],
                correctIndex: 1,
                explanation: 'Retinal ganglion cells transmit light signals directly to the SCN.',
                conceptHint: 'Review Section 1: The Master Pacemaker.'
              }
            ],
            practice: {
              id: 'prac-04',
              title: 'Circadian Light & Breath Protocol',
              prompt: 'For 3 consecutive mornings, spend 10 minutes outdoors before viewing screens, followed by 3 minutes of gentle 4-7-8 breathing. Record your perceived afternoon focus score (1 to 10).',
              starterContent: 'Day 1: Light time: ___, Breath: ___, Afternoon Focus: ___/10\nDay 2: Light time: ___, Breath: ___, Afternoon Focus: ___/10\nDay 3: Light time: ___, Breath: ___, Afternoon Focus: ___/10',
              rubric: ['All 3 days recorded', 'Morning outdoor light confirmed', 'Focus score noted'],
              suggestedSolution: 'Learner observed reduced 3 PM slump and calmer mental transition into evening study.'
            },
            realWorldApplication: {
              id: 'app-04',
              title: 'Personal Cognitive Stamina Architecture',
              scenario: 'You have an intensive 6-week project requiring high intellectual output.',
              deliverablePrompt: 'Design a sustainable daily routine incorporating two 90-minute deep work blocks, 15-minute visual resets, and strict bedtime electronic hygiene.',
              evaluationChecklist: ['Includes restorative visual resets.', 'Protects 8-hour sleep opportunity.', 'Zero crash stimulants.']
            },
            reflectionPrompt: 'Are you treating your body as an inconvenient obstacle to work, or as the very foundation of your intelligence?'
          }
        ]
      }
    ]
  },

  // Course 5: Head 5 — Strategy
  {
    id: 'course-05-strategic-thought',
    headId: 'head-05-strategy',
    title: 'Systems Strategy & Game Theory',
    subtitle: 'From Cognitive Defense to Asymmetric Advantage',
    description: 'Master probabilistic reasoning, decision trees, second-order consequences, and anti-fragile positioning.',
    level: 'Foundational',
    modules: [
      {
        id: 'mod-05-decision-science',
        courseId: 'course-05-strategic-thought',
        headId: 'head-05-strategy',
        order: 1,
        title: 'Module 1: The Art of Decision Framing',
        description: 'How to separate decisions from outcomes and evaluate risk asymmetry.',
        chapters: [
          {
            id: 'chap-05-second-order',
            moduleId: 'mod-05-decision-science',
            headId: 'head-05-strategy',
            order: 1,
            title: 'Chapter 1: Second-Order Thinking — Seeing Beyond the Immediate Horizon',
            estimatedMinutes: 21,
            learningObjectives: [
              'Distinguish first-order immediate gratification from second-order systemic effects.',
              'Map feedback loops in complex decision environments.',
              'Apply Chesterton Fence principle before proposing reforms.'
            ],
            pillarAlignment: {
              light: 'Prudent foresight and durable long-term systemic flourishing.',
              shadow: 'Paralysis by analysis and cynical manipulation of human systems.',
              selfCorrection: 'Enforce ethical transparency and align with mutual win-win incentives.'
            },
            sections: [
              {
                id: 'sec-05-chesterton',
                title: 'The Chesterton Fence Principle',
                content: `Suppose you come across a fence erected across a country road. A hasty first-order thinker says: "I see no use for this fence; let us tear it down."

The second-order strategist responds: "If you cannot explain why it was put there, I cannot let you tear it down. Go find out why it was built, and if the reason no longer exists, we will dismantle it together."

Most systemic failures occur when well-meaning people remove constraints without understanding the secondary problems those constraints were preventing.`,
                keyDefinition: {
                  term: 'Chesterton Fence',
                  definition: 'The principle that reforms should not be made until the reasoning behind the existing state of affairs is thoroughly understood.'
                }
              }
            ],
            summary: [
              'First-order thinking asks: What happens next? Second-order asks: And then what?',
              'Complex systems exhibit delayed, non-linear feedback loops.',
              'Never dismantle a constraint until you understand why it exists.'
            ],
            quiz: [
              {
                id: 'q5-1',
                question: 'What is the core directive of Chesterton Fence?',
                options: [
                  'Fences must always be painted white.',
                  'Never remove a system rule until you understand what problem it was built to solve.',
                  'Always replace rules with automated scripts.',
                  'First-order results are all that matter.'
                ],
                correctIndex: 1,
                explanation: 'Reforms must be preceded by understanding the original problem.',
                conceptHint: 'Review Section 1: The Chesterton Fence Principle.'
              }
            ],
            practice: {
              id: 'prac-05',
              title: 'Second-Order Consequence Map',
              prompt: 'Take a proposed change (e.g. eliminating all email in a company, or quitting caffeine cold-turkey). Map out: 1st order effect (immediate), 2nd order effect (1 week later), and 3rd order effect (3 months later).',
              starterContent: 'Proposed Change:\n1st Order Effect:\n2nd Order Effect:\n3rd Order Effect:\nNet Strategic Evaluation:',
              rubric: ['Concrete change', 'Three distinct orders of impact', 'Uncovers non-obvious secondary feedback'],
              suggestedSolution: 'Change: Eliminating all internal meetings. 1st Order: Immediate calendar relief. 2nd Order: Communication moves to asynchronous chat. 3rd Order: Message volume causes anxiety and fragmented attention without structured sync.'
            },
            realWorldApplication: {
              id: 'app-05',
              title: 'Strategic Scenario Blueprint',
              scenario: 'Your project faces three competing strategic pathways with differing capital requirements.',
              deliverablePrompt: 'Create a decision tree matrix comparing maximum downside, upside potential, and reversibility for each option.',
              evaluationChecklist: ['Assesses reversibility (two-way vs one-way doors).', 'Evaluates black-swan downside.', 'Defines clear decision criteria.']
            },
            reflectionPrompt: 'Which decision in your past had unintended second-order consequences that taught you the most?'
          }
        ]
      }
    ]
  },

  // Courses 6-10: Vision, Voice, Astronomy, Traditional Knowledge, Governance
  {
    id: 'course-06-visionary-architecture',
    headId: 'head-06-vision',
    title: 'Visionary Architecture & Long-Term Innovation',
    subtitle: 'From Imaginative Synthesis to Concrete Future Planning',
    description: 'Learn how to construct compelling 5-year horizons, design innovative prototypes, and align daily habits with lifelong ambition.',
    level: 'Foundational',
    modules: [
      {
        id: 'mod-06-future-design',
        courseId: 'course-06-visionary-architecture',
        headId: 'head-06-vision',
        order: 1,
        title: 'Module 1: The Architecture of Vision',
        description: 'Translating creative imagination into verifiable execution roadmaps.',
        chapters: [
          {
            id: 'chap-06-visionary-foundations',
            moduleId: 'mod-06-future-design',
            headId: 'head-06-vision',
            order: 1,
            title: 'Chapter 1: The 10-Year Horizon — Backward-Engineered Milestones',
            estimatedMinutes: 17,
            learningObjectives: [
              'Anchor long-term vision in concrete reverse-engineered stages.',
              'Distinguish fantasy from disciplined creative ambition.',
              'Overcome creative paralysis through small daily iterations.'
            ],
            pillarAlignment: {
              light: 'Inspirational horizons that elevate human achievement.',
              shadow: 'Unanchored daydreaming and chronic non-execution.',
              selfCorrection: 'Daily check-ins, tangible artifacts, and milestone accountability.'
            },
            sections: [
              {
                id: 'sec-06-reverse-engineering',
                title: 'Backward Engineering Destiny',
                content: `Most people plan forward: "What should I do tomorrow?" A visionary thinker plans backward: "Where will my life stand 10 years from today? To be there in 10 years, where must I stand in 5 years? In 2 years? In 6 months? And what single action must I take before noon today?"`,
                keyDefinition: {
                  term: 'Backcasting',
                  definition: 'A planning method that starts with defining a desirable future and then works backwards to identify policies and programs that connect that future to the present.'
                }
              }
            ],
            summary: ['Backcasting connects ambitious futures to today execution.', 'Vision without daily iteration is mere fantasy.'],
            quiz: [
              {
                id: 'q6-1',
                question: 'What is backcasting?',
                options: ['Looking only at past mistakes.', 'Starting with a defined future vision and planning backward to the present.', 'Predicting the weather with historical data.', 'Writing science fiction novels.'],
                correctIndex: 1,
                explanation: 'Backcasting starts with the target future and deduces required steps backward.',
                conceptHint: 'Review Section 1: Backward Engineering Destiny.'
              }
            ],
            practice: {
              id: 'prac-06',
              title: '5-Year Backward Plan',
              prompt: 'Define your primary mastery goal for 5 years from today. Backcast to Year 3, Year 1, Month 3, and Tomorrow morning.',
              starterContent: '5-Year Goal:\n3-Year Milestone:\n1-Year Milestone:\nMonth 3 Milestone:\nTomorrow 8 AM Action:',
              rubric: ['Measurable 5-year goal', 'Coherent backward sequence', 'Immediate next action defined'],
              suggestedSolution: '5-Year: Lead an autonomous software research institute. 1-Year: Publish 3 verified open-source models. Tomorrow: Write chapter 1 code.'
            },
            realWorldApplication: {
              id: 'app-06',
              title: 'Quarterly Vision Matrix',
              scenario: 'You are restructuring your life architecture for the upcoming quarter.',
              deliverablePrompt: 'Create a 1-page roadmap balancing intellectual growth, vitality, and creative output with concrete weekly metrics.',
              evaluationChecklist: ['Balances multiple heads.', 'Concrete metrics.', 'Includes rest buffers.']
            },
            reflectionPrompt: 'Does your daily calendar reflect the future you claim you want to build?'
          }
        ]
      }
    ]
  },

  // Course 7: Head 7 — Voice
  {
    id: 'course-07-articulate-voice',
    headId: 'head-07-voice',
    title: 'The Articulate Voice & Spoken Rhetoric',
    subtitle: 'From Vocal Mechanics to Confident Public Presentation',
    description: 'Master the vocal instrument, diaphragmatic breathing, rhetorical cadence, and high-impact presentation delivery.',
    level: 'Foundational',
    modules: [
      {
        id: 'mod-07-vocal-mechanics',
        courseId: 'course-07-articulate-voice',
        headId: 'head-07-voice',
        order: 1,
        title: 'Module 1: Speech Mechanics',
        description: 'Physical vocal resonance, pitch control, and rhetorical pauses.',
        chapters: [
          {
            id: 'chap-07-rhetorical-pause',
            moduleId: 'mod-07-vocal-mechanics',
            headId: 'head-07-voice',
            order: 1,
            title: 'Chapter 1: The Power of the Deliberate Pause',
            estimatedMinutes: 15,
            learningObjectives: [
              'Replace verbal filler (um, uh, like) with deliberate silent pauses.',
              'Anchor vocal projection in diaphragmatic resonance.',
              'Pace speech to match listener cognitive processing speed.'
            ],
            pillarAlignment: {
              light: 'Clarity of truth, inspiring presence, and mutual comprehension.',
              shadow: 'Performative manipulation and rhetorical deception.',
              selfCorrection: 'Uncompromising commitment to truth and economy of words.'
            },
            sections: [
              {
                id: 'sec-07-pause',
                title: 'The Sound of Silence',
                content: `Amateur speakers fear silence; they rush to fill every millisecond with verbal ticks ("um", "like", "you know"). Master orators view the pause as a structural element of speech. A 2-second pause before an essential point creates anticipation; a 2-second pause after allows the concept to settle into the audience memory.`,
                keyDefinition: {
                  term: 'Rhetorical Pause',
                  definition: 'An intentional silence in oral delivery used to emphasize a key assertion or allow cognitive integration.'
                }
              }
            ],
            summary: ['Silence is the canvas upon which speech is painted.', 'Diaphragmatic resonance projects authority without vocal strain.'],
            quiz: [
              {
                id: 'q7-1',
                question: 'Why do master speakers utilize the deliberate pause?',
                options: ['Because they forgot their speech.', 'To build anticipation and give listeners time to digest key insights.', 'To check their mobile phone.', 'To sound louder.'],
                correctIndex: 1,
                explanation: 'Pauses allow cognitive processing and create dramatic focus.',
                conceptHint: 'Review Section 1: The Sound of Silence.'
              }
            ],
            practice: {
              id: 'prac-07',
              title: 'Filler-Free 60-Second Challenge',
              prompt: 'Record yourself explaining one scientific concept for 60 seconds. Count every filler word. Re-record replacing every filler with a 1-second pause.',
              starterContent: 'Concept:\nTake 1 Filler Count:\nTake 2 Pause Count:\nKey Difference Felt:',
              rubric: ['60-second duration', 'Recorded twice', 'Replaced fillers with silence'],
              suggestedSolution: 'Explained gravity; Take 1 had 8 "ums"; Take 2 had 4 pauses and felt authoritative.'
            },
            realWorldApplication: {
              id: 'app-07',
              title: 'Executive Briefing Speech',
              scenario: 'Deliver a 3-minute project update to stakeholders.',
              deliverablePrompt: 'Structure a 3-part delivery: The Core Invariant, The Roadblock Solved, The Next Strategic Milestone.',
              evaluationChecklist: ['Under 3 minutes.', 'Zero filler words.', 'Clear call to action.']
            },
            reflectionPrompt: 'Are you speaking to impress others, or speaking to transmit truth with clarity?'
          }
        ]
      }
    ]
  },

  // Course 8: Head 8 — Astronomy
  {
    id: 'course-08-celestial-cosmos',
    headId: 'head-08-astronomy',
    title: 'Cosmic Horizons & Celestial Mechanics',
    subtitle: 'From Planetary Orbits to Deep Stellar Evolution',
    description: 'Learn orbital physics, planetary atmospheres, stellar lifecycles, and the grand timeline of cosmic evolution.',
    level: 'Foundational',
    modules: [
      {
        id: 'mod-08-orbital-mechanics',
        courseId: 'course-08-celestial-cosmos',
        headId: 'head-08-astronomy',
        order: 1,
        title: 'Module 1: The Dance of Gravity',
        description: 'How Newton and Kepler revealed the universal laws governing orbital mechanics.',
        chapters: [
          {
            id: 'chap-08-kepler-laws',
            moduleId: 'mod-08-orbital-mechanics',
            headId: 'head-08-astronomy',
            order: 1,
            title: 'Chapter 1: Kepler Laws — The Geometry of Celestial Paths',
            estimatedMinutes: 22,
            learningObjectives: [
              'State Kepler three laws of planetary motion.',
              'Understand elliptical orbits and conservation of angular momentum.',
              'Calculate orbital velocity shifts from perihelion to aphelion.'
            ],
            pillarAlignment: {
              light: 'Cosmic awe, mathematical beauty, and planetary humility.',
              shadow: 'Existential nihilism that diminishes the importance of earth.',
              selfCorrection: 'Revere cosmic physics while caring deeply for our planetary home.'
            },
            sections: [
              {
                id: 'sec-08-kepler',
                title: 'The Elliptical Breakthrough',
                content: `For two thousand years, Western astronomy insisted that planetary orbits must be perfect circles. Johannes Kepler, armed with Tycho Brahe precision observational data of Mars, shattered this dogma: planets move in **ellipses**, with the Sun at one focus.

The second law states that a line segment joining a planet and the Sun sweeps out equal areas during equal intervals of time: planets speed up when closest to the Sun (perihelion) and slow down when furthest (aphelion).`,
                keyDefinition: {
                  term: 'Kepler Second Law',
                  definition: 'Equal areas are swept out in equal intervals of time, reflecting conservation of angular momentum.'
                }
              }
            ],
            summary: ['Planetary orbits are ellipses, not circles.', 'Gravitational orbital velocity varies inversely with distance from the central mass.'],
            quiz: [
              {
                id: 'q8-1',
                question: 'Where does a planet travel at its highest orbital velocity?',
                options: ['At aphelion (furthest from the Sun)', 'At perihelion (closest to the Sun)', 'It travels at constant speed always', 'When it crosses the solar equator'],
                correctIndex: 1,
                explanation: 'A planet accelerates as it nears perihelion due to conservation of angular momentum.',
                conceptHint: 'Review Section 1: The Elliptical Breakthrough.'
              }
            ],
            practice: {
              id: 'prac-08',
              title: 'Orbital Period Comparison',
              prompt: 'Compare Earth orbit (1 AU, 1 year) with Jupiter (5.2 AU). Using Kepler Third Law ($P^2 = a^3$), verify Jupiter orbital period.',
              starterContent: 'Semi-major axis $a = 5.2$\n$a^3 = $\n$P = \\sqrt{a^3} = $\nCalculated Period in Earth Years:',
              rubric: ['Correct calculation', 'Matches astronomical observation (approx 11.86 years)'],
              suggestedSolution: '$5.2^3 = 140.6$. $\\sqrt{140.6} \\approx 11.86$ Earth years.'
            },
            realWorldApplication: {
              id: 'app-08',
              title: 'Satellite Orbit Profile',
              scenario: 'Select an orbit profile for a planetary climate monitoring satellite.',
              deliverablePrompt: 'Differentiate Low Earth Orbit (LEO) vs Geostationary Orbit (GEO) in terms of coverage resolution and orbital decay.',
              evaluationChecklist: ['Explains trade-offs.', 'Considers atmospheric drag.', 'Accurate altitude numbers.']
            },
            reflectionPrompt: 'How does realizing the vast scale of the cosmos alter the significance of your daily worries?'
          }
        ]
      }
    ]
  },

  // Course 9: Head 9 — Traditional Knowledge
  {
    id: 'course-09-heritage-wisdom',
    headId: 'head-09-traditional-knowledge',
    title: 'Heritage Wisdom & Comparative Philosophy',
    subtitle: 'From Ancient Epistemology to Modern Empirical Demarcation',
    description: 'Explore the great philosophical lineages, traditional ecological knowledge, and apply critical empirical scrutiny to ancient claims.',
    level: 'Foundational',
    modules: [
      {
        id: 'mod-09-epistemic-roots',
        courseId: 'course-09-heritage-wisdom',
        headId: 'head-09-traditional-knowledge',
        order: 1,
        title: 'Module 1: Ancient Epistemologies',
        description: 'How Indian, Greek, and Indigenous philosophical schools approached truth.',
        chapters: [
          {
            id: 'chap-09-pramana-logic',
            moduleId: 'mod-09-epistemic-roots',
            headId: 'head-09-traditional-knowledge',
            order: 1,
            title: 'Chapter 1: The Pramana System — Ancient Indian Epistemology',
            estimatedMinutes: 20,
            learningObjectives: [
              'Understand the Nyaya pramanas: Pratyaksha (perception) and Anumana (inference).',
              'Distinguish empirical observation from mythological extrapolation.',
              'Apply critical historical analysis to ancient heritage texts.'
            ],
            pillarAlignment: {
              light: 'Respectful cultural understanding grounded in philosophical depth.',
              shadow: 'Uncritical acceptance of superstition as established science.',
              selfCorrection: 'Demand empirical replication and maintain clear demarcation between science and heritage.'
            },
            sections: [
              {
                id: 'sec-09-pramanas',
                title: 'The Means of Valid Knowledge',
                content: `Long before modern European epistemology, Indian philosophical systems (such as Nyaya) developed the **Pramana** system—the study of valid sources of knowledge:

1. **Pratyaksha:** Direct sensory perception.
2. **Anumana:** Logical inference based on invariable concomitance (smoke implies fire).
3. **Upamana:** Comparison and analogy.
4. **Shabda:** Verbal testimony of a reliable, verified authority.

The Nyaya school insisted that any claim must stand up to rigorous logical debate (Vada). We study this not to accept ancient claims blindly, but to appreciate the timeless human quest for rational inquiry.`,
                keyDefinition: {
                  term: 'Pramana',
                  definition: 'In Indian philosophy, a reliable source or means of valid knowledge.'
                }
              }
            ],
            summary: ['Ancient cultures developed sophisticated rational epistemologies.', 'Respecting heritage requires critical philosophical scrutiny, not blind dogmatism.'],
            quiz: [
              {
                id: 'q9-1',
                question: 'What is "Pratyaksha" in classical Indian epistemology?',
                options: ['Blind faith in tradition.', 'Direct sensory perception.', 'Astronomical computation.', 'Poetic storytelling.'],
                correctIndex: 1,
                explanation: 'Pratyaksha refers to direct, valid sensory perception.',
                conceptHint: 'Review Section 1: The Means of Valid Knowledge.'
              }
            ],
            practice: {
              id: 'prac-09',
              title: 'Epistemological Source Audit',
              prompt: 'Select one traditional claim or proverb (e.g. "Early to bed makes a person healthy"). Deconstruct it: What part is verified by modern circadian biology? What part was historical heuristic?',
              starterContent: 'Claim:\nPerception/Observation Basis:\nModern Scientific Verification:\nHistorical Contextual Limit:',
              rubric: ['Identifies claim', 'Compares with modern empirical science', 'Preserves cultural nuance without pseudoscience'],
              suggestedSolution: 'Claim: Waking with sunrise. Verification: Retinal exposure anchors cortisol. Context: In pre-electric societies, sunlight was the only productive illumination.'
            },
            realWorldApplication: {
              id: 'app-09',
              title: 'Cultural Heritage Case Study',
              scenario: 'A museum or educational initiative is presenting ancient philosophical artifacts to a modern science audience.',
              deliverablePrompt: 'Draft a plaque text explaining the Nyaya system while maintaining scientific demarcation guidelines.',
              evaluationChecklist: ['Accurate historical attribution.', 'Clear demarcation.', 'Respectful presentation.']
            },
            reflectionPrompt: 'How can we honor the wisdom of our ancestors without becoming prisoners of their limitations?'
          }
        ]
      }
    ]
  },

  // Course 10: Head 10 — Governance
  {
    id: 'course-10-ethical-governance',
    headId: 'head-10-governance',
    title: 'Ethical Leadership & Institutional Governance',
    subtitle: 'From Systems Accountability to Servant Stewardship',
    description: 'Learn institutional design, public policy principles, transparent audit trails, and ethical leadership.',
    level: 'Foundational',
    modules: [
      {
        id: 'mod-10-systems-governance',
        courseId: 'course-10-ethical-governance',
        headId: 'head-10-governance',
        order: 1,
        title: 'Module 1: Designing Resilient Institutions',
        description: 'How incentives, audit mechanisms, and checks and balances sustain civilizations.',
        chapters: [
          {
            id: 'chap-10-checks-balances',
            moduleId: 'mod-10-systems-governance',
            headId: 'head-10-governance',
            order: 1,
            title: 'Chapter 1: The Architecture of Integrity — Audit Trails & Transparency',
            estimatedMinutes: 20,
            learningObjectives: [
              'Understand why systems must rely on transparent incentives rather than noble intentions.',
              'Implement tamper-evident audit logs and role separation.',
              'Apply servant leadership principles to group coordination.'
            ],
            pillarAlignment: {
              light: 'Equitable institutions, radical transparency, and human flourishing.',
              shadow: 'Authoritarian corruption, regulatory capture, and self-serving power consolidation.',
              selfCorrection: 'Independent review, open audits, and power rotation.'
            },
            sections: [
              {
                id: 'sec-10-incentives',
                title: 'The Iron Law of Institutions',
                content: `Good intentions do not preserve institutions; structural incentives and transparent checks do. As James Madison famously articulated in Federalist No. 51: "If men were angels, no government would be necessary."

In modern software and organizational systems, governance translates into:
- **Role-Based Access Control (RBAC):** Principle of least privilege.
- **Tamper-Evident Audit Trails:** Every administrative alteration is indelibly recorded.
- **Separation of Duties:** No single actor can unilaterally approve and execute consequential operations without oversight.`,
                keyDefinition: {
                  term: 'Principle of Least Privilege',
                  definition: 'An information security concept in which a user is given the minimum levels of access necessary to complete their specified role.'
                }
              }
            ],
            summary: ['Institutions endure when structured around incentives, not personalities.', 'Auditability is the foundation of public trust.'],
            quiz: [
              {
                id: 'q10-1',
                question: 'What is the Principle of Least Privilege in system governance?',
                options: ['Giving every user full admin rights.', 'Restricting user access to only the minimum permissions required for their role.', 'Eliminating all security passwords.', 'Ignoring audit logs.'],
                correctIndex: 1,
                explanation: 'Least privilege prevents accidental or malicious overreach by minimizing access.',
                conceptHint: 'Review Section 1: The Iron Law of Institutions.'
              }
            ],
            practice: {
              id: 'prac-10',
              title: 'Access Control Audit Exercise',
              prompt: 'Review a project or organization you participate in. Identify one area where someone has excessive permissions beyond what their role demands. Propose a segmented role structure.',
              starterContent: '1. Organization/Project:\n2. Over-privileged Role:\n3. Identified Risk:\n4. Proposed Segmented Permissions:',
              rubric: ['Identifies real privilege bottleneck', 'Assesses failure risk', 'Proposes balanced RBAC matrix'],
              suggestedSolution: 'All team members currently have production database delete rights. Proposed: Separate developer read/test rights from automated CI/CD deployment keys.'
            },
            realWorldApplication: {
              id: 'app-10',
              title: 'Governance Policy Formulation',
              scenario: 'Draft a data governance and audit policy for an educational platform.',
              deliverablePrompt: 'Specify how user deletion requests are logged, how administrative actions are tracked, and how formula injection in data exports is prevented.',
              evaluationChecklist: ['Details immutable audit logging.', 'Prevents spreadsheet formula injection.', 'Protects learner privacy.']
            },
            reflectionPrompt: 'When given authority, do you use it to empower the collective, or to insulate yourself from accountability?'
          }
        ]
      }
    ]
  }
];
