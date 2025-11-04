import { likeRepository } from "../repositories/LikeRepository";
import type { LikerItem } from "../types/like.item";
import type { LikerModel } from "../types/like.model";

class LikeService {
  /**
   * (번역기) 백엔드 LikerModel -> UI용 LikerItem
   */
  private modelToItem(model: LikerModel): LikerItem {
    return {
      nickname: model.nickname,
    };
  }

  /**
   * 특정 리뷰를 '좋아요'한 사용자 목록 조회
   */
  async getLikersByReviewId(reviewId: string): Promise<LikerItem[]> {
    const responseModels = await likeRepository.getLikersByReviewId(reviewId);
    return responseModels.map(this.modelToItem);
  }

}

export const likeService = new LikeService();