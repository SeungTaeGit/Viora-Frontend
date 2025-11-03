import { Box, Button, TextField, Typography, Divider, Alert } from "@mui/material";
import { useLogin } from "../hooks/useLogin";
import GoogleIcon from '@mui/icons-material/Google';
import ChatIcon from '@mui/icons-material/Chat';

const BACKEND_URL = "http://localhost:8080";

function LoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  } = useLogin();

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 400,
        mx: 'auto'
      }}
    >
      <Typography component="h1" variant="h5">
        로그인
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
        <TextField
          margin="normal" required fullWidth
          id="email" label="이메일 주소" name="email"
          autoComplete="email" autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <TextField
          margin="normal" required fullWidth
          name="password" label="비밀번호" type="password"
          id="password" autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          type="submit" fullWidth variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? "로그인 중..." : "로그인"}
        </Button>

        <Divider sx={{ my: 2 }}>또는</Divider>

        <Button
          component="a"
          href={`${BACKEND_URL}/oauth2/authorization/google`}
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          sx={{ mb: 1 }}
          disabled={loading}
        >
          Google로 로그인
        </Button>

        <Button
          component="a"
          href={`${BACKEND_URL}/oauth2/authorization/kakao`}
          fullWidth
          variant="outlined"
          startIcon={<ChatIcon />}
          sx={{
            backgroundColor: '#FEE500',
            color: '#000000',
            '&:hover': { backgroundColor: '#F0D900' },
            mb: 1
          }}
          disabled={loading}
        >
          Kakao로 로그인
        </Button>
      </Box>
    </Box>
  );
}

export default LoginPage;