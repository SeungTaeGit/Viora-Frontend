// src/hooks/useHomePage.ts
import { useState, useEffect } from 'react';
import { reviewService } from '../services/ReviewService';
import { useAuthStore } from '../stores/authStore';

export function useHomePage() {
  const [latestReviews, setLatestReviews] = useState([]);
  const [popularReviews, setPopularReviews] = useState([]);
  const [recommendedReviews, setRecommendedReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isLoggedIn } = useAuthStore(); // 로그인 상태 확인

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // ❗️ Service 로직을 여기에 통합하는 것이 더 효율적일 수 있습니다.
        // ❗️ 또는 Service를 호출하여 한 번에 데이터를 받아옵니다.
        // ❗️ (로그인 상태에 따라 다른 API를 호출하는 로직 포함)

        // ... (HomePage의 useEffect 로직을 이곳으로 이동) ...

      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isLoggedIn]); // 로그인 상태가 바뀌면 데이터를 다시 가져옴

  return { latestReviews, popularReviews, recommendedReviews, loading };
}