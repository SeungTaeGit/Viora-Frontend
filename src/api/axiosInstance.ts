import axios from 'axios';
// ❗️ import { useAuthStore }... 구문을 '완전히 삭제'합니다.

// 1. Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
});

// 2. 요청 인터셉터 (토큰 보내기)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. 응답 인터셉터 (401 에러 처리)
axiosInstance.interceptors.response.use(
  (response) => {
    return response; // 2xx 범위의 응답은 그대로 통과
  },
  (error) => {
    // ❗️ 401 (Unauthorized) 에러가 발생했을 때의 로직
    if (error.response && error.response.status === 401) {
      // ❗️ authStore를 직접 호출하는 대신, localStorage를 비웁니다.
      localStorage.removeItem('accessToken');
      
      // ❗️ 현재 요청이 로그인 페이지가 아닐 경우에만 alert/redirect 실행
      if (window.location.pathname !== '/login') {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        // window.location.href를 사용하면 앱 전체가 새로고침되며 authStore 상태도 초기화됩니다.
        window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
