import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance'; // 1. axiosInstance import

interface UserProfile {
  email: string;
  nickname: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>; // 2. ❗️ login 함수를 Promise를 반환하도록 async로 변경
  logout: () => void;
  setUser: (user: UserProfile) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  isLoading: true,
  login: async (token) => { // 3. ❗️ async 함수로 변경
    localStorage.setItem('accessToken', token);
    set({ isLoggedIn: true });

    try {
      // 4. ❗️ 토큰으로 사용자 정보를 직접 가져옵니다.
      const response = await axiosInstance.get('/api/users/me');
      set({ user: response.data }); // 5. ❗️ 가져온 정보로 user 상태를 업데이트합니다.
    } catch (error) {
      console.error("로그인 후 사용자 정보 로딩 실패", error);
      // 실패 시 로그아웃 처리
      localStorage.removeItem('accessToken');
      set({ user: null, isLoggedIn: false });
    }
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    set({ user: null, isLoggedIn: false });
  },
  setUser: (user) => {
    set({ user });
  },
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));