import type {
  PersonalityConfig,
  PersonalityQuestion,
  RulerProfile,
} from '@/lib/types/personality';

const questions: PersonalityQuestion[] = [
  {
    id: 1,
    question: 'Your city faces a crisis. How do you respond?',
    dimension: 'Power Style',
    options: [
      {
        text: 'Take full control immediately',
        delta: [0.9, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
      },
      {
        text: 'Build consensus among advisors',
        delta: [0.1, 0.1, 0.9, 0.1, 0.8, 0.1, 0.1, 0.1],
      },
      {
        text: 'Find a creative, unexpected solution',
        delta: [0.1, 0.1, 0.1, 0.9, 0.1, 0.7, 0.1, 0.1],
      },
      {
        text: 'Observe carefully, then adapt',
        delta: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.9, 0.5],
      },
    ],
  },
  {
    id: 2,
    question: 'People challenge your authority. What do you do?',
    dimension: 'Conflict Response',
    options: [
      {
        text: 'Crush the opposition decisively',
        delta: [0.9, 0.9, 0.1, 0.1, 0.1, 0.9, 0.1, 0.1],
      },
      {
        text: 'Win them over with charm and promises',
        delta: [0.3, 0.3, 0.7, 0.5, 0.6, 0.3, 0.3, 0.9],
      },
      {
        text: 'Ignore them - they are beneath you',
        delta: [0.5, 0.5, 0.1, 0.7, 0.1, 0.5, 0.1, 0.5],
      },
      {
        text: 'Outmanoeuvre them politically',
        delta: [0.7, 0.2, 0.8, 0.6, 0.5, 0.4, 0.6, 0.7],
      },
    ],
  },
  {
    id: 3,
    question: 'What drives your deepest ambitions?',
    dimension: 'Motivation',
    options: [
      {
        text: 'Building a legacy that lasts centuries',
        delta: [0.6, 0.2, 0.8, 0.3, 0.7, 0.3, 0.7, 0.7],
      },
      {
        text: 'Ensuring stability and prosperity for my people',
        delta: [0.3, 0.1, 0.7, 0.2, 0.9, 0.2, 0.8, 0.4],
      },
      {
        text: 'Expanding my territory and influence',
        delta: [0.8, 0.7, 0.4, 0.5, 0.3, 0.8, 0.3, 0.6],
      },
      {
        text: 'Personal glory and recognition',
        delta: [0.7, 0.8, 0.2, 0.8, 0.1, 0.9, 0.1, 0.9],
      },
    ],
  },
  {
    id: 4,
    question: 'What is your greatest strength as a leader?',
    dimension: 'Leadership Trait',
    options: [
      {
        text: 'Strategic patience - I play the long game',
        delta: [0.6, 0.1, 0.8, 0.4, 0.7, 0.2, 0.8, 0.6],
      },
      {
        text: 'Inspiring fierce loyalty in my followers',
        delta: [0.5, 0.5, 0.5, 0.5, 0.6, 0.5, 0.4, 0.9],
      },
      {
        text: 'Military genius and tactical brilliance',
        delta: [0.8, 0.8, 0.3, 0.4, 0.3, 0.8, 0.3, 0.5],
      },
      {
        text: 'Political instinct - I always know the right move',
        delta: [0.7, 0.3, 0.9, 0.7, 0.5, 0.4, 0.6, 0.8],
      },
    ],
  },
  {
    id: 5,
    question: 'How do you handle a devastating defeat?',
    dimension: 'Resilience',
    options: [
      {
        text: 'Analyse what went wrong and learn from it',
        delta: [0.4, 0.1, 0.7, 0.4, 0.8, 0.2, 0.9, 0.5],
      },
      {
        text: 'Negotiate from whatever position remains',
        delta: [0.3, 0.2, 0.8, 0.5, 0.6, 0.3, 0.6, 0.6],
      },
      {
        text: 'Never accept defeat - fight harder',
        delta: [0.9, 0.9, 0.2, 0.6, 0.2, 0.9, 0.2, 0.7],
      },
      {
        text: 'Blame others and protect my reputation',
        delta: [0.6, 0.6, 0.1, 0.7, 0.1, 0.5, 0.1, 0.6],
      },
    ],
  },
  {
    id: 6,
    question: 'What kind of legacy do you want to leave?',
    dimension: 'Legacy Type',
    options: [
      {
        text: 'Grand buildings, laws, and institutions',
        delta: [0.6, 0.2, 0.9, 0.4, 0.8, 0.3, 0.8, 0.7],
      },
      {
        text: 'A prosperous, well-governed people',
        delta: [0.3, 0.1, 0.7, 0.2, 0.9, 0.2, 0.8, 0.4],
      },
      {
        text: 'Vast new territories and conquests',
        delta: [0.8, 0.7, 0.4, 0.5, 0.3, 0.9, 0.3, 0.5],
      },
      {
        text: 'A name that inspires fear and awe forever',
        delta: [0.8, 0.9, 0.1, 0.8, 0.1, 0.8, 0.1, 0.8],
      },
    ],
  },
  {
    id: 7,
    question: 'What is your relationship with religion and belief?',
    dimension: 'Belief',
    options: [
      {
        text: 'A useful political tool - nothing more',
        delta: [0.7, 0.4, 0.7, 0.6, 0.3, 0.4, 0.4, 0.7],
      },
      {
        text: 'Genuinely important to me',
        delta: [0.3, 0.1, 0.5, 0.2, 0.8, 0.2, 0.9, 0.3],
      },
      {
        text: 'I keep it separate from governance',
        delta: [0.4, 0.2, 0.7, 0.4, 0.6, 0.3, 0.7, 0.5],
      },
      {
        text: 'Whatever serves my interests at the time',
        delta: [0.6, 0.6, 0.3, 0.7, 0.2, 0.6, 0.2, 0.6],
      },
    ],
  },
  {
    id: 8,
    question: 'In your final years, what occupies your mind?',
    dimension: 'Endgame',
    options: [
      {
        text: 'Careful succession planning',
        delta: [0.5, 0.1, 0.9, 0.3, 0.8, 0.2, 0.8, 0.6],
      },
      {
        text: 'One last great campaign or project',
        delta: [0.8, 0.7, 0.4, 0.5, 0.4, 0.8, 0.4, 0.6],
      },
      {
        text: 'Philosophy and the meaning of it all',
        delta: [0.2, 0.1, 0.5, 0.3, 0.9, 0.1, 0.9, 0.3],
      },
      {
        text: 'Accumulating as much as possible',
        delta: [0.7, 0.8, 0.2, 0.8, 0.1, 0.7, 0.1, 0.7],
      },
    ],
  },
];

const rulers: RulerProfile[] = [
  {
    id: 'augustus',
    name: 'Augustus',
    title: 'The First Emperor',
    years: '27 BC – 14 AD',
    portrait: '',
    color: '#B8860B',
    description:
      'A master strategist who transformed a republic into an empire through patience, diplomacy, and calculated reform. You lead by building systems that outlast you.',
    traits: ['Strategic', 'Patient', 'Diplomatic', 'Institutional'],
    vector: [0.7, 0.3, 0.9, 0.6, 0.8, 0.4, 0.7, 0.9],
  },
  {
    id: 'caesar',
    name: 'Julius Caesar',
    title: 'The Dictator Perpetuo',
    years: '49 – 44 BC',
    portrait: '⚔',
    color: '#8B0000',
    description:
      'Brilliant, bold, and ruthlessly ambitious. You seize opportunity where others see risk, inspiring fierce loyalty and equally fierce opposition.',
    traits: ['Bold', 'Ambitious', 'Charismatic', 'Ruthless'],
    vector: [0.9, 0.8, 0.5, 0.9, 0.4, 0.9, 0.3, 0.9],
  },
  {
    id: 'aurelius',
    name: 'Marcus Aurelius',
    title: 'The Philosopher Emperor',
    years: '161 – 180 AD',
    portrait: '',
    color: '#6B4C8A',
    description:
      'Thoughtful and principled, you lead through wisdom rather than force. You bear the weight of responsibility with quiet dignity and deep reflection.',
    traits: ['Wise', 'Stoic', 'Principled', 'Reflective'],
    vector: [0.4, 0.2, 0.8, 0.3, 0.9, 0.3, 0.9, 0.5],
  },
  {
    id: 'trajan',
    name: 'Trajan',
    title: 'The Optimus Princeps',
    years: '98 – 117 AD',
    portrait: '',
    color: '#4A6741',
    description:
      'A soldier-emperor beloved by all. You expand what you touch, building roads, bridges, and legacies. Your ambition serves the common good.',
    traits: ['Expansive', 'Popular', 'Military', 'Builder'],
    vector: [0.8, 0.6, 0.7, 0.5, 0.7, 0.7, 0.6, 0.7],
  },
  {
    id: 'nero',
    name: 'Nero',
    title: 'The Artist Emperor',
    years: '54 – 68 AD',
    portrait: '',
    color: '#C4622D',
    description:
      'Creative, passionate, and dangerously self-absorbed. You see the world as your stage and refuse to be constrained by convention or expectation.',
    traits: ['Creative', 'Passionate', 'Dramatic', 'Unpredictable'],
    vector: [0.6, 0.7, 0.2, 0.8, 0.3, 0.8, 0.2, 0.8],
  },
  {
    id: 'caligula',
    name: 'Caligula',
    title: 'The Mad Emperor',
    years: '37 – 41 AD',
    portrait: '',
    color: '#2C2C2C',
    description:
      'Absolute power revealed your true nature. Impulsive and theatrical, you test every boundary and answer to no one - for better or worse.',
    traits: ['Impulsive', 'Theatrical', 'Absolute', 'Provocative'],
    vector: [0.9, 0.9, 0.1, 0.7, 0.1, 0.9, 0.1, 0.6],
  },
];

export const ROMAN_PERSONALITY: PersonalityConfig = {
  displayName: 'Roman',
  questions,
  rulers,
};
