export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface Topic {
  id: number;
  name: string;
  description: string;
  difficulty: string;
  icon: string;
}

export interface Progress {
  learned_words: number;
  average_score: number;
  quizzes_taken: number;
}

export interface Vocabulary {
  id: number;
  word: string;
  meaning: string;
  example: string;
  pronunciation: string;
  topic_id: number;
}

export interface QuizQuestion {
  id: number;
  topic_id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_answer: string;
}

export interface MatchingPair {
  word: string;
  meaning: string;
  id: number;
}

export interface MatchingGame {
  words: string[];
  meanings: string[];
  correct_pairs: MatchingPair[];
}

export interface FillBlankQuestion {
  sentence: string;
  correct_word: string;
  meaning: string;
  id: number;
}

export interface ScrambleWord {
  scrambled: string;
  correct_word: string;
  meaning: string;
  id: number;
}

export interface RandomContent {
  type: 'vocabulary' | 'quiz' | 'matching' | 'fill-blank' | 'scramble';
  content: any;
  topic_id?: number;
}

export interface RandomGameState {
  currentContent: RandomContent | null;
  score: number;
  totalQuestions: number;
  isLoading: boolean;
  gameMode: string;
  selectedTopic?: number;
}
