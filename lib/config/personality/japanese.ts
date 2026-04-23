import type {
  PersonalityConfig,
  PersonalityQuestion,
  RulerProfile,
} from '@/lib/types/personality';

const questions: PersonalityQuestion[] = [
  {
    id: 1,
    question: 'How do you prefer to establish your authority?',
    dimension: 'power_style',
    options: [
      {
        text: 'Through sacred lineage and divine mandate',
        delta: [2, 0, 2, 0, 1, 0, 2, 1],
      },
      {
        text: 'Through military conquest and decisive force',
        delta: [2, 2, 1, 1, 0, 2, 0, 1],
      },
      {
        text: 'Through patient alliance-building and strategy',
        delta: [1, 0, 2, 1, 1, 0, 1, 1],
      },
      {
        text: 'Through institutional reform and legal order',
        delta: [1, 0, 2, 2, 1, 0, 1, 0],
      },
    ],
  },
  {
    id: 2,
    question: 'A rival threatens your domain. What is your first instinct?',
    dimension: 'conflict',
    options: [
      {
        text: 'Strike decisively before they consolidate power',
        delta: [1, 2, 0, 0, 0, 2, 0, 1],
      },
      {
        text: 'Negotiate from a position of strength',
        delta: [1, 1, 1, 1, 1, 0, 1, 1],
      },
      {
        text: 'Outlast them - patience is the greatest weapon',
        delta: [0, 0, 2, 0, 0, 0, 1, 0],
      },
      {
        text: 'Build a coalition to isolate and contain them',
        delta: [1, 1, 1, 1, 1, 1, 1, 1],
      },
    ],
  },
  {
    id: 3,
    question: 'What do you most want your era to be remembered for?',
    dimension: 'legacy',
    options: [
      {
        text: 'Unifying a fractured nation under one rule',
        delta: [2, 1, 2, 1, 1, 1, 0, 1],
      },
      {
        text: 'Transforming society through sweeping reform',
        delta: [1, 0, 2, 2, 1, 1, 1, 1],
      },
      {
        text: 'Preserving culture and court refinement',
        delta: [0, 0, 2, 0, 2, 0, 2, 2],
      },
      {
        text: 'Restoring imperial dignity after long decline',
        delta: [2, 1, 2, 0, 1, 1, 2, 2],
      },
    ],
  },
  {
    id: 4,
    question:
      'How do you approach the relationship between religion and governance?',
    dimension: 'moral_framework',
    options: [
      {
        text: 'Sacred authority underpins all legitimate rule',
        delta: [1, 0, 1, 0, 1, 0, 2, 1],
      },
      {
        text: 'Religion is a tool - useful but subordinate to power',
        delta: [2, 1, 1, 1, 0, 1, 0, 1],
      },
      {
        text: 'Faith should guide rulers toward compassionate governance',
        delta: [0, 0, 1, 1, 2, 0, 2, 1],
      },
      {
        text: 'Spiritual life is personal; statecraft must be practical',
        delta: [1, 1, 1, 2, 1, 1, 0, 0],
      },
    ],
  },
  {
    id: 5,
    question: 'A famine strikes your realm. What do you prioritize?',
    dimension: 'people_focus',
    options: [
      {
        text: 'Waive taxes immediately and distribute imperial stores',
        delta: [0, 0, 1, 0, 2, 0, 2, 1],
      },
      {
        text: 'Mobilize the military to maintain order and distribute aid',
        delta: [1, 1, 1, 0, 1, 1, 0, 0],
      },
      {
        text: 'Commission long-term infrastructure to prevent recurrence',
        delta: [0, 0, 2, 2, 1, 0, 1, 0],
      },
      {
        text: 'Enforce strict rationing to preserve resources for recovery',
        delta: [1, 0, 1, 2, 0, 0, 1, 0],
      },
    ],
  },
  {
    id: 6,
    question: 'What is your relationship with foreign knowledge and culture?',
    dimension: 'innovation',
    options: [
      {
        text: 'Embrace it actively - borrow whatever strengthens the nation',
        delta: [0, 0, 1, 2, 1, 1, 0, 1],
      },
      {
        text: 'Study it selectively and adapt it to our own traditions',
        delta: [0, 0, 2, 1, 1, 0, 1, 1],
      },
      {
        text: 'Our heritage is sufficient - foreign influence is dangerous',
        delta: [1, 1, 1, 0, 0, 0, 2, 0],
      },
      {
        text: 'Use it as a diplomatic bridge - knowledge is power',
        delta: [1, 0, 1, 1, 1, 0, 1, 1],
      },
    ],
  },
  {
    id: 7,
    question: 'How do you manage powerful nobles and clans beneath you?',
    dimension: 'risk',
    options: [
      {
        text: 'Crush any who openly challenge imperial authority',
        delta: [2, 2, 0, 0, 0, 2, 0, 0],
      },
      {
        text: 'Bind them through marriage alliances and shared interest',
        delta: [1, 0, 1, 1, 1, 0, 1, 1],
      },
      {
        text: 'Create institutions that make individual defiance impossible',
        delta: [1, 0, 2, 2, 1, 0, 1, 0],
      },
      {
        text: 'Play rivals against each other from a position of balance',
        delta: [2, 1, 1, 1, 0, 1, 0, 1],
      },
    ],
  },
  {
    id: 8,
    question:
      'At the end of your life, what gives you the deepest satisfaction?',
    dimension: 'charisma',
    options: [
      {
        text: 'A stable order that will outlast me by centuries',
        delta: [1, 0, 2, 1, 1, 0, 1, 0],
      },
      {
        text: 'A nation transformed beyond recognition by my vision',
        delta: [2, 1, 2, 2, 0, 2, 0, 2],
      },
      {
        text: 'Having served my people with integrity and humility',
        delta: [0, 0, 1, 0, 2, 0, 2, 1],
      },
      {
        text: 'Having inspired loyalty that transcended self-interest',
        delta: [1, 0, 2, 0, 1, 0, 1, 2],
      },
    ],
  },
];

const rulers: RulerProfile[] = [
  {
    id: 'emperor-meiji',
    name: 'Emperor Meiji',
    title: 'The Reformer Emperor',
    years: '1867-1912',
    portrait: '',
    color: '#C8102E',
    description:
      "The emperor who dismantled feudalism and built a modern nation in a single generation. Meiji's reign transformed Japan from an isolated shogunate into an industrial great power with a constitution, a conscript army, and global ambitions beyond anything his predecessors could have imagined.",
    traits: ['Modernizer', 'Visionary', 'Decisive', 'Nationalist'],
    vector: [2, 1, 2, 2, 1, 2, 1, 2],
  },
  {
    id: 'tokugawa-ieyasu',
    name: 'Tokugawa Ieyasu',
    title: 'The Patient Unifier',
    years: '1600-1616 (effective rule)',
    portrait: '',
    color: '#2C3E50',
    description:
      "The most patient strategist in Japanese history, who waited decades for his moment and then built institutions that lasted 250 years. Ieyasu's genius lay not just in winning at Sekigahara but in designing a system so stable that it made rebellion nearly impossible.",
    traits: ['Patient', 'Strategic', 'Institutional', 'Calculating'],
    vector: [2, 1, 2, 2, 1, 0, 1, 1],
  },
  {
    id: 'emperor-kanmu',
    name: 'Emperor Kanmu',
    title: 'The Capital Builder',
    years: '781-806',
    portrait: '',
    color: '#D35400',
    description:
      'The emperor who founded Kyoto and shaped Japanese political geography for over a millennium. Kanmu combined military expansion into Tohoku with sweeping administrative reform, moving the capital twice to escape entrenched interests and build a state on his own terms.',
    traits: ['Decisive', 'Builder', 'Reformist', 'Expansionist'],
    vector: [2, 1, 2, 2, 1, 1, 1, 1],
  },
  {
    id: 'emperor-go-daigo',
    name: 'Emperor Go-Daigo',
    title: 'The Restorationist',
    years: '1318-1339',
    portrait: '',
    color: '#8E44AD',
    description:
      "The emperor who dared to overthrow the Kamakura shogunate and briefly restore direct imperial rule in the Kemmu Restoration of 1333. Visionary and stubborn in equal measure, Go-Daigo's ambition outran his political skill, leading to the bitter Southern Court exile that defined his final years.",
    traits: ['Idealistic', 'Defiant', 'Ambitious', 'Uncompromising'],
    vector: [2, 2, 2, 0, 1, 2, 2, 2],
  },
  {
    id: 'emperor-showa',
    name: 'Emperor Showa',
    title: 'The Enduring Symbol',
    years: '1926-1989',
    portrait: '',
    color: '#7F8C8D',
    description:
      "Japan's longest-reigning emperor, whose 62-year reign spanned militarist expansion, catastrophic defeat, atomic devastation, and one of history's most remarkable national recoveries. Hirohito's voice announcing surrender in 1945 was the first time his subjects had ever heard him speak.",
    traits: ['Enduring', 'Adaptive', 'Symbolic', 'Reserved'],
    vector: [1, 1, 2, 0, 1, 0, 1, 1],
  },
  {
    id: 'prince-shotoku',
    name: 'Prince Shotoku',
    title: 'The Philosopher Regent',
    years: '593-622 (regent)',
    portrait: '',
    color: '#27AE60',
    description:
      "The regent who introduced Buddhism, drafted the Seventeen-Article Constitution, and sent Japan's first diplomatic missions to Sui China. Shotoku envisioned a Japan governed by Confucian harmony and Buddhist compassion - a moral vision that shaped Japanese statecraft for centuries.",
    traits: ['Philosophical', 'Diplomatic', 'Visionary', 'Compassionate'],
    vector: [1, 0, 2, 1, 2, 0, 2, 2],
  },
];

export const JAPANESE_PERSONALITY: PersonalityConfig = {
  displayName: 'Japanese',
  questions,
  rulers,
};
