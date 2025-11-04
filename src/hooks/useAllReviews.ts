import { useState, useEffect, useCallback } from 'react';
import { reviewService } from '../services/ReviewService';
import type { ReviewPageItem } from '../types/review.item';

const PAGE_SIZE = 10;

export function useAllReviews() {
  const [reviewPage, setReviewPage] = useState<ReviewPageItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); // API는 0부터 시작

  // 검색 관련 상태
  const [searchType, setSearchType] = useState('contentName'); // 검색 유형
  const [keyword, setKeyword] = useState(''); // 사용자가 입력 중인 검색어
  const [currentSearch, setCurrentSearch] = useState({ type: 'contentName', keyword: '' }); // '실행된' 검색

  // 데이터 페칭 로직
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      const pageable = { page, size: PAGE_SIZE };

      if (currentSearch.keyword) {
        // 검색어가 있으면 searchReviews 호출
        response = await reviewService.searchReviews(currentSearch, pageable);
      } else {
        // 검색어가 없으면 getAllReviews 호출
        response = await reviewService.getAllReviews(pageable);
      }
      setReviewPage(response);
    } catch (error) {
      console.error("리뷰 목록을 불러오는 데 실패했습니다.", error);
    } finally {
      setLoading(false);
    }
  }, [page, currentSearch]); // page 또는 currentSearch(실행된 검색)가 바뀔 때마다 실행

  // API 호출 트리거
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 페이지 변경 핸들러
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1); // MUI Pagination은 1부터 시작하므로 -1
  };

  // 검색 버튼 클릭 핸들러
  const handleSearch = () => {
    setPage(0); // 검색 시 0페이지(첫 페이지)부터 보도록 설정
    setCurrentSearch({ type: searchType, keyword: keyword }); // '실행된' 검색 상태 업데이트
  };

  // 페이지가 사용할 모든 것을 반환
  return {
    reviewPage,
    loading,
    page: page + 1, // UI(Pagination)는 1부터 시작하므로 +1
    searchType,
    keyword,
    setSearchType,
    setKeyword,
    handlePageChange,
    handleSearch,
    currentSearch
  };
}
