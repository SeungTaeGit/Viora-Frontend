import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import {
  Box, Button, Container, TextField, Typography, Rating,
  Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import MapSelector from '../components/MapSelector';

const REVIEW_CATEGORIES = [ '맛집', '카페', '숙소', '여행지', '영화', '도서', '기타' ];

function ReviewWritePage() {
  const [category, setCategory] = useState('');
  const [contentName, setContentName] = useState('');
  const [location, setLocation] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState<number | null>(0);
  const navigate = useNavigate();

  // event 타입을 any로 변경
  const handleCategoryChange = (event: any) => {
    setCategory(event.target.value as string);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post('/api/reviews', {
        category, contentName, location, text, rating,
      });
      alert('리뷰가 성공적으로 작성되었습니다.');
      const newReviewId = response.data;
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
          작성 완료
        </Button>
      </Box>
    </Container>
  );
}
export default ReviewWritePage;