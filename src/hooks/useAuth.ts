import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/AuthService';
import axiosInstance from '@/api/axiosInstance';

export const useAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { isLoggedIn, user, isLoading, setUser, setLoading, logout: storeLogout } = useAuthStore();
  const router = useRouter();

  const login = async (token: string) => {
    localStorage.setItem('accessToken', token); //HTTP-only 쿠키에 저장 권장
    useAuthStore.setState({ isLoggedIn: true });

    try {
      const response = await axiosInstance.get('/api/users/me');
      setUser(response.data);
    } catch (error) {
      console.error('로그인 후 사용자 정보 로딩 실패', error);
      localStorage.removeItem('accessToken');
      useAuthStore.setState({ user: null, isLoggedIn: false });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    storeLogout();
    router.push('/login');
  };

  const signIn = async (email: string, password: string) => {
    try {
      const accessToken = await authService.signIn(email, password);
      await login(accessToken);
      return { success: true };
    } catch (error) {
      console.error('로그인 오류:', error);
      return { success: false, error: '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.' };
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    const result = await signIn(email, password);
    
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || '로그인에 실패했습니다.');
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    error,
    handleSubmit,
    isLoggedIn,
    user,
    isLoading,
    login,
    logout,
    signIn,
    setLoading,
  };
};