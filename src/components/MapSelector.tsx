import { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

// 부모 컴포넌트로부터 받을 데이터(props)의 타입을 정의합니다.
interface MapSelectorProps {
  onAddressSelect: (address: string) => void;
  initialCenter?: { lat: number; lng: number }; // 수정 페이지를 위한 초기 위치 (선택 사항)
}

function MapSelector({ onAddressSelect, initialCenter }: MapSelectorProps) {
  // 지도의 초기 중심점을 설정합니다.
  // 부모로부터 initialCenter를 받으면 그 값을, 없으면 서울 시청을 기본값으로 사용합니다.
  const defaultCenter = initialCenter || { lat: 37.5666103, lng: 126.9783882 };

  // 지도와 마커의 상태를 관리합니다.
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);

  // 지도 클릭 이벤트 핸들러
  const handleMapClick = (_target: kakao.maps.Map, mouseEvent: kakao.maps.event.MouseEvent) => {
    const newPos = {
      lat: mouseEvent.latLng.getLat(),
      lng: mouseEvent.latLng.getLng(),
    };
    setMarkerPosition(newPos); // 클릭한 위치로 마커 이동
  };

  // 마커의 위치가 변경될 때마다 좌표를 주소로 변환합니다.
  useEffect(() => {
    // Geocoder 객체를 생성합니다.
    const geocoder = new kakao.maps.services.Geocoder();

    // 좌표로 주소를 검색합니다.
    geocoder.coord2Address(markerPosition.lng, markerPosition.lat, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        // 도로명 주소가 있으면 그것을 사용하고, 없으면 지번 주소를 사용합니다.
        const roadAddress = result[0].road_address ? result[0].road_address.address_name : '';
        const jibunAddress = result[0].address.address_name;

        // 부모 컴포넌트(ReviewWritePage, ReviewEditPage)에 변환된 주소를 전달합니다.
        onAddressSelect(roadAddress || jibunAddress);
      }
    });
  }, [markerPosition, onAddressSelect]); // 마커 위치가 바뀔 때마다 실행

  return (
    <Map
      center={markerPosition} // 지도의 중심을 마커 위치와 동기화
      style={{ width: '100%', height: '100%' }}
      level={3} // 지도 확대 레벨
      onClick={handleMapClick}
    >
      <MapMarker position={markerPosition} />
    </Map>
  );
}

export default MapSelector;