import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import {
  Box,
  Container,
  Typography,
  Divider,
  List,
  CircularProgress,
} from "@mui/material";
import { useAuthStore } from "../stores/authStore";
import CommentForm from "../components/CommentForm";
import CommentItem from "../components/CommentItem"; // CommentItem을 import합니다.

// 백엔드로부터 받아올 리뷰 데이터의 타입 정의
interface Review {
  authorNickname: string;
  category: string;
  contentName: string;
  text: string;
  rating: number;
}

// 백엔드로부터 받아올 댓글 데이터의 타입 정의
interface Comment {
  id: number;
  authorNickname: string;
  text: string;
}

function ReviewDetailPage() {
  const { reviewId } = useParams<{ reviewId: string }>();
  const [review, setReview] = useState<Review | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  // 중앙 관제실(authStore)에서 로그인 상태와 앱 전체의 로딩 상태(isAuthLoading)를 가져옵니다.
  const { isLoggedIn, isLoading: isAuthLoading } = useAuthStore();

  // 댓글 목록을 다시 불러오는 함수
  const fetchComments = async () => {
    if (!reviewId) return;
    try {
      const response = await axiosInstance.get(
        `/api/reviews/${reviewId}/comments`
      );
      setComments(response.data.content);
    } catch (error) {
      console.error("댓글을 불러오는 데 실패했습니다.", error);
    }
  };

  // 페이지가 처음 로딩될 때 리뷰와 댓글 데이터를 가져옵니다.
  useEffect(() => {
    const fetchReviewDetail = async () => {
      if (!reviewId) return;
      try {
        const response = await axiosInstance.get(`/api/reviews/${reviewId}`);
        setReview(response.data);
      } catch (error) {
        console.error("리뷰 상세 정보를 불러오는 데 실패했습니다.", error);
      }
    };

    fetchReviewDetail();
    fetchComments();
  }, [reviewId]); // reviewId가 바뀔 때마다 데이터를 새로고침

  // 앱의 사용자 정보 또는 이 페이지의 리뷰 정보 로딩이 끝나지 않았다면 로딩 화면을 보여줍니다.
  if (isAuthLoading || !review) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* 리뷰 내용 */}
      <Typography variant="h4" gutterBottom>
        {review.contentName}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {review.category}
      </Typography>
      <Typography variant="h5" sx={{ mt: 2 }}>
        "{review.text}"
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, mb: 2 }}>
        <Typography color="text.secondary">by {review.authorNickname}</Typography>
        <Typography variant="h6">⭐ {review.rating} / 5</Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* 댓글 목록 */}
      <Typography variant="h5" gutterBottom>
        댓글 ({comments.length}개)
      </Typography>
      <List>
        {comments.map((comment) => (
          // 복잡한 로직 대신 CommentItem 컴포넌트를 사용합니다.
          <CommentItem
            key={comment.id}
            comment={comment}
            onCommentUpdated={fetchComments} // 수정/삭제 시 목록 새로고침을 위한 함수 전달
          />
        ))}
      </List>

      {/* 댓글 작성 폼 */}
      {isLoggedIn && reviewId && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            댓글 작성하기
          </Typography>
          <CommentForm reviewId={reviewId} onCommentAdded={fetchComments} />
        </Box>
      )}
    </Container>
  );
}

export default ReviewDetailPage;