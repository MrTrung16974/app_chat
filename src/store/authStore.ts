import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import type { User } from '@/types/models';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const THEME_KEY = 'theme_mode';

export type ThemeMode = 'light' | 'dark';

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  themeMode: 'light',
  setThemeMode: async (mode) => {
    await AsyncStorage.setItem(THEME_KEY, mode);
    set({ themeMode: mode });
  },
  login: async (token, user) => {
    await AsyncStorage.multiSet([
      [TOKEN_KEY, token],
      [USER_KEY, JSON.stringify(user)],
    ]);
    set({ token, user, isAuthenticated: true });
  },
  logout: async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    set({ token: null, user: null, isAuthenticated: false });
  },
  restoreSession: async () => {
    const [[, token], [, userRaw], [, themeRaw]] = await AsyncStorage.multiGet([
      TOKEN_KEY,
      USER_KEY,
      THEME_KEY,
    ]);
    const user = userRaw ? (JSON.parse(userRaw) as User) : null;
    set({
      token: token ?? null,
      user,
      isAuthenticated: Boolean(token && user),
      themeMode: (themeRaw as ThemeMode) ?? 'light',
    });
  },
}));

export const getAuthToken = () => useAuthStore.getState().token;
