import styled from 'styled-components';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useState } from 'react';

const StyledMapContainer = styled.div`
  position: fixed;
  transform: translate(-50%, -50%);
  width: 100vw; // 뷰포트 너비의 80%
  height: 100vh; // 뷰포트 높이의 80%
  left: 50%;
  top: 50%;
  z-index: 1;
`;

const LeftBarContainer = styled.div`
  position: relative;
  width: 320px;
  height: calc(100vh - 130px);
  top: 130px;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
`;

const SearchBox = styled.div`
  position: absolute;
  width: 90%;
  height: 45px;
  left: 2.5%;
  top: 0.5%;
  margin-bottom: 1%;
  img {
    position: absolute;
    right: 10px;
    top: 10px;
  }
  z-index: 2;
`;

const Search = styled.input`
  padding-left: 10px;
  background-color: #eaeaea;
  width: 100%;
  height: 100%;
  outline: none;
  border-radius: 5px;
  font-size: 1em;
  z-index: 2;
`;

const SearchResultArea = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  z-index: 1;
`;

const RightBarContainer = styled.div`
  position: fixed; // 수정된 부분
  right: 0;
  top: 130px;
  width: 320px;
  height: calc(100vh - 130px);
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 2;
`;

export const KakaoMap = ({ closeModal }) => {
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
      <StyledMapContainer onClick={(e) => e.stopPropagation()}>
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
      </StyledMapContainer>
      <LeftBarContainer>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchPlaces();
          }}
        >
          <SearchBox>
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
          </SearchBox>
        </form>
        <SearchResultArea></SearchResultArea>
      </LeftBarContainer>
      <RightBarContainer></RightBarContainer>
    </>
  );
};

export default KakaoMap;
