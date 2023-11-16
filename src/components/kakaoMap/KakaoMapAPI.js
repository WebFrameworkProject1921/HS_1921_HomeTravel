import styled from 'styled-components';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useState, useEffect } from 'react';
import '../../styles/kakaoMap.css';

import WeatherUI from '../weatherAPI/WeatherUI';
import News from '../MainModule/News';
import KakaoMarkers from './KakaoMarkers';
import BottomSideBar from '../tourInfoAPI/BottomSideBar';

const StyledMapContainer = styled.div`
  position: fixed;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 100vh;
  left: 50%;
  top: 50%;
  z-index: 1;
`;

const RightBarContainer = styled.div`
  position: fixed;
  right: 0;
  top: 16vh;
  width: 320px;
  height: 84vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 2;
`;

const LeftBarContainer = styled.div`
  position: relative;
  width: 320px;
  height: 84vh;
  top: 16vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
`;

const SearchBox = styled.div`
  position: absolute;
  width: 95%;
  height: 50px;
  left: 2.5%;
  top: 1.2vh;
  margin-bottom: 1%;
  img {
    position: absolute;
    right: 10px;
    top: 10px;
  }
  z-index: 2;
`;

const Search = styled.input`
  background-color: #eaeaea;
  width: 100%;
  height: 100%;
  outline: none;
  border-radius: 5px;
  font-size: 1em;
  z-index: 2;
`;

export const KakaoMapAPI = ({ keyword, setKeyword = (f) => f }) => {
  const [markers, setMarkers] = useState([]);
  const [info, setInfo] = useState();
  const [map, setMap] = useState();
  const [inputValue, setInputValue] = useState('');
  const [markerState, setMarkerState] = useState(false); // 마커를 재설정 해야하는지 여부

  const { kakao } = window;

  // 키워드 입력시 엔터를 입력했을 때만 setKeyword 호출
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setKeyword(inputValue);
    }
  };

  // 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성
  let infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

  useEffect(() => {
    let options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(37.477082, 126.963543), //지도의 중심좌표.
      level: 5, //지도의 레벨(확대, 축소 정도)
    };
  }, []);

  function searchPlaces() {
    if (!keyword || !keyword.trim()) {
      return false;
    }

    // 장소검색 객체 생성 및 키워드로 장소검색 요청
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(keyword, placesSearchCB);
  }

  // 키워드 검색 완료 시 호출되는 콜백함수 입니다
  function placesSearchCB(data, status) {
    if (status === kakao.maps.services.Status.OK) {
      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가
      const bounds = new kakao.maps.LatLngBounds();
      let tempMarkers = [];

      for (var i = 0; i < data.length; i++) {
        tempMarkers.push({
          position: {
            lat: data[i].y,
            lng: data[i].x,
          },
          content: data[i].place_name,
        });

        bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
      }
      setMarkers(markers);

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
      map.setBounds(bounds);

      // 정상적으로 검색이 완료됐으면
      // 검색 목록과 마커를 표출합니다
      displayPlaces(data);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
      alert('검색 결과가 존재하지 않습니다.');
      return;
    } else if (status === kakao.maps.services.Status.ERROR) {
      alert('검색 결과 중 오류가 발생했습니다.');
      return;
    }
  }

  // 검색 결과 목록과 마커를 표출하는 함수
  function displayPlaces(places) {
    var listEl = document.getElementById('placesList'),
      menuEl = document.getElementById('menu_wrap'),
      fragment = document.createDocumentFragment(),
      bounds = new kakao.maps.LatLngBounds();

    // 검색 결과 목록에 추가된 항목들을 제거
    removeAllChildNods(listEl);

    // 지도에 표시되고 있는 마커를 제거
    removeMarker();

    for (var i = 0; i < places.length; i++) {
      // 마커를 생성하고 지도에 표시합니다
      var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
        marker = addMarker(placePosition, i),
        itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가
      bounds.extend(placePosition);

      // 마커와 검색결과 항목에 mouseover 했을때
      // 해당 장소에 인포윈도우에 장소명을 표시
      // mouseout 했을 때는 인포윈도우 닫기
      (function (marker, title) {
        kakao.maps.event.addListener(marker, 'mouseover', function () {
          displayInfowindow(marker, title);
        });

        kakao.maps.event.addListener(marker, 'mouseout', function () {
          infowindow.close();
        });

        itemEl.onmouseover = function () {
          displayInfowindow(marker, title);
        };

        itemEl.onmouseout = function () {
          infowindow.close();
        };
      })(marker, places[i].place_name);

      fragment.appendChild(itemEl);
    }

    // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map.setBounds(bounds);
  }

  // 검색결과 항목을 Element로 반환하는 함수입니다
  function getListItem(index, places) {
    var el = document.createElement('li'),
      itemStr =
        '<span class="markerbg marker_' +
        (index + 1) +
        '"></span>' +
        '<div class="info">' +
        '   <h5>' +
        places.place_name +
        '</h5>';

    if (places.road_address_name) {
      itemStr +=
        '    <span>' +
        places.road_address_name +
        '</span>' +
        '   <span class="jibun gray">' +
        places.address_name +
        '</span>';
    } else {
      itemStr += '    <span>' + places.address_name + '</span>';
    }

    itemStr += '  <span class="tel">' + places.phone + '</span>' + '</div>';

    el.innerHTML = itemStr;
    el.className = 'item';

    return el;
  }

  // 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
  function addMarker(position, idx) {
    var imageSrc =
        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
      imageSize = new kakao.maps.Size(36, 37), // 마커 이미지의 크기
      imgOptions = {
        spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
        spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
        offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
      },
      markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
      marker = new kakao.maps.Marker({
        position: position, // 마커의 위치
        image: markerImage,
      });

    marker.setMap(map); // 지도 위에 마커를 표출합니다

    return marker;
  }

  // 지도 위에 표시되고 있는 마커를 모두 제거합니다
  function removeMarker() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    setMarkers([]);
    setMarkerState(true); // 카테고리 마커를 지우기 위함
  }

  // 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
  // 인포윈도우에 장소명을 표시합니다
  function displayInfowindow(marker, title) {
    var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

    infowindow.setContent(content);
    infowindow.open(map, marker);
  }

  // 검색결과 목록의 자식 Element를 제거하는 함수입니다
  function removeAllChildNods(el) {
    while (el.hasChildNodes()) {
      el.removeChild(el.lastChild);
    }
  }

  return (
    <>
      {map && <KakaoMarkers map={map} markerState={markerState} />}
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
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
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

        <div className="map_wrap">
          <div id="menu_wrap" className="bg_white">
            <div className="option"></div>
            <div style={{ display: 'block' }}>
              {/* 검색 결과 목록 */}
              <ul id="placesList"></ul>

              {/* 페이지네이션 */}
              <div id="pagination"></div>
            </div>
          </div>
        </div>
      </LeftBarContainer>
      <RightBarContainer>
        <WeatherUI keyword={keyword} />
        <News keyword={keyword} />
      </RightBarContainer>
      <BottomSideBar keyword={keyword} />
    </>
  );
};

export default KakaoMapAPI;
