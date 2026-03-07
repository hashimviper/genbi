import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (title: string, message: string) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: '1',
          title: 'Welcome to VisoryBI',
          message: 'Your workspace is ready. Start by importing data or choosing a template.',
          timestamp: new Date().toISOString(),
          read: false,
        },
        {
          id: '2',
          title: 'New Templates Available',
          message: '11+ industry templates are now available in the Templates page.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false,
        },
      ],
      addNotification: (title, message) =>
        set((state) => ({
          notifications: [
            {
              id: Date.now().toString(36) + Math.random().toString(36).slice(2),
              title,
              message,
              timestamp: new Date().toISOString(),
              read: false,
            },
            ...state.notifications,
          ],
        })),
      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      unreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    { name: 'visorybi-notifications' }
  )
);
