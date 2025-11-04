// API에서 받아올 댓글 데이터 타입
export type CommentModel = {
  id: number;
  authorNickname: string;
  text: string;
};

// 댓글 페이지네이션 API 응답 타입
export type CommentPageModel = {
  content: CommentModel[];
  totalPages: number;
  number: number;
  // ...
};