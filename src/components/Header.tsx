import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

function Header() {
  const { isLoggedIn, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    alert("로그아웃 되었습니다.");
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          Viora
        </Typography>

        {isLoggedIn ? (
          <Box>
            <Button color="inherit" component={Link} to="/write-review">
              리뷰 쓰기
            </Button>
            <Button color="inherit" component={Link} to="/mypage">
              마이페이지
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              로그아웃
            </Button>
          </Box>
        ) : (
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