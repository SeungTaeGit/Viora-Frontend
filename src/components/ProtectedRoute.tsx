import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Box, CircularProgress } from '@mui/material';

function ProtectedRoute() {
  const { isLoggedIn, isLoading } = useAuthStore();

  // 1. 자동 로그인 시도 중(로딩 중)이면, 잠시 기다리게 합니다.
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // 2. 로딩이 끝났는데, 로그인이 안 되어있으면 로그인 페이지로 쫓아냅니다.
  if (!isLoggedIn) {
    alert('로그인이 필요한 서비스입니다.');
    // `replace` 옵션은 뒤로가기 시 이 페이지로 다시 돌아오는 것을 방지합니다.
    return <Navigate to="/login" replace />;
  }

  // 3. 로딩이 끝났고, 로그인도 되어있다면 자식 페이지(요청한 페이지)를 보여줍니다.
  return <Outlet />;
}

export default ProtectedRoute;