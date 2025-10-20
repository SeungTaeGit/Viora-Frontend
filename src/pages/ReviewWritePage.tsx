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
import MapSelector from '../components/MapSelector'; // 카카오 지도 선택 컴포넌트

function ReviewWritePage() {
  const [category, setCategory] = useState('');
  const [contentName, setContentName] = useState('');
  const [location, setLocation] = useState(''); // 선택된 주소를 저장할 상태
  const [text, setText] = useState('');
  const [rating, setRating] = useState<number | null>(0);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // 백엔드는 생성된 리뷰의 ID를 반환해야 합니다.
      const response = await axiosInstance.post('/api/reviews', {
        category,
        contentName,
        location, // location 정보를 요청에 포함
        text,
        rating,
      });

      alert('리뷰가 성공적으로 작성되었습니다.');

      // 응답 데이터에서 새로 생성된 리뷰의 ID를 추출합니다.
      // 참고: 이 로직은 백엔드가 성공 시 { "id": newReviewId } 형태를 반환한다고 가정합니다.
      const newReviewId = response.data; // 백엔드 응답 형식에 따라 .id 등을 추가해야 할 수 있습니다.

      // 새로 생성된 리뷰의 상세 페이지로 이동합니다.
      navigate(`/reviews/${newReviewId}`);

    } catch (error) {
      console.error('리뷰 작성 실패:', error);
      alert('리뷰 작성에 실패했습니다.');
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography component="h1" variant="h5">
        리뷰 작성하기
      </Typography>
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

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          위치 선택
        </Typography>
        {/* 지도 컴포넌트를 렌더링하고, 주소가 선택될 때마다 location 상태를 업데이트합니다. */}
        <MapSelector onAddressSelect={(address) => setLocation(address)} />

        {/* 선택된 주소를 보여주는 읽기 전용 입력창 */}
        <TextField
          label="선택된 주소"
          fullWidth
          required
          margin="normal"
          value={location}
          InputProps={{ readOnly: true }} // 사용자가 직접 수정할 수 없도록 설정
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