// src/pages/ReviewWritePage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Rating,
} from '@mui/material';
import MapSelector from '../components/MapSelector';

function ReviewWritePage() {
  const [category, setCategory] = useState('');
  const [contentName, setContentName] = useState('');
  const [location, setLocation] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState<number | null>(0);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post('/api/reviews', {
        category,
        contentName,
        location,
        text,
        rating,
      });
      alert('리뷰가 성공적으로 작성되었습니다.');
      const newReviewId = response.data; // 백엔드 응답에 따라 .id 등을 추가해야 할 수 있습니다.
      navigate(`/reviews/${newReviewId}`);
    } catch (error) {
      console.error('리뷰 작성 실패:', error);
      alert('리뷰 작성에 실패했습니다.');
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography component="h1" variant="h5">리뷰 작성하기</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          label="카테고리 (예: 맛집, 영화)"
          fullWidth
          required
          margin="normal"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <TextField
          label="콘텐츠 이름 (예: 제미니 파스타)"
          fullWidth
          required
          margin="normal"
          value={contentName}
          onChange={(e) => setContentName(e.target.value)}
        />

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>위치 선택</Typography>
        <Box sx={{ width: '100%', height: '400px', mb: 2 }}>
          <MapSelector onAddressSelect={(address) => setLocation(address)} />
        </Box>
        <TextField
          label="선택된 주소"
          fullWidth
          required
          margin="normal"
          value={location}
          InputProps={{ readOnly: true }}
        />

        <TextField
          label="리뷰 내용"
          fullWidth
          required
          multiline
          rows={8}
          margin="normal"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <Typography component="legend" sx={{ mt: 2 }}>별점</Typography>
        <Rating
          name="rating"
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          작성 완료
        </Button>
      </Box>
    </Container>
  );
}

export default ReviewWritePage;