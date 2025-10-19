// src/components/CommentForm.tsx

import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

// 이 컴포넌트가 부모로부터 받아야 할 정보의 타입을 정의합니다.
interface CommentFormProps {
  reviewId: string; // 어떤 리뷰에 댓글을 달 것인지
  onCommentAdded: () => void; // 댓글 작성 성공 시 부모에게 알리는 함수
}

function CommentForm({ reviewId, onCommentAdded }: CommentFormProps) {
  // 1. 사용자가 입력하는 댓글 내용을 기억할 공간
  const [text, setText] = useState("");

  // 2. 폼 제출 시 실행될 함수
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim()) { // 내용이 비어있으면 전송하지 않음
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      // 3. 백엔드의 댓글 생성 API 호출
      await axiosInstance.post(`/api/reviews/${reviewId}/comments`, { text });

      alert("댓글이 작성되었습니다.");
      setText(""); // 입력창 비우기
      onCommentAdded(); // 4. 부모 컴포넌트에게 "댓글 추가됐어!" 라고 알림

    } catch (error) {
      console.error("댓글 작성 실패:", error);
      alert("댓글 작성에 실패했습니다.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField
        label="댓글을 입력하세요"
        multiline
        rows={4}
        fullWidth
        value={text}
        onChange={(e) => setText(e.target.value)}
        variant="outlined"
      />
      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 2, float: 'right' }}
      >
        댓글 작성
      </Button>
    </Box>
  );
}

export default CommentForm;