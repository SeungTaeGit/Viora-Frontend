// src/pages/HomePage.tsx

import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import ReviewCard from "../components/ReviewCard"; // 1. 방금 만든 리뷰 카드 import
import { Box, Container, Typography } from "@mui/material";

// 백엔드에서 받아올 리뷰 데이터의 타입을 정의
interface Review {
  id: number;
  authorNickname: string;
  category: string;
  contentName: string;
  text: string;
  rating: number;
}

function HomePage() {
  // 2. 받아온 리뷰 목록을 기억할 공간
  const [reviews, setReviews] = useState<Review[]>([]);

  // 3. 페이지가 처음 렌더링될 때 딱 한 번 실행될 로직
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // 백엔드의 리뷰 목록 조회 API 호출 (페이지네이션 적용)
        const response = await axiosInstance.get("/api/reviews?page=0&size=10");
        setReviews(response.data.content); // 받아온 데이터(content 배열)를 기억 공간에 저장
      } catch (error) {
        console.error("리뷰를 불러오는 데 실패했습니다.", error);
      }
    };

    fetchReviews();
  }, []); // 빈 배열은 "처음 한 번만 실행"하라는 의미

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          모든 리뷰
        </Typography>
        {/* 4. 받아온 리뷰 목록을 순회하며 '리뷰 카드'를 하나씩 보여줌 */}
        {reviews.map((review) => (
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
    </Container>
  );
}

export default HomePage;