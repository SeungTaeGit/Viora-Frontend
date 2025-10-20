// src/pages/LoginPage.tsx

import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // '페이지 이동' 전문가 import
import { useAuthStore } from '../stores/authStore'; // 관제실 import
import axiosInstance from '../api/axiosInstance'; // 새로운 axiosInstance import

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuthStore(); // 관제실의 login 기능 가져오기
  const navigate = useNavigate(); // '페이지 이동' 전문가를 불러옵니다.

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const accessToken = response.data.accessToken;

      // ❗️ 이제 이 login 함수가 토큰 저장, 사용자 정보 로딩까지 모두 처리합니다.
      await login(accessToken);

      alert('로그인에 성공했습니다!');
      navigate('/');
    } catch (error) {
      alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
      console.error("로그인 오류:", error);
    }
  };

  return (
      // ... (이하 JSX 코드는 이전과 동일)
      <Box
          sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
          }}
      >
          <Typography component="h1" variant="h5">
              로그인
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="이메일 주소"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="비밀번호"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
              >
                  로그인
              </Button>
          </Box>
      </Box>
  );
}

export default LoginPage;