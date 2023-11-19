import { MapMarker, MapTypeId } from 'react-kakao-maps-sdk';
const { kakao } = window;

function KakaoRoadMap({ center, setCenter = (f) => f, setIsError = f => f }) {
  return (
    <>
      <MapTypeId type={kakao.maps.MapTypeId.ROADVIEW} />
      <MapMarker
        position={center}
        draggable={true}
        onDragEnd={(marker) => {
          setCenter({
            lat: marker.getPosition().getLat(),
            lng: marker.getPosition().getLng(),
          });
          setIsError(false);
        }}
        image={{
          src: 'https://t1.daumcdn.net/localimg/localimages/07/2018/pc/roadview_minimap_wk_2018.png',
          size: { width: 26, height: 46 },
          options: {
            spriteSize: { width: 1666, height: 168 },
            spriteOrigin: { x: 705, y: 114 },
            offset: { x: 13, y: 46 },
          },
        }}
      />
    </>
  );
}

export default KakaoRoadMap;
