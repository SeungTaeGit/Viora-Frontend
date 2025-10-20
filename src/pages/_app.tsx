import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuthStore } from '../stores/authStore';
import { Box, CircularProgress } from '@mui/material';
import theme from '@/assets/theme';

export default function App({ Component, pageProps }: AppProps) {
  const { login, setLoading, isLoading } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      login(token).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <main>
          <Component {...pageProps} />
        </main>
      </div>
    </ThemeProvider>
  );
}