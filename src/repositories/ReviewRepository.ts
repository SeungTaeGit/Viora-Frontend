import axiosInstance from "../api/axiosInstance";
import type { ReviewPageModel, ReviewModel } from "../types/review.model";

class ReviewRepository {
  /**
   * 최신 리뷰 목록 조회 (페이지네이션)
   */
  getLatestReviews(page: number, size: number) {
    const params = { page, size, sort: "createdAt,desc" };
    return axiosInstance.get<ReviewPageModel>("/api/reviews", { params });
  }

  /**
   * 인기 리뷰 목록 조회 (페이지네이션)
   */
  getPopularReviews(page: number, size: number) {
    const params = { page, size };
    return axiosInstance.get<ReviewPageModel>("/api/reviews/popular", { params });
  }

  /**
   * 추천 리뷰 목록 조회
   * (추천 API는 페이지네이션이 아닌 목록을 반환한다고 가정)
   */
  getRecommendedReviews() {
    return axiosInstance.get<ReviewModel[]>("/api/reviews/recommended");
  }

  // TODO: 나중에 getReviewById, createReview 등 다른 리뷰 API도 이곳으로 옮깁니다.
}

// 싱글톤 인스턴스로 export
export const reviewRepository = new ReviewRepository();
