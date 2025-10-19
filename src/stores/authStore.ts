// src/stores/authStore.ts

import { create } from 'zustand';

// 관제실에서 관리할 상태와 행동 정의
interface AuthState {
  isLoggedIn: boolean; // 로그인 상태
  login: (token: string) => void; // 로그인 처리 액션
  logout: () => void; // 로그아웃 처리 액션
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false, // 초기 상태는 로그아웃
  login: (token) => {
    localStorage.setItem('accessToken', token); // 토큰 저장
    set({ isLoggedIn: true }); // 상태를 '로그인'으로 변경
  },
  logout: () => {
    localStorage.removeItem('accessToken'); // 토큰 삭제
    set({ isLoggedIn: false }); // 상태를 '로그아웃'으로 변경
  },
}));