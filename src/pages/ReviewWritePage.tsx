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
  // ❗️ SelectChangeEvent import를 여기서 삭제했습니다.
} from '@mui/material';
import MapSelector from '../components/MapSelector';

// 임시 카테고리 목록 (별도 파일로 분리하는 것이 좋습니다)
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

  // ❗️ event의 타입을 'SelectChangeEvent' 대신 'any'로 변경하여 오류를 우회합니다.
  const handleCategoryChange = (event: any) => {
    setCategory(event.target.value as string);
  };

  // 이미지 파일 선택 핸들러
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // 폼 제출 (2단계 로직)
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);

    let uploadedImageUrl = null;

    try {
      // --- 1단계: 이미지 업로드 (이미지가 선택된 경우) ---
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

      // --- 2단계: 리뷰 작성 ---
      const reviewData = {
        category,
        contentName,
        location,
        text,
        rating,
        imageUrl: uploadedImageUrl,
      };

      const reviewResponse = await axiosInstance.post('/api/reviews', reviewData);

      alert('리뷰가 성공적으로 작성되었습니다.');
      const newReviewId = reviewResponse.data;
      navigate(`/reviews/${newReviewId}`);

    } catch (error) {
      console.error('리뷰 작성/업로드 실패:', error);
      alert('리뷰 작성에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography component="h1" variant="h5">리뷰 작성하기</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>

        <FormControl fullWidth required margin="normal">
          <InputLabel id="category-select-label">카테고리</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={category}
            label="카테고리"
            onChange={handleCategoryChange} // ❗️ 'any' 타입으로 변경된 핸들러 연결
            name="category"
          >
            {REVIEW_CATEGORIES.map((categoryOption) => (
              <MenuItem key={categoryOption} value={categoryOption}>
                {categoryOption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="콘텐츠 이름" fullWidth required margin="normal" value={contentName} onChange={(e) => setContentName(e.target.value)} />
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>위치 선택</Typography>
        <Box sx={{ width: '100%', height: '400px', mb: 2 }}>
          <MapSelector onAddressSelect={(address) => setLocation(address)} />
        </Box>
        <TextField label="선택된 주소" fullWidth required margin="normal" value={location} InputProps={{ readOnly: true }} />

        <Box sx={{ mt: 2 }}>
          <Typography component="legend">사진 첨부 (선택)</Typography>
          <Button variant="outlined" component="label" sx={{ mt: 1 }}>
            파일 선택
            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
          </Button>
          {imagePreview && (
            <Box sx={{ mt: 2, border: '1px dashed grey', p: 1, width: '100%', maxWidth: '400px' }}>
              <Typography variant="caption">미리보기:</Typography>
              <img src={imagePreview} alt="미리보기" style={{ width: '100%', objectFit: 'cover' }} />
            </Box>
          )}
        </Box>

        <TextField label="리뷰 내용" fullWidth required multiline rows={8} margin="normal" sx={{ mt: 2 }} value={text} onChange={(e) => setText(e.target.value)} />
        <Typography component="legend" sx={{ mt: 2 }}>별점</Typography>
        <Rating name="rating" value={rating} onChange={(event, newValue) => { setRating(newValue); }} />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isUploading}
        >
          {isUploading ? "업로드 중..." : "작성 완료"}
        </Button>
      </Box>
    </Container>
  );
}

export default ReviewWritePage;