export interface InterviewSettings {
  questions: string[];
  numQuestions: number;
  secondsPerQuestion: number;
  shuffle: boolean;
}

export const STORAGE_KEY = 'questionary-app-settings';

export const DEFAULT_QUESTIONS = [
  'If you could visit any place in the world, where would you go and why?',
  "What is one skill or hobby you've always wanted to learn?",
  'What book has had the biggest impact on your life?',
  'If you could have dinner with any historical figure, who would it be and why?',
  'What is your favorite way to relax and unwind?',
  'What is something you are passionate about?',
  'What is a goal you want to accomplish in the next year?',
  'What is the best piece of advice you have ever received?',
  'If you could live anywhere in the world, where would it be?',
  'What is a hobby you enjoy in your free time?',
];

export const DEFAULT_SETTINGS: InterviewSettings = {
  questions: DEFAULT_QUESTIONS,
  numQuestions: 5,
  secondsPerQuestion: 60,
  shuffle: false,
};

export function loadSettings(): InterviewSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<InterviewSettings>;
    return {
      questions: Array.isArray(parsed.questions)
        ? parsed.questions
        : DEFAULT_SETTINGS.questions,
      numQuestions:
        typeof parsed.numQuestions === 'number'
          ? parsed.numQuestions
          : DEFAULT_SETTINGS.numQuestions,
      secondsPerQuestion:
        typeof parsed.secondsPerQuestion === 'number'
          ? parsed.secondsPerQuestion
          : DEFAULT_SETTINGS.secondsPerQuestion,
      shuffle:
        typeof parsed.shuffle === 'boolean'
          ? parsed.shuffle
          : DEFAULT_SETTINGS.shuffle,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function persistSettings(settings: InterviewSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // almacenamiento no disponible: se ignora
  }
}

export function normalizeQuestions(raw: string[]): string[] {
  return raw.map((q) => q.trim()).filter((q) => q.length > 0);
}

export function buildSession(settings: InterviewSettings): string[] {
  const pool = normalizeQuestions(settings.questions);
  if (pool.length === 0) return [];
  const source = settings.shuffle
    ? [...pool].sort(() => Math.random() - 0.5)
    : pool;
  const count = Math.min(Math.max(settings.numQuestions, 1), source.length);
  return source.slice(0, count);
}

export function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
