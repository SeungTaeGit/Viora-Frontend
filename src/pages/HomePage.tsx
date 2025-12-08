import { useHomePageData } from "../hooks/useHomePageData";
import ReviewCard from "../components/organisms/ReviewCard";
import { useAuthStore } from "../stores/authStore";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
  </div>
);

function HomePage() {
  const {
    latestReviews,
    popularReviews,
    recommendedReviews,
    loading,
  } = useHomePageData();

  const { isLoggedIn, user } = useAuthStore();

  if (loading) {
    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50">
            <LoadingSpinner />
        </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- 섹션 1: 추천 리뷰 (로그인 시에만 표시) --- */}
        {isLoggedIn && (
          <section className="mb-20">
            <div className="flex items-center mb-6">
                <span className="text-3xl mr-3">🌟</span>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {user?.nickname}님을 위한 추천 리뷰
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">회원님의 취향을 분석하여 엄선했습니다.</p>
                </div>
            </div>

            {recommendedReviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendedReviews.map((review) => (
                  <ReviewCard key={'rec-' + review.id} {...review} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100">
                <p className="text-gray-500">아직 추천할 리뷰가 충분하지 않습니다. 활동을 시작해보세요!</p>
              </div>
            )}
          </section>
        )}

        {/* --- 섹션 2: 최신 리뷰 --- */}
        <section className="mb-20">
          <div className="flex items-center mb-6">
                <span className="text-3xl mr-3">✨</span>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">따끈따끈한 최신 리뷰</h2>
                    <p className="text-gray-500 text-sm mt-1">방금 올라온 생생한 후기들을 확인해보세요.</p>
                </div>
            </div>

          {latestReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestReviews.map((review) => (
                <ReviewCard key={'lat-' + review.id} {...review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
                <p className="text-gray-500">등록된 리뷰가 없습니다.</p>
            </div>
          )}
        </section>

        {/* --- 섹션 3: 인기 리뷰 --- */}
        <section>
           <div className="flex items-center mb-6">
                <span className="text-3xl mr-3">🔥</span>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">지금 핫한 인기 리뷰</h2>
                    <p className="text-gray-500 text-sm mt-1">많은 사용자들이 좋아한 검증된 리뷰입니다.</p>
                </div>
            </div>

          {popularReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularReviews.map((review) => (
                <ReviewCard key={'pop-' + review.id} {...review} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100">
                <p className="text-gray-500">아직 집계된 인기 리뷰가 없습니다. 첫 번째 인기 리뷰의 주인공이 되어보세요!</p>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}

export default HomePage;