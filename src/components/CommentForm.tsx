import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

interface CommentFormProps {
  reviewId: string;
  onCommentAdded: () => void;
}

function CommentForm({ reviewId, onCommentAdded }: CommentFormProps) {
  const [text, setText] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim()) return;

    try {
      await axiosInstance.post(`/api/reviews/${reviewId}/comments`, { text });
      setText("");
      onCommentAdded();
    } catch (error) {
      alert("댓글 작성 실패");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-start mt-6">
       <div className="flex-grow">
          <textarea
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 text-sm border resize-none"
            rows={2}
            placeholder="댓글을 남겨보세요..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
       </div>
       <button
         type="submit"
         className="bg-indigo-600 text-white px-4 py-3 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm flex-shrink-0"
       >
         등록
       </button>
    </form>
  );
}

export default CommentForm;