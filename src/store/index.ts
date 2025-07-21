import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { User, DashboardData, ChatSession, Notification } from "@/types";

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

interface DashboardState {
  dashboardData: DashboardData | null;
  isLoading: boolean;
  setDashboardData: (data: DashboardData) => void;
  setLoading: (loading: boolean) => void;
}

//  Type definition for Message
type Message = {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  category?: "general" | "budgeting" | "investment" | "savings";
};

interface ChatState {
  activeChatSession: ChatSession | null;
  chatSessions: ChatSession[];
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
  setActiveChatSession: (session: ChatSession | null) => void;
  addChatSession: (session: ChatSession) => void;
  updateChatSession: (sessionId: string, session: Partial<ChatSession>) => void;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  setTyping: (typing: boolean) => void;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
}

// User Store
export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        setLoading: (isLoading) => set({ isLoading }),
        logout: () => set({ user: null, isAuthenticated: false }),
      }),
      {
        name: "fintar-user-storage",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: "user-store" }
  )
);

// Dashboard Store
export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set) => ({
      dashboardData: null,
      isLoading: false,
      setDashboardData: (dashboardData) => set({ dashboardData }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    { name: "dashboard-store" }
  )
);

// Chat Store
export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set, get) => ({
        activeChatSession: null,
        chatSessions: [],
        messages: [],
        isLoading: false,
        isTyping: false,
        setActiveChatSession: (activeChatSession) => set({ activeChatSession }),
        addChatSession: (session) => {
          const { chatSessions } = get();
          set({ chatSessions: [session, ...chatSessions] });
        },
        updateChatSession: (sessionId, sessionUpdate) => {
          const { chatSessions } = get();
          const updatedSessions = chatSessions.map((session) =>
            session.id === sessionId
              ? { ...session, ...sessionUpdate }
              : session
          );
          set({ chatSessions: updatedSessions });

          // Update active session if it's the one being updated
          const { activeChatSession } = get();
          if (activeChatSession && activeChatSession.id === sessionId) {
            set({
              activeChatSession: { ...activeChatSession, ...sessionUpdate },
            });
          }
        },
        addMessage: (message) => {
          const { messages } = get();
          set({ messages: [...messages, message] });
        },
        setLoading: (isLoading) => set({ isLoading }),
        setTyping: (isTyping) => set({ isTyping }),
      }),
      {
        name: "fintar-chat-storage",
        partialize: (state) => ({
          chatSessions: state.chatSessions.slice(0, 10), // Keep only last 10 sessions
          messages: state.messages.slice(-50), // Keep only last 50 messages
        }),
      }
    ),
    { name: "chat-store" }
  )
);

// Notification Store
export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      addNotification: (notification) => {
        const { notifications } = get();
        const newNotifications = [notification, ...notifications];
        const unreadCount = newNotifications.filter((n) => !n.read).length;
        set({ notifications: newNotifications, unreadCount });
      },
      markAsRead: (notificationId) => {
        const { notifications } = get();
        const updatedNotifications = notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        );
        const unreadCount = updatedNotifications.filter((n) => !n.read).length;
        set({ notifications: updatedNotifications, unreadCount });
      },
      markAllAsRead: () => {
        const { notifications } = get();
        const updatedNotifications = notifications.map((n) => ({
          ...n,
          read: true,
        }));
        set({ notifications: updatedNotifications, unreadCount: 0 });
      },
      removeNotification: (notificationId) => {
        const { notifications } = get();
        const updatedNotifications = notifications.filter(
          (n) => n.id !== notificationId
        );
        const unreadCount = updatedNotifications.filter((n) => !n.read).length;
        set({ notifications: updatedNotifications, unreadCount });
      },
    }),
    { name: "notification-store" }
  )
);
