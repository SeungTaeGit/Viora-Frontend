import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

function OAuthRedirectPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      login(token)
        .then(() => {
          navigate("/");
        })
        .catch(() => {
          alert("로그인 처리에 실패했습니다.");
          navigate("/login");
        });
    } else {
      alert("잘못된 접근입니다.");
      navigate("/login");
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50 font-sans">
      <div className="text-center">
         {/* 애니메이션 스피너 */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">로그인 중입니다...</h2>
        <p className="text-gray-500">잠시만 기다려 주세요.</p>
      </div>
    </div>
  );
}

export default OAuthRedirectPage;