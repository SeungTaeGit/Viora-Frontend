import axiosInstance from '../api/axiosInstance';
import { useState, useEffect } from 'react';
import ReviewCard from "../components/organisms/ReviewCard";
import { useAllReviews } from "../hooks/useAllReviews";

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

  const onPageBtnClick = (newPage: number) => {
    handlePageChange(null as any, newPage);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 헤더 및 검색 섹션 */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">모든 리뷰 둘러보기</h1>

          {/* 검색바 */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-48">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border"
              >
                <option value="contentName">콘텐츠 이름</option>
                <option value="text">리뷰 내용</option>
                <option value="category">카테고리</option>
                <option value="author">작성자</option>
              </select>
            </div>

            <div className="relative flex-grow w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="block w-full rounded-lg border-gray-300 bg-gray-50 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border"
                placeholder="검색어를 입력하세요..."
              />
            </div>

            <button
              onClick={handleSearch}
              className="w-full md:w-auto bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              검색
            </button>
          </div>
        </div>

        {/* 리뷰 목록 그리드 */}
        {reviewPage && reviewPage.content.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {reviewPage.content.map((review) => (
                <ReviewCard
                  key={review.id}
                  id={review.id}
                  authorNickname={review.authorNickname}
                  category={review.category}
                  contentName={review.contentName}
                  text={review.text}
                  rating={review.rating}
                  imageUrl={review.imageUrl}
                />
              ))}
            </div>

            {/* 페이지네이션 */}
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => onPageBtnClick(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                이전
              </button>

              <span className="px-4 py-2 text-sm text-gray-700 font-medium">
                Page {page} of {reviewPage.totalPages}
              </span>

              <button
                onClick={() => onPageBtnClick(page + 1)}
                disabled={page === reviewPage.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-lg">
              {currentSearch.keyword ? `'${currentSearch.keyword}'에 대한 검색 결과가 없습니다.` : '아직 작성된 리뷰가 없습니다.'}
            </p>
            {currentSearch.keyword && (
               <button
                 onClick={() => { setKeyword(''); setSearchType('contentName'); handleSearch(); }}
                 className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
               >
                 전체 목록 보기
               </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default AllReviewsPage;