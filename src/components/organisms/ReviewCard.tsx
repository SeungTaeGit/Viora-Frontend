import { Link } from "react-router-dom";

interface ReviewCardProps {
  id: number;
  authorNickname: string;
  category: string;
  contentName: string;
  text: string;
  rating: number;
  imageUrl: string | null;
}

function ReviewCard({ id, authorNickname, category, contentName, text, rating, imageUrl }: ReviewCardProps) {

  const truncatedText = text.length > 100 ? text.substring(0, 100) + "..." : text;

  const displayImage = imageUrl || `https://placehold.co/600x400?text=${encodeURIComponent(category)}`;

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 ${i <= rating ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      );
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
      {/* 이미지 영역 */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
            src={displayImage}
            alt={contentName}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            onError={(e: any) => e.target.src = 'https://placehold.co/600x400?text=No+Image'}
        />
        {/* 카테고리 배지 */}
        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
            {category}
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="p-6 flex flex-col flex-grow">
        {/* 헤더: 별점 및 날짜(임시) */}
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
                {renderStars(rating)}
                <span className="text-sm text-gray-500 font-bold ml-1">{rating.toFixed(1)}</span>
            </div>
        </div>

        {/* 제목 */}
        <h3 className="font-bold text-xl mb-2 text-gray-900 line-clamp-1">
            {contentName}
        </h3>

        {/* 본문 (말줄임 처리) */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
            {truncatedText}
        </p>

        {/* 작성자 정보 및 버튼 */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
            <div className="flex items-center">
                {/* 프로필 이미지 대신 이니셜 아바타 */}
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs text-indigo-600 font-bold mr-2">
                    {authorNickname.substring(0, 1).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 truncate max-w-[100px]">
                    {authorNickname}
                </span>
            </div>
            <Link
                to={`/reviews/${id}`}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center transition-colors"
            >
                자세히 보기 →
            </Link>
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;