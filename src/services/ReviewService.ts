import { reviewRepository } from "../repositories/ReviewRepository";
import type { ReviewItem, ReviewPageItem } from "../types/review.item";
import type { ReviewModel, ReviewPageModel } from "../types/review.model";

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
    
    // 1. API 호출 목록 준비
    const promisesToAwait = [
      reviewRepository.getLatestReviews(0, 5), // 최신 5개
      reviewRepository.getPopularReviews(0, 5)  // 인기 5개
    ];

    // 2. 로그인 상태일 때만 추천 API 호출 목록에 추가
    if (isLoggedIn) {
      promisesToAwait.push(reviewRepository.getRecommendedReviews());
    }

    // 3. API들을 '동시에' 호출
    const responses = await Promise.all(promisesToAwait);

    // 4. 결과를 '번역'
    const latestReviews = this.modelPageToItemPage(responses[0].data);
    const popularReviews = this.modelPageToItemPage(responses[1].data);
    
    let recommendedReviews: ReviewItem[] = [];
    if (isLoggedIn && responses[2]) {
      // 추천 리뷰는 Page가 아닌 Array(ReviewModel[])라고 가정
      const recommendedData = responses[2].data as ReviewModel[];
      recommendedReviews = recommendedData.map(this.modelToItem);
    }

    // 5. Hook이 사용하기 좋은 형태로 묶어서 반환
    return { latestReviews, popularReviews, recommendedReviews };
  }

  // TODO: 나중에 getReviewById, createReview 등의 서비스 로직도 이곳에 추가합니다.
}

// 싱글톤 인스턴스로 export
export const reviewService = new ReviewService();
