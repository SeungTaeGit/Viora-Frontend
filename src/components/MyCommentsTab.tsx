// src/components/MyCommentsTab.tsx (간략한 구조 예시)
import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Box, CircularProgress, Typography, List, ListItem, ListItemText, Pagination, Divider } from '@mui/material';
import { Link } from 'react-router-dom'; // 리뷰로 이동하는 링크 추가

interface CommentPage {
  content: CommentItemData[];
  totalPages: number;
  number: number;
}
interface CommentItemData { // 댓글 데이터 타입 정의
  id: number;
  text: string;
  reviewId: number; // 댓글이 달린 리뷰 ID (백엔드 응답에 포함되어야 함)
  reviewContentName: string; // 댓글이 달린 리뷰 이름 (백엔드 응답에 포함되어야 함)
  createdAt: string; // 작성일 추가
}

function MyCommentsTab() {
  const [commentPage, setCommentPage] = useState<CommentPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchMyComments = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/api/me/comments?page=${page}&size=10`); // 댓글은 10개씩
        setCommentPage(response.data);
      } catch (error) {
        console.error("내가 쓴 댓글을 불러오는 데 실패했습니다.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyComments();
  }, [page]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1);
  };

  if (loading) return <CircularProgress />;
  if (!commentPage || commentPage.content.length === 0) return <Typography>작성한 댓글이 없습니다.</Typography>;

  return (
    <Box>
      <List>
        {commentPage.content.map((comment) => (
          <Box key={comment.id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Typography variant="body2" color="text.secondary">
                    <Link to={`/reviews/${comment.reviewId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      '{comment.reviewContentName}' 리뷰에 남긴 댓글
                    </Link>
                     - {new Date(comment.createdAt).toLocaleDateString()} {/* 작성일 표시 */}
                  </Typography>
                }
                secondary={comment.text}
              />
            </ListItem>
            <Divider component="li" />
          </Box>
        ))}
      </List>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={commentPage.totalPages}
          page={page + 1}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
}

export default MyCommentsTab;