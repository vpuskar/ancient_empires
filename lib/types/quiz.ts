export interface QuizDifficultyLevel {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  dbValue: number;
  timer: number;
  multiplier: number;
  icon: string;
}

export interface QuizCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string | null;
  category: string;
}

export interface QuizConfig {
  difficulties: QuizDifficultyLevel[];
  allCategories: QuizCategory[];
}
