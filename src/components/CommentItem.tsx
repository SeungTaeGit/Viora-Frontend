import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { Box, ListItem, ListItemText, IconButton, TextField, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "../api/axiosInstance";

interface Comment {
  id: number;
  authorNickname: string;
  text: string;
}

interface CommentItemProps {
  comment: Comment;
  onCommentUpdated: () => void;
}

function CommentItem({ comment, onCommentUpdated }: CommentItemProps) {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);

  const handleDelete = async () => {
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      try {
        await axiosInstance.delete(`/api/comments/${comment.id}`);
        alert("댓글이 삭제되었습니다.");
        onCommentUpdated();
      } catch (error) {
        alert("댓글 삭제에 실패했습니다.");
      }
    }
  };

  const handleUpdate = async () => {
    try {
        await axiosInstance.put(`/api/comments/${comment.id}`, { text: editedText });
        alert("댓글이 수정되었습니다.");
        setIsEditing(false);
        onCommentUpdated();
    } catch (error) {
        alert("댓글 수정에 실패했습니다.");
    }
  };

  return (
    <ListItem
      alignItems="flex-start"
      secondaryAction={
        user?.nickname === comment.authorNickname ? (
          <>
            <IconButton edge="end" aria-label="edit" onClick={() => setIsEditing(true)}>
              <EditIcon />
            </IconButton>
            <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </>
        ) : null
      }
    >
      {isEditing ? (
        <Box sx={{ width: '100%' }}>
            <TextField
                fullWidth
                multiline
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
            />
            <Box sx={{ mt: 1, textAlign: 'right' }}>
                <Button onClick={() => setIsEditing(false)} sx={{ mr: 1 }}>취소</Button>
                <Button onClick={handleUpdate} variant="contained">저장</Button>
            </Box>
        </Box>
      ) : (
        <ListItemText
          primary={comment.authorNickname}
          secondary={comment.text}
        />
      )}
    </ListItem>
  );
}

export default CommentItem;