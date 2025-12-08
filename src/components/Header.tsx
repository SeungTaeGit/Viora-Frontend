import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

function Header() {
  const { isLoggedIn, logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    alert("로그아웃 되었습니다.");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 1. 로고 */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-indigo-600 tracking-tight hover:text-indigo-500 transition-colors"
            >
              Viora
            </Link>
          </div>

          {/* 2. 네비게이션 메뉴 */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* 공통 메뉴 */}
            <Link
              to="/reviews"
              className="text-gray-600 hover:text-indigo-600 font-medium px-3 py-2 rounded-md transition-colors text-sm sm:text-base"
            >
              탐색
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/write-review"
                  className="text-gray-600 hover:text-indigo-600 font-medium px-3 py-2 rounded-md transition-colors text-sm sm:text-base hidden sm:block"
                >
                  리뷰 쓰기
                </Link>

                {/* 마이페이지 버튼 (아바타 포함) */}
                <Link
                  to="/mypage"
                  className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 px-2 sm:px-3 py-2 rounded-md transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm group-hover:bg-indigo-200 transition-colors">
                    {/* 닉네임 첫 글자 표시 (없으면 U) */}
                    {user?.nickname ? user.nickname.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="font-medium text-sm sm:text-base hidden sm:inline">마이페이지</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 font-medium px-2 sm:px-3 py-2 rounded-md transition-colors text-xs sm:text-sm"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-indigo-600 font-medium px-3 py-2 rounded-md transition-colors text-sm sm:text-base"
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;