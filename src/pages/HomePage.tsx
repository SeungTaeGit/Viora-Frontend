// src/pages/HomePage.tsx

import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import ReviewCard from "../components/ReviewCard";
import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { useAuthStore } from "../stores/authStore";

// Review 타입 정의
interface Review {
  id: number;
  authorNickname: string;
  category: string;
  contentName: string;
  text: string;
  rating: number;
}

// 백엔드 API 응답 타입 (페이지 정보 포함) - 필요시 사용
// interface ReviewPage {
//   content: Review[];
//   totalPages: number;
//   number: number;
// }

function HomePage() {
  const [latestReviews, setLatestReviews] = useState<Review[]>([]);
  const [popularReviews, setPopularReviews] = useState<Review[]>([]);
  const [recommendedReviews, setRecommendedReviews] = useState<Review[]>([]);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(false); // 추천은 로그인 시 로딩 시작

  const { isLoggedIn, user } = useAuthStore();

  useEffect(() => {
    // --- 최신 리뷰 로딩 ---
    const fetchLatestReviews = async () => {
      setLoadingLatest(true); // 로딩 시작 명시
      try {
        const response = await axiosInstance.get("/api/reviews?page=0&size=5&sort=createdAt,desc"); // 정렬 조건 명시
        setLatestReviews(response.data.content);
      } catch (error) {
        console.error("최신 리뷰 로딩 실패:", error);
        setLatestReviews([]); // 실패 시 빈 배열로 초기화
      } finally {
        setLoadingLatest(false); // 로딩 종료 명시
      }
    };

    // --- 인기 리뷰 로딩 ---
    const fetchPopularReviews = async () => {
      setLoadingPopular(true); // 로딩 시작 명시
      try {
        const response = await axiosInstance.get("/api/reviews/popular?page=0&size=5");
        setPopularReviews(response.data.content);
      } catch (error) {
        console.error("인기 리뷰 로딩 실패:", error);
        setPopularReviews([]); // 실패 시 빈 배열로 초기화
      } finally {
        setLoadingPopular(false); // 로딩 종료 명시
      }
    };

    // --- 추천 리뷰 로딩 (로그인 시) ---
    const fetchRecommendedReviews = async () => {
      setLoadingRecommended(true);
      try {
        const response = await axiosInstance.get("/api/reviews/recommended");
        setRecommendedReviews(response.data);
      } catch (error) {
        console.error("추천 리뷰 로딩 실패:", error);
        setRecommendedReviews([]); // 실패 시 빈 배열로 초기화
      } finally {
        setLoadingRecommended(false);
      }
    };

    // --- 함수 호출 ---
    fetchLatestReviews(); // 최신 리뷰 호출
    fetchPopularReviews(); // 인기 리뷰 호출

    if (isLoggedIn) {
      fetchRecommendedReviews(); // 로그인 상태면 추천 리뷰 호출
    } else {
        setRecommendedReviews([]); // 로그아웃 상태면 추천 목록 비우기
        setLoadingRecommended(false); // 추천 로딩 상태 false로 설정
    }

  }, [isLoggedIn]); // 로그인 상태 변경 시 재실행

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

      {/* --- 추천 리뷰 섹션 (로그인 시) --- */}
      {isLoggedIn && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            🌟 {user?.nickname}님을 위한 추천 리뷰
          </Typography>
          {loadingRecommended ? (
            <CircularProgress />
          ) : recommendedReviews.length > 0 ? (
            recommendedReviews.map((review) => (
              <ReviewCard
                key={'recommended-' + review.id}
                id={review.id}
                authorNickname={review.authorNickname}
                category={review.category}
                contentName={review.contentName}
                text={review.text}
                rating={review.rating}
              />
            ))
          ) : (
            <Typography>추천 리뷰를 준비 중입니다.</Typography>
          )}
        </Box>
      )}

      {/* --- 최신 리뷰 섹션 --- */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ✨ 최신 리뷰
        </Typography>
        {/* ❗️ 로딩 상태와 데이터 유무를 정확히 확인합니다. ❗️ */}
        {loadingLatest ? (
          <CircularProgress />
        ) : latestReviews.length > 0 ? (
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
        {/* ❗️ 로딩 상태와 데이터 유무를 정확히 확인합니다. ❗️ */}
        {loadingPopular ? (
          <CircularProgress />
        ) : popularReviews.length > 0 ? (
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