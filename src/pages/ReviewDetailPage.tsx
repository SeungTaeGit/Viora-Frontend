import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import {
  Box,
  Container,
  Typography,
  Divider,
  List,
  CircularProgress,
  Button,
} from "@mui/material";
import { useAuthStore } from "../stores/authStore";
import CommentForm from "../components/CommentForm";
import CommentItem from "../components/CommentItem";
import { Map, MapMarker } from "react-kakao-maps-sdk"; // 카카오 지도 컴포넌트

// 백엔드로부터 받아올 리뷰 데이터의 타입 정의
interface Review {
  authorNickname: string;
  category: string;
  contentName: string;
  location: string; // location 필드 추가
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
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading, isLoggedIn } = useAuthStore();
  const [review, setReview] = useState<Review | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null); // 지도 마커 위치 상태

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

        // 리뷰 로딩 성공 후, 주소를 좌표로 변환하여 마커 위치 설정
        if (response.data.location && window.kakao && window.kakao.maps && window.kakao.maps.services) {
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.addressSearch(response.data.location, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              setMarkerPosition({ lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) });
            } else {
              console.warn("주소를 좌표로 변환하는데 실패했습니다:", response.data.location);
              setMarkerPosition(null); // 실패 시 마커 위치 null로 설정
            }
          });
        } else {
             setMarkerPosition(null); // 주소가 없으면 마커 위치 null로 설정
        }
      } catch (error) {
        console.error("리뷰 상세 정보를 불러오는 데 실패했습니다.", error);
        setReview(null); // 에러 발생 시 review를 null로 설정
      }
    };

    fetchReviewDetail();
    fetchComments();
  }, [reviewId]);

  // 리뷰 삭제 처리 함수
  const handleDeleteReview = async () => {
    if (window.confirm("정말로 이 리뷰를 삭제하시겠습니까?")) {
      try {
        await axiosInstance.delete(`/api/reviews/${reviewId}`);
        alert("리뷰가 삭제되었습니다.");
        navigate("/"); // 삭제 성공 시 메인 페이지로 이동
      } catch (error) {
        alert("리뷰 삭제에 실패했습니다.");
        console.error("리뷰 삭제 오류:", error);
      }
    }
  };

  // 1. 앱의 사용자 정보 로딩이 아직 안 끝났거나,
  // 2. 이 페이지의 리뷰 정보 로딩이 아직 안 끝났다면 로딩 화면을 보여줍니다.
  // ❗️❗️ 이 if 문 안에 로딩 코드가 있어야 합니다. ❗️❗️
  if (isAuthLoading || review === undefined) { // review가 undefined인 초기 상태도 로딩으로 간주
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // 리뷰 데이터 로딩 실패 시 (null) 에러 메시지 표시
  if (review === null) {
      return <Typography sx={{ p: 2 }}>리뷰 정보를 불러오는데 실패했거나 해당 리뷰가 없습니다.</Typography>;
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
        <Typography variant="h6">⭐ {review.rating} / 5</Typography>
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
            onCommentUpdated={fetchComments}
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