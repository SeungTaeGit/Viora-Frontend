import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Box, CircularProgress, Typography, Pagination } from '@mui/material';
import ReviewCard from './ReviewCard';

interface ReviewPage {
  content: Review[];
  totalPages: number;
  number: number;
}
interface Review {
  id: number;
  authorNickname: string;
  category: string;
  contentName: string;
  text: string;
  rating: number;
}

function MyReviewsTab() {
  const [reviewPage, setReviewPage] = useState<ReviewPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchMyReviews = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/api/me/reviews?page=${page}&size=5`);
        setReviewPage(response.data);
      } catch (error) {
        console.error("내가 쓴 리뷰를 불러오는 데 실패했습니다.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyReviews();
  }, [page]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!reviewPage || reviewPage.content.length === 0) {
    return <Typography>작성한 리뷰가 없습니다.</Typography>;
  }

  return (
    <Box>
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
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={reviewPage.totalPages}
          page={page + 1}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
}

export default MyReviewsTab;