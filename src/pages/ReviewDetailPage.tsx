import { useParams, Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Divider,
  List,
  CircularProgress,
  Button,
  Modal,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import CommentForm from "../components/CommentForm";
import CommentItem from "../components/CommentItem";
import LikeButton from "../components/LikeButton";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useReviewDetail } from "../hooks/useReviewDetail"; // ❗️ 훅 import

function ReviewDetailPage() {
  // ❗️ reviewId는 훅 내부에서도 필요하지만,
  // ❗️ CommentForm에 전달하기 위해 여기서도 가져옵니다.
  // ❗️ (더 좋은 방법은 훅이 reviewId도 반환하는 것입니다.)
  const { reviewId } = useParams<{ reviewId: string }>();

  // ❗️ 모든 로직을 훅에서 가져옵니다.
  const {
    review,
    comments,
    markerPosition, // ❗️ 훅에서 받은 마커 위치
    isLikersModalOpen,
    likersList,
    isLoadingLikers,
    loading,
    isLoggedIn,
    user,
    fetchComments,
    handleDeleteReview,
    handleOpenLikersModal,
    handleCloseLikersModal,
  } = useReviewDetail(); // ❗️ 훅 호출

  // ❗️ useEffect, useState, 로직 함수들이 모두 사라졌습니다.

  // 로딩 처리
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // 리뷰가 없는 경우
  if (!review) {
      return <Typography sx={{ p: 2 }}>해당 리뷰를 찾을 수 없습니다.</Typography>;
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* 리뷰 내용 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          {review.contentName}
        </Typography>
        {user?.nickname === review.authorNickname && (
          <Box>
            <Button size="small" sx={{ mr: 1 }} component={Link} to={`/reviews/${reviewId}/edit`}>
              수정
            </Button>
            <Button size="small" color="error" onClick={handleDeleteReview}>
              삭제
            </Button>
          </Box>
        )}
      </Box>
      <Typography variant="subtitle1" color="text.secondary">
        {review.category}
      </Typography>

      {/* 위치 정보 및 지도 */}
      {markerPosition && (
         <Box sx={{ width: '100%', height: '300px', mt: 2, mb: 2 }}>
           <Map center={markerPosition} style={{ width: "100%", height: "100%" }} level={3}>
             <MapMarker position={markerPosition} />
           </Map>
         </Box>
      )}
      <Typography variant="body2" color="text.secondary" gutterBottom>
        위치: {review.location || '정보 없음'}
      </Typography>

      <Typography variant="h5" sx={{ mt: 2 }}>
        "{review.text}"
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, mb: 2 }}>
        <Typography color="text.secondary">by {review.authorNickname}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ mr: 1 }}>⭐ {review.rating} / 5</Typography>
          <LikeButton
            reviewId={reviewId!}
            initialLikeCount={review.likeCount}
            initialIsLiked={review.isLiked}
          />
          <IconButton
            aria-label="view likers"
            onClick={handleOpenLikersModal}
            size="small"
            sx={{ ml: 0.5 }}
            disabled={isLoadingLikers}
          >
            <AccountCircleIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* 댓글 목록 */}
      <Typography variant="h5" gutterBottom>
        댓글 ({comments.length}개)
      </Typography>
      <List>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onCommentUpdated={fetchComments} // 훅에서 받은 함수 전달
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

      {/* '좋아요' 목록 모달 창 */}
      <Modal
        open={isLikersModalOpen}
        onClose={handleCloseLikersModal} // 훅에서 받은 함수 사용
        aria-labelledby="likers-modal-title"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="likers-modal-title" variant="h6" component="h2">
            좋아요 누른 사람
          </Typography>
          {isLoadingLikers ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List sx={{ mt: 2, maxHeight: 300, overflow: 'auto' }}>
              {likersList.length > 0 ? (
                 likersList.map((liker, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={liker.nickname} />
                  </ListItem>
                 ))
              ) : (
                <Typography sx={{ mt: 2 }}>좋아요를 누른 사람이 없습니다.</Typography>
              )}
            </List>
          )}
          <Button onClick={handleCloseLikersModal} sx={{ mt: 2 }}>닫기</Button>
        </Box>
      </Modal>

    </Container>
  );
}

export default ReviewDetailPage;

