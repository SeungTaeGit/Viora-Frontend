// src/App.tsx

import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import { useEffect } from "react";
import { useAuthStore } from "./stores/authStore";
import SignupPage from "./pages/SignupPage";
import ReviewDetailPage from "./pages/ReviewDetailPage";

function App() {
  const { login } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      login(token);
    }
  }, [login]);

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