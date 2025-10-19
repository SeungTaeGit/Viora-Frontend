// src/components/Header.tsx

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

function Header() {
  // 1. 중앙 관제실(authStore)에서 로그인 상태와 로그아웃 기능을 가져옵니다.
  const { isLoggedIn, logout } = useAuthStore();
  const navigate = useNavigate();

  // 2. 로그아웃 버튼을 클릭했을 때 실행될 함수
  const handleLogout = () => {
    logout(); // 스토어의 상태를 로그아웃으로 변경하고 localStorage에서 토큰 삭제
    alert("로그아웃 되었습니다.");
    navigate("/login"); // 로그인 페이지로 이동
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* 로고 (클릭하면 홈으로 이동) */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          Viora
        </Typography>

        {/* 3. 로그인 상태에 따라 다른 버튼들을 보여줍니다. */}
        {isLoggedIn ? (
          // 로그인 상태일 때 보여줄 메뉴
          <Box>
            <Button color="inherit" component={Link} to="/mypage">
              마이페이지
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              로그아웃
            </Button>
          </Box>
        ) : (
          // 로그아웃 상태일 때 보여줄 메뉴
          <Box>
            <Button color="inherit" component={Link} to="/login">
              로그인
            </Button>
            <Button color="inherit" component={Link} to="/signup">
              회원가입
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;