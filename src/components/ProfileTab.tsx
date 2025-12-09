import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuthStore } from '../stores/authStore';

interface UserProfile {
  email: string;
  nickname: string;
  profileImageUrl?: string | null;
  bio?: string | null;
}

function ProfileTab() {
  const { user, setUser } = useAuthStore();
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    nickname: '',
    profileImageUrl: '',
    bio: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData({
        nickname: user.nickname || '',
        profileImageUrl: user.profileImageUrl || '',
        bio: user.bio || '',
      });
      setLoading(false);
    } else {
        const fetchUser = async () => {
             try {
                const response = await axiosInstance.get('/api/users/me');
                setUser(response.data);
                setFormData({
                    nickname: response.data.nickname || '',
                    profileImageUrl: response.data.profileImageUrl || '',
                    bio: response.data.bio || '',
                });
             } catch (error) {
                console.error("내 정보 로딩 실패:", error);
             } finally {
                setLoading(false);
             }
        }
        fetchUser();
    }
  }, [user, setUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.put('/api/users/me', formData);
      setUser(response.data);
      alert('프로필이 수정되었습니다.');
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      alert('프로필 수정에 실패했습니다.');
    }
  };

  if (loading) return <div className="text-center py-10">로딩 중...</div>;

  return (
    <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center mb-8">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-gray-200 overflow-hidden mb-4">
                {/* 프로필 이미지가 없으면 기본 이미지(또는 이니셜) 표시 */}
                {formData.profileImageUrl ? (
                     <img src={formData.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400 font-bold bg-gray-100">
                        {formData.nickname ? formData.nickname.charAt(0).toUpperCase() : 'U'}
                    </div>
                )}
            </div>
             <h2 className="text-xl font-bold text-gray-900">{user?.email}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
                <input
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            {/* 프로필 이미지 URL 대신 파일 업로드를 추가하면 더 좋습니다 (추후 과제) */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">프로필 이미지 URL</label>
                <input
                    type="text"
                    name="profileImageUrl"
                    value={formData.profileImageUrl || ''}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">한 줄 소개</label>
                <textarea
                    name="bio"
                    value={formData.bio || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-semibold shadow-sm hover:bg-indigo-500 transition-colors"
                >
                    수정 완료
                </button>
            </div>
        </form>
    </div>
  );
}

export default ProfileTab;