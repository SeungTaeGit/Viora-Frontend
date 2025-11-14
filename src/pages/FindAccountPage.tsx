import { useState } from 'react';
import { Container, Typography, Box, Tabs, Tab, TextField, Button } from '@mui/material';
import axiosInstance from '../api/axiosInstance';

function FindAccountPage() {
  const [tab, setTab] = useState(0);

  // 이메일 찾기 상태
  const [nickname, setNickname] = useState('');
  const [foundEmail, setFoundEmail] = useState('');

  // 비밀번호 찾기 상태
  const [resetEmail, setResetEmail] = useState('');
  const [resetNickname, setResetNickname] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleFindEmail = async () => {
    try {
      const response = await axiosInstance.post('/auth/find-email', { nickname });
      setFoundEmail(response.data); // 마스킹된 이메일
      alert(`회원님의 이메일은 ${response.data} 입니다.`);
    } catch (error) {
      alert('사용자를 찾을 수 없습니다.');
    }
  };

  const handleResetPassword = async () => {
    try {
      await axiosInstance.post('/auth/reset-password', {
        email: resetEmail,
        nickname: resetNickname,
        newPassword: newPassword
      });
      alert('비밀번호가 변경되었습니다. 로그인해주세요.');
      // 로그인 페이지로 이동 로직 추가
    } catch (error) {
      alert('정보가 일치하지 않거나 변경에 실패했습니다.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>계정 찾기</Typography>
      <Tabs value={tab} onChange={(e, v) => setTab(v)} centered>
        <Tab label="이메일 찾기" />
        <Tab label="비밀번호 재설정" />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {tab === 0 ? (
          <Box>
            <TextField label="닉네임" fullWidth value={nickname} onChange={(e) => setNickname(e.target.value)} />
            <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleFindEmail}>이메일 찾기</Button>
            {foundEmail && <Typography sx={{ mt: 2, textAlign: 'center' }}>이메일: {foundEmail}</Typography>}
          </Box>
        ) : (
          <Box>
            <TextField label="이메일" fullWidth margin="normal" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
            <TextField label="닉네임" fullWidth margin="normal" value={resetNickname} onChange={(e) => setResetNickname(e.target.value)} />
            <TextField label="새 비밀번호" type="password" fullWidth margin="normal" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleResetPassword}>비밀번호 변경</Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default FindAccountPage;