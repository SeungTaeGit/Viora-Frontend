import { useParams, Link, useNavigate } from "react-router-dom";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import CommentForm from "../components/CommentForm";
import CommentItem from "../components/CommentItem";
import LikeButton from "../components/LikeButton";
import { useReviewDetail } from "../hooks/useReviewDetail";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-80">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
  </div>
);

function ReviewDetailPage() {
  const { reviewId } = useParams<{ reviewId: string }>();
  const navigate = useNavigate();

  const {
    review,
    comments,
    markerPosition,
    isLikersModalOpen,
    likersList,
    isLoadingLikers,
    loading,
    isLoggedIn,
    user,
    fetchComments,
    handleDeleteReview,
    handleOpenLikersModal,
    handleCloseLikersModal,
  } = useReviewDetail(reviewId);

  if (loading) return <LoadingSpinner />;

  if (!review) return <div className="text-center py-20 text-gray-500">해당 리뷰를 찾을 수 없습니다.</div>;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
    ));
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- 1. 리뷰 헤더 --- */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-indigo-600 font-semibold mb-2">
            <span className="bg-indigo-50 px-2 py-1 rounded">{review.category}</span>
          </div>

          <div className="flex justify-between items-start">
             <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{review.contentName}</h1>

             {/* 수정/삭제 버튼 (작성자 본인일 때만) */}
             {user?.nickname === review.authorNickname && (
                <div className="flex space-x-2 flex-shrink-0 ml-4">
                  <Link to={`/reviews/${reviewId}/edit`} className="text-gray-400 hover:text-indigo-600 text-sm font-medium transition-colors">수정</Link>
                  <button onClick={handleDeleteReview} className="text-gray-400 hover:text-red-600 text-sm font-medium transition-colors">삭제</button>
                </div>
             )}
          </div>

          <div className="flex items-center">
            {/* 프로필 이미지 (이니셜) */}
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3">
              {review.authorNickname.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{review.authorNickname}</p>
              <div className="flex items-center mt-0.5">
                 <div className="flex mr-1">{renderStars(review.rating)}</div>
                 <span className="text-xs text-gray-500 font-medium">({review.rating}.0)</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- 2. 메인 이미지 --- */}
        {review.imageUrl && (
          <div className="rounded-xl overflow-hidden shadow-md mb-8 bg-white">
            <img
              src={review.imageUrl}
              alt={review.contentName}
              className="w-full h-auto object-cover max-h-[500px]"
              onError={(e: any) => e.target.style.display = 'none'}
            />
          </div>
        )}

        {/* --- 3. 리뷰 본문 --- */}
        <div className="prose prose-lg text-gray-700 mb-10 leading-relaxed whitespace-pre-wrap">
          {review.text}
        </div>

        {/* --- 4. 위치 정보 (지도) --- */}
        {/* markerPosition이 있으면 지도 표시, 없으면 텍스트만 표시 */}
        {markerPosition ? (
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
              📍 위치 정보
            </h3>
            <div className="w-full h-48 rounded-lg overflow-hidden mb-3 border border-gray-200">
              <Map center={markerPosition} style={{ width: "100%", height: "100%" }} level={3}>
                <MapMarker position={markerPosition} />
              </Map>
            </div>
            <p className="text-sm text-gray-600 flex items-center">
              <span className="mr-1">🏠</span> {review.location}
            </p>
          </div>
        ) : review.location && (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                📍 위치 정보
                </h3>
                <p className="text-sm text-gray-600 flex items-center">
                <span className="mr-1">🏠</span> {review.location}
                </p>
            </div>
        )}

        {/* --- 5. 좋아요 버튼 영역 --- */}
        <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 mb-10">
            <div className="flex items-center space-x-6">
                {/* 좋아요 버튼 컴포넌트 */}
                <LikeButton
                    reviewId={reviewId!}
                    initialLikeCount={review.likeCount}
                    initialIsLiked={review.isLiked}
                />

                {/* 좋아요 목록 보기 버튼 */}
                <button
                    onClick={handleOpenLikersModal}
                    disabled={isLoadingLikers}
                    className="flex items-center space-x-1 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
                >
                    <span>👥 좋아요 {review.likeCount}개</span>
                </button>
            </div>

            {/* 공유 버튼 (아이콘만 구현) */}
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
            </button>
        </div>

        {/* --- 6. 댓글 섹션 --- */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            댓글 <span className="ml-2 text-indigo-600 text-lg">{comments.length}</span>
          </h3>

          {/* 댓글 목록 */}
          <div className="space-y-4 mb-8">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onCommentUpdated={fetchComments}
              />
            ))}
            {comments.length === 0 && <p className="text-gray-500 text-sm py-4">아직 작성된 댓글이 없습니다.</p>}
          </div>

          {/* 댓글 작성 폼 */}
          {isLoggedIn && reviewId && (
            <CommentForm reviewId={reviewId} onCommentAdded={fetchComments} />
          )}
        </div>
      </div>

      {/* 좋아요 누른 사람 모달 */}
      {isLikersModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={handleCloseLikersModal}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">좋아요 누른 사람</h3>
                    <button onClick={handleCloseLikersModal} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                <div className="p-0 max-h-80 overflow-y-auto">
                    {likersList.length > 0 ? (
                        <ul className="divide-y divide-gray-100">
                            {likersList.map((liker, index) => (
                                <li key={index} className="px-6 py-3 text-sm text-gray-700 flex items-center">
                                     <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs mr-3 font-bold">
                                        {liker.nickname.charAt(0)}
                                     </div>
                                    {liker.nickname}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="px-6 py-8 text-center text-sm text-gray-500">아직 좋아요가 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
      )}

    </div>
  );
}

export default ReviewDetailPage;