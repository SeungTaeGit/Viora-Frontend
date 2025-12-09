import { useMyComments } from "../hooks/useMyComments";
import { Link } from "react-router-dom";
import type { CommentItem } from "../types/comment.item";

// 백엔드에서 reviewId 등을 받아오도록 DTO가 수정되었다고 가정
// (만약 아직 없다면 백엔드 MyCommentResponse DTO 수정 필요)
interface MyCommentItem extends CommentItem {
    reviewId?: number;
    reviewContentName?: string;
    createdAt?: string;
}

function MyCommentsTab() {
  const { commentPage, loading, page, handlePageChange } = useMyComments();

  const onPageBtnClick = (newPage: number) => {
    handlePageChange(null as any, newPage);
  };

  if (loading) return <div className="text-center py-10 text-gray-500">로딩 중...</div>;

  if (!commentPage || commentPage.content.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
        <p className="text-gray-500">아직 작성한 댓글이 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4 mb-8">
        {commentPage.content.map((comment: MyCommentItem) => (
          <div key={comment.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:border-indigo-300 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-medium text-indigo-600">
                    {/* 리뷰 제목을 클릭하면 해당 리뷰로 이동 */}
                    <Link to={`/reviews/${comment.reviewId}`} className="hover:underline">
                        {comment.reviewContentName || '리뷰 보러가기'}
                    </Link>
                </div>
                {comment.createdAt && (
                    <span className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                )}
            </div>
            <p className="text-gray-700 text-sm">{comment.text}</p>
          </div>
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
          disabled={page + 1 >= commentPage.totalPages}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default MyCommentsTab;