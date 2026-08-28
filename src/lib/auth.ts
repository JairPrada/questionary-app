import type { User } from "./types";
import { read, write } from "./db";

const KEY = "questionary-user";
const GUEST_KEY = "questionary-guest";

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function persist(user: User): User {
  try {
    localStorage.setItem(KEY, JSON.stringify(user));
  } catch {
    /* noop */
  }
  return user;
}

export function signIn(email: string): User {
  const db = read();
  const normalized = email.trim().toLowerCase();
  let user = db.users.find((u) => u.email.toLowerCase() === normalized);
  if (!user) {
    user = {
      id: uid(),
      email: normalized,
      created_at: new Date().toISOString(),
    };
    db.users.push(user);
    write(db);
  }
  return persist(user);
}

export function signUp(email: string): User {
  const db = read();
  const normalized = email.trim().toLowerCase();
  const existing = db.users.find((u) => u.email.toLowerCase() === normalized);
  if (existing) return signIn(email);
  const user: User = {
    id: uid(),
    email: normalized,
    created_at: new Date().toISOString(),
  };
  db.users.push(user);
  write(db);
  return persist(user);
}

export function signOut(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}

export function getOrCreateGuestId(): string {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    if (raw) return raw;
  } catch {
    /* noop */
  }
  const id = "guest-" + uid();
  try {
    localStorage.setItem(GUEST_KEY, id);
  } catch {
    /* noop */
  }
  return id;
}
