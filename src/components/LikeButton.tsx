// src/components/LikeButton.tsx

import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite'; // 채워진 하트
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; // 테두리만 있는 하트

// 부모로부터 받을 데이터 타입 정의
interface LikeButtonProps {
  reviewId: string;
  initialLikeCount: number;
  initialIsLiked: boolean;
}

function LikeButton({ reviewId, initialLikeCount, initialIsLiked }: LikeButtonProps) {
  // 1. 이 컴포넌트가 직접 '좋아요' 상태와 개수를 관리합니다. (Optimistic UI)
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  // 2. 하트 아이콘 클릭 시 실행될 함수
  const handleLikeClick = async () => {
    // 3. 먼저 화면부터 즉시 업데이트 (사용자는 빠른 피드백을 받음)
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    try {
      // 4. 그 다음에 백그라운드에서 실제 API 요청을 보냄
      if (isLiked) {
        // 이미 좋아요 상태였으면 -> 좋아요 취소 API 호출
        await axiosInstance.delete(`/api/reviews/${reviewId}/likes`);
      } else {
        // 좋아요 상태가 아니었으면 -> 좋아요 추가 API 호출
        await axiosInstance.post(`/api/reviews/${reviewId}/likes`);
      }
    } catch (error) {
      // 5. 만약 API 요청이 실패하면, 화면을 원래 상태로 되돌림
      alert("요청에 실패했습니다.");
      setIsLiked(isLiked);
      setLikeCount(likeCount);
      console.error("좋아요 처리 실패:", error);
    }
  };

  return (
    <IconButton aria-label="add to favorites" onClick={handleLikeClick}>
      {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
      <span style={{ fontSize: '1rem', marginLeft: '4px' }}>{likeCount}</span>
    </IconButton>
  );
}

export default LikeButton;