import { useMyLikes } from "../hooks/useMyLikes";
import ReviewCard from "../components/organisms/ReviewCard";

function LikedReviewsTab() {
  const { reviewPage, loading, page, handlePageChange } = useMyLikes();

  const onPageBtnClick = (newPage: number) => {
    handlePageChange(null as any, newPage);
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">로딩 중...</div>;
  }

  if (!reviewPage || reviewPage.content.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
        <p className="text-gray-500">아직 좋아요 한 리뷰가 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

      <div className="flex justify-center items-center space-x-2">
        <button
          onClick={() => onPageBtnClick(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          이전
        </button>
        <span className="text-sm text-gray-600 font-medium">Page {page + 1}</span>
        <button
          onClick={() => onPageBtnClick(page + 1)}
          disabled={page + 1 >= reviewPage.totalPages}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default LikedReviewsTab;