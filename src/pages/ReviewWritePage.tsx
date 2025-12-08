import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Rating } from '@mui/material';
import MapSelector from '../components/MapSelector';

const REVIEW_CATEGORIES = [
  '맛집', '카페', '숙소', '여행지', '영화', '도서', '기타',
];

function ReviewWritePage() {
  const [category, setCategory] = useState('맛집');
  const [contentName, setContentName] = useState('');
  const [location, setLocation] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState<number | null>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);

    let uploadedImageUrl = null;

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadResponse = await axiosInstance.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploadedImageUrl = uploadResponse.data.url;
      }

      const reviewData = {
        category,
        contentName,
        location,
        text,
        rating,
        imageUrl: uploadedImageUrl,
      };

      const response = await axiosInstance.post('/api/reviews', reviewData);
      alert('리뷰가 성공적으로 작성되었습니다.');
      const newReviewId = response.data;
      navigate(`/reviews/${newReviewId}`);
    } catch (error) {
      console.error('리뷰 작성 실패:', error);
      alert('리뷰 작성에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 font-sans">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">

            {/* 헤더 */}
            <div className="mb-8 border-b border-gray-100 pb-4">
                <h1 className="text-2xl font-bold text-gray-900">리뷰 작성하기</h1>
                <p className="text-gray-500 text-sm mt-1">당신의 소중한 경험을 공유해주세요.</p>
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
                            placeholder="예: 스타벅스 강남점"
                            className="block w-full rounded-md border-0 py-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                        />
                    </div>
                </div>

                {/* 이미지 업로드 (드래그 앤 드롭 스타일) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">사진 첨부 (선택)</label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                        <div className="text-center w-full">
                            {imagePreview ? (
                                <div className="relative">
                                    <img src={imagePreview} alt="Preview" className="mx-auto h-64 object-contain rounded-md" />
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
                        <MapSelector onAddressSelect={(address) => setLocation(address)} />
                    </div>
                    <input
                        type="text"
                        readOnly
                        value={location}
                        placeholder="지도를 클릭하면 주소가 입력됩니다"
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
                        placeholder="자세한 후기를 남겨주세요."
                        className="block w-full rounded-md border-0 py-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 resize-none"
                    ></textarea>
                </div>

                {/* 별점 (MUI Rating 사용) */}
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
                        <span className="ml-3 text-sm text-gray-500 font-medium">{rating ? `${rating}점` : '선택해주세요'}</span>
                    </div>
                </div>

                {/* 작성 완료 버튼 */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isUploading}
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors disabled:bg-indigo-300"
                    >
                        {isUploading ? "업로드 중..." : "작성 완료"}
                    </button>
                </div>
            </form>
        </div>
    </div>
  </div>
  );
}

export default ReviewWritePage;