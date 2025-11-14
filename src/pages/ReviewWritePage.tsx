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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
} from '@mui/material';
import MapSelector from '../components/MapSelector';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import type { SelectChangeEvent } from '@mui/material';

// 임시 카테고리 목록
const REVIEW_CATEGORIES = [
  '맛집', '카페', '숙소', '여행지', '영화', '도서', '기타',
];

function ReviewWritePage() {
  const [category, setCategory] = useState('');
  const [contentName, setContentName] = useState('');
  const [location, setLocation] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState<number | null>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  const handleCategoryChange = (event: any) => {
    setCategory(event.target.value as string);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);

    let uploadedImageUrl: string | null = null;

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadResponse = await axiosInstance.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        uploadedImageUrl = uploadResponse.data.url;
      }

      // 2단계: 리뷰 텍스트 데이터와 이미지 URL을 함께 백엔드에 전송
      const reviewData = {
        category,
        contentName,
        location,
        text,
        rating,
        imageUrl: uploadedImageUrl,
      };

      const response = await axiosInstance.post('/api/reviews', reviewData);

      alert('리뷰가 성공적으로 작성되었습니다.');
      const newReviewId = response.data;
      navigate(`/reviews/${newReviewId}`);

    } catch (error) {
      console.error('리뷰 작성 실패:', error);
      alert('리뷰 작성에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography component="h1" variant="h5">리뷰 작성하기</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>

        <Box sx={{ mb: 2, border: '1px dashed grey', p: 2, borderRadius: 1, textAlign: 'center' }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<PhotoCamera />}
          >
            사진 첨부
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
          {/* 이미지 미리보기 */}
          {imagePreview && (
            <Box sx={{ mt: 2 }}>
              <img src={imagePreview} alt="미리보기" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
            </Box>
          )}
        </Box>

        <FormControl fullWidth required margin="normal">
          <InputLabel id="category-select-label">카테고리</InputLabel>
          <Select
            labelId="category-select-label"
            value={category}
            label="카테고리"
            onChange={handleCategoryChange}
            name="category"
          >
            {REVIEW_CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="콘텐츠 이름" fullWidth required margin="normal"
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

        <Button
          type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}
          disabled={isUploading}
        >
          {isUploading ? <CircularProgress size={24} /> : '작성 완료'}
        </Button>
      </Box>
    </Container>
  );
}

export default ReviewWritePage;