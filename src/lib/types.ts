export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type QuestionBank = {
  id: string;
  user_id: string;
  title: string;
  is_public: boolean;
  icon?: string;
  created_at: string;
};

export type Question = {
  id: string;
  bank_id: string;
  text: string;
  order_index: number;
};

export type UseCaseCategory = "idiomas" | "entrevistas" | "negocios" | "ocio";

export type TimerStyle = "digital" | "bar";
export type SoundOption = "none" | "tick" | "alarm";
export type ReadingSize = "sm" | "md" | "lg";
export type EnvironmentKey =
  | "light"
  | "dark"
  | "aurora"
  | "sunset"
  | "ocean"
  | "lavender"
  | "beams"
  | "auroraGlow";

export type SessionEnvironment = {
  timerStyle: TimerStyle;
  sound: SoundOption;
  readingSize: ReadingSize;
  background: EnvironmentKey;
};

export type FontKey = "sans" | "serif" | "mono";
export type AnimationKey = "fade" | "slide" | "scale" | "none";

export type Design = {
  id: string;
  name: string;
  isBuiltIn?: boolean;
  background: EnvironmentKey;
  timerStyle: TimerStyle;
  sound: SoundOption;
  readingSize: ReadingSize;
  accent: string;
  font: FontKey;
  animation: AnimationKey;
};

export type SessionSource =
  | { type: "bank"; bankId: string }
  | { type: "custom"; questions: string[] };

export type Session = {
  id: string;
  user_id: string;
  title: string;
  source: SessionSource;
  designId: string;
  prepSec: number;
  responseSec: number;
  count: number;
  isRandom: boolean;
  is_public: boolean;
  category?: UseCaseCategory;
  created_at: string;
};

export type InterviewPreset = {
  id: string;
  user_id: string;
  bank_id: string;
  name: string;
  questions_count: number;
  time_per_question_sec: number;
  is_random: boolean;
  category?: UseCaseCategory;
  prep_sec?: number;
  created_at: string;
};

export type SessionHistory = {
  id: string;
  user_id: string;
  preset_id: string | null;
  bank_id: string;
  completed_at: string;
  total_duration_sec: number;
  avg_response_sec: number;
  questions_answered: number;
};
