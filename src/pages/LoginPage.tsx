// src/pages/LoginPage.tsx

import { Box, Button, TextField, Typography, Divider } from "@mui/material"; // Divider 추가
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuthStore } from "../stores/authStore";
import GoogleIcon from '@mui/icons-material/Google'; // 구글 아이콘
import ChatIcon from '@mui/icons-material/Chat'; // 카카오 아이콘 (임시)

// 백엔드 서버의 기본 주소 (CORS 설정에 등록된 주소)
const BACKEND_URL = "http://localhost:8080";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      await login(response.data.accessToken); // authStore의 login 함수 호출
      alert("로그인에 성공했습니다!");
      navigate("/");
    } catch (error) {
      alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
      console.error("로그인 오류:", error);
    }
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 400, // 폼 너비 제한
        mx: 'auto' // 좌우 마진 자동으로 중앙 정렬
      }}
    >
      <Typography component="h1" variant="h5">
        로그인
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
        {/* ... (이메일, 비밀번호 TextField, 로그인 버튼은 동일) ... */}
        <TextField
          margin="normal" required fullWidth
          id="email" label="이메일 주소" name="email"
          autoComplete="email" autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="normal" required fullWidth
          name="password" label="비밀번호" type="password"
          id="password" autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit" fullWidth variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          로그인
        </Button>

        {/* --- ❗️ 여기가 추가된 부분입니다 ❗️ --- */}
        <Divider sx={{ my: 2 }}>또는</Divider>

        {/* Google 로그인 버튼 */}
        <Button
          component="a" // <a> 태그로 동작
          href={`${BACKEND_URL}/oauth2/authorization/google`} // 백엔드 인증 URL
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          sx={{ mb: 1 }}
        >
          Google로 로그인
        </Button>

        {/* Kakao 로그인 버튼 */}
        <Button
          component="a" // <a> 태그로 동작
          href={`${BACKEND_URL}/oauth2/authorization/kakao`} // 백엔드 인증 URL
          fullWidth
          variant="outlined"
          startIcon={<ChatIcon />} // 임시 카카오 아이콘
          sx={{ backgroundColor: '#FEE500', color: '#000000', '&:hover': { backgroundColor: '#F0D900' } }}
        >
          Kakao로 로그인
        </Button>
        {/* --- 여기까지 --- */}
      </Box>
    </Box>
  );
}

export default LoginPage;