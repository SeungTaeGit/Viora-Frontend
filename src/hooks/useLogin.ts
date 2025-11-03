import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { authService } from "../services/AuthService";
import type { AuthLoginItem } from "../types/auth.item";
import axios from "axios";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login: loginToStore } = useAuthStore();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const loginItem: AuthLoginItem = { email, password };
      const tokenItem = await authService.login(loginItem);
      await loginToStore(tokenItem.accessToken); // ❗️ 순수 '문자열' 토큰 전달

      alert("로그인에 성공했습니다!");
      navigate("/");
    } catch (err) {
      console.error("로그인 오류:", err);
      if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
        setError("이메일과 비밀번호를 확인해주세요.");
      } else {
        setError("로그인 중 알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  };
}