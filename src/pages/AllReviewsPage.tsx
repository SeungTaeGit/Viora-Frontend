import {
  Box, CircularProgress, Typography, Pagination, Container,
  TextField, Button, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import ReviewCard from '../components/organisms/ReviewCard';
import SearchIcon from '@mui/icons-material/Search';
import { useAllReviews } from '../hooks/useAllReviews';

const searchOptions = [
  { value: 'contentName', label: '콘텐츠 이름' },
  { value: 'text', label: '리뷰 내용' },
  { value: 'category', label: '카테고리' },
  { value: 'author', label: '작성자' },
];

function AllReviewsPage() {
  const {
    reviewPage,
    loading,
    page,
    searchType,
    keyword,
    setSearchType,
    setKeyword,
    handlePageChange,
    handleSearch,
    currentSearch
  } = useAllReviews();

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        모든 리뷰 둘러보기
      </Typography>

      {/* 검색 UI */}
      <Box sx={{ display: 'flex', gap: 1, mb: 4, alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>검색 기준</InputLabel>
          <Select
            value={searchType}
            label="검색 기준"
            onChange={(e: SelectChangeEvent) => setSearchType(e.target.value)}
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

      {/* 리뷰 목록 */}
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
                isLiked={false}
                likeCount={0}
                imageUrl={review.imageUrl}
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={reviewPage.totalPages}
              page={page} // 훅에서 이미 +1 처리된 page를 반환
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