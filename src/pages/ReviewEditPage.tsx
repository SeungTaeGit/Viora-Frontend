// src/pages/ReviewEditPage.tsx

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Rating,
  CircularProgress
} from '@mui/material';
import MapSelector from '../components/MapSelector';

function ReviewEditPage() {
  const { reviewId } = useParams<{ reviewId: string }>();
  const [category, setCategory] = useState('');
  const [contentName, setContentName] = useState('');
  const [location, setLocation] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReview = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/api/reviews/${reviewId}`);
        const { category, contentName, location, text, rating } = response.data;
        setCategory(category);
        setContentName(contentName);
        setLocation(location);
        setText(text);
        setRating(rating);
      } catch (error) {
        console.error("리뷰 정보를 불러오는데 실패했습니다.", error);
        alert("리뷰 정보를 불러올 수 없습니다.");
        navigate(`/reviews/${reviewId}`);
      } finally {
        setLoading(false);
      }
    };
    if (reviewId) {
      fetchReview();
    }
  }, [reviewId, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await axiosInstance.put(`/api/reviews/${reviewId}`, {
        category,
        contentName,
        location,
        text,
        rating,
      });
      alert('리뷰가 성공적으로 수정되었습니다.');
      navigate(`/reviews/${reviewId}`);
    } catch (error) {
      console.error('리뷰 수정 실패:', error);
      alert('리뷰 수정에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography component="h1" variant="h5">리뷰 수정하기</Typography>
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
          수정 완료
        </Button>
      </Box>
    </Container>
  );
}

export default ReviewEditPage;