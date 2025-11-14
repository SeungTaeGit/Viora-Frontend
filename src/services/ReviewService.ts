import { reviewRepository } from "../repositories/ReviewRepository";
import type { ReviewPageModel, ReviewModel } from "../types/review.model";
import type { ReviewPageItem, ReviewItem } from "../types/review.item";
import type { Pageable, SearchQuery } from "../types/page";

class ReviewService {

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
      imageUrl: model.imageUrl,
    };
  }

  private modelPageToItemPage(model: ReviewPageModel): ReviewPageItem {
    return {
      content: model.content.map(this.modelToItem),
      totalPages: model.totalPages,
      number: model.number,
    };
  }

// --- HomePage ---

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
      // 추천 리뷰 API가 List<ReviewModel>을 반환한다고 가정
      const recommendedData = responses[2].data as ReviewModel[];
      recommendedReviews = recommendedData.map(this.modelToItem);
    }

    return { latestReviews, popularReviews, recommendedReviews };
  }

  // --- AllReviewsPage ---

  async getAllReviews(pageable: Pageable): Promise<ReviewPageItem> {
    const response = await reviewRepository.getAllReviews(pageable);
    return this.modelPageToItemPage(response.data);
  }

  async searchReviews(searchQuery: SearchQuery, pageable: Pageable): Promise<ReviewPageItem> {
    const response = await reviewRepository.searchReviews(searchQuery, pageable);
    return this.modelPageToItemPage(response.data);
  }

  /**
   * 리뷰 상세 정보 조회
   */
  async getReviewById(reviewId: string): Promise<ReviewItem> {
    const response = await reviewRepository.getReviewById(reviewId);
    return this.modelToItem(response.data);
  }

  /**
   * 리뷰 삭제
   */
  async deleteReview(reviewId: string): Promise<void> {
    await reviewRepository.deleteReview(reviewId);
  }
}

export const reviewService = new ReviewService();