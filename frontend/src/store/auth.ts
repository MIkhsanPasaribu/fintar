import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient, type User, type AuthResponse } from "@/lib/api-client";

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User) => void;
  updateUserProfile: (profile: Partial<User>) => void;

  // Getters
  getDisplayName: () => string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.login({ email, password });

          if (response.success && response.data) {
            const { user } = response.data;
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return true;
          } else {
            set({
              error: response.error || "Login failed",
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Login failed",
            isLoading: false,
          });
          return false;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.register(data);

          if (response.success && response.data) {
            const { user } = response.data;
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return true;
          } else {
            set({
              error: response.error || "Registration failed",
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Registration failed",
            isLoading: false,
          });
          return false;
        }
      },

      logout: () => {
        apiClient.logout();
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      updateUserProfile: (profileUpdates) => {
        const currentUser = get().user;
        if (currentUser && currentUser.profile) {
          set({
            user: {
              ...currentUser,
              profile: {
                ...currentUser.profile,
                ...profileUpdates,
              },
            },
          });
        }
      },

      // Getters
      getDisplayName: () => {
        const user = get().user;
        if (!user) return "Guest";

        const profile = user.profile;
        if (profile?.firstName && profile?.lastName) {
          return `${profile.firstName} ${profile.lastName}`;
        }

        if (profile?.firstName) {
          return profile.firstName;
        }

        return user.email.split("@")[0];
      },
    }),
    {
      name: "fintar-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Helper hooks
export const useAuth = () => {
  const authStore = useAuthStore();
  return {
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    error: authStore.error,
    login: authStore.login,
    register: authStore.register,
    logout: authStore.logout,
    clearError: authStore.clearError,
    displayName: authStore.getDisplayName(),
  };
};

export const useUser = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const updateUserProfile = useAuthStore((state) => state.updateUserProfile);

  return {
    user,
    setUser,
    updateUserProfile,
  };
};
