import { useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
import { useAuthStore } from './stores/authStore';
import axiosInstance from './api/axiosInstance';
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import SignupPage from "./pages/SignupPage";
import ReviewDetailPage from "./pages/ReviewDetailPage";
import { Box, CircularProgress } from "@mui/material";

function App() {
  const { login, setLoading, isLoading } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // 똑똑해진 login 함수를 호출하기만 하면 됩니다.
      login(token).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // 전역 로딩 상태일 때, 화면 전체에 로딩 스피너를 보여줌
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
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reviews/:reviewId" element={<ReviewDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;