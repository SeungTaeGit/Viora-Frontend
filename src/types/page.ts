export type Pageable = {
  page: number;
  size: number;
};

// 검색 API로 보낼 타입
export type SearchQuery = {
  type: string;
  keyword: string;
};
