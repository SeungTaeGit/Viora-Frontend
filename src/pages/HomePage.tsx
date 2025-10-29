// src/pages/HomePage.tsx
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import ReviewCard from "../components/ReviewCard";
import { Box, Container, Typography, CircularProgress } from "@mui/material"; // CircularProgress 추가

// Review 타입 정의 (이전과 동일)
interface Review {
  id: number;
  authorNickname: string;
  category: string;
  contentName: string;
  text: string;
  rating: number;
}

function HomePage() {
  // ❗️ 상태 변수를 두 개로 나눕니다.
  const [latestReviews, setLatestReviews] = useState<Review[]>([]);
  const [popularReviews, setPopularReviews] = useState<Review[]>([]);
  const [loadingLatest, setLoadingLatest] = useState(true); // 최신 리뷰 로딩 상태
  const [loadingPopular, setLoadingPopular] = useState(true); // 인기 리뷰 로딩 상태

  useEffect(() => {
    // ❗️ 데이터를 가져오는 함수도 두 개로 분리합니다.
    const fetchLatestReviews = async () => {
      setLoadingLatest(true);
      try {
        // 최신순 API 호출 (기본 /api/reviews)
        const response = await axiosInstance.get("/api/reviews?page=0&size=5"); // 예시: 5개만 가져오기
        setLatestReviews(response.data.content);
      } catch (error) {
        console.error("최신 리뷰를 불러오는 데 실패했습니다.", error);
      } finally {
        setLoadingLatest(false);
      }
    };

    const fetchPopularReviews = async () => {
      setLoadingPopular(true);
      try {
        // 인기순 API 호출 (/api/reviews/popular)
        const response = await axiosInstance.get("/api/reviews/popular?page=0&size=5"); // 예시: 5개만 가져오기
        setPopularReviews(response.data.content);
      } catch (error) {
        console.error("인기 리뷰를 불러오는 데 실패했습니다.", error);
      } finally {
        setLoadingPopular(false);
      }
    };

    fetchLatestReviews();
    fetchPopularReviews();
  }, []); // 처음 한 번만 실행

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}> {/* maxWidth 변경 */}

      {/* --- 최신 리뷰 섹션 --- */}
      <Box sx={{ mb: 4 }}> {/* 섹션 간 마진 추가 */}
        <Typography variant="h4" component="h1" gutterBottom>
          ✨ 최신 리뷰
        </Typography>
        {loadingLatest ? (
          <CircularProgress />
        ) : latestReviews.length > 0 ? (
          latestReviews.map((review) => (
            <ReviewCard
              key={'latest-' + review.id} // key 값 중복 방지
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
        {loadingPopular ? (
          <CircularProgress />
        ) : popularReviews.length > 0 ? (
          popularReviews.map((review) => (
            <ReviewCard
              key={'popular-' + review.id} // key 값 중복 방지
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