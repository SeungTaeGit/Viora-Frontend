import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import {
  Box, CircularProgress, Typography, Pagination, Container,
  TextField, Button, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import ReviewCard from "../components/organisms/ReviewCard";
import SearchIcon from '@mui/icons-material/Search';

const searchOptions = [
    { value: 'contentName', label: '콘텐츠 이름' },
    { value: 'text', label: '리뷰 내용' },
    { value: 'category', label: '카테고리' },
    { value: 'author', label: '작성자' },
];

function AllReviewsPage() {
  const [reviewPage, setReviewPage] = useState<ReviewPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const [searchType, setSearchType] = useState('contentName');
  const [keyword, setKeyword] = useState('');
  const [currentSearch, setCurrentSearch] = useState({ type: '', keyword: '' });

  const pageSize = 10;

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      let url = '/api/reviews';
      const params = new URLSearchParams({
          page: page.toString(),
          size: pageSize.toString(),
          sort: 'createdAt,desc'
      });

      if (currentSearch.keyword) {
        url = '/api/reviews/search';
        params.append('type', currentSearch.type);
        params.append('keyword', currentSearch.keyword);
      }

      try {
        const response = await axiosInstance.get(url, { params });
        setReviewPage(response.data);
      } catch (error) {
        console.error("리뷰를 불러오는 데 실패했습니다.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [page, currentSearch]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1);
  };

  const handleSearch = () => {
    setPage(0);
    setCurrentSearch({ type: searchType, keyword: keyword });
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        모든 리뷰 둘러보기
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 4, alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>검색 기준</InputLabel>
          <Select
            value={searchType}
            label="검색 기준"
            // ❗️ ❗️ event 타입을 'any'로 변경하여 오류를 우회합니다. ❗️ ❗️
            onChange={(e: any) => setSearchType(e.target.value)}
          >
            {searchOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="검색어 입력"
          variant="outlined"
          size="small"
          fullWidth
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="contained" onClick={handleSearch} startIcon={<SearchIcon />}>
          검색
        </Button>
      </Box>

      {/* ... (이하 리뷰 목록 렌더링 코드는 동일) ... */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
           <CircularProgress />
        </Box>
      ) : reviewPage && reviewPage.content.length > 0 ? (
        <>
          <Box sx={{ mt: 3 }}>
            {reviewPage.content.map((review) => (
              <ReviewCard
                key={review.id}
                id={review.id}
                authorNickname={review.authorNickname}
                category={review.category}
                contentName={review.contentName}
                text={review.text}
                rating={review.rating}
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={reviewPage.totalPages}
              page={page + 1}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      ) : (
        <Typography sx={{ mt: 3 }}>
          {currentSearch.keyword ? '검색 결과가 없습니다.' : '아직 작성된 리뷰가 없습니다.'}
        </Typography>
      )}
    </Container>
  );
}

export default AllReviewsPage;