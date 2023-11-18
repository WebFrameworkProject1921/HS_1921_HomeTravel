import React, { useEffect, useState } from 'react';
import '../../styles/Calender.css';
import Modal from 'react-modal';
import { Map, MapMarker, Polyline } from 'react-kakao-maps-sdk';
import CircularProgress from '@mui/material/CircularProgress';
import { KAKAO_MOBILITY_API_KEY } from '../../config/KakaoMobilityKey';
const { kakao } = window;

Modal.setAppElement('#root'); //모달이 나타날 때 모달창 아래의 콘텐츠의 포커스 처리를 도와주는 코드

const ColumnModal = ({ isOpen, onClose, column, columnIndex }) => {
  const [startLocation, setStartLocation] = useState({
    lat: '0',
    lng: '0',
  }); //중심 좌표
  const [markers, setMarkers] = useState([]); //마커 위치(카드들의 위치 좌표)
  const [stopovers, setStopovers] = useState([]); // 경유지 좌표
  const [distance, setDistance] = useState(0); //총 거리
  const [duration, setDuration] = useState(0); // 총 이동 시간(차량 기준)
  const [isLoading, setLoading] = useState(true); //경로 가져오는 동안 로딩 표시
  useEffect(() => {
    const newMarkers = column.cards.map((card) => ({
      //컬럼 내의 카드들의 좌표 가져와서 markers에 저장
      position: { lat: card.place.lat, lng: card.place.lng },
      name: card.place.name,
    }));
    setMarkers(newMarkers);
    if (newMarkers.length > 0) {
      //마커가 하나라도 있으면 처음 중심좌표를 첫번째 마커의 위치로 함
      setStartLocation(newMarkers[0].position);
    }
    const fetchData = async () => {
      console.log('스타트');
      //출발지와 도착지의 좌표 사이의 갈림길들의 좌표를 구한다.
      const newStepovers = [];
      let newDistance = 0;
      let newDuration = 0;
      for (let i = 0; i < newMarkers.length - 1; i++) {
        //for문을 돌며 컬럼 내 카드들을 출발지, 도착지로 설정하며 경로를 가져온다.
        const origin = `${newMarkers[i].position.lng},${newMarkers[i].position.lat}`; //출발지
        const destination = `${newMarkers[i + 1].position.lng},${
          newMarkers[i + 1].position.lat
        }`; //도착지
        if (origin === destination) continue;
        const temp = await getStepovers(origin, destination); //temp에 경유지 좌표가 들어옴
        newStepovers.push(...temp.stepovers);
        newDistance += temp.distance;
        newDuration += temp.duration;
      }
      setStopovers(newStepovers); //새로운 경유지 좌표 설정
      setDistance(newDistance);
      setDuration(newDuration);
      setLoading(false);
    };
    if (isOpen) fetchData(); //모달창이 열릴때만 경로 계산
    return () => {
      //클린업 함수
      setMarkers([]);
      setStopovers([]);
      setLoading(true);
      console.log('클린업!!!!');
    };
  }, [isOpen]); //모달창 오픈시 마커 위치 조정, 경로표시를 위한 stopovers 조정
  if (!isOpen) {
    return null;
  }
  async function getStepovers(origin, destination) {
    //출발지와 도착지 좌표를 매개변수로 받아 경유지 좌표들을 리턴하는 함수
    const REST_API_KEY = KAKAO_MOBILITY_API_KEY; //카카오 모빌리티 API 키
    const headers = {
      Authorization: `KakaoAK ${REST_API_KEY}`,
      'Content-Type': 'application/json',
    };

    const queryParams = new URLSearchParams({
      origin: origin,
      destination: destination,
    }); //요청 파라미터

    const url = `https://apis-navi.kakaomobility.com/v1/directions?${queryParams}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json(); //경유지 데이터를 가져옴
      console.log(data);
      const linePath = [];
      //경유지 데이터에서 좌표만 가져와서 linePath에 저장
      data.routes[0].sections[0].roads.map((road) => {
        for (let i = 0; i < road.vertexes.length - 2; i += 2) {
          linePath.push({
            position: { lat: road.vertexes[i + 1], lng: road.vertexes[i] },
          }); //데이터가 vertexes에 lng, lat 순서로 들어옴
        }
      });
      console.log('거리' + data.routes[0].summary.distance);
      console.log('시간' + data.routes[0].summary.duration);
      const temp = {
        stepovers: linePath,
        distance: data.routes[0].summary.distance,
        duration: data.routes[0].summary.duration,
      };
      return temp; //temp 리턴, temp는 경유지좌표, 총 이동거리, 총 소요시간을 속성으로 가짐
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const CustomMarker = ({ position, number }) => (
    <div
      style={{
        position: 'absolute',
        top: '25px',
        left: '60px',
        zIndex: '9',
        width: '30px',
        height: '30px',
        background: '#FF0000',
        color: '#FFFFFF',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {number}
    </div>
  );
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="column-modal"
      overlayClassName="modal-overlay"
    >
      <div className="modal-head">
        <span className="modal-title">Day {columnIndex + 1}</span>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'right',
          alignItems: 'center',
          width: '80%',
          height: '80px',
        }}
      >
        총 이동거리: {(distance / 1000).toFixed(2)} km
        <br /> 총 소요시간&#40;차량&#41;: {Math.round(duration / 60)} 분
      </div>
      {markers.length !== 0 ? (
        !isLoading ? (
          <div
            style={{
              width: '400px',
              height: '400px',
            }}
          >
            <Map
              id="map"
              isPanto={true}
              center={{ lat: startLocation.lat, lng: startLocation.lng }}
              style={{
                width: '100%',
                height: '100%',
              }}
              level={10}
            >
              {markers.map((marker, index) => (
                <MapMarker
                  key={`marker-${marker.name}-${marker.position.lat},${marker.position.lng}`}
                  position={marker.position}
                  image={{
                    src: process.env.PUBLIC_URL + '/img/calender/white.png',
                    size: new kakao.maps.Size(20, 20),
                  }}
                  opacity={0.01} //이미지 설정해서 MapMarker를 안보이게 하고,이미지 투명도 낮춰서 우리가 만든 CustomMarker만 보이게한다.
                >
                  <div
                    style={{
                      width: '150px',
                      height: '23px',
                      overflow: 'hidden',
                    }}
                  >
                    {marker.name}
                    <CustomMarker
                      position={marker.position}
                      number={index + 1}
                    />
                  </div>
                </MapMarker>
              ))}
              <Polyline
                path={stopovers.map((stopover) => stopover.position)}
                strokeWeight={3}
                strokeColor="#FF0000"
              />
            </Map>
          </div>
        ) : (
          <div className="column-modal-box">
            <CircularProgress />
          </div>
        )
      ) : (
        <div className="column-modal-box">등록된 일정이 없습니다.</div>
      )}
      <br />
      <div className="modal-close" onClick={onClose}>
        <span className="modal-close-text">닫기</span>
      </div>
    </Modal>
  );
};

export default ColumnModal;
