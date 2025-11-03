import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { useHomePageData } from "../hooks/useHomePageData"; // 1. 방금 만든 훅 import
import ReviewCard from "../components/organisms/ReviewCard"; // 2. 아토믹 패턴에 맞게 organisms로 경로 변경 (예시)

// ❗️ Review, ReviewPage 타입 정의는 훅으로 이동했으므로 삭제

function HomePage() {
  // 3. ❗️ 모든 로직이 훅으로 분리되고, 필요한 데이터만 받아옵니다.
  const { 
    latestReviews, 
    popularReviews, 
    recommendedReviews, 
    loading, 
    isLoggedIn 
  } = useHomePageData();

  // ❗️ useEffect, useState, API 호출 로직이 모두 사라졌습니다.

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
      {isLoggedIn && recommendedReviews.length > 0 && ( // 4. isLoggedIn으로 렌더링 결정
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
