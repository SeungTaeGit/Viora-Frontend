import { useState } from 'react';
import ProfileTab from '../components/ProfileTab';
import MyReviewsTab from '../components/MyReviewsTab';
import MyCommentsTab from '../components/MyCommentsTab';
import LikedReviewsTab from '../components/LikedReviewsTab';

function MyPage() {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    { id: 0, label: "내 정보" },
    { id: 1, label: "내가 쓴 리뷰" },
    { id: 2, label: "내가 쓴 댓글" },
    { id: 3, label: "좋아요 한 리뷰" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans">

      {/* 마이페이지 헤더 (배경) */}
      <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">

        {/* 탭 네비게이션 & 컨텐츠 영역 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden min-h-[600px]">

            {/* 탭 메뉴 */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setSelectedTab(tab.id)}
                        className={`
                            flex-1 py-4 px-6 text-sm font-medium text-center whitespace-nowrap transition-colors duration-200
                            ${selectedTab === tab.id
                                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* 탭 컨텐츠 */}
            <div className="p-6 md:p-8">
                {selectedTab === 0 && <ProfileTab />}
                {selectedTab === 1 && <MyReviewsTab />}
                {selectedTab === 2 && <MyCommentsTab />}
                {selectedTab === 3 && <LikedReviewsTab />}
            </div>
        </div>

      </div>
    </div>
  );
}

export default MyPage;