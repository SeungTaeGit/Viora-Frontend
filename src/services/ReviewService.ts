import { reviewRepository } from "../repositories/ReviewRepository";
import type { ReviewItem, ReviewPageItem } from "../types/review.item";
import type { ReviewModel, ReviewPageModel } from "../types/review.model";
import type { Pageable, SearchQuery } from "../types/page.ts";

class ReviewService {

  // '번역기': API 모델(Model)을 UI 아이템(Item)으로 변환
  private modelToItem(model: ReviewModel): ReviewItem {
    return {
      id: model.id,
      authorNickname: model.authorNickname,
      category: model.category,
      contentName: model.contentName,
      location: model.location,
      text: model.text,
      rating: model.rating,
      likeCount: model.likeCount,
      isLiked: model.isLiked,
    };
  }

  // '번역기' (페이지): API 페이지 모델을 UI 페이지 아이템으로 변환
  private modelPageToItemPage(modelPage: ReviewPageModel): ReviewPageItem {
    return {
      content: modelPage.content.map(this.modelToItem),
      totalPages: modelPage.totalPages,
      number: modelPage.number,
    };
  }

  /**
   * HomePage에서 필요한 모든 데이터를 한 번에 가져오는 로직
   */
  async getHomePageData(isLoggedIn: boolean) {
    const promisesToAwait: Promise<any>[] = [
      reviewRepository.getLatestReviews({ page: 0, size: 5 }),
      reviewRepository.getPopularReviews({ page: 0, size: 5 })
    ];

    if (isLoggedIn) {
      promisesToAwait.push(reviewRepository.getRecommendedReviews());
    }

    const responses = await Promise.all(promisesToAwait);

    const latestReviews = this.modelPageToItemPage(responses[0].data);
    const popularReviews = this.modelPageToItemPage(responses[1].data);

    let recommendedReviews: ReviewItem[] = [];
    if (isLoggedIn && responses[2]) {
      const recommendedData = responses[2].data as ReviewModel[];
      recommendedReviews = recommendedData.map(this.modelToItem);
    }

    return { latestReviews, popularReviews, recommendedReviews };
  }

  // --- ❗️ 여기에 새로운 메서드들을 추가합니다 ❗️ ---

  /**
   * 모든 리뷰 목록 조회 (AllReviewsPage용)
   */
  async getAllReviews(pageable: Pageable): Promise<ReviewPageItem> {
    const response = await reviewRepository.getAllReviews(pageable);
    return this.modelPageToItemPage(response.data);
  }

  /**
   * 리뷰 검색 (AllReviewsPage용)
   */
  async searchReviews(searchQuery: SearchQuery, pageable: Pageable): Promise<ReviewPageItem> {
    const response = await reviewRepository.searchReviews(searchQuery, pageable);
    return this.modelPageToItemPage(response.data);
  }
}

export const reviewService = new ReviewService();