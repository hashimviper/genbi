import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

// Static hardcoded organization members
export const STATIC_ORG = {
  name: 'VisoryBI Team',
  members: [
    { id: 'viper-001', username: 'Viper', role: 'admin' as UserRole, isOwner: true },
  ],
};

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;

  login: (username: string, role: UserRole) => void;
  logout: () => void;
  canEdit: () => boolean;
  canDelete: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,

      login: (username, role) => {
        const user: User = {
          id: `${username.toLowerCase()}-${Date.now().toString(36)}`,
          username,
          role,
        };
        set({ currentUser: user, isAuthenticated: true });
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },

      canEdit: () => {
        const { currentUser } = get();
        return currentUser?.role === 'admin' || currentUser?.role === 'editor';
      },

      canDelete: () => {
        const { currentUser } = get();
        return currentUser?.role === 'admin';
      },
    }),
    { name: 'visorybi-auth' }
  )
);
