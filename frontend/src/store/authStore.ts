// ✅ authStore.ts
import { create } from "zustand";
import axios from "axios";

// ✅ 사용자 타입 정의
interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

// ✅ 상태 타입 정의
interface AuthState {
  user: User | null; // 로그인한 사용자 정보
  token: string | null; // 로그인 토큰
  setToken: (token: string) => void; // 토큰 저장 함수
  fetchUser: () => Promise<void>; // 사용자 정보 가져오기 함수
  logout: () => void; // 로그아웃 함수
}

// ✅ Zustand로 상태 생성
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,

  setToken: (token: string) => {
    localStorage.setItem("token", token);
    set(() => ({ token })); // 토큰 상태만 업데이트
  },

  fetchUser: async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: res.data }); // 사용자 상태 업데이트
    } catch {
      set({ user: null }); // 실패 시 사용자 초기화
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));
