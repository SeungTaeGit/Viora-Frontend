import axiosInstance from "../api/axiosInstance";
import type { CommentPageModel } from "../types/comment.model";

class CommentRepository {
  /**
   * 특정 리뷰의 댓글 목록 조회 (페이지네이션)
   */
  async getCommentsByReviewId(reviewId: string): Promise<CommentPageModel> {
    const response = await axiosInstance.get<CommentPageModel>(`/api/reviews/${reviewId}/comments`);
    return response.data;
  }

  // TODO: 댓글 작성, 수정, 삭제 API 호출 메서드 추가
}

export const commentRepository = new CommentRepository();