// UI 계층에서 사용할 댓글 데이터 타입
export type CommentItem = {
  id: number;
  authorNickname: string;
  text: string;
};

// 댓글 페이지네이션 타입
export type CommentPageItem = {
  content: CommentItem[];
  totalPages: number;
  number: number;
  // ... (필요한 다른 페이지 정보)
};