import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { useHomePageData } from "../hooks/useHomePageData";
import ReviewCard from "../components/organisms/ReviewCard";

function HomePage() {
  const { 
    latestReviews, 
    popularReviews, 
    recommendedReviews, 
    loading, 
    isLoggedIn 
  } = useHomePageData();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

      {/* --- 추천 리뷰 섹션 (로그인 시) --- */}
      {isLoggedIn && recommendedReviews.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            🌟 {/** TODO: user?.nickname **/}님을 위한 추천 리뷰
          </Typography>
          {recommendedReviews.map((review) => (
            <ReviewCard
              key={'recommended-' + review.id}
              id={review.id}
              authorNickname={review.authorNickname}
              category={review.category}
              contentName={review.contentName}
              text={review.text}
              rating={review.rating}
              imageUrl={review.imageUrl}
            />
          ))}
        </Box>
      )}

      {/* --- 최신 리뷰 섹션 --- */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ✨ 최신 리뷰
        </Typography>
        {latestReviews.length > 0 ? (
          latestReviews.map((review) => (
            <ReviewCard
              key={'latest-' + review.id}
              id={review.id}
              authorNickname={review.authorNickname}
              category={review.category}
              contentName={review.contentName}
              text={review.text}
              rating={review.rating}
              imageUrl={review.imageUrl}
            />
          ))
        ) : (
          <Typography>최신 리뷰가 없습니다.</Typography>
        )}
      </Box>

      {/* --- 인기 리뷰 섹션 --- */}
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          🔥 인기 리뷰 (좋아요 순)
        </Typography>
        {popularReviews.length > 0 ? (
          popularReviews.map((review) => (
            <ReviewCard
              key={'popular-' + review.id}
              id={review.id}
              authorNickname={review.authorNickname}
              category={review.category}
              contentName={review.contentName}
              text={review.text}
              rating={review.rating}
              imageUrl={review.imageUrl}
            />
          ))
        ) : (
          <Typography>인기 리뷰가 없습니다.</Typography>
        )}
      </Box>
    </Container>
  );
}

export default HomePage;
