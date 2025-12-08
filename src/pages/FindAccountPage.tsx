import { useState } from 'react';
import axiosInstance from "../api/axiosInstance";

function FindAccountPage() {
  const [activeTab, setActiveTab] = useState<'findEmail' | 'resetPw'>('findEmail');

  // 이메일 찾기 상태
  const [nickname, setNickname] = useState('');
  const [foundEmail, setFoundEmail] = useState('');

  // 비밀번호 찾기 상태
  const [resetEmail, setResetEmail] = useState('');
  const [resetNickname, setResetNickname] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleFindEmail = async () => {
    try {
      const response = await axiosInstance.post('/auth/find-email', { nickname });
      setFoundEmail(response.data);
      alert(`회원님의 이메일은 ${response.data} 입니다.`);
    } catch (error) {
      alert('사용자를 찾을 수 없습니다.');
    }
  };

  const handleResetPassword = async () => {
    try {
      await axiosInstance.post('/auth/reset-password', {
        email: resetEmail,
        nickname: resetNickname,
        newPassword: newPassword
      });
      alert('비밀번호가 변경되었습니다. 로그인해주세요.');
      window.location.href = '/login';
    } catch (error) {
      alert('정보가 일치하지 않거나 변경에 실패했습니다.');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

        <div className="px-8 pt-8 pb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900">계정 찾기</h2>
            <p className="mt-2 text-sm text-gray-500">계정 정보를 잊으셨나요?</p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex border-b border-gray-200">
            <button
                onClick={() => setActiveTab('findEmail')}
                className={`flex-1 py-4 text-sm font-medium text-center transition-colors duration-200 ${activeTab === 'findEmail' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
                이메일 찾기
            </button>
            <button
                onClick={() => setActiveTab('resetPw')}
                className={`flex-1 py-4 text-sm font-medium text-center transition-colors duration-200 ${activeTab === 'resetPw' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
                비밀번호 재설정
            </button>
        </div>

        <div className="p-8">
            {activeTab === 'findEmail' ? (
                // --- 이메일 찾기 폼 ---
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="가입 시 입력한 닉네임"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleFindEmail}
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold shadow-sm transition-colors"
                    >
                        이메일 찾기
                    </button>
                    {foundEmail && (
                        <div className="mt-4 p-4 bg-indigo-50 rounded-md text-center border border-indigo-100">
                            <p className="text-sm text-gray-600">회원님의 이메일은</p>
                            <p className="text-lg font-bold text-indigo-700 mt-1">{foundEmail}</p>
                            <p className="text-sm text-gray-600">입니다.</p>
                        </div>
                    )}
                </div>
            ) : (
                // --- 비밀번호 재설정 폼 ---
                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={resetNickname}
                            onChange={(e) => setResetNickname(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="새로운 비밀번호 입력"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleResetPassword}
                        className="w-full mt-2 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold shadow-sm transition-colors"
                    >
                        비밀번호 변경
                    </button>
                </div>
            )}
        </div>

        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 text-center">
             <a href="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                로그인 페이지로 돌아가기
            </a>
        </div>

      </div>
    </div>
  );
}

export default FindAccountPage;