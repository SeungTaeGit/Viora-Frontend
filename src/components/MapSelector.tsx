// src/components/MapSelector.tsx

import { useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

// 부모에게 선택된 주소를 전달하기 위한 타입 정의
interface MapSelectorProps {
  onAddressSelect: (address: string) => void;
}

function MapSelector({ onAddressSelect }: MapSelectorProps) {
  // 1. 지도의 초기 상태 설정
  const [state, setState] = useState({
    center: { lat: 37.5666103, lng: 126.9783882 }, // 초기 위치: 서울 시청
    level: 3, // 지도 확대 레벨
  });
  const [markerPosition, setMarkerPosition] = useState(state.center);

  // 2. 지도 클릭 이벤트 핸들러
  const handleMapClick = (_target: kakao.maps.Map, mouseEvent: kakao.maps.event.MouseEvent) => {
    const newPos = {
      lat: mouseEvent.latLng.getLat(),
      lng: mouseEvent.latLng.getLng(),
    };
    setMarkerPosition(newPos); // 클릭한 위치로 마커 이동

    // 3. 좌표를 주소로 변환 (Geocoding)
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2Address(newPos.lng, newPos.lat, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        // 도로명 주소를 우선적으로 사용, 없으면 지번 주소 사용
        const roadAddress = result[0].road_address ? result[0].road_address.address_name : '';
        const jibunAddress = result[0].address.address_name;
        onAddressSelect(roadAddress || jibunAddress); // 부모 컴포넌트에 주소 전달
      }
    });
  };

  return (
    <Map
      center={state.center}
      style={{ width: '100%', height: '400px' }}
      level={state.level}
      onClick={handleMapClick}
    >
      <MapMarker position={markerPosition} />
    </Map>
  );
}

export default MapSelector;