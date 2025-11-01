// src/pages/OAuthRedirectPage.tsx

import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { Box, CircularProgress, Typography } from "@mui/material";

function OAuthRedirectPage() {
  // 1. URL의 쿼리 파라미터( ?token=... )를 읽어옵니다.
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    // 2. 'token'이라는 이름의 파라미터 값을 가져옵니다.
    const token = searchParams.get("token");

    if (token) {
      // 3. 토큰이 있다면, authStore의 login 함수를 호출합니다.
      // (login 함수는 토큰 저장, 사용자 정보 로딩을 모두 처리합니다.)
      login(token)
        .then(() => {
          // 4. 모든 처리가 끝나면 메인 페이지로 이동합니다.
          navigate("/");
        })
        .catch(() => {
          // 5. 실패 시 로그인 페이지로 보냅니다.
          alert("로그인 처리에 실패했습니다.");
          navigate("/login");
        });
    } else {
      // 토큰이 없이 이 페이지에 접근한 경우
      alert("잘못된 접근입니다.");
      navigate("/login");
    }
  }, [searchParams, login, navigate]);

  // 사용자에게는 로딩 중임을 보여줍니다.
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>로그인 중입니다...</Typography>
    </Box>
  );
}

export default OAuthRedirectPage;