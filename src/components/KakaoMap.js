import styled from 'styled-components';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useEffect } from 'react';
import { useState } from 'react';

const StyledBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 0;
  cursor: auto;
`;

const StyledModalContainer = styled.div`
  position: fixed;
  transform: translate(-50%, -50%);
  width: 70vw; // 뷰포트 너비의 80%
  height: 80vh; // 뷰포트 높이의 80%
  left: 50%;
  top: 50%;

  .myMap {
    border-radius: 10px;
    box-shadow: 1px 1px 10px 1px rgb(71, 181, 255);
  }
`;

const SearchContainer = styled.div`
  position: fixed;
  width: 13%;
  height: 4%;
  left: 1%;
  top: 10%;
  border: 0;
  margin-bottom: 20px;
  img {
    position: absolute;
    right: 10px;
    top: 10px;
  }
`;

const Search = styled.input`
  border: 0;
  padding-left: 10px;
  background-color: #eaeaea;
  width: 100%;
  height: 100%;
  outline: none;
  border-radius: 5px;
`;

export const KakaoMap = ({ showModal, closeModal }) => {
  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState();
  const [keyword, setKeyword] = useState('');
  const { kakao } = window;

  function searchPlaces() {
    if (!keyword || !keyword.trim()) {
      return false;
    }

    // 장소검색 객체 생성 및 키워드로 장소검색 요청
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data, status, _pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        const bounds = new kakao.maps.LatLngBounds();
        let markers = [];

        for (var i = 0; i < data.length; i++) {
          // @ts-ignore
          markers.push({
            position: {
              lat: data[i].y,
              lng: data[i].x,
            },
            content: data[i].place_name,
          });
          // @ts-ignore
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        setMarkers(markers);

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds);
      }
    });
  }

  return (
    <>
      <StyledBackground onClick={closeModal}>
        <StyledModalContainer onClick={(e) => e.stopPropagation()}>
          <Map
            className="myMap"
            style={{ width: '100%', height: '100%' }}
            center={{ lat: 37.477082, lng: 126.963543 }}
            level={3}
            onCreate={setMap}
          >
            {markers.map((marker) => (
              <MapMarker
                key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
                position={marker.position}
                onClick={() => setInfo(marker)}
              >
                {info && info.content === marker.content && (
                  <div style={{ color: '#000' }}>{marker.content}</div>
                )}
              </MapMarker>
            ))}
          </Map>
        </StyledModalContainer>
      </StyledBackground>
      <div id="search_bar">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchPlaces();
          }}
        >
          <SearchContainer>
            <Search
              type="text"
              id="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              size="15"
            />
            <img
              src="img/search.png"
              alt="searchIcon"
              style={{
                width: 10 + '%',
                height: 70 + '%',
                left: 88 + '%',
                top: 20 + '%',
              }}
            />
          </SearchContainer>
        </form>
      </div>
    </>
  );
};
