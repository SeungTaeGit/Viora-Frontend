import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import {
  Box, Button, Container, TextField, Typography, Rating, CircularProgress,
  Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import MapSelector from '../components/MapSelector';

const REVIEW_CATEGORIES = [ '맛집', '카페', '숙소', '여행지', '영화', '도서', '기타' ];

function ReviewEditPage() {
  const { reviewId } = useParams<{ reviewId: string }>();
  const [category, setCategory] = useState('');
  const [contentName, setContentName] = useState('');
  const [location, setLocation] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // event 타입을 any로 변경
  const handleCategoryChange = (event: any) => {
    setCategory(event.target.value as string);
  };

  useEffect(() => {
    // ... (이전과 동일)
     const fetchReview = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/api/reviews/${reviewId}`);
        const { category, contentName, location, text, rating } = response.data;
        setCategory(category); setContentName(contentName); setLocation(location);
        setText(text); setRating(rating);
      } catch (error) {
        console.error("리뷰 정보를 불러오는데 실패했습니다.", error);
        alert("리뷰 정보를 불러올 수 없습니다."); navigate(`/reviews/${reviewId}`);
      } finally { setLoading(false); }
    };
    if (reviewId) { fetchReview(); }
  }, [reviewId, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // ... (이전과 동일)
     event.preventDefault();
    try {
      await axiosInstance.put(`/api/reviews/${reviewId}`, {
        category, contentName, location, text, rating,
      });
      alert('리뷰가 성공적으로 수정되었습니다.'); navigate(`/reviews/${reviewId}`);
    } catch (error) {
      console.error('리뷰 수정 실패:', error); alert('리뷰 수정에 실패했습니다.');
    }
  };

  if (loading) {
    // ... (이전과 동일)
     return ( <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}> <CircularProgress /> </Box> );
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography component="h1" variant="h5">리뷰 수정하기</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <FormControl fullWidth required margin="normal">
          <InputLabel id="category-select-label">카테고리</InputLabel>
          <Select
            labelId="category-select-label" id="category-select"
            value={category} label="카테고리"
            onChange={handleCategoryChange} // 이 부분은 그대로 둡니다.
            name="category"
          >
            {REVIEW_CATEGORIES.map((categoryOption) => (
              <MenuItem key={categoryOption} value={categoryOption}>
                {categoryOption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* ... 이하 코드는 동일 ... */}
         <TextField
          label="콘텐츠 이름 (예: 제미니 파스타)" fullWidth required margin="normal"
          value={contentName} onChange={(e) => setContentName(e.target.value)}
        />
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>위치 선택</Typography>
        <Box sx={{ width: '100%', height: '400px', mb: 2 }}>
          <MapSelector onAddressSelect={(address) => setLocation(address)} />
        </Box>
        <TextField
          label="선택된 주소" fullWidth required margin="normal"
          value={location} InputProps={{ readOnly: true }}
        />
        <TextField
          label="리뷰 내용" fullWidth required multiline rows={8} margin="normal"
          value={text} onChange={(e) => setText(e.target.value)}
        />
        <Typography component="legend" sx={{ mt: 2 }}>별점</Typography>
        <Rating
          name="rating" value={rating}
          onChange={(event, newValue) => { setRating(newValue); }}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          수정 완료
        </Button>
      </Box>
    </Container>
  );
}
export default ReviewEditPage;