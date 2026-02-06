
export type DifficultyLevel = "Starters" | "Movers" | "Flyers" | "KET";
export type WordType = "noun" | "verb" | "adjective";

export enum LetterShape {
  Ascender = "Ascender",   // b, d, f, h, k, l, t
  Descender = "Descender", // g, j, p, q, y
  Neutral = "Neutral"      // a, c, e, i, m, n, o, r, s, u, v, w, x, z
}

export interface User {
  name: string;
  avatarId: number;
  joinedAt: number;
}

export interface PhonicsRule {
  label: string;        // Technical: "Short i sound"
  displayLabel: string; // Kid-friendly: "⏱️ 短促音"
  tooltipText: string;  // Story: "这个 i 只有一丁点长..."
  color: 'pink' | 'purple' | 'blue' | 'yellow' | 'green' | 'orange';
  audioCue?: string;
}

export interface WordItem {
  id: string;
  word: string;
  type: WordType;
  level: DifficultyLevel;
  meaning: string;
  imageUrl: string;
  audioUrl: string;
  phonics: {
    segments: string[];
    rules: PhonicsRule[];
  };
  letterShapes: LetterShape[];
  masteryLevel: number;
  nextReviewTime: number;
  example?: string;
  memoryTip: string;
}

export interface GameState {
  currentWordIndex: number;
  score: number;
  isFinished: boolean;
  hearts: number;
  streak: number;
  wordsCompletedToday: number;
  dailyGoal: number;
}
