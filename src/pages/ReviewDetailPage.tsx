// src/pages/ReviewDetailPage.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { Box, Container, Typography, Divider, List, ListItem, ListItemText } from "@mui/material";

// 리뷰와 댓글의 데이터 타입을 정의합니다.
interface Review {
  authorNickname: string;
  category: string;
  contentName: string;
  text: string;
  rating: number;
}
interface Comment {
  id: number;
  authorNickname: string;
  text: string;
}

function ReviewDetailPage() {
  // 1. URL의 :reviewId 값을 가져옵니다.
  const { reviewId } = useParams<{ reviewId: string }>();

  // 2. 리뷰와 댓글 데이터를 기억할 공간을 만듭니다.
  const [review, setReview] = useState<Review | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    // 3. 리뷰 상세 정보 가져오기
    const fetchReviewDetail = async () => {
      try {
        const response = await axiosInstance.get(`/api/reviews/${reviewId}`);
        setReview(response.data);
      } catch (error) {
        console.error("리뷰 상세 정보를 불러오는 데 실패했습니다.", error);
      }
    };

    // 4. 리뷰에 달린 댓글 목록 가져오기
    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get(`/api/reviews/${reviewId}/comments`);
        setComments(response.data.content);
      } catch (error) {
        console.error("댓글을 불러오는 데 실패했습니다.", error);
      }
    };

    fetchReviewDetail();
    fetchComments();
  }, [reviewId]); // reviewId가 바뀔 때마다 데이터를 새로고침합니다.

  if (!review) {
    return <Typography>리뷰를 불러오는 중...</Typography>;
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
      {/* 리뷰 내용 */}
      <Typography variant="h4" gutterBottom>{review.contentName}</Typography>
      <Typography variant="subtitle1" color="text.secondary">{review.category}</Typography>
      <Typography variant="h5" sx={{ mt: 2 }}>"{review.text}"</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 2 }}>
        <Typography color="text.secondary">by {review.authorNickname}</Typography>
        <Typography variant="h6">⭐ {review.rating} / 5</Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* 댓글 목록 */}
      <Typography variant="h5" gutterBottom>댓글</Typography>
      <List>
        {comments.map((comment) => (
          <ListItem key={comment.id} alignItems="flex-start">
            <ListItemText
              primary={comment.authorNickname}
              secondary={comment.text}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default ReviewDetailPage;