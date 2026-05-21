import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
export interface AuthUser {
    id: number;
    name: string;
    email: string;
    avatar?: string;
}
interface AuthState {
    user: AuthUser | null;
    hasToken: boolean;
    isAuthenticated: boolean;
    isLoading: boolean;
    setAuth: (user: AuthUser) => void;
    clearAuth: () => void;
    setLoading: (loading: boolean) => void;
}
export const useAuthStore = create<AuthState>()(persist((set) => ({
    user: null,
    hasToken: false,
    isAuthenticated: false,
    isLoading: false,
    setAuth: (user) => set({ user, hasToken: true, isAuthenticated: true, isLoading: false }),
    clearAuth: () => set({ user: null, hasToken: false, isAuthenticated: false }),
    setLoading: (isLoading) => set({ isLoading }),
}), {
    name: 'auth-storage',
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state) => ({
        user: state.user,
        hasToken: state.hasToken,
        isAuthenticated: state.isAuthenticated,
    }),
}));
