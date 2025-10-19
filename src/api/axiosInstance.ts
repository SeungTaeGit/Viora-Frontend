// src/api/axiosInstance.ts

import axios from 'axios';

// 1. Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // 백엔드 API의 기본 URL
});

// 2. 요청 인터셉터 설정
axiosInstance.interceptors.request.use(
  (config) => {
    // localStorage에서 토큰을 가져옵니다.
    const token = localStorage.getItem('accessToken');

    // 토큰이 존재하면 Authorization 헤더에 추가합니다.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;