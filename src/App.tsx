import { useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
import { useAuthStore } from './stores/authStore';
import axiosInstance from './api/axiosInstance';
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import SignupPage from "./pages/SignupPage";
import ReviewDetailPage from "./pages/ReviewDetailPage";
import ProtectedRoute from './components/ProtectedRoute';
import ReviewWritePage from './pages/ReviewWritePage';
import ReviewEditPage from './pages/ReviewEditPage';
import { Box, CircularProgress } from "@mui/material";
import MyPage from './pages/MyPage';
import AllReviewsPage from './pages/AllReviewsPage';

function App() {
  const { login, setUser, setLoading, isLoading } = useAuthStore();

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
          {/* 공개 경로 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reviews/:reviewId" element={<ReviewDetailPage />} />
          <Route path="/reviews" element={<AllReviewsPage />} />

          {/* 보호된 경로 (로그인 필요) */}
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