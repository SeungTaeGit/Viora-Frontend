// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

function ProtectedRoute() {
  const { isLoggedIn } = useAuthStore();

  // 로그인 상태가 아니면 로그인 페이지로 보냅니다.
  if (!isLoggedIn) {
    alert('로그인이 필요한 서비스입니다.');
    return <Navigate to="/login" replace />;
  }

  // 로그인 상태이면 요청된 페이지(자식 컴포넌트)를 보여줍니다.
  return <Outlet />;
}

export default ProtectedRoute;