import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

interface LikeButtonProps {
  reviewId: string;
  initialLikeCount: number;
  initialIsLiked: boolean;
}

function LikeButton({ reviewId, initialLikeCount, initialIsLiked }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleLikeClick = async () => {
    if (isLoading) return;
    setIsLoading(true);

    // 낙관적 업데이트
    const prevLiked = isLiked;
    const prevCount = likeCount;
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    try {
      if (isLiked) await axiosInstance.delete(`/api/reviews/${reviewId}/likes`);
      else await axiosInstance.post(`/api/reviews/${reviewId}/likes`);
    } catch (error) {
      alert("요청 실패");
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
        onClick={handleLikeClick}
        disabled={isLoading}
        className={`flex items-center space-x-2 transition-colors duration-200 ${isLiked ? 'text-pink-500 hover:text-pink-600' : 'text-gray-400 hover:text-pink-500'}`}
    >
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <span className={`font-bold text-lg ${isLiked ? 'text-pink-600' : 'text-gray-600'}`}>{likeCount}</span>
    </button>
  );
}

export default LikeButton;