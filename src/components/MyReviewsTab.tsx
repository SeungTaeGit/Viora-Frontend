import { Box, CircularProgress, Typography, Pagination } from '@mui/material';
import ReviewCard from './organisms/ReviewCard';
import { useMyReviews } from '../hooks/useMyReviews';

function MyReviewsTab() {
  const { reviewPage, loading, page, handlePageChange } = useMyReviews();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!reviewPage || reviewPage.content.length === 0) {
    return <Typography sx={{ p: 4 }}>작성한 리뷰가 없습니다.</Typography>;
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
          imageUrl={review.imageUrl}
        />
      ))}
      {/* 페이지네이션 UI */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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