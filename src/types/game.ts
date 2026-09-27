export type CharacterId = 'raka' | 'sinta' | 'bimo' | 'citra';

export interface Character {
  id: CharacterId;
  name: string;
  avatar: string;
  role: string;
  description: string;
  color: string;
}

export interface UserProfile {
  id: string;
  name: string;
  classCode: string;
  characterId: CharacterId;
  role: 'student' | 'teacher';
  level: number;
  xp: number;
  badges: string[];
  completedMissions: string[];
  preTestScore?: number;
  postTestScore?: number;
  scores: {
    literal: number;       // Informasi tersurat
    characters: number;    // Tokoh & latar
    sequence: number;      // Urutan kejadian
    causeEffect: number;   // Sebab-akibat
    inferential: number;   // Informasi tersirat
    conclusion: number;    // Kesimpulan
    coding: number;        // Logika & sequence
    debugging: number;     // Pemecahan bug
  };
}

export type QuestionCategory =
  | 'literal'
  | 'character_setting'
  | 'sequence'
  | 'cause_effect'
  | 'inferential'
  | 'conclusion';

export interface MultipleChoiceQuestion {
  id: string;
  type: 'multiple_choice';
  category: QuestionCategory;
  question: string;
  options: string[];
  correctIndex: number;
  storyReferenceClue?: string;
}

export interface SequenceQuestion {
  id: string;
  type: 'sequence_order';
  category: 'sequence';
  question: string;
  items: { id: string; text: string; correctOrder: number }[];
}

export type Question = MultipleChoiceQuestion | SequenceQuestion;

export type BlockType =
  | 'MOVE_FORWARD'
  | 'TURN_LEFT'
  | 'TURN_RIGHT'
  | 'PICK'
  | 'TALK'
  | 'RESCUE'
  | 'REPEAT_2'
  | 'REPEAT_3';

export interface CodeBlockItem {
  id: string;
  type: BlockType;
  label: string;
  iconName: string;
  color: string;
  category: 'motion' | 'action' | 'control';
}

export interface MazeCell {
  x: number;
  y: number;
  type: 'path' | 'wall' | 'grass' | 'start' | 'target' | 'npc' | 'item';
  label?: string;
  icon?: string;
}

export interface MazeConfig {
  gridSize: { width: number; height: number };
  startPos: { x: number; y: number; dir: 'up' | 'down' | 'left' | 'right' };
  targetPos: { x: number; y: number };
  npcPos?: { x: number; y: number; name: string };
  itemPos?: { x: number; y: number; name: string };
  walls: { x: number; y: number }[];
  solutionSteps: BlockType[];
}

export interface Mission {
  id: string;
  worldId: string;
  title: string;
  subtitle: string;
  readingFocus: string;
  storyTitle: string;
  storyText: string;
  storyIllustration: string;
  storyAudioSpeed?: number;
  questions: Question[];
  mazeConfig: MazeConfig;
  availableBlocks: BlockType[];
  aiChallenge: {
    question: string;
    expectedConcept: string;
    sampleGoodAnswer: string;
  };
  rewardXP: number;
  badgeRewardId?: string;
}

export interface World {
  id: string;
  number: number;
  name: string;
  theme: string;
  focus: string;
  icon: string;
  bgGradient: string;
  isUnlocked: boolean;
  missions: Mission[];
}

export interface Badge {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlockedAt?: string;
  category: 'reading' | 'coding' | 'thinking' | 'master';
}

export interface StudentProgressRecord {
  studentId: string;
  studentName: string;
  classCode: string;
  characterId: CharacterId;
  readingScore: number;
  codingScore: number;
  progressPercent: number;
  weakness: string;
  preTestScore: number;
  postTestScore: number;
  hintsUsedCount: number;
  completedAt?: string;
  categoryBreakdown: {
    literal: number;
    sequence: number;
    causeEffect: number;
    inferential: number;
    conclusion: number;
    coding: number;
  };
}
