import type {
  Design,
  InterviewPreset,
  Question,
  QuestionBank,
  Session,
  SessionHistory,
  User,
} from "./types";

const DB_KEY = "questionary-db-v1";

type DB = {
  users: User[];
  banks: QuestionBank[];
  questions: Question[];
  presets: InterviewPreset[];
  history: SessionHistory[];
  designs: Design[];
  sessions: Session[];
};

const EMPTY: DB = {
  users: [],
  banks: [],
  questions: [],
  presets: [],
  history: [],
  designs: [],
  sessions: [],
};

export function read(): DB {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return structuredClone(EMPTY);
    const parsed = JSON.parse(raw) as Partial<DB>;
    return { ...structuredClone(EMPTY), ...parsed };
  } catch {
    return structuredClone(EMPTY);
  }
}

export function write(db: DB): void {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    /* almacenamiento no disponible */
  }
}

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const DEMO_PRESET_ID = "example-ocio";
const EXAMPLE_USER = "examples";

type ExampleDef = {
  category: "idiomas" | "entrevistas" | "negocios" | "ocio";
  bankId: string;
  bankTitle: string;
  bankIcon: string;
  presetId: string;
  presetName: string;
  prepSec: number;
  responseSec: number;
  questions: string[];
};

const EXAMPLES: ExampleDef[] = [
  {
    category: "idiomas",
    bankId: "example-idiomas-bank",
    bankTitle: "Speaking TOEFL (Sección 1)",
    bankIcon: "Globe",
    presetId: "example-idiomas",
    presetName: "Práctica de idiomas · TOEFL",
    prepSec: 15,
    responseSec: 45,
    questions: [
      "Some people prefer to study alone. Others prefer to study with a group. Which do you prefer and why?",
      "Describe a book, movie, or song that has been meaningful to you and explain why.",
      "Do you agree or disagree: it is better to grow up in a small town than in a big city?",
      "Describe a place you would like to visit and explain what you would do there.",
      "Some students learn best by reading; others by discussing. Which is better for you?",
    ],
  },
  {
    category: "entrevistas",
    bankId: "example-entrevistas-bank",
    bankTitle: "Conceptos de Arquitectura de Software",
    bankIcon: "Briefcase",
    presetId: "example-entrevistas",
    presetName: "Entrevistas técnicas · Arquitectura",
    prepSec: 0,
    responseSec: 150,
    questions: [
      "Explica la diferencia entre un balanceador de carga y una API Gateway.",
      "¿Cuándo usarías una base de datos SQL frente a una NoSQL?",
      "Describe el patrón Circuit Breaker y cuándo aplicarlo.",
      "¿Qué estrategias conoces para lograr consistencia eventual?",
      "Explica cómo funciona la comunicación síncrona vs asíncrona entre microservicios.",
    ],
  },
  {
    category: "negocios",
    bankId: "example-negocios-bank",
    bankTitle: "Manejo de Objeciones de Clientes B2B",
    bankIcon: "TrendingUp",
    presetId: "example-negocios",
    presetName: "Ventas y negocios · Objeciones B2B",
    prepSec: 0,
    responseSec: 30,
    questions: [
      "El cliente dice: 'Es muy caro comparado con la competencia'. ¿Cómo respondes?",
      "Te dicen: 'Ya trabajamos con un proveedor actual'. ¿Qué haces?",
      "Objeción: 'Necesito consultarlo con mi equipo'. ¿Cómo avanzas?",
      "El prospecto afirma: 'No veo el retorno de inversión'. ¿Cómo lo abordas?",
      "Dicen: 'Ahora no es el momento'. ¿Qué respuesta das?",
    ],
  },
  {
    category: "ocio",
    bankId: "example-ocio-bank",
    bankTitle: "Improvisación: Continúa la historia",
    bankIcon: "Sparkles",
    presetId: "example-ocio",
    presetName: "Ocio y creatividad · Improvisación",
    prepSec: 0,
    responseSec: 60,
    questions: [
      "Continúa la historia: 'Esa noche, la puerta del sótano estaba entornada y...'",
      "Sigue: 'Despertó sin recordar su nombre, pero en el espejo había un mensaje:...'",
      "Improvise: 'El último tren salía en cinco minutos y ella aún no había...'",
      "Continúa: 'Encontró el mapa dentro de un libro que nadie había abierto en años...'",
      "Sigue: 'La radio emitía una canción que nadie reconocía, y entonces...'",
    ],
  },
];

export function ensureExamples(): void {
  const db = read();
  let changed = false;
  for (const ex of EXAMPLES) {
    if (db.banks.some((b) => b.id === ex.bankId)) continue;
    const now = new Date().toISOString();
    db.banks.push({
      id: ex.bankId,
      user_id: EXAMPLE_USER,
      title: ex.bankTitle,
      is_public: true,
      icon: ex.bankIcon,
      created_at: now,
    });
    ex.questions.forEach((text, i) => {
      db.questions.push({
        id: `${ex.bankId}-q-${i + 1}`,
        bank_id: ex.bankId,
        text,
        order_index: i,
      });
    });
    db.presets.push({
      id: ex.presetId,
      user_id: EXAMPLE_USER,
      name: ex.presetName,
      bank_id: ex.bankId,
      questions_count: ex.questions.length,
      time_per_question_sec: ex.responseSec,
      is_random: true,
      category: ex.category,
      prep_sec: ex.prepSec,
      created_at: now,
    });
    const designByCategory: Record<string, string> = {
      idiomas: "design-aurora",
      entrevistas: "design-minimal",
      negocios: "design-ocean",
      ocio: "design-neon",
    };
    const sessionId = `example-session-${ex.category}`;
    if (!db.sessions.some((s) => s.id === sessionId)) {
      db.sessions.push({
        id: sessionId,
        user_id: EXAMPLE_USER,
        title: ex.presetName,
        source: { type: "bank", bankId: ex.bankId },
        designId: designByCategory[ex.category] ?? "design-aurora",
        prepSec: ex.prepSec,
        responseSec: ex.responseSec,
        count: ex.questions.length,
        isRandom: true,
        is_public: true,
        category: ex.category,
        created_at: now,
      });
    }
    changed = true;
  }
  if (changed) write(db);
}

export function getExamplePresets(): ReturnType<typeof getPresets> {
  const db = read();
  return EXAMPLES.map(
    (ex) => db.presets.find((p) => p.id === ex.presetId)!,
  ).filter(Boolean);
}

export function getBanks(userId: string): QuestionBank[] {
  return read()
    .banks.filter((b) => b.user_id === userId || b.is_public)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export function createBank(
  userId: string,
  title: string,
  isPublic: boolean,
  icon?: string,
): QuestionBank {
  const db = read();
  const bank: QuestionBank = {
    id: uid(),
    user_id: userId,
    title: title.trim() || "Banco sin título",
    is_public: isPublic,
    icon: icon,
    created_at: new Date().toISOString(),
  };
  db.banks.push(bank);
  write(db);
  return bank;
}

export function updateBank(
  bankId: string,
  patch: Partial<Pick<QuestionBank, "title" | "is_public" | "icon">>,
): void {
  const db = read();
  const bank = db.banks.find((b) => b.id === bankId);
  if (!bank) return;
  if (patch.title !== undefined) bank.title = patch.title.trim() || bank.title;
  if (patch.is_public !== undefined) bank.is_public = patch.is_public;
  if (patch.icon !== undefined) bank.icon = patch.icon;
  write(db);
}

export function deleteBank(bankId: string): void {
  const db = read();
  db.banks = db.banks.filter((b) => b.id !== bankId);
  db.questions = db.questions.filter((q) => q.bank_id !== bankId);
  db.presets = db.presets.filter((p) => p.bank_id !== bankId);
  write(db);
}

export function getQuestions(bankId: string): Question[] {
  return read()
    .questions.filter((q) => q.bank_id === bankId)
    .sort((a, b) => a.order_index - b.order_index);
}

export function addQuestion(bankId: string, text: string): Question {
  const db = read();
  const text2 = text.trim();
  if (!text2) throw new Error("La pregunta no puede estar vacía");
  const order = db.questions.filter((q) => q.bank_id === bankId).length;
  const q: Question = {
    id: uid(),
    bank_id: bankId,
    text: text2,
    order_index: order,
  };
  db.questions.push(q);
  write(db);
  return q;
}

export function updateQuestion(questionId: string, text: string): void {
  const db = read();
  const q = db.questions.find((x) => x.id === questionId);
  if (!q) return;
  const t = text.trim();
  if (t) q.text = t;
  write(db);
}

export function reorderQuestions(
  bankId: string,
  orderedIds: string[],
): void {
  const db = read();
  orderedIds.forEach((id, i) => {
    const q = db.questions.find(
      (x) => x.id === id && x.bank_id === bankId,
    );
    if (q) q.order_index = i;
  });
  write(db);
}

export function deleteQuestion(questionId: string): void {
  const db = read();
  const q = db.questions.find((x) => x.id === questionId);
  if (!q) return;
  db.questions = db.questions.filter((x) => x.id !== questionId);
  db.questions
    .filter((x) => x.bank_id === q.bank_id)
    .sort((a, b) => a.order_index - b.order_index)
    .forEach((x, i) => (x.order_index = i));
  write(db);
}

export function getPresets(userId: string): InterviewPreset[] {
  return read()
    .presets.filter((p) => p.user_id === userId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function getPreset(presetId: string): InterviewPreset | undefined {
  return read().presets.find((p) => p.id === presetId);
}

export function createPreset(
  userId: string,
  data: Omit<InterviewPreset, "id" | "user_id" | "created_at">,
): InterviewPreset {
  const db = read();
  const preset: InterviewPreset = {
    id: uid(),
    user_id: userId,
    created_at: new Date().toISOString(),
    ...data,
  };
  db.presets.push(preset);
  write(db);
  return preset;
}

export function updatePreset(
  presetId: string,
  patch: Partial<
    Pick<
      InterviewPreset,
      "name" | "bank_id" | "questions_count" | "time_per_question_sec" | "is_random"
    >
  >,
): void {
  const db = read();
  const p = db.presets.find((x) => x.id === presetId);
  if (!p) return;
  Object.assign(p, patch);
  write(db);
}

export function deletePreset(presetId: string): void {
  const db = read();
  db.presets = db.presets.filter((p) => p.id !== presetId);
  write(db);
}

export function getHistory(userId: string): SessionHistory[] {
  return read()
    .history.filter((h) => h.user_id === userId)
    .sort((a, b) => b.completed_at.localeCompare(a.completed_at));
}

export function addSession(
  userId: string,
  data: Omit<SessionHistory, "id" | "user_id" | "completed_at">,
): SessionHistory {
  const db = read();
  const session: SessionHistory = {
    id: uid(),
    user_id: userId,
    completed_at: new Date().toISOString(),
    ...data,
  };
  db.history.push(session);
  write(db);
  return session;
}

export function getDesigns(): Design[] {
  return [...read().designs];
}

export function getDesign(designId: string): Design | undefined {
  return read().designs.find((d) => d.id === designId);
}

export function createDesign(
  data: Omit<Design, "id">,
): Design {
  const db = read();
  const design: Design = { ...data, id: uid() };
  db.designs.push(design);
  write(db);
  return design;
}

export function updateDesign(
  designId: string,
  patch: Partial<Omit<Design, "id" | "isBuiltIn">>,
): void {
  const db = read();
  const d = db.designs.find((x) => x.id === designId);
  if (!d) return;
  Object.assign(d, patch);
  write(db);
}

export function deleteDesign(designId: string): void {
  const db = read();
  db.designs = db.designs.filter((d) => d.id !== designId);
  write(db);
}

export function getSessions(userId: string): Session[] {
  return read()
    .sessions.filter((s) => s.user_id === userId || s.is_public)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function getSession(sessionId: string): Session | undefined {
  return read().sessions.find((s) => s.id === sessionId);
}

export function createSession(
  userId: string,
  data: Omit<Session, "id" | "user_id" | "created_at">,
): Session {
  const db = read();
  const session: Session = {
    id: uid(),
    user_id: userId,
    created_at: new Date().toISOString(),
    ...data,
  };
  db.sessions.push(session);
  write(db);
  return session;
}

export function updateSession(
  sessionId: string,
  patch: Partial<
    Pick<
      Session,
      | "title"
      | "source"
      | "designId"
      | "prepSec"
      | "responseSec"
      | "count"
      | "isRandom"
    >
  >,
): void {
  const db = read();
  const s = db.sessions.find((x) => x.id === sessionId);
  if (!s) return;
  Object.assign(s, patch);
  write(db);
}

export function deleteSession(sessionId: string): void {
  const db = read();
  db.sessions = db.sessions.filter((s) => s.id !== sessionId);
  write(db);
}

const SEED_QUESTIONS = [
  "Cuéntame sobre ti y por qué te interesa este puesto.",
  "¿Cuál ha sido tu mayor logro profesional hasta ahora?",
  "Describe un momento en el que resolviste un conflicto en un equipo.",
  "¿Cómo manejas la presión y los plazos ajustados?",
  "Háblame de un proyecto del que te sientas especialmente orgulloso.",
  "¿Cuáles son tus principales fortalezas y áreas de mejora?",
  "Cuéntame sobre un error que cometiste y qué aprendiste de él.",
  "¿Dónde te ves profesionalmente en cinco años?",
  "¿Por qué deberíamos contratarte a ti y no a otro candidato?",
  "¿Qué preguntas tienes para nosotros sobre el rol o la empresa?",
];

export function seedIfEmpty(userId: string): void {
  const db = read();
  const hasBank = db.banks.some((b) => b.user_id === userId);
  if (hasBank) return;

  const bank: QuestionBank = {
    id: uid(),
    user_id: userId,
    title: "Entrevista general",
    is_public: false,
    icon: "ListChecks",
    created_at: new Date().toISOString(),
  };
  db.banks.push(bank);

  SEED_QUESTIONS.forEach((text, i) => {
    db.questions.push({
      id: uid(),
      bank_id: bank.id,
      text,
      order_index: i,
    });
  });

  const preset: InterviewPreset = {
    id: uid(),
    user_id: userId,
    bank_id: bank.id,
    name: "Entrevista rápida",
    questions_count: 5,
    time_per_question_sec: 60,
    is_random: false,
    created_at: new Date().toISOString(),
  };
  db.presets.push(preset);

  db.sessions.push({
    id: uid(),
    user_id: userId,
    title: "Entrevista general",
    source: { type: "bank", bankId: bank.id },
    designId: "design-aurora",
    prepSec: 0,
    responseSec: 60,
    count: 5,
    isRandom: false,
    is_public: false,
    created_at: new Date().toISOString(),
  });
  write(db);
}
