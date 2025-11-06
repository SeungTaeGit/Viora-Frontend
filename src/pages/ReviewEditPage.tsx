import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import {
  Box, Button, Container, TextField, Typography, Rating, CircularProgress,
  Select, MenuItem, InputLabel, FormControl,
  // ❗️ SelectChangeEvent import를 여기서 삭제했습니다.
} from '@mui/material';
import MapSelector from '../components/MapSelector';

// 임시 카테고리 목록
const REVIEW_CATEGORIES = [
  '맛집', '카페', '숙소', '여행지', '영화', '도서', '기타',
];

function ReviewEditPage() {
  const { reviewId } = useParams<{ reviewId: string }>();
  const [category, setCategory] = useState('');
  const [contentName, setContentName] = useState('');
  const [location, setLocation] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState<number | null>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  // ❗️ event의 타입을 'SelectChangeEvent' 대신 'any'로 변경하여 오류를 우회합니다.
  const handleCategoryChange = (event: any) => {
    setCategory(event.target.value as string);
  };

  // 기존 리뷰 데이터 불러오기
  useEffect(() => {
    const fetchReview = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/api/reviews/${reviewId}`);
        const { category, contentName, location, text, rating, imageUrl } = response.data;
        setCategory(category);
        setContentName(contentName);
        setLocation(location);
        setText(text);
        setRating(rating);
        setExistingImageUrl(imageUrl);
        setImagePreview(imageUrl);
      } catch (error) {
         console.error("리뷰 정보를 불러오는데 실패했습니다.", error);
         alert("리뷰 정보를 불러올 수 없습니다.");
         navigate(`/reviews/${reviewId}`);
      } finally {
        setLoading(false);
      }
    };
    if (reviewId) fetchReview();
  }, [reviewId, navigate]);

  // 이미지 파일 선택 핸들러
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // 폼 제출 (수정 로직)
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);

    let updatedImageUrl = existingImageUrl;

    try {
      // --- 1단계: '새로운' 이미지가 선택된 경우에만 업로드 ---
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadResponse = await axiosInstance.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        updatedImageUrl = uploadResponse.data.url;
      }

      // --- 2단계: 리뷰 수정 ---
      const reviewData = {
        category,
        contentName,
        location,
        text,
        rating,
        imageUrl: updatedImageUrl,
      };

      await axiosInstance.put(`/api/reviews/${reviewId}`, reviewData);
      alert('리뷰가 성공적으로 수정되었습니다.');
      navigate(`/reviews/${reviewId}`);

    } catch (error) {
      console.error('리뷰 수정 실패:', error);
      alert('리뷰 수정에 실패했습니다.');
    } finally {
      setIsUploading(false);
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
            새 파일 선택
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
          {isUploading ? "업로드 중..." : "수정 완료"}
        </Button>
      </Box>
    </Container>
  );
}

export default ReviewEditPage;