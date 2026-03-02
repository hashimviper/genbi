import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  createdAt: string;
}

interface AuthState {
  currentUser: User | null;
  users: User[];
  passwordHashes: Record<string, string>; // userId -> hash
  isAuthenticated: boolean;
  
  register: (username: string, email: string, password: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  getAllUsers: () => User[];
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateId(): string {
  return crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      passwordHashes: {},
      isAuthenticated: false,

      register: async (username, email, password, role = 'editor') => {
        const { users } = get();
        
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          return { success: false, error: 'Email already registered' };
        }
        if (password.length < 6) {
          return { success: false, error: 'Password must be at least 6 characters' };
        }

        const hash = await hashPassword(password);
        const user: User = {
          id: generateId(),
          username,
          email: email.toLowerCase(),
          role,
          createdAt: new Date().toISOString(),
        };

        set(state => ({
          users: [...state.users, user],
          passwordHashes: { ...state.passwordHashes, [user.id]: hash },
          currentUser: user,
          isAuthenticated: true,
        }));

        return { success: true };
      },

      login: async (email, password) => {
        const { users, passwordHashes } = get();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
          return { success: false, error: 'Invalid email or password' };
        }

        const hash = await hashPassword(password);
        if (passwordHashes[user.id] !== hash) {
          return { success: false, error: 'Invalid email or password' };
        }

        set({ currentUser: user, isAuthenticated: true });
        return { success: true };
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },

      updateUser: (userId, updates) => {
        set(state => ({
          users: state.users.map(u => u.id === userId ? { ...u, ...updates } : u),
          currentUser: state.currentUser?.id === userId ? { ...state.currentUser, ...updates } : state.currentUser,
        }));
      },

      deleteUser: (userId) => {
        set(state => {
          const newHashes = { ...state.passwordHashes };
          delete newHashes[userId];
          return {
            users: state.users.filter(u => u.id !== userId),
            passwordHashes: newHashes,
            currentUser: state.currentUser?.id === userId ? null : state.currentUser,
            isAuthenticated: state.currentUser?.id === userId ? false : state.isAuthenticated,
          };
        });
      },

      getAllUsers: () => get().users,
    }),
    { name: 'visorybi-auth' }
  )
);
