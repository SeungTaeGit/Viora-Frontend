import { reviewRepository } from "../repositories/ReviewRepository";
import type { ReviewPageModel, ReviewModel } from "../types/review.model";
import type { ReviewPageItem, ReviewItem } from "../types/review.item";
import type { Pageable, SearchQuery } from "../types/page";

class ReviewService {

  // --- 데이터 '번역기' ---

  // '리뷰 모델'을 '리뷰 아이템'으로 변환
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

  // '리뷰 페이지 모델'을 '리뷰 페이지 아이템'으로 변환
  private modelPageToItemPage(model: ReviewPageModel): ReviewPageItem {
    // ❗️ 여기가 버그 수정 지점입니다: model.content.map을 사용해야 합니다.
    return {
      content: model.content.map(this.modelToItem),
      totalPages: model.totalPages,
      number: model.number,
    };
  }

  // --- 서비스 로직 ---

  /**
   * HomePage 데이터를 한 번에 가져오는 함수
   */
  async getHomePageData(isLoggedIn: boolean) {
    // 3개의 API를 동시에 요청 (성능 향상)
    const [latestRes, popularRes] = await Promise.all([
      reviewRepository.getLatestReviews({ page: 0, size: 5 }),
      reviewRepository.getPopularReviews({ page: 0, size: 5 }),
    ]);

    // 로그인 상태일 때만 추천 API 호출
    let recommendedReviews: ReviewItem[] = [];
    if (isLoggedIn) {
      try {
        const recommendedRes = await reviewRepository.getRecommendedReviews();
        recommendedReviews = recommendedRes.data.map(this.modelToItem);
      } catch (error) {
        console.error("추천 리뷰 로딩 실패(Service):", error);
      }
    }

    return {
      latestReviews: this.modelPageToItemPage(latestRes.data),
      popularReviews: this.modelPageToItemPage(popularRes.data),
      recommendedReviews: recommendedReviews,
    };
  }

  /**
   * 모든 리뷰 목록 조회 (AllReviewsPage용)
   */
  async getAllReviews(pageable: Pageable) {
    // ❗️ 여기가 버그 수정 지점입니다: response.data를 넘겨야 합니다.
    const response = await reviewRepository.getAllReviews(pageable);
    return this.modelPageToItemPage(response.data);
  }

  /**
   * 리뷰 검색 (AllReviewsPage용)
   */
  async searchReviews(searchParams: SearchQuery, pageable: Pageable) {
    // ❗️ 여기가 버그 수정 지점입니다: response.data를 넘겨야 합니다.
    const response = await reviewRepository.searchReviews(searchParams, pageable);
    return this.modelPageToItemPage(response.data);
  }

  /**
   * 리뷰 상세 조회 (ReviewDetailPage용)
   */
  async getReviewById(reviewId: string) {
    const model = await reviewRepository.getReviewById(reviewId);
    return this.modelToItem(model);
  }

  /**
   * 리뷰 삭제 (ReviewDetailPage용)
   */
  async deleteReview(reviewId: string) {
    return await reviewRepository.deleteReview(reviewId);
  }
}

export const reviewService = new ReviewService();