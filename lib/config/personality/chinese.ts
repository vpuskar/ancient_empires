import type {
  PersonalityConfig,
  PersonalityQuestion,
  RulerProfile,
} from '@/lib/types/personality';

// Vector dimensions (positional): [power, conflict, legacy, innovation, people, risk, moral, charisma]

const questions: PersonalityQuestion[] = [
  {
    id: 1,
    question: 'When facing a rival power, you typically:',
    dimension: 'Power Style',
    options: [
      {
        text: 'Seek military conquest and expansion',
        delta: [1.0, 1.0, 0.1, 0.1, 0.1, 0.8, 0.1, 0.3],
      },
      {
        text: 'Build alliances and diplomatic networks',
        delta: [0.5, 0.1, 0.3, 0.6, 1.0, 0.1, 0.5, 0.7],
      },
      {
        text: 'Focus on cultural and economic dominance',
        delta: [0.3, 0.1, 0.9, 1.0, 0.6, 0.3, 0.5, 0.5],
      },
      {
        text: 'Fortify borders and maintain stability',
        delta: [0.6, 0.3, 0.5, 0.3, 0.3, 0.2, 0.8, 0.3],
      },
    ],
  },
  {
    id: 2,
    question: 'Your greatest strength as a leader is:',
    dimension: 'Leadership Trait',
    options: [
      {
        text: 'Strategic brilliance and tactical foresight',
        delta: [1.0, 0.8, 0.3, 0.7, 0.3, 0.5, 0.3, 0.5],
      },
      {
        text: 'Unifying disparate peoples under one vision',
        delta: [0.5, 0.3, 0.9, 0.5, 1.0, 0.3, 0.7, 1.0],
      },
      {
        text: 'Revolutionizing the state through bold reforms',
        delta: [0.5, 0.6, 0.5, 1.0, 0.3, 0.7, 0.7, 0.3],
      },
      {
        text: 'Preserving traditions while adapting to change',
        delta: [0.3, 0.1, 0.8, 0.5, 0.5, 0.1, 1.0, 0.3],
      },
    ],
  },
  {
    id: 3,
    question: 'When encountering a challenge to your rule:',
    dimension: 'Conflict Response',
    options: [
      {
        text: 'Respond with decisive military action',
        delta: [1.0, 1.0, 0.1, 0.1, 0.1, 0.9, 0.1, 0.5],
      },
      {
        text: 'Use intelligence and subtlety to neutralize it',
        delta: [0.8, 0.7, 0.3, 0.8, 0.3, 0.5, 0.3, 0.5],
      },
      {
        text: 'Address the root cause through systemic change',
        delta: [0.3, 0.5, 0.5, 1.0, 0.5, 0.3, 0.8, 0.3],
      },
      {
        text: 'Seek consensus and broker a compromise',
        delta: [0.1, 0.1, 0.3, 0.3, 1.0, 0.2, 0.9, 0.7],
      },
    ],
  },
  {
    id: 4,
    question: 'Your vision for your empire centers on:',
    dimension: 'Motivation',
    options: [
      {
        text: 'Territorial dominance and military glory',
        delta: [1.0, 0.9, 0.6, 0.3, 0.1, 0.7, 0.1, 0.5],
      },
      {
        text: 'Cultural and intellectual flourishing',
        delta: [0.3, 0.1, 1.0, 1.0, 0.7, 0.1, 0.7, 0.7],
      },
      {
        text: 'Restoring or reforming the entire social order',
        delta: [0.5, 0.7, 0.6, 1.0, 0.3, 0.5, 0.9, 0.3],
      },
      {
        text: 'Harmony, stability, and harmonious governance',
        delta: [0.3, 0.1, 0.5, 0.3, 0.9, 0.1, 1.0, 0.5],
      },
    ],
  },
  {
    id: 5,
    question: 'When it comes to loyalty and trust:',
    dimension: 'Resilience',
    options: [
      {
        text: 'You surround yourself with capable generals and strategists',
        delta: [0.9, 0.7, 0.3, 0.5, 0.3, 0.6, 0.3, 0.5],
      },
      {
        text: 'You cultivate deep personal bonds with your inner circle',
        delta: [0.3, 0.3, 0.5, 0.3, 1.0, 0.3, 0.8, 1.0],
      },
      {
        text: 'You implement systems that reward merit and ability',
        delta: [0.5, 0.3, 0.7, 1.0, 0.7, 0.3, 0.8, 0.3],
      },
      {
        text: 'You rely on family and traditional hierarchies',
        delta: [0.5, 0.1, 0.9, 0.2, 0.3, 0.1, 1.0, 0.3],
      },
    ],
  },
  {
    id: 6,
    question: 'In times of prosperity, you are most likely to:',
    dimension: 'Legacy Type',
    options: [
      {
        text: 'Launch new military campaigns to expand the realm',
        delta: [1.0, 0.9, 0.5, 0.3, 0.1, 0.8, 0.1, 0.5],
      },
      {
        text: 'Commission grand monuments, art, and cultural projects',
        delta: [0.3, 0.1, 1.0, 0.7, 0.5, 0.3, 0.5, 0.9],
      },
      {
        text: 'Implement sweeping bureaucratic or social reforms',
        delta: [0.5, 0.6, 0.6, 1.0, 0.5, 0.5, 0.8, 0.3],
      },
      {
        text: 'Consolidate power and ensure the stability of your line',
        delta: [0.8, 0.3, 0.9, 0.3, 0.5, 0.1, 1.0, 0.5],
      },
    ],
  },
  {
    id: 7,
    question: 'How do you handle dissent within your empire?',
    dimension: 'Belief',
    options: [
      {
        text: 'Crush it with overwhelming force',
        delta: [1.0, 1.0, 0.3, 0.1, 0.1, 0.7, 0.2, 0.3],
      },
      {
        text: 'Co-opt dissenters through inclusion and rewards',
        delta: [0.3, 0.3, 0.3, 0.5, 1.0, 0.3, 0.7, 0.9],
      },
      {
        text: 'Reform the system so grievances are prevented',
        delta: [0.3, 0.4, 0.5, 1.0, 0.5, 0.3, 0.9, 0.3],
      },
      {
        text: 'Maintain strict control while respecting hierarchy',
        delta: [0.8, 0.5, 0.7, 0.3, 0.3, 0.2, 1.0, 0.3],
      },
    ],
  },
  {
    id: 8,
    question: 'Your legacy will be remembered for:',
    dimension: 'Endgame',
    options: [
      {
        text: 'Conquering vast territories and defeating enemies',
        delta: [1.0, 1.0, 0.7, 0.3, 0.1, 0.7, 0.1, 0.5],
      },
      {
        text: 'Patronizing a golden age of culture and arts',
        delta: [0.3, 0.1, 1.0, 0.9, 0.5, 0.2, 0.6, 1.0],
      },
      {
        text: 'Transforming governance and social institutions',
        delta: [0.5, 0.5, 0.9, 1.0, 0.5, 0.3, 0.8, 0.3],
      },
      {
        text: 'Preserving harmony and passing a stable realm to heirs',
        delta: [0.6, 0.2, 1.0, 0.3, 0.7, 0.1, 1.0, 0.5],
      },
    ],
  },
];

const rulers: RulerProfile[] = [
  {
    id: 'qin-shi-huang',
    name: 'Qin Shi Huang',
    title: 'The First Emperor',
    years: '221 – 210 BC',
    portrait: '',
    color: '#8B0000',
    description:
      'You unify through sheer force of will. Like Qin Shi Huang, you see fragmentation as a problem to be solved decisively — no matter the human cost. Your vision outlasts your own lifetime in stone and bronze.',
    traits: ['Unifier', 'Ruthless', 'Visionary', 'Absolute'],
    vector: [1.0, 1.0, 0.8, 0.9, 0.3, 0.9, 0.2, 0.7],
  },
  {
    id: 'kangxi',
    name: 'Kangxi Emperor',
    title: 'The Scholar-King',
    years: '1661 – 1722',
    portrait: '',
    color: '#DE2910',
    description:
      'You rule through mastery of culture as much as power. Like Kangxi, you combine military decisiveness with deep scholarship, patient diplomacy, and a 60-year commitment to stable governance.',
    traits: ['Scholar', 'Patient', 'Multicultural', 'Institutional'],
    vector: [0.8, 0.6, 1.0, 0.8, 0.8, 0.3, 0.9, 0.9],
  },
  {
    id: 'wu-zetian',
    name: 'Wu Zetian',
    title: 'The Empress',
    years: '690 – 705',
    portrait: '',
    color: '#6B2C5F',
    description:
      'You break every rule and still win. Like Wu Zetian, you navigate impossible odds through intelligence, calculated ruthlessness, and a willingness to redefine what authority itself looks like.',
    traits: ['Unprecedented', 'Shrewd', 'Reformer', 'Charismatic'],
    vector: [1.0, 0.8, 0.9, 0.8, 0.6, 0.8, 0.4, 0.9],
  },
  {
    id: 'yongzheng',
    name: 'Yongzheng Emperor',
    title: 'The Administrator',
    years: '1722 – 1735',
    portrait: '',
    color: '#2F5D50',
    description:
      'You transform empires through paperwork. Like Yongzheng, you believe good governance means sixteen-hour days, merciless anti-corruption drives, and bureaucratic systems built to outlast you.',
    traits: ['Diligent', 'Reformer', 'Incorruptible', 'Systematic'],
    vector: [0.9, 0.7, 0.9, 1.0, 0.5, 0.4, 0.8, 0.6],
  },
  {
    id: 'hongwu',
    name: 'Hongwu Emperor',
    title: 'The Liberator',
    years: '1368 – 1398',
    portrait: '',
    color: '#B8860B',
    description:
      'From peasant to emperor. Like Hongwu, you understand power from the bottom up and never forget it — wielding absolute authority with the paranoia of someone who has seen the world from below.',
    traits: ['Self-Made', 'Authoritarian', 'Suspicious', 'Transformative'],
    vector: [1.0, 0.9, 0.8, 0.8, 0.2, 0.7, 0.3, 0.7],
  },
  {
    id: 'tang-xuanzong',
    name: 'Tang Xuanzong',
    title: 'The Cultured Monarch',
    years: '712 – 756',
    portrait: '',
    color: '#C9A227',
    description:
      'You preside over a golden age. Like Xuanzong, you believe an empire is measured not in miles but in poems written, paintings completed, and foreign scholars welcomed at court.',
    traits: ['Patron', 'Cosmopolitan', 'Cultured', 'Generous'],
    vector: [0.5, 0.2, 1.0, 1.0, 0.9, 0.2, 1.0, 0.8],
  },
];

export const CHINESE_PERSONALITY: PersonalityConfig = {
  displayName: 'Chinese',
  questions,
  rulers,
};
