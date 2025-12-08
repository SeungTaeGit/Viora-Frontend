import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import axiosInstance from "../api/axiosInstance";

interface Comment {
  id: number;
  authorNickname: string;
  text: string;
}

interface CommentItemProps {
  comment: Comment;
  onCommentUpdated: () => void;
}

function CommentItem({ comment, onCommentUpdated }: CommentItemProps) {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);

  const handleDelete = async () => {
    if (window.confirm("삭제하시겠습니까?")) {
      try {
        await axiosInstance.delete(`/api/comments/${comment.id}`);
        onCommentUpdated();
      } catch (error) { alert("삭제 실패"); }
    }
  };

  const handleUpdate = async () => {
    try {
        await axiosInstance.put(`/api/comments/${comment.id}`, { text: editedText });
        setIsEditing(false);
        onCommentUpdated();
    } catch (error) { alert("수정 실패"); }
  };

  const isMyComment = user?.nickname === comment.authorNickname;

  const avatarInitial = comment.authorNickname ? comment.authorNickname.charAt(0) : '?';

  return (
    <div className="flex space-x-3 group mb-4">
        <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs uppercase">
                {avatarInitial}
            </div>
        </div>
        <div className="flex-grow">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm relative">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-gray-900">
                        {comment.authorNickname || '알 수 없는 사용자'}
                    </span>
                    {/* 내 댓글일 때만 보이는 수정/삭제 버튼 */}
                    {isMyComment && !isEditing && (
                        <div className="flex space-x-2 text-xs text-gray-400">
                            <button onClick={() => setIsEditing(true)} className="hover:text-indigo-600">수정</button>
                            <button onClick={handleDelete} className="hover:text-red-600">삭제</button>
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <div className="mt-2">
                        <textarea
                            className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            rows={2}
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                            <button onClick={() => setIsEditing(false)} className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1">취소</button>
                            <button onClick={handleUpdate} className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">저장</button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                )}
            </div>
        </div>
    </div>
  );
}

export default CommentItem;