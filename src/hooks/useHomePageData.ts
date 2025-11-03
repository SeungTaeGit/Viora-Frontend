import { useState, useEffect } from 'react';
import { reviewService } from '../services/ReviewService'; // 1. Service import
import { useAuthStore } from '../stores/authStore';
import type { ReviewItem } from '../types/review.item'; // 2. 타입 import

// 3. HomePage가 사용할 모든 로직과 상태를 이 훅이 담당합니다.
export function useHomePageData() {
  const [latestReviews, setLatestReviews] = useState<ReviewItem[]>([]);
  const [popularReviews, setPopularReviews] = useState<ReviewItem[]>([]);
  const [recommendedReviews, setRecommendedReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { isLoggedIn } = useAuthStore(); // 로그인 상태 확인

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 4. Service를 호출하여 3가지 데이터를 한 번에 가져옵니다.
        const data = await reviewService.getHomePageData(isLoggedIn);

        // 5. 받아온 데이터로 상태를 업데이트합니다.
        setLatestReviews(data.latestReviews.content);
        setPopularReviews(data.popularReviews.content);
        setRecommendedReviews(data.recommendedReviews);

      } catch (error) {
        console.error("홈페이지 데이터를 불러오는 데 실패했습니다.", error);
        // 실패 시 빈 배열로 초기화
        setLatestReviews([]);
        setPopularReviews([]);
        setRecommendedReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn]); // 로그인 상태가 바뀌면 데이터를 다시 가져옴

  // 6. Page 컴포넌트가 사용할 상태와 데이터를 반환합니다.
  return { latestReviews, popularReviews, recommendedReviews, loading, isLoggedIn };
}
