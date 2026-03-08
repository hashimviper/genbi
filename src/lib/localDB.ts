/**
 * VisoryBI Local Database Layer
 * Lightweight localStorage-based structured storage for:
 * - User credentials & sessions
 * - Collaboration requests
 * - Notifications
 * - Online presence
 *
 * Designed for static hosting (Vercel) with zero backend dependency.
 */

const DB_PREFIX = 'visorybi-db';

// ── Generic helpers ──────────────────────────────────────────────

function getCollection<T>(collection: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(`${DB_PREFIX}:${collection}`) || '[]');
  } catch {
    return [];
  }
}

function setCollection<T>(collection: string, data: T[]): void {
  localStorage.setItem(`${DB_PREFIX}:${collection}`, JSON.stringify(data));
}

function getRecord<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`${DB_PREFIX}:${key}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setRecord<T>(key: string, data: T): void {
  localStorage.setItem(`${DB_PREFIX}:${key}`, JSON.stringify(data));
}

function removeRecord(key: string): void {
  localStorage.removeItem(`${DB_PREFIX}:${key}`);
}

// ── Presence / Online Status ─────────────────────────────────────

export interface PresenceRecord {
  userId: string;
  username: string;
  lastSeen: string; // ISO timestamp
}

const PRESENCE_KEY = 'presence';
const PRESENCE_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes

export function updatePresence(userId: string, username: string): void {
  const records = getCollection<PresenceRecord>(PRESENCE_KEY);
  const now = new Date().toISOString();
  const idx = records.findIndex((r) => r.userId === userId);
  if (idx >= 0) {
    records[idx].lastSeen = now;
    records[idx].username = username;
  } else {
    records.push({ userId, username, lastSeen: now });
  }
  setCollection(PRESENCE_KEY, records);
}

export function removePresence(userId: string): void {
  const records = getCollection<PresenceRecord>(PRESENCE_KEY).filter(
    (r) => r.userId !== userId
  );
  setCollection(PRESENCE_KEY, records);
}

export function getOnlineUsers(): PresenceRecord[] {
  const records = getCollection<PresenceRecord>(PRESENCE_KEY);
  const cutoff = Date.now() - PRESENCE_TIMEOUT_MS;
  return records.filter((r) => new Date(r.lastSeen).getTime() > cutoff);
}

export function isUserOnline(username: string): boolean {
  return getOnlineUsers().some((r) => r.username === username);
}

// ── Collaboration Requests ───────────────────────────────────────

export interface CollabRequest {
  id: string;
  fromUser: string;
  toUser: string;
  dashboardId?: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

const COLLAB_KEY = 'collab-requests';

export function createCollabRequest(
  fromUser: string,
  toUser: string,
  message: string,
  dashboardId?: string
): CollabRequest {
  const request: CollabRequest = {
    id: crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2),
    fromUser,
    toUser,
    dashboardId,
    message,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  const all = getCollection<CollabRequest>(COLLAB_KEY);
  all.unshift(request);
  setCollection(COLLAB_KEY, all);
  return request;
}

export function getCollabRequests(username?: string): CollabRequest[] {
  const all = getCollection<CollabRequest>(COLLAB_KEY);
  if (!username) return all;
  return all.filter((r) => r.toUser === username || r.fromUser === username);
}

export function updateCollabRequestStatus(
  id: string,
  status: 'accepted' | 'declined'
): void {
  const all = getCollection<CollabRequest>(COLLAB_KEY);
  const idx = all.findIndex((r) => r.id === id);
  if (idx >= 0) {
    all[idx].status = status;
    setCollection(COLLAB_KEY, all);
  }
}

// ── User Credentials (hashed-style local storage) ────────────────

export interface StoredUser {
  id: string;
  username: string;
  passwordHash: string; // simple base64 for demo — NOT production-grade
  role: 'admin' | 'editor' | 'viewer';
  createdAt: string;
}

const USERS_KEY = 'users';

function simpleHash(password: string): string {
  // Demo-grade obfuscation only — not cryptographically secure
  return btoa(password);
}

function verifyHash(password: string, hash: string): boolean {
  return btoa(password) === hash;
}

export function registerUser(
  username: string,
  password: string,
  role: 'admin' | 'editor' | 'viewer' = 'viewer'
): StoredUser | null {
  const users = getCollection<StoredUser>(USERS_KEY);
  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return null; // already exists
  }
  const user: StoredUser = {
    id: crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2),
    username,
    passwordHash: simpleHash(password),
    role,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  setCollection(USERS_KEY, users);
  return user;
}

export function authenticateUser(
  username: string,
  password: string
): StoredUser | null {
  const users = getCollection<StoredUser>(USERS_KEY);
  return (
    users.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        verifyHash(password, u.passwordHash)
    ) || null
  );
}

export function getAllUsers(): StoredUser[] {
  return getCollection<StoredUser>(USERS_KEY);
}

// ── Activity Log ─────────────────────────────────────────────────

export interface ActivityEntry {
  id: string;
  userId: string;
  username: string;
  action: string;
  target?: string;
  timestamp: string;
}

const ACTIVITY_KEY = 'activity-log';

export function logActivity(
  userId: string,
  username: string,
  action: string,
  target?: string
): void {
  const log = getCollection<ActivityEntry>(ACTIVITY_KEY);
  log.unshift({
    id: Date.now().toString(36),
    userId,
    username,
    action,
    target,
    timestamp: new Date().toISOString(),
  });
  // Keep last 200 entries
  if (log.length > 200) log.length = 200;
  setCollection(ACTIVITY_KEY, log);
}

export function getActivityLog(limit = 50): ActivityEntry[] {
  return getCollection<ActivityEntry>(ACTIVITY_KEY).slice(0, limit);
}

// ── Export all DB utilities ──────────────────────────────────────

export const localDB = {
  // Presence
  updatePresence,
  removePresence,
  getOnlineUsers,
  isUserOnline,
  // Collaboration
  createCollabRequest,
  getCollabRequests,
  updateCollabRequestStatus,
  // Users
  registerUser,
  authenticateUser,
  getAllUsers,
  // Activity
  logActivity,
  getActivityLog,
};
