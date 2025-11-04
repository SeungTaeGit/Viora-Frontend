import axiosInstance from "../api/axiosInstance";
import type { ReviewPageModel, ReviewModel } from "../types/review.model";
import type { Pageable, SearchQuery } from "../types/page.ts";

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
    const params = { ...pageable };
    return axiosInstance.get<ReviewPageModel>("/api/reviews/popular", { params });
  }

  /**
   * 추천 리뷰 목록 조회 (HomePage용)
   */
  getRecommendedReviews() {
    return axiosInstance.get<ReviewModel[]>("/api/reviews/recommended");
  }

  // --- ❗️ 여기에 새로운 메서드들을 추가합니다 ❗️ ---

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
  searchReviews(searchQuery: SearchQuery, pageable: Pageable) {
    const params = { ...searchQuery, ...pageable, sort: "createdAt,desc" };
    return axiosInstance.get<ReviewPageModel>("/api/reviews/search", { params });
  }
}

export const reviewRepository = new ReviewRepository();