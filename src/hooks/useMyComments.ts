import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import type { CommentPageItem } from '../types/comment.item';

export function useMyComments() {
  const [commentPage, setCommentPage] = useState<CommentPageItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const fetchMyComments = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get<CommentPageItem>(`/api/me/comments`, {
          params: {
            page: page,
            size: pageSize,
            sort: 'createdAt,desc'
          }
        });
        setCommentPage(response.data);
      } catch (error) {
        console.error("내가 쓴 댓글을 불러오는 데 실패했습니다.", error);
        setCommentPage(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMyComments();
  }, [page]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1);
  };

  return { commentPage, loading, page, handlePageChange };
}