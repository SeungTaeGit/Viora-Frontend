export type ReviewModel = {
  id: number;
  authorNickname: string;
  category: string;
  contentName: string;
  location: string;
  text: string;
  rating: number;
  likeCount: number;
  isLiked: boolean;
};

export type ReviewPageModel = {
  content: ReviewModel[];
  totalPages: number;
  number: number;
};