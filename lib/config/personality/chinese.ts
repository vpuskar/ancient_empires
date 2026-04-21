import type {
  PersonalityConfig,
  PersonalityQuestion,
  RulerProfile,
} from '@/lib/types/personality';

const questions: PersonalityQuestion[] = [
  {
    id: 1,
    text: 'When facing a rival power, you typically:',
    options: [
      {
        id: 'a',
        text: 'Seek military conquest and expansion',
        dimensions: { power_style: 10, conflict: 10, risk: 8 },
      },
      {
        id: 'b',
        text: 'Build alliances and diplomatic networks',
        dimensions: { power_style: 5, people_focus: 10, innovation: 6 },
      },
      {
        id: 'c',
        text: 'Focus on cultural and economic dominance',
        dimensions: { innovation: 10, legacy: 9, people_focus: 6 },
      },
      {
        id: 'd',
        text: 'Fortify borders and maintain stability',
        dimensions: { power_style: 6, moral_framework: 8, risk: 2 },
      },
    ],
  },
  {
    id: 2,
    text: 'Your greatest strength as a leader is:',
    options: [
      {
        id: 'a',
        text: 'Strategic brilliance and tactical foresight',
        dimensions: { power_style: 10, conflict: 8, innovation: 7 },
      },
      {
        id: 'b',
        text: 'Unifying disparate peoples under one vision',
        dimensions: { people_focus: 10, legacy: 9, charisma: 10 },
      },
      {
        id: 'c',
        text: 'Revolutionizing the state through bold reforms',
        dimensions: { innovation: 10, conflict: 6, moral_framework: 7 },
      },
      {
        id: 'd',
        text: 'Preserving traditions while adapting to change',
        dimensions: { moral_framework: 10, legacy: 8, innovation: 5 },
      },
    ],
  },
  {
    id: 3,
    text: 'When encountering a challenge to your rule:',
    options: [
      {
        id: 'a',
        text: 'Respond with decisive military action',
        dimensions: { power_style: 10, conflict: 10, risk: 9 },
      },
      {
        id: 'b',
        text: 'Use intelligence and subtlety to neutralize it',
        dimensions: { power_style: 8, conflict: 7, innovation: 8 },
      },
      {
        id: 'c',
        text: 'Address the root cause through systemic change',
        dimensions: { innovation: 10, moral_framework: 8, conflict: 5 },
      },
      {
        id: 'd',
        text: 'Seek consensus and broker a compromise',
        dimensions: { people_focus: 10, moral_framework: 9, risk: 2 },
      },
    ],
  },
  {
    id: 4,
    text: 'Your vision for your empire centers on:',
    options: [
      {
        id: 'a',
        text: 'Territorial dominance and military glory',
        dimensions: { power_style: 10, conflict: 9, legacy: 6 },
      },
      {
        id: 'b',
        text: 'Cultural and intellectual flourishing',
        dimensions: { legacy: 10, innovation: 10, people_focus: 7 },
      },
      {
        id: 'c',
        text: 'Restoring or reforming the entire social order',
        dimensions: { innovation: 10, conflict: 7, moral_framework: 9 },
      },
      {
        id: 'd',
        text: 'Harmony, stability, and harmonious governance',
        dimensions: { moral_framework: 10, people_focus: 9, risk: 1 },
      },
    ],
  },
  {
    id: 5,
    text: 'When it comes to loyalty and trust:',
    options: [
      {
        id: 'a',
        text: 'You surround yourself with capable generals and strategists',
        dimensions: { power_style: 9, conflict: 7, risk: 6 },
      },
      {
        id: 'b',
        text: 'You cultivate deep personal bonds with your inner circle',
        dimensions: { people_focus: 10, charisma: 10, moral_framework: 8 },
      },
      {
        id: 'c',
        text: 'You implement systems that reward merit and ability',
        dimensions: { innovation: 10, moral_framework: 8, people_focus: 7 },
      },
      {
        id: 'd',
        text: 'You rely on family and traditional hierarchies',
        dimensions: { moral_framework: 10, legacy: 9, innovation: 2 },
      },
    ],
  },
  {
    id: 6,
    text: 'In times of prosperity, you are most likely to:',
    options: [
      {
        id: 'a',
        text: 'Launch new military campaigns to expand the realm',
        dimensions: { power_style: 10, conflict: 9, risk: 8 },
      },
      {
        id: 'b',
        text: 'Commission grand monuments, art, and cultural projects',
        dimensions: { legacy: 10, charisma: 9, innovation: 7 },
      },
      {
        id: 'c',
        text: 'Implement sweeping bureaucratic or social reforms',
        dimensions: { innovation: 10, moral_framework: 8, conflict: 6 },
      },
      {
        id: 'd',
        text: 'Consolidate power and ensure the stability of your line',
        dimensions: { power_style: 8, moral_framework: 10, legacy: 9 },
      },
    ],
  },
  {
    id: 7,
    text: 'How do you handle dissent within your empire?',
    options: [
      {
        id: 'a',
        text: 'Crush it with overwhelming force',
        dimensions: { power_style: 10, conflict: 10, moral_framework: 2 },
      },
      {
        id: 'b',
        text: 'Co-opt dissenters through inclusion and rewards',
        dimensions: { people_focus: 10, charisma: 9, conflict: 3 },
      },
      {
        id: 'c',
        text: 'Reform the system so grievances are prevented',
        dimensions: { innovation: 10, moral_framework: 9, conflict: 4 },
      },
      {
        id: 'd',
        text: 'Maintain strict control while respecting hierarchy',
        dimensions: { moral_framework: 10, power_style: 8, conflict: 5 },
      },
    ],
  },
  {
    id: 8,
    text: 'Your legacy will be remembered for:',
    options: [
      {
        id: 'a',
        text: 'Conquering vast territories and defeating enemies',
        dimensions: { power_style: 10, conflict: 10, legacy: 7 },
      },
      {
        id: 'b',
        text: 'Patronizing a golden age of culture and arts',
        dimensions: { legacy: 10, innovation: 9, charisma: 10 },
      },
      {
        id: 'c',
        text: 'Transforming governance and social institutions',
        dimensions: { innovation: 10, legacy: 9, moral_framework: 8 },
      },
      {
        id: 'd',
        text: 'Preserving harmony and passing a stable realm to heirs',
        dimensions: { legacy: 10, moral_framework: 10, power_style: 6 },
      },
    ],
  },
];

const rulerProfiles: RulerProfile[] = [
  {
    id: 'qin-shi-huang',
    name: 'Qin Shi Huang',
    title: 'The Unifier',
    description:
      'Founder of the Qin Dynasty who unified China through military conquest and administrative reorganization. His obsession with immortality and legacy led to the Great Wall and the Terracotta Army.',
    image: '/rulers/chinese/qin-shi-huang.jpg',
    dimensions: {
      power_style: 10,
      conflict: 10,
      legacy: 8,
      innovation: 9,
      people_focus: 3,
      risk: 9,
      moral_framework: 2,
      charisma: 7,
    },
  },
  {
    id: 'kangxi',
    name: 'Kangxi Emperor',
    title: 'The Scholar-King',
    description:
      'Manchu ruler of the Qing Dynasty who brought Confucian scholarship to imperial governance. Known for military victories, cultural patronage, and a 61-year reign of unprecedented stability.',
    image: '/rulers/chinese/kangxi.jpg',
    dimensions: {
      power_style: 8,
      conflict: 6,
      legacy: 10,
      innovation: 8,
      people_focus: 8,
      risk: 3,
      moral_framework: 9,
      charisma: 9,
    },
  },
  {
    id: 'wu-zetian',
    name: 'Wu Zetian',
    title: 'The Empress',
    description:
      'The only woman to rule China as emperor. Consolidated power through intelligence and ruthlessness, reformed the civil service, and promoted Buddhism while maintaining Confucian governance.',
    image: '/rulers/chinese/wu-zetian.jpg',
    dimensions: {
      power_style: 10,
      conflict: 8,
      legacy: 9,
      innovation: 8,
      people_focus: 6,
      risk: 8,
      moral_framework: 4,
      charisma: 9,
    },
  },
  {
    id: 'yongzheng',
    name: 'Yongzheng Emperor',
    title: 'The Administrator',
    description:
      'Qing Dynasty emperor who revolutionized bureaucracy through meritocratic reforms and anti-corruption measures. Created a centralized administrative system that lasted centuries.',
    image: '/rulers/chinese/yongzheng.jpg',
    dimensions: {
      power_style: 9,
      conflict: 7,
      legacy: 9,
      innovation: 10,
      people_focus: 5,
      risk: 4,
      moral_framework: 8,
      charisma: 6,
    },
  },
  {
    id: 'hong-wu',
    name: 'Hongwu Emperor',
    title: 'The Liberator',
    description:
      'Founder of the Ming Dynasty who overthrew Mongol rule. Abolished the position of chancellor, centralized power, and initiated the Forbidden City. Harsh but transformative ruler.',
    image: '/rulers/chinese/hong-wu.jpg',
    dimensions: {
      power_style: 10,
      conflict: 9,
      legacy: 8,
      innovation: 8,
      people_focus: 2,
      risk: 7,
      moral_framework: 3,
      charisma: 7,
    },
  },
  {
    id: 'tang-era',
    name: 'Xuanzang (Tang Monk)',
    title: 'The Visionary',
    description:
      "Though not technically an emperor, represented the Tang Dynasty's golden age of cultural synthesis. Buddhism, poetry, and artistic expression flourished under enlightened patronage.",
    image: '/rulers/chinese/tang-era.jpg',
    dimensions: {
      power_style: 5,
      conflict: 2,
      legacy: 10,
      innovation: 10,
      people_focus: 9,
      risk: 2,
      moral_framework: 10,
      charisma: 8,
    },
  },
];

export const CHINESE_PERSONALITY: PersonalityConfig = {
  empireId: 2,
  displayName: 'Chinese',
  questions,
  rulerProfiles,
};
