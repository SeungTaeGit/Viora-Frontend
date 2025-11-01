import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { authService } from "../services/AuthService";
// import { AuthLoginItem } from "../types/auth.item";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login: loginToStore } = useAuthStore(); // 스토어의 login 함수

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const loginItem: AuthLoginItem = { email, password };
      
      // 1. Service에 로직 실행 요청 (tokenItem 객체를 받음)
      const tokenItem = await authService.login(loginItem);

      // 2. ❗️ tokenItem 객체에서 'accessToken' 문자열만 꺼냅니다.
      const tokenString = tokenItem.accessToken;

      // 3. ❗️ 스토어에는 순수 '문자열' 토큰만 전달합니다.
      await loginToStore(tokenString); 

      alert("로그인에 성공했습니다!");
      navigate("/"); // 메인 페이지로 이동

    } catch (err) {
      console.error("로그인 오류:", err);
      setError("이메일과 비밀번호를 확인해주세요.");
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
