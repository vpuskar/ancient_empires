import type { CrossEmpireQuestion } from '@/lib/types/crossPersonality';

export const CROSS_QUESTIONS: CrossEmpireQuestion[] = [
  {
    id: 1,
    question: 'A powerful neighbor threatens your frontier. What do you do?',
    options: [
      {
        text: 'Mobilize disciplined forces and make the border a lesson in deterrence.',
        delta: [0.2, 0.3, 0.1, 0, -0.1, 0.2, 0.1, 0.1],
        empireBias: { 1: 0.12 },
      },
      {
        text: 'Stabilize the frontier with diplomacy, tribute, and long-term patience.',
        delta: [0.1, -0.1, 0.2, 0.1, 0.2, -0.2, 0.2, 0],
        empireBias: { 2: 0.1 },
      },
      {
        text: 'Fortify key positions and bind warriors through honor and obligation.',
        delta: [0, 0.2, 0.2, -0.1, 0, 0.1, 0.3, 0.1],
        empireBias: { 3: 0.1 },
      },
      {
        text: 'Absorb local powers into a flexible imperial frontier system.',
        delta: [0.2, 0.1, 0.1, 0.1, 0.3, 0, 0.1, 0.2],
        empireBias: { 4: 0.1 },
      },
    ],
  },
  {
    id: 2,
    question: 'Your realm needs rules. Which instinct guides you?',
    options: [
      {
        text: 'Write clear laws that outlive any single ruler.',
        delta: [0.2, 0, 0.3, 0.1, 0, -0.1, 0.2, 0],
        empireBias: { 1: 0.12 },
      },
      {
        text: 'Preserve inherited norms and refine them through learned officials.',
        delta: [0.1, -0.1, 0.2, 0, 0.2, -0.2, 0.3, -0.1],
        empireBias: { 2: 0.1 },
      },
      {
        text: 'Let custom, hierarchy, and ritual keep society in balance.',
        delta: [0, 0, 0.2, -0.1, 0.1, -0.1, 0.3, 0.1],
        empireBias: { 3: 0.08 },
      },
      {
        text: 'Blend imperial decree with local law so many peoples can function.',
        delta: [0.2, 0, 0.1, 0.2, 0.3, 0, 0.1, 0.1],
        empireBias: { 4: 0.1 },
      },
    ],
  },
  {
    id: 3,
    question: 'What kind of cultural legacy matters most to you?',
    options: [
      {
        text: 'Cities, roads, monuments, and institutions people can still walk through.',
        delta: [0.1, 0.1, 0.3, 0.1, 0, 0, 0.1, 0.2],
        empireBias: { 1: 0.1 },
      },
      {
        text: 'A written tradition of learning, bureaucracy, poetry, and philosophy.',
        delta: [0, -0.1, 0.3, 0.2, 0.1, -0.1, 0.3, 0],
        empireBias: { 2: 0.12 },
      },
      {
        text: 'A refined aesthetic of duty, craft, discipline, and memory.',
        delta: [0, 0.1, 0.3, 0, 0.1, 0, 0.2, 0.2],
        empireBias: { 3: 0.1 },
      },
      {
        text: 'A cosmopolitan court where different cultures leave a shared imprint.',
        delta: [0.1, 0, 0.2, 0.2, 0.3, 0, 0.1, 0.3],
        empireBias: { 4: 0.1 },
      },
    ],
  },
  {
    id: 4,
    question: 'A disruptive new idea reaches your capital. How do you respond?',
    options: [
      {
        text: 'Test it, adapt what works, and turn it into a practical tool.',
        delta: [0.1, 0, 0.1, 0.3, 0, 0.1, 0, 0.1],
        empireBias: { 1: 0.06 },
      },
      {
        text: 'Study it deeply and integrate it into an existing intellectual order.',
        delta: [0, -0.1, 0.2, 0.3, 0.1, -0.1, 0.2, 0],
        empireBias: { 2: 0.1 },
      },
      {
        text: 'Adopt it carefully only if it strengthens continuity and discipline.',
        delta: [0, 0, 0.2, 0.1, 0, -0.1, 0.2, 0.1],
        empireBias: { 3: 0.07 },
      },
      {
        text: 'Welcome it if it helps connect different peoples and markets.',
        delta: [0.1, -0.1, 0.1, 0.3, 0.2, 0, 0, 0.2],
        empireBias: { 4: 0.08 },
      },
    ],
  },
  {
    id: 5,
    question: 'You have absorbed a defeated people. What is your policy?',
    options: [
      {
        text: 'Offer status and citizenship to those who serve the common order.',
        delta: [0.2, 0.1, 0.2, 0, 0.2, 0, 0.1, 0.1],
        empireBias: { 1: 0.1 },
      },
      {
        text: 'Govern through officials while drawing them into a shared civil culture.',
        delta: [0.1, -0.1, 0.2, 0.1, 0.2, -0.1, 0.2, 0],
        empireBias: { 2: 0.08 },
      },
      {
        text: 'Demand loyalty and ritual respect before granting deeper trust.',
        delta: [0.1, 0.2, 0.1, -0.1, -0.1, 0.1, 0.2, 0],
        empireBias: { 3: 0.06 },
      },
      {
        text: 'Let communities keep many customs if they accept imperial authority.',
        delta: [0.2, 0, 0.1, 0.1, 0.3, -0.1, 0.1, 0.1],
        empireBias: { 4: 0.12 },
      },
    ],
  },
  {
    id: 6,
    question: 'What role should belief and ethics play in government?',
    options: [
      {
        text: 'Public duty matters most; religion should support civic order.',
        delta: [0.2, 0, 0.2, 0, 0, -0.1, 0.2, 0.1],
        empireBias: { 1: 0.07 },
      },
      {
        text: 'Ethical cultivation should shape both ruler and official class.',
        delta: [0, -0.1, 0.2, 0.1, 0.2, -0.2, 0.3, 0],
        empireBias: { 2: 0.12 },
      },
      {
        text: 'Sacred legitimacy and personal honor should guide authority.',
        delta: [0.1, 0.1, 0.2, -0.1, 0, 0, 0.3, 0.2],
        empireBias: { 3: 0.1 },
      },
      {
        text: 'Different faiths can coexist under a confident imperial umbrella.',
        delta: [0.2, -0.1, 0.1, 0.1, 0.3, -0.1, 0.2, 0.2],
        empireBias: { 4: 0.12 },
      },
    ],
  },
  {
    id: 7,
    question: 'The empire is under internal stress. What is your first move?',
    options: [
      {
        text: 'Restore command, discipline, and visible authority before anything else.',
        delta: [0.3, 0.2, 0.1, 0, -0.1, 0.2, 0.1, 0.2],
        empireBias: { 1: 0.1 },
      },
      {
        text: 'Rebalance administration and reduce disorder through patient reform.',
        delta: [0.1, -0.1, 0.2, 0.2, 0.2, -0.2, 0.2, 0],
        empireBias: { 2: 0.09 },
      },
      {
        text: 'Call elites back to loyalty and sacrifice for the house they serve.',
        delta: [0.1, 0.2, 0.2, -0.1, 0, 0.1, 0.3, 0.1],
        empireBias: { 3: 0.1 },
      },
      {
        text: 'Negotiate across factions and preserve the center through compromise.',
        delta: [0.2, -0.1, 0.1, 0.1, 0.3, -0.1, 0.1, 0.2],
        empireBias: { 4: 0.08 },
      },
    ],
  },
  {
    id: 8,
    question: 'How should power be transferred or earned?',
    options: [
      {
        text: 'Through proven capacity, elite recognition, and service to the state.',
        delta: [0.2, 0.1, 0.2, 0, 0, 0.1, 0.1, 0.2],
        empireBias: { 1: 0.08 },
      },
      {
        text: 'Through legitimacy, education, and the moral fitness to govern.',
        delta: [0.1, -0.1, 0.2, 0.1, 0.2, -0.1, 0.3, 0],
        empireBias: { 2: 0.1 },
      },
      {
        text: 'Through inherited duty, lineage, and loyalty to rightful order.',
        delta: [0, 0.1, 0.3, -0.1, 0, -0.1, 0.3, 0.1],
        empireBias: { 3: 0.12 },
      },
      {
        text: 'Through dynastic strength balanced by practical court politics.',
        delta: [0.3, 0.1, 0.1, 0, 0.1, 0.1, 0.1, 0.2],
        empireBias: { 4: 0.08 },
      },
    ],
  },
  {
    id: 9,
    question: 'What is your instinct toward trade and exchange?',
    options: [
      {
        text: 'Build roads, ports, and tax systems so commerce serves power.',
        delta: [0.2, 0, 0.2, 0.2, 0.1, 0, 0, 0.1],
        empireBias: { 1: 0.08 },
      },
      {
        text: 'Treat exchange as a civilizational network of goods and ideas.',
        delta: [0, -0.1, 0.2, 0.3, 0.2, -0.1, 0.1, 0.1],
        empireBias: { 2: 0.09 },
      },
      {
        text: 'Control outside contact carefully to protect internal cohesion.',
        delta: [0.1, 0, 0.2, -0.2, 0, -0.2, 0.2, 0],
        empireBias: { 3: 0.08 },
      },
      {
        text: 'Make the capital a meeting point between continents and peoples.',
        delta: [0.2, -0.1, 0.2, 0.2, 0.3, 0, 0.1, 0.2],
        empireBias: { 4: 0.12 },
      },
    ],
  },
  {
    id: 10,
    question: 'What do you most want to be remembered for?',
    options: [
      {
        text: 'Creating institutions strong enough to shape centuries after me.',
        delta: [0.2, 0, 0.3, 0.1, 0, 0, 0.2, 0.1],
        empireBias: { 1: 0.1 },
      },
      {
        text: 'Preserving wisdom while improving the lives of future generations.',
        delta: [0, -0.1, 0.3, 0.2, 0.3, -0.2, 0.2, 0],
        empireBias: { 2: 0.1 },
      },
      {
        text: 'Living with honor and leaving a model of disciplined purpose.',
        delta: [0, 0.1, 0.2, 0, 0.1, 0, 0.3, 0.2],
        empireBias: { 3: 0.1 },
      },
      {
        text: 'Uniting many worlds under a magnificent and adaptable order.',
        delta: [0.2, 0, 0.2, 0.2, 0.3, 0, 0.1, 0.3],
        empireBias: { 4: 0.1 },
      },
    ],
  },
];
