// src/pages/AllReviewsPage.tsx

import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Box, CircularProgress, Typography, Pagination, Container } from '@mui/material';
import ReviewCard from '../components/ReviewCard'; // ReviewCard 컴포넌트 import

// 백엔드 API 응답 타입 (페이지 정보 포함)
interface ReviewPage {
  content: Review[];
  totalPages: number;
  number: number; // 현재 페이지 번호 (0부터 시작)
}
interface Review {
  id: number;
  authorNickname: string;
  category: string;
  contentName: string;
  text: string;
  rating: number;
}

function AllReviewsPage() {
  const [reviewPage, setReviewPage] = useState<ReviewPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); // 현재 페이지 상태 (0부터 시작)
  const pageSize = 10; // 한 페이지에 보여줄 리뷰 개수

  useEffect(() => {
    const fetchAllReviews = async () => {
      setLoading(true);
      try {
        // 백엔드 API 호출 (최신순 정렬 기본값 사용)
        const response = await axiosInstance.get(`/api/reviews?page=${page}&size=${pageSize}&sort=createdAt,desc`);
        setReviewPage(response.data);
      } catch (error) {
        console.error("모든 리뷰를 불러오는 데 실패했습니다.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllReviews();
  }, [page]); // page 상태가 변경될 때마다 API 다시 호출

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1); // MUI Pagination은 1부터 시작, API는 0부터 시작
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        모든 리뷰 둘러보기
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
           <CircularProgress />
        </Box>
      ) : reviewPage && reviewPage.content.length > 0 ? (
        <>
          <Box sx={{ mt: 3 }}>
            {reviewPage.content.map((review) => (
              <ReviewCard
                key={review.id}
                id={review.id}
                authorNickname={review.authorNickname}
                category={review.category}
                contentName={review.contentName}
                text={review.text}
                rating={review.rating}
              />
            ))}
          </Box>
          {/* 페이지네이션 UI */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={reviewPage.totalPages}
              page={page + 1} // MUI Pagination은 1부터 시작
              onChange={handlePageChange}
              color="primary"
              showFirstButton // 처음 페이지 버튼
              showLastButton // 마지막 페이지 버튼
            />
          </Box>
        </>
      ) : (
        <Typography sx={{ mt: 3 }}>아직 작성된 리뷰가 없습니다.</Typography>
      )}
    </Container>
  );
}

export default AllReviewsPage;