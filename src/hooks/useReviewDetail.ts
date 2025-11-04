import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import axiosInstance from "../api/axiosInstance";

// ❗️ 'types' 폴더를 사용하지 않고, 이 파일에서 직접 타입을 정의하여
// ❗️ 'export' 오류 가능성을 원천 차단합니다.
// (나중에 src/types/review.item.ts 등으로 옮겨도 좋습니다)
interface Review {
  id: number;
  authorNickname: string;
  category: string;
  contentName: string;
  location: string;
  text: string;
  rating: number;
  likeCount: number;
  isLiked: boolean;
}

interface Comment {
  id: number;
  authorNickname: string;
  text: string;
}

interface CommentPage {
  content: Comment[];
  totalPages: number;
  number: number;
}

interface Liker {
  nickname: string;
}

export function useReviewDetail() {
  const { reviewId } = useParams<{ reviewId: string }>();
  const navigate = useNavigate();

  // 1. 상태 관리
  const { user, isLoggedIn, isLoading: isAuthLoading } = useAuthStore();
  const [review, setReview] = useState<Review | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true); // 이 페이지 자체의 로딩 상태
  const [isLikersModalOpen, setIsLikersModalOpen] = useState(false);
  const [likersList, setLikersList] = useState<Liker[]>([]);
  const [isLoadingLikers, setIsLoadingLikers] = useState(false);

  // 2. 비즈니스 로직 (함수)

  // 댓글 목록을 새로고침하는 함수 (공용)
  // useCallback: reviewId가 바뀌지 않는 한, 이 함수를 새로 만들지 않음
  const fetchComments = useCallback(async () => {
    if (!reviewId) return;
    try {
      // ❗️ axiosInstance를 훅에서 직접 호출
      const response = await axiosInstance.get<CommentPage>(
        `/api/reviews/${reviewId}/comments`
      );
      setComments(response.data.content);
    } catch (error) {
      console.error("댓글을 불러오는 데 실패했습니다.", error);
    }
  }, [reviewId]);

  // 리뷰 삭제 함수
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

  // '좋아요' 목록 모달을 여는 함수
  const handleOpenLikersModal = async () => {
    if (isLoadingLikers) return;
    setIsLoadingLikers(true);
    try {
      const response = await axiosInstance.get<Liker[]>(`/api/reviews/${reviewId}/likers`);
      setLikersList(response.data);
      setIsLikersModalOpen(true);
    } catch (error) {
      console.error("좋아요 목록을 불러오는 데 실패했습니다.", error);
      alert("좋아요 목록을 불러올 수 없습니다.");
    } finally {
      setIsLoadingLikers(false);
    }
  };

  // 모달 닫기 함수
  const handleCloseLikersModal = () => {
    setIsLikersModalOpen(false);
  };

  // 3. 데이터 페칭 (useEffect)
  useEffect(() => {
    const fetchReviewDetail = async () => {
      if (!reviewId) return;
      setLoading(true); // 이 페이지의 로딩 시작
      try {
        const response = await axiosInstance.get<Review>(`/api/reviews/${reviewId}`);
        setReview(response.data);
      } catch (error) {
        console.error("리뷰 상세 정보를 불러오는 데 실패했습니다.", error);
        setReview(null); // 에러 발생 시 review를 null로 설정
      } finally {
        setLoading(false); // 이 페이지의 로딩 종료
      }
    };

    fetchReviewDetail();
    fetchComments();
  }, [reviewId, fetchComments]); // reviewId가 바뀔 때마다 실행

  // 4. Page 컴포넌트에 필요한 모든 것을 반환
  return {
    reviewId,
    review,
    comments,
    markerPosition: null, // ❗️ MapSelector 리팩토링 시 이 부분도 수정 필요 (지금은 임시)
    isLikersModalOpen,
    likersList,
    isLoadingLikers,
    loading: isAuthLoading || loading, // 앱 로딩 또는 페이지 로딩 중 하나라도 true이면 true
    isLoggedIn,
    user,
    fetchComments,
    handleDeleteReview,
    handleOpenLikersModal,
    handleCloseLikersModal,
  };
}

