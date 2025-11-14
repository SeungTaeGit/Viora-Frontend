import { useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
import { useAuthStore } from './stores/authStore';
import axiosInstance from './api/axiosInstance';
import { Box, CircularProgress } from "@mui/material";

// Layout & Middleware
import Header from "./components/Header";
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages (누구나 접근 가능)
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AllReviewsPage from './pages/AllReviewsPage';
import ReviewDetailPage from "./pages/ReviewDetailPage";
import OAuthRedirectPage from './pages/OAuthRedirectPage';
import FindAccountPage from "./pages/FindAccountPage";

// Protected Pages (로그인 필수)
import ReviewWritePage from './pages/ReviewWritePage';
import ReviewEditPage from './pages/ReviewEditPage';
import MyPage from './pages/MyPage';

function App() {
  const { login, setUser, setLoading, isLoading } = useAuthStore();

  // 앱 실행 시 자동 로그인 처리
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const fetchUser = async () => {
        try {
          const response = await axiosInstance.get('/api/users/me');
          setUser(response.data);
          login(token);
        } catch (error) {
          console.error("자동 로그인 실패. 토큰이 유효하지 않을 수 있습니다.", error);
          localStorage.removeItem("accessToken");
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Header />
      <main>
        <Routes>
          {/* --- 공개 경로 (누구나 접근 가능) --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reviews" element={<AllReviewsPage />} />
          <Route path="/reviews/:reviewId" element={<ReviewDetailPage />} />
          <Route path="/oauth-redirect" element={<OAuthRedirectPage />} />
          <Route path="/find-account" element={<FindAccountPage />} />

          {/* --- 보호된 경로 (로그인 필수) --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/write-review" element={<ReviewWritePage />} />
            <Route path="/reviews/:reviewId/edit" element={<ReviewEditPage />} />
            <Route path="/mypage" element={<MyPage />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;