import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Rating } from '@mui/material';
import MapSelector from '../components/MapSelector';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const REVIEW_CATEGORIES = [
  '맛집', '카페', '숙소', '여행지', '영화', '도서', '기타',
];

function ReviewEditPage() {
  const { reviewId } = useParams<{ reviewId: string }>();
  const [category, setCategory] = useState('');
  const [contentName, setContentName] = useState('');
  const [location, setLocation] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReview = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/api/reviews/${reviewId}`);
        const { category, contentName, location, text, rating, imageUrl } = response.data;
        setCategory(category);
        setContentName(contentName);
        setLocation(location);
        setText(text);
        setRating(rating);
        setExistingImageUrl(imageUrl);
        setImagePreview(imageUrl);
      } catch (error) {
        console.error("리뷰 정보를 불러오는데 실패했습니다.", error);
        alert("리뷰 정보를 불러올 수 없습니다.");
        navigate(`/reviews/${reviewId}`);
      } finally {
        setLoading(false);
      }
    };
    if (reviewId) fetchReview();
  }, [reviewId, navigate]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);
    let updatedImageUrl = existingImageUrl;

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadResponse = await axiosInstance.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        updatedImageUrl = uploadResponse.data.url;
      }

      const reviewData = {
        category,
        contentName,
        location,
        text,
        rating,
        imageUrl: updatedImageUrl,
      };

      await axiosInstance.put(`/api/reviews/${reviewId}`, reviewData);
      alert('리뷰가 성공적으로 수정되었습니다.');
      navigate(`/reviews/${reviewId}`);

    } catch (error) {
      console.error('리뷰 수정 실패:', error);
      alert('리뷰 수정에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 font-sans">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">

            <div className="mb-8 border-b border-gray-100 pb-4">
                <h1 className="text-2xl font-bold text-gray-900">리뷰 수정하기</h1>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                {/* 카테고리 & 제목 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="block w-full rounded-md border-0 py-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white px-3"
                        >
                            {REVIEW_CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">콘텐츠 이름</label>
                        <input
                            type="text"
                            required
                            value={contentName}
                            onChange={(e) => setContentName(e.target.value)}
                            className="block w-full rounded-md border-0 py-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                        />
                    </div>
                </div>

                {/* 이미지 업로드 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">사진 첨부 (선택)</label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                        <div className="text-center w-full">
                            {(imagePreview || existingImageUrl) ? (
                                <div className="relative">
                                    <img src={imagePreview || existingImageUrl || ''} alt="Preview" className="mx-auto h-64 object-contain rounded-md" />
                                    <p className="mt-2 text-xs text-gray-500">이미지를 클릭하여 변경</p>
                                </div>
                            ) : (
                                <>
                                    <div className="mx-auto h-12 w-12 text-gray-300 flex justify-center">
                                         <svg className="h-full w-full" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                                        <span className="font-semibold text-indigo-600">파일 선택</span>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, WEBP</p>
                                </>
                            )}
                        </div>
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                </div>

                {/* 위치 선택 (지도) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">위치 선택</label>
                    <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden mb-2 border border-gray-300 relative z-0">
                        <MapSelector onAddressSelect={(address) => setLocation(address)} initialCenter={undefined} /> {/* initialCenter 로직이 MapSelector에 있다면 추가 가능 */}
                    </div>
                    <input
                        type="text"
                        readOnly
                        value={location}
                        className="block w-full rounded-md border-0 py-2.5 text-gray-900 bg-gray-50 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 px-3 text-gray-500 cursor-not-allowed"
                    />
                </div>

                {/* 리뷰 내용 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">리뷰 내용</label>
                    <textarea
                        rows={6}
                        required
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="block w-full rounded-md border-0 py-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 resize-none"
                    ></textarea>
                </div>

                {/* 별점 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">별점</label>
                    <div className="flex items-center">
                        <Rating
                            name="rating"
                            value={rating}
                            onChange={(event, newValue) => { setRating(newValue); }}
                            size="large"
                            sx={{ fontSize: '2.5rem' }}
                        />
                        <span className="ml-3 text-sm text-gray-500 font-medium">{rating}점</span>
                    </div>
                </div>

                {/* 수정 완료 버튼 */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isUploading}
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors disabled:bg-indigo-300"
                    >
                        {isUploading ? "업로드 중..." : "수정 완료"}
                    </button>
                </div>
            </form>
        </div>
    </div>
  </div>
  );
}

export default ReviewEditPage;