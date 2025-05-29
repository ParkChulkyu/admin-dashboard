// app/hooks/useAuthStore.ts

import { create } from "zustand";

type User = {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
};

type AuthStore = {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,

  // 사용자 정보 저장
  setUser: (user) => set({ user }),

  // 토큰 저장
  setToken: (token) => {
    localStorage.setItem("token", token); // ⛳ 로컬 저장
    set({ token });
  },

  // 로그아웃 처리
  logout: () => {
    localStorage.removeItem("token"); // ⛳ 저장된 토큰 제거
    set({ user: null, token: null });
  },
}));
