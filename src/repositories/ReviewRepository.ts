import axiosInstance from "../api/axiosInstance";
import type { ReviewPageModel } from "../types/review.model";
import type { Pageable, SearchQuery } from "../types/page";

class ReviewRepository {
  /**
   * 최신 리뷰 목록 조회 (HomePage용)
   */
  getLatestReviews(pageable: Pageable) {
    const params = { ...pageable, sort: "createdAt,desc" };
    return axiosInstance.get<ReviewPageModel>("/api/reviews", { params });
  }

  /**
   * 인기 리뷰 목록 조회 (HomePage용)
   */
  getPopularReviews(pageable: Pageable) {
    return axiosInstance.get<ReviewPageModel>("/api/reviews/popular", { params: pageable });
  }

  /**
   * 추천 리뷰 목록 조회 (HomePage용)
   */
  getRecommendedReviews() {
    // ❗️ 참고: 이 API는 List<ReviewResponse>를 반환하므로, Model 타입이 다를 수 있습니다.
    // 여기서는 ReviewPageModel과 유사한 List<ReviewModel>을 반환한다고 가정합니다.
    return axiosInstance.get<ReviewPageModel["content"]>("/api/reviews/recommended");
  }

  /**
   * 모든 리뷰 목록 조회 (AllReviewsPage용)
   */
  getAllReviews(pageable: Pageable) {
    const params = { ...pageable, sort: "createdAt,desc" };
    return axiosInstance.get<ReviewPageModel>("/api/reviews", { params });
  }

  /**
   * 리뷰 검색 (AllReviewsPage용)
   */
  searchReviews(searchParams: SearchQuery, pageable: Pageable) {
    const params = { ...searchParams, ...pageable, sort: "createdAt,desc" };
    return axiosInstance.get<ReviewPageModel>("/api/reviews/search", { params });
  }

  /**
   * 리뷰 상세 조회 (ReviewDetailPage용)
   */
  async getReviewById(reviewId: string) {
    const response = await axiosInstance.get(`/api/reviews/${reviewId}`);
    return response.data;
  }

  /**
   * 리뷰 삭제 (ReviewDetailPage용)
   */
  async deleteReview(reviewId: string) {
    return await axiosInstance.delete(`/api/reviews/${reviewId}`);
  }
}

export const reviewRepository = new ReviewRepository();