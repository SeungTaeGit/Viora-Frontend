// src/pages/SignupPage.tsx

import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState(""); // 1. 닉네임을 기억할 공간 추가
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // 2. 백엔드의 회원가입 API 호출
      await axiosInstance.post("/auth/signup", {
        email: email,
        password: password,
        nickname: nickname, // 3. 닉네임 정보 추가
      });

      alert("회원가입에 성공했습니다! 로그인 페이지로 이동합니다.");
      navigate("/login"); // 4. 성공 시 로그인 페이지로 이동

    } catch (error) {
      alert("회원가입에 실패했습니다. 이미 사용 중인 이메일일 수 있습니다.");
      console.error("회원가입 오류:", error);
    }
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography component="h1" variant="h5">
        회원가입
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* 5. 닉네임 입력창 추가 */}
        <TextField
          margin="normal"
          required
          fullWidth
          name="nickname"
          label="닉네임"
          type="text"
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          가입하기
        </Button>
      </Box>
    </Box>
  );
}

export default SignupPage;