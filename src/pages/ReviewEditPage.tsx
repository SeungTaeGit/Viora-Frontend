import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import {
  Box, Button, Container, TextField, Typography, Rating, CircularProgress,
  Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import MapSelector from '../components/MapSelector';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

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
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

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

    let updatedImageUrl: string | null = existingImageUrl;

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadResponse = await axiosInstance.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        updatedImageUrl = uploadResponse.data.url;
      }

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

  const handleCategoryChange = (event: any) => {
    setCategory(event.target.value as string);
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}> <CircularProgress /> </Box>;
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography component="h1" variant="h5">리뷰 수정하기</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>

        {/* 11. 이미지 선택 및 미리보기 UI */}
        <Box sx={{ mb: 2, border: '1px dashed grey', p: 2, borderRadius: 1, textAlign: 'center' }}>
          <Button variant="outlined" component="label" startIcon={<PhotoCamera />}>
            사진 변경
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </Button>
          {/* - 새 이미지를 선택하면: imagePreview (새 미리보기)
            - 아니면: existingImageUrl (기존 이미지)
          */}
          {(imagePreview || existingImageUrl) && (
            <Box sx={{ mt: 2 }}>
              <img
                src={imagePreview || existingImageUrl || ''}
                alt="미리보기"
                style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
              />
            </Box>
          )}
        </Box>

        <FormControl fullWidth required margin="normal">
          <InputLabel id="category-select-label">카테고리</InputLabel>
          <Select
            labelId="category-select-label" value={category} label="카테고리"
            onChange={handleCategoryChange} name="category"
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
          {isUploading ? <CircularProgress size={24} /> : '수정 완료'}
        </Button>
      </Box>
    </Container>
  );
}

export default ReviewEditPage;