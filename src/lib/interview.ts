export function buildSession(
  questions: string[],
  count: number,
  isRandom: boolean,
): string[] {
  const pool = questions.map((q) => q.trim()).filter((q) => q.length > 0);
  if (pool.length === 0) return [];
  const source = isRandom
    ? [...pool].sort(() => Math.random() - 0.5)
    : pool;
  const total = Math.min(Math.max(count, 1), source.length);
  return source.slice(0, total);
}

export function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
