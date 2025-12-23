import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuthStore } from "../stores/authStore";
import { Link } from "react-router-dom";

const BACKEND_URL = "https://api.viora-app.click";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. 로그인 요청
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const accessToken = response.data.accessToken; // 백엔드가 객체({ accessToken: ... })를 반환한다고 가정

      // 2. 로그인 성공 처리 (스토어 업데이트)
      await login(accessToken);

      alert("로그인에 성공했습니다!");
      navigate("/"); // 메인 페이지로 이동

    } catch (err: any) {
      console.error("로그인 오류:", err);
      // 에러 메시지 설정
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setError("이메일과 비밀번호를 확인해주세요.");
      } else {
        setError("로그인 중 알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

        {/* 헤더 섹션 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 mb-2 tracking-tight">Viora</h1>
          <p className="text-gray-500 text-sm">감성 리뷰 플랫폼에 오신 것을 환영합니다.</p>
        </div>

        {/* 로그인 폼 */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              이메일 주소
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="example@viora.com"
                className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                비밀번호
              </label>
              <div className="text-sm">
                <Link to="/find-account" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="••••••••"
                className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all duration-200"
              />
            </div>
          </div>

          {/* 에러 메시지 표시 */}
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md border border-red-100">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  로그인 중...
                </span>
              ) : (
                "로그인"
              )}
            </button>
          </div>
        </form>

        {/* 간편 로그인 구분선 */}
        <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
                <span className="bg-white px-2 text-xs text-gray-400 font-medium">간편 로그인</span>
            </div>
        </div>

        {/* 소셜 로그인 버튼 */}
        <div className="mt-6 space-y-3">
            <a
              href={`${BACKEND_URL}/oauth2/authorization/google`}
              className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all duration-200 no-underline"
            >
                <img className="h-5 w-5" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                Google로 계속하기
            </a>
            <a
              href={`${BACKEND_URL}/oauth2/authorization/kakao`}
              className="flex w-full items-center justify-center gap-3 rounded-md bg-[#FEE500] px-3 py-2.5 text-sm font-semibold text-[#000000] shadow-sm hover:bg-[#F0D900] transition-all duration-200 no-underline"
            >
                <img className="h-5 w-5" src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo_no_text.svg" alt="Kakao" />
                Kakao로 계속하기
            </a>
        </div>

        {/* 회원가입 링크 */}
        <p className="mt-8 text-center text-sm text-gray-500">
            아직 회원이 아니신가요?
            <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 ml-1 transition-colors">
              회원가입
            </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;