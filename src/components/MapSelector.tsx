// src/components/MapSelector.tsx

import { useEffect, useState, useRef } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { Box, TextField, Button } from '@mui/material'; // MUI 컴포넌트 추가

interface MapSelectorProps {
  onAddressSelect: (address: string) => void;
  initialCenter?: { lat: number; lng: number };
}

function MapSelector({ onAddressSelect, initialCenter }: MapSelectorProps) {
  const defaultCenter = initialCenter || { lat: 37.5666103, lng: 126.9783882 };
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [map, setMap] = useState<kakao.maps.Map | null>(null); // 지도 객체 상태 추가
  const [keyword, setKeyword] = useState(''); // 검색어 상태 추가

  // 지도 클릭 이벤트 핸들러
  const handleMapClick = (_target: kakao.maps.Map, mouseEvent: kakao.maps.event.MouseEvent) => {
    const newPos = {
      lat: mouseEvent.latLng.getLat(),
      lng: mouseEvent.latLng.getLng(),
    };
    setMarkerPosition(newPos);
  };

  // 마커 위치 변경 시 주소 변환
  useEffect(() => {
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) return;
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2Address(markerPosition.lng, markerPosition.lat, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const roadAddress = result[0].road_address ? result[0].road_address.address_name : '';
        const jibunAddress = result[0].address.address_name;
        onAddressSelect(roadAddress || jibunAddress);
      }
    });
  }, [markerPosition, onAddressSelect]);

  // 장소 검색 함수
  const searchPlaces = () => {
    if (!map || !keyword.trim()) return; // 지도 객체가 없거나 검색어가 비어있으면 중단

    const ps = new kakao.maps.services.Places();
    // 키워드로 장소를 검색합니다
    ps.keywordSearch(keyword, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        const bounds = new kakao.maps.LatLngBounds();
        if (data.length > 0) {
           const place = data[0]; // 첫 번째 결과 사용
           const position = {
               lat: parseFloat(place.y),
               lng: parseFloat(place.x),
           };
           setMarkerPosition(position); // 마커 위치 이동
           bounds.extend(new kakao.maps.LatLng(position.lat, position.lng));
           map.setBounds(bounds); // 검색 결과 위치로 지도 이동
        } else {
            alert('검색 결과가 없습니다.');
        }
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
          alert('검색 결과가 존재하지 않습니다.');
          return;
      } else if (status === kakao.maps.services.Status.ERROR) {
          alert('검색 결과 중 오류가 발생했습니다.');
          return;
      }
    });
  };

  return (
    <Box>
      {/* 검색창과 버튼 */}
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          label="장소 검색"
          variant="outlined"
          fullWidth
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') searchPlaces(); }} // Enter 키로도 검색
        />
        <Button variant="contained" onClick={searchPlaces} sx={{ ml: 1 }}>
          검색
        </Button>
      </Box>
      {/* 지도 */}
      <Box sx={{ width: '100%', height: '400px' }}>
        <Map
          center={markerPosition} // 지도의 중심을 마커 위치와 동기화
          style={{ width: '100%', height: '100%' }}
          level={3}
          onClick={handleMapClick}
          onCreate={setMap} // 지도 객체를 state에 저장
        >
          <MapMarker position={markerPosition} />
        </Map>
      </Box>
    </Box>
  );
}

// MapContainer는 이제 필요 없으므로 삭제하거나, MapSelector를 직접 사용하도록 수정합니다.
// export default MapContainer;
export default MapSelector; // MapSelector를 직접 export 합니다.