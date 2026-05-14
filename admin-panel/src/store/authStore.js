import { create } from 'zustand';

const TOKEN_KEY = 'admin_dashboard_token';
const USER_KEY = 'admin_dashboard_user';

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export const useAuthStore = create((set) => ({
  token: localStorage.getItem(TOKEN_KEY),
  user: readStoredUser(),
  login: ({ token, user }) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ token: null, user: null });
  }
}));
