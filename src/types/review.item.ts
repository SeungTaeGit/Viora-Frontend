export type ReviewItem = {
  id: number;
  authorNickname: string;
  category: string;
  contentName: string;
  location: string;
  text: string;
  rating: number;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  imageUrl: string | null;
};

export type ReviewPageItem = {
  content: ReviewItem[];
  totalPages: number;
  number: number;
};