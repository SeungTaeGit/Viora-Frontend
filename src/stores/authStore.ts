import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance'; // 사용자 정보 로딩을 위해 import

// 앱 전역에서 사용할 사용자 프로필 타입
type UserProfile = {
  email: string;
  nickname: string;
  profileImageUrl?: string | null;
  bio?: string | null;
};

// 스토어의 상태(State)와 행동(Actions) 타입 정의
type AuthState = {
  isLoggedIn: boolean;
  user: UserProfile | null;
  isLoading: boolean; // 앱 초기 로딩 상태
  login: (token: string) => Promise<void>;
  logout: () => void;
  setUser: (user: UserProfile) => void;
  setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  // --- 초기 상태 ---
  isLoggedIn: false,
  user: null,
  isLoading: true, // 앱이 처음 시작될 땐 항상 로딩 중 상태

  // --- 행동 (Actions) ---
  /**
   * 로그인 처리: 토큰을 받아 저장하고, 사용자 정보를 즉시 로드합니다.
   */
  login: async (token: string) => { // ❗️ token이 string
    localStorage.setItem('accessToken', token);
    set({ isLoggedIn: true });

    try {
      // --- ❗️ 여기가 수정 포인트입니다 ❗️ ---
      // axiosInstance의 인터셉터를 기다리지 않고,
      // 이 요청에만 '수동'으로 Authorization 헤더를 설정하여 보냅니다.
      const response = await axiosInstance.get('/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // --- 여기까지 ---

      // ❗️ 사용자 정보를 스토어에 저장합니다.
      set({ user: response.data });
    } catch (error) {
      console.error("로그인 후 사용자 정보 로딩 실패", error);
      // ❗️ 실패 시 (예: 유효하지 않은 토큰) 즉시 로그아웃 처리
      localStorage.removeItem('accessToken');
      set({ user: null, isLoggedIn: false });
    }
  },

  /**
   * 로그아웃 처리: 토큰과 사용자 정보를 모두 비웁니다.
   */
  logout: () => {
    localStorage.removeItem('accessToken');
    set({ user: null, isLoggedIn: false });
  },

  /**
   * (자동 로그인 시) 사용자 정보를 스토어에 설정합니다.
   */
  setUser: (user: UserProfile) => {
    set({ user });
  },

  /**
   * (자동 로그인 시) 앱 초기 로딩 상태를 변경합니다.
   */
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));

