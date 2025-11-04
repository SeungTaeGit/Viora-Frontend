import axiosInstance from "../api/axiosInstance";
import type { LikerModel } from "../types/like.model";

class LikeRepository {
  /**
   * 특정 리뷰를 '좋아요'한 사용자 목록 조회
   */
  async getLikersByReviewId(reviewId: string): Promise<LikerModel[]> {
    const response = await axiosInstance.get<LikerModel[]>(`/api/reviews/${reviewId}/likers`);
    return response.data;
  }

  // TODO: 좋아요 추가, 취소 API 호출 메서드 추가
}

export const likeRepository = new LikeRepository();