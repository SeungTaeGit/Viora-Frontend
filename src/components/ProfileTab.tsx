import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Box, TextField, Button, CircularProgress, Typography } from '@mui/material';
import { useAuthStore } from '../stores/authStore';

interface UserProfile {
  email: string;
  nickname: string;
  profileImageUrl?: string | null; // Optional
  bio?: string | null; // Optional
}

function ProfileTab() {
  const { user, setUser } = useAuthStore(); // 전역 상태에서 사용자 정보 가져오기
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    nickname: '',
    profileImageUrl: '',
    bio: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData({
        nickname: user.nickname || '',
        profileImageUrl: user.profileImageUrl || '',
        bio: user.bio || '',
      });
      setLoading(false);
    } else {
        const fetchUser = async () => {
             try {
                const response = await axiosInstance.get('/api/users/me');
                setUser(response.data); // 스토어 업데이트
                setFormData({ // 폼 업데이트
                    nickname: response.data.nickname || '',
                    profileImageUrl: response.data.profileImageUrl || '',
                    bio: response.data.bio || '',
                });
             } catch (error) {
                console.error("내 정보 로딩 실패:", error);
             } finally {
                setLoading(false);
             }
        }
        fetchUser();
    }
  }, [user, setUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.put('/api/users/me', formData);
      setUser(response.data); // 성공 시 전역 상태도 업데이트
      alert('프로필이 수정되었습니다.');
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      alert('프로필 수정에 실패했습니다.');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, maxWidth: 'sm' }}>
      <Typography variant="h6" gutterBottom>프로필 수정</Typography>
      {/* 이메일은 보통 수정 불가 */}
      <TextField label="이메일" value={user?.email || ''} fullWidth margin="normal" disabled />
      <TextField
        label="닉네임"
        name="nickname"
        value={formData.nickname}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="프로필 이미지 URL"
        name="profileImageUrl"
        value={formData.profileImageUrl || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="한 줄 소개"
        name="bio"
        value={formData.bio || ''}
        onChange={handleChange}
        fullWidth
        multiline
        rows={3}
        margin="normal"
      />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        수정 완료
      </Button>
    </Box>
  );
}

export default ProfileTab;