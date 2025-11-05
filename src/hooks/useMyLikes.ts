import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import type { ReviewPageItem } from '../types/review.item';

export function useMyLikes() {
  const [reviewPage, setReviewPage] = useState<ReviewPageItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    const fetchLikedReviews = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get<ReviewPageItem>(`/api/me/liked-reviews`, {
          params: {
            page: page,
            size: pageSize,
            sort: 'id,desc'
          }
        });
        setReviewPage(response.data);
      } catch (error) {
        console.error("좋아요 한 리뷰를 불러오는 데 실패했습니다.", error);
        setReviewPage(null);
      } finally {
        setLoading(false);
      }
    };
    fetchLikedReviews();
  }, [page]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1);
  };

  return { reviewPage, loading, page, handlePageChange };
}