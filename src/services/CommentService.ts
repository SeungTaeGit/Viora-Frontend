import { commentRepository } from "../repositories/CommentRepository";
import type { CommentItem, CommentPageItem } from "../types/comment.item";
import type { CommentModel, CommentPageModel } from "../types/comment.model";

class CommentService {
  /**
   * (번역기) 백엔드 CommentModel -> UI용 CommentItem
   */
  private modelToItem(model: CommentModel): CommentItem {
    return {
      id: model.id,
      authorNickname: model.authorNickname,
      text: model.text,
    };
  }

  /**
   * (번역기) 백엔드 Page<Model> -> UI용 Page<Item>
   */
  private modelPageToItemPage(modelPage: CommentPageModel): CommentPageItem {
    return {
      ...modelPage,
      content: modelPage.content.map(this.modelToItem),
    };
  }

  /**
   * 특정 리뷰의 댓글 목록 조회
   */
  async getCommentsByReviewId(reviewId: string): Promise<CommentPageItem> {
    const responseModel = await commentRepository.getCommentsByReviewId(reviewId);
    return this.modelPageToItemPage(responseModel);
  }

}

export const commentService = new CommentService();