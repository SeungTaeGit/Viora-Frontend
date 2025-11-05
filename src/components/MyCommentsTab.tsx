import { Box, CircularProgress, Typography, Pagination, List, Divider } from '@mui/material';
import { useMyComments } from '../hooks/useMyComments';
import CommentItem from './CommentItem';
import type { CommentItem as CommentItemType } from '../types/comment.item';

function MyCommentsTab() {
  const { commentPage, loading, page, handlePageChange } = useMyComments();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!commentPage || commentPage.content.length === 0) {
    return <Typography sx={{ p: 4 }}>작성한 댓글이 없습니다.</Typography>;
  }

  const dummyRefresh = () => {
    console.log("새로고침 기능이 필요하면 useMyComments 훅에서 구현해야 합니다.");
  };

  return (
    <Box>
      <List>
        {commentPage.content.map((comment: CommentItemType) => (
          <Box key={comment.id}>
             <CommentItem
                comment={comment}
                onCommentUpdated={dummyRefresh}
             />
             <Divider component="li" />
          </Box>
        ))}
      </List>
      {/* 페이지네이션 UI */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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