import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuthStore } from "../stores/authStore";

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
  imageUrl: string | null;
}

interface Comment {
  id: number;
  authorNickname: string;
  text: string;
}

interface Liker {
  nickname: string;
}

interface UseReviewDetailReturn {
    review: Review | null;
    comments: Comment[];
    isLikersModalOpen: boolean;
    isLoadingLikers: boolean;
    loading: boolean;
    isLoggedIn: boolean;
    user: { nickname: string; } | null;
    fetchComments: () => Promise<void>;
    handleDeleteReview: () => Promise<void>;
    handleOpenLikersModal: () => Promise<void>;
    handleCloseLikersModal: () => void;
    likersList: Liker[];
    markerPosition: { lat: number; lng: number } | null;
}

export function useReviewDetail(reviewId?: string): UseReviewDetailReturn {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading, isLoggedIn } = useAuthStore();

  const [review, setReview] = useState<Review | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);

  const [isLikersModalOpen, setIsLikersModalOpen] = useState(false);
  const [likersList, setLikersList] = useState<Liker[]>([]);
  const [isLoadingLikers, setIsLoadingLikers] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    if (!reviewId) return;
    try {
      const response = await axiosInstance.get(`/api/reviews/${reviewId}/comments`);
      setComments(response.data.content);
    } catch (error) {
      console.error("댓글을 불러오는 데 실패했습니다.", error);
    }
  }, [reviewId]);

  useEffect(() => {
    const fetchReviewDetail = async () => {
      if (!reviewId) {
        setIsPageLoading(false);
        return;
      }
      setIsPageLoading(true);
      try {
        const response = await axiosInstance.get<Review>(`/api/reviews/${reviewId}`);
        const reviewData = response.data;
        setReview(reviewData);

        if (reviewData.location) {
            if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
                const geocoder = new window.kakao.maps.services.Geocoder();
                geocoder.addressSearch(reviewData.location, (result, status) => {
                    if (status === window.kakao.maps.services.Status.OK) {
                        setMarkerPosition({ lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) });
                    } else {
                        setMarkerPosition(null);
                    }
                });
            } else {
                setMarkerPosition(null);
            }
        } else {
            setMarkerPosition(null);
        }

      } catch (error) {
        console.error("리뷰 상세 정보를 불러오는 데 실패했습니다.", error);
        setReview(null);
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchReviewDetail();
    fetchComments();
  }, [reviewId, fetchComments]);

  const handleDeleteReview = async () => {
      if (window.confirm("정말로 이 리뷰를 삭제하시겠습니까?")) {
          try {
              await axiosInstance.delete(`/api/reviews/${reviewId}`);
              alert("리뷰가 삭제되었습니다.");
              navigate("/");
          } catch (error) {
              alert("리뷰 삭제에 실패했습니다.");
          }
      }
  };

  const handleOpenLikersModal = async () => {
      if (!reviewId || isLoadingLikers) return;
      setIsLoadingLikers(true);
      try {
          const response = await axiosInstance.get<Liker[]>(`/api/reviews/${reviewId}/likers`);
          setLikersList(response.data);
          setIsLikersModalOpen(true);
      } catch (error) {
          alert("좋아요 목록을 불러올 수 없습니다.");
      } finally {
          setIsLoadingLikers(false);
      }
  };

  const handleCloseLikersModal = () => {
      setIsLikersModalOpen(false);
  };

  return {
    review,
    comments,
    markerPosition,
    isLikersModalOpen,
    likersList,
    isLoadingLikers,
    loading: isAuthLoading || isPageLoading,
    isLoggedIn,
    user,
    fetchComments,
    handleDeleteReview,
    handleOpenLikersModal,
    handleCloseLikersModal,
  };
}