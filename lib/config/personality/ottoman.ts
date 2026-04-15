import type {
  PersonalityConfig,
  PersonalityQuestion,
  RulerProfile,
} from '@/lib/types/personality';

const questions: PersonalityQuestion[] = [
  {
    id: 1,
    question:
      'You have just been proclaimed Sultan. How do you secure your throne?',
    dimension: 'Power Style',
    options: [
      {
        text: 'Execute all rivals immediately',
        delta: [0.9, 0.3, 0.1, 0.1, 0.1, 0.3, 0.1, 0.7],
      },
      {
        text: 'Win over the court through generous appointments',
        delta: [0.3, 0.1, 0.1, 0.1, 0.8, 0.1, 0.7, 0.5],
      },
      {
        text: 'Reform the system to prevent future challenges',
        delta: [0.5, 0.1, 0.3, 0.7, 0.3, 0.5, 0.3, 0.3],
      },
      {
        text: 'Build alliances and wait for loyalty to grow',
        delta: [0.1, 0.1, 0.7, 0.3, 0.5, 0.1, 0.5, 0.1],
      },
    ],
  },
  {
    id: 2,
    question:
      'A powerful Janissary commander defies your orders. What do you do?',
    dimension: 'Conflict Response',
    options: [
      {
        text: 'Crush the rebellion publicly as an example',
        delta: [0.7, 0.9, 0.1, 0.1, 0.1, 0.7, 0.1, 0.5],
      },
      {
        text: 'Negotiate and find a compromise',
        delta: [0.3, 0.3, 0.1, 0.1, 0.7, 0.1, 0.7, 0.7],
      },
      {
        text: 'Abolish the institution entirely and replace it',
        delta: [0.5, 0.5, 0.3, 0.7, 0.1, 0.5, 0.3, 0.3],
      },
      {
        text: 'Outmaneuver them through palace intrigue',
        delta: [0.3, 0.1, 0.1, 0.3, 0.3, 0.1, 0.5, 0.9],
      },
    ],
  },
  {
    id: 3,
    question: 'What kind of legacy would you want to leave behind?',
    dimension: 'Motivation',
    options: [
      {
        text: 'Magnificent buildings and cultural achievements',
        delta: [0.3, 0.1, 0.9, 0.1, 0.1, 0.1, 0.3, 0.5],
      },
      {
        text: 'The greatest territorial expansion',
        delta: [0.5, 0.3, 0.7, 0.1, 0.1, 0.7, 0.1, 0.7],
      },
      {
        text: 'A just legal code that outlasts you',
        delta: [0.1, 0.1, 0.7, 0.3, 0.7, 0.1, 0.9, 0.1],
      },
      {
        text: 'Being remembered as undefeatable',
        delta: [0.7, 0.5, 0.5, 0.5, 0.3, 0.5, 0.3, 0.3],
      },
    ],
  },
  {
    id: 4,
    question: 'Constantinople has just fallen. How do you reshape it?',
    dimension: 'Leadership Trait',
    options: [
      {
        text: 'Repopulate it with diverse communities',
        delta: [0.5, 0.1, 0.7, 0.7, 0.5, 0.3, 0.5, 0.5],
      },
      {
        text: 'Build grand mosques and palaces to show power',
        delta: [0.7, 0.3, 0.5, 0.3, 0.1, 0.5, 0.1, 0.9],
      },
      {
        text: 'Create new institutions of learning and trade',
        delta: [0.1, 0.1, 0.3, 0.9, 0.3, 0.3, 0.5, 0.1],
      },
      {
        text: 'Preserve existing institutions and win local trust',
        delta: [0.3, 0.1, 0.1, 0.5, 0.7, 0.1, 0.7, 0.3],
      },
    ],
  },
  {
    id: 5,
    question:
      'Your empire contains Muslims, Christians, and Jews. How do you govern them?',
    dimension: 'Resilience',
    options: [
      {
        text: 'The millet system: each community governs its own affairs',
        delta: [0.3, 0.1, 0.3, 0.3, 0.9, 0.1, 0.7, 0.3],
      },
      {
        text: 'Centralized authority with the Sultan supreme over all',
        delta: [0.7, 0.3, 0.1, 0.5, 0.3, 0.3, 0.1, 0.5],
      },
      {
        text: 'Equal citizenship rights through legal reform',
        delta: [0.1, 0.1, 0.5, 0.7, 0.7, 0.3, 0.5, 0.1],
      },
      {
        text: 'Use diversity as a tool of imperial strength',
        delta: [0.5, 0.5, 0.1, 0.1, 0.5, 0.5, 0.3, 0.7],
      },
    ],
  },
  {
    id: 6,
    question:
      'Vienna stands before you. Your supply lines are stretched. Do you attack?',
    dimension: 'Legacy Type',
    options: [
      {
        text: 'Attack now; fortune favors the bold',
        delta: [0.5, 0.7, 0.3, 0.1, 0.1, 0.9, 0.1, 0.7],
      },
      {
        text: 'Withdraw and consolidate your gains',
        delta: [0.3, 0.1, 0.5, 0.3, 0.3, 0.1, 0.7, 0.1],
      },
      {
        text: 'Probe for weakness before committing',
        delta: [0.5, 0.3, 0.1, 0.5, 0.1, 0.5, 0.3, 0.5],
      },
      {
        text: 'Negotiate a treaty from a position of strength',
        delta: [0.1, 0.1, 0.7, 0.3, 0.5, 0.1, 0.5, 0.3],
      },
    ],
  },
  {
    id: 7,
    question:
      'A grand vizier has grown too powerful. He serves the state well, but threatens your authority.',
    dimension: 'Belief',
    options: [
      {
        text: 'Remove him immediately; no one rivals the Sultan',
        delta: [0.7, 0.5, 0.1, 0.1, 0.1, 0.5, 0.3, 0.5],
      },
      {
        text: 'Let him serve as long as he governs justly',
        delta: [0.1, 0.1, 0.3, 0.3, 0.5, 0.1, 0.9, 0.1],
      },
      {
        text: 'Gradually shift power to others you trust',
        delta: [0.3, 0.3, 0.1, 0.5, 0.3, 0.3, 0.5, 0.7],
      },
      {
        text: 'Create new institutions that limit any single office',
        delta: [0.5, 0.1, 0.5, 0.7, 0.1, 0.3, 0.5, 0.3],
      },
    ],
  },
  {
    id: 8,
    question: 'How would your subjects remember you?',
    dimension: 'Endgame',
    options: [
      {
        text: 'A leader whose presence inspired awe and devotion',
        delta: [0.5, 0.3, 0.5, 0.1, 0.3, 0.3, 0.1, 0.9],
      },
      {
        text: 'A wise ruler who brought order and justice',
        delta: [0.3, 0.1, 0.7, 0.3, 0.5, 0.1, 0.7, 0.3],
      },
      {
        text: 'A warrior who never lost a battle',
        delta: [0.7, 0.7, 0.3, 0.3, 0.1, 0.7, 0.1, 0.5],
      },
      {
        text: 'A visionary who transformed the empire',
        delta: [0.1, 0.1, 0.5, 0.9, 0.5, 0.3, 0.5, 0.1],
      },
    ],
  },
];

const rulers: RulerProfile[] = [
  {
    id: 'suleiman-i',
    name: 'Suleiman I',
    title: 'The Lawgiver',
    years: '1520 - 1566',
    portrait: '',
    color: '#C9A227',
    description:
      'You lead with vision and order. Like Suleiman, you balance military strength with cultural brilliance and just governance.',
    traits: ['Lawgiver', 'Empire Builder', 'Patron of Arts'],
    vector: [0.7, 0.5, 0.9, 0.5, 0.6, 0.5, 0.9, 0.8],
  },
  {
    id: 'mehmed-ii',
    name: 'Mehmed II',
    title: 'The Conqueror',
    years: '1451 - 1481',
    portrait: '',
    color: '#8B0000',
    description:
      'You are driven by ambition and grand vision. Like Mehmed, you see possibilities where others see impossibilities and reshape the world around you.',
    traits: ['Conqueror', 'Visionary', 'City Builder'],
    vector: [0.8, 0.7, 0.8, 0.8, 0.4, 0.8, 0.3, 0.9],
  },
  {
    id: 'selim-i',
    name: 'Selim I',
    title: 'The Grim',
    years: '1512 - 1520',
    portrait: '',
    color: '#5B1F1F',
    description:
      'You are swift, decisive, and uncompromising. Like Selim, you accomplish in years what others take decades to achieve through sheer force of will.',
    traits: ['Ruthless', 'Decisive', 'Empire Doubler'],
    vector: [0.9, 0.9, 0.6, 0.4, 0.2, 0.9, 0.2, 0.7],
  },
  {
    id: 'bayezid-ii',
    name: 'Bayezid II',
    title: 'The Pious',
    years: '1481 - 1512',
    portrait: '',
    color: '#2F5D50',
    description:
      'You value stability over expansion. Like Bayezid II, you strengthen what exists, welcome the displaced, and govern through patience rather than force.',
    traits: ['Diplomat', 'Consolidator', 'Patron of Refugees'],
    vector: [0.3, 0.2, 0.6, 0.4, 0.7, 0.2, 0.8, 0.4],
  },
  {
    id: 'osman-i',
    name: 'Osman I',
    title: 'The Founder',
    years: 'c. 1299 - 1324',
    portrait: '',
    color: '#6B4F2A',
    description:
      'You build from nothing. Like Osman, you see potential in a small beginning and have the patience and charisma to turn a frontier outpost into an empire.',
    traits: ['Pioneer', 'Tribal Leader', 'Dynasty Founder'],
    vector: [0.6, 0.5, 0.7, 0.6, 0.6, 0.6, 0.5, 0.6],
  },
  {
    id: 'murad-i',
    name: 'Murad I',
    title: 'The God-Like One',
    years: '1362 - 1389',
    portrait: '',
    color: '#3E4E88',
    description:
      'You are a builder of systems. Like Murad I, you create the institutions, armies, laws, and structures that outlast any single ruler.',
    traits: ['Institution Builder', 'Warrior Sultan', 'Innovator'],
    vector: [0.7, 0.7, 0.5, 0.6, 0.4, 0.7, 0.4, 0.6],
  },
];

export const OTTOMAN_PERSONALITY: PersonalityConfig = {
  displayName: 'Ottoman',
  questions,
  rulers,
};
