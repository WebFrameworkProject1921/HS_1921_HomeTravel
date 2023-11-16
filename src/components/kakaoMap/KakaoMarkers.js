import React, { useEffect } from 'react';
import '../../styles/kakaoMarkers.css';
const { kakao } = window;

// 음식점, 마트, 학교, 지하철, 카페 편의점 카테고리 마커를 표시하는 컴포넌트
export const MapCategoryMarkers = ({ map }) => {
  useEffect(() => {
    // 마커를 클릭했을 때 해당 장소의 상세정보를 보여줄 커스텀오버레이
    var placeOverlay = new kakao.maps.CustomOverlay({ zIndex: 1 }),
      contentNode = document.createElement('div'), // 커스텀 오버레이의 컨텐츠 엘리먼트
      markers = [], // 마커를 담을 배열
      currCategory = ''; // 현재 선택된 카테고리를 가지고 있을 변수

    // 장소 검색 객체를 생성
    var ps = new kakao.maps.services.Places(map);

    // 지도에 idle 이벤트를 등록
    kakao.maps.event.addListener(map, 'idle', searchPlaces);

    // 커스텀 오버레이의 컨텐츠 노드에 css class를 추가
    contentNode.className = 'placeinfo_wrap';
    kakao.maps.event.addListener(map, 'click', function () {
      placeOverlay.setMap(null); // 지도를 클릭하면 오버레이를 숨깁니다
    });

    // 커스텀 오버레이의 컨텐츠 노드에 mousedown, touchstart 이벤트가 발생했을때
    // 지도 객체에 이벤트가 전달되지 않도록 이벤트 핸들러로 kakao.maps.event.preventMap 메소드를 등록
    addEventHandle(contentNode, 'mousedown', kakao.maps.event.preventMap);
    addEventHandle(contentNode, 'touchstart', kakao.maps.event.preventMap);

    // 커스텀 오버레이 컨텐츠를 설정
    placeOverlay.setContent(contentNode);

    // 각 카테고리에 클릭 이벤트를 등록
    addCategoryClickEvent();

    // 엘리먼트에 이벤트 핸들러를 등록하는 함수
    function addEventHandle(target, type, callback) {
      if (target.addEventListener) {
        target.addEventListener(type, callback);
      } else {
        target.attachEvent('on' + type, callback);
      }
    }

    // 카테고리 검색을 요청하는 함수
    function searchPlaces() {
      if (!currCategory) {
        return;
      }

      // 커스텀 오버레이 숨김
      placeOverlay.setMap(null);

      // 지도에 표시되고 있는 마커 제거
      removeMarker();

      ps.categorySearch(currCategory, placesSearchCB, { useMapBounds: true });
    }

    // 장소검색이 완료됐을 때 호출되는 콜백함수
    function placesSearchCB(data, status) {
      if (status === kakao.maps.services.Status.OK) {
        // 정상적으로 검색이 완료됐으면 지도에 마커를 표출
        displayPlaces(data);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        console.log(
          'MapCategoryMarker.js - placesSearchCB() 에서 장소검색 결과 없음'
        );
      } else if (status === kakao.maps.services.Status.ERROR) {
        console.log(
          'MapCategoryMarker.js - placesSearchCB() 에서 장소검색 에러 발생'
        );
      }
    }

    // 지도에 마커를 표출하는 함수
    function displayPlaces(places) {
      // 몇번째 카테고리가 선택되어 있는지 얻어옵니다
      // 이 순서는 스프라이트 이미지에서의 위치를 계산하는데 사용됩니다
      var order = document
        .getElementById(currCategory)
        .getAttribute('data-order');

      for (var i = 0; i < places.length; i++) {
        // 마커를 생성하고 지도에 표시
        var marker = addMarker(
          new kakao.maps.LatLng(places[i].y, places[i].x),
          order
        );

        // 마커와 검색결과 항목을 클릭 했을 때
        // 장소정보를 표출하도록 클릭 이벤트를 등록
        (function (marker, place) {
          kakao.maps.event.addListener(marker, 'click', function () {
            displayPlaceInfo(place);
          });
        })(marker, places[i]);
      }
    }

    // 마커를 생성하고 지도 위에 마커를 표시하는 함수
    function addMarker(position, order) {
      var imageSrc =
          'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(27, 28), // 마커 이미지의 크기
        imgOptions = {
          spriteSize: new kakao.maps.Size(72, 208), // 스프라이트 이미지의 크기
          spriteOrigin: new kakao.maps.Point(46, order * 36), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
          offset: new kakao.maps.Point(11, 28), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imgOptions
        ),
        marker = new kakao.maps.Marker({
          position: position, // 마커의 위치
          image: markerImage,
        });

      marker.setMap(map); // 지도 위에 마커를 표출
      markers.push(marker); // 배열에 생성된 마커를 추가

      return marker;
    }

    // 지도 위에 표시되고 있는 마커를 모두 제거
    function removeMarker() {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      markers = [];
    }

    // 클릭한 마커에 대한 장소 상세정보를 커스텀 오버레이로 표시하는 함수
    function displayPlaceInfo(place) {
      var content =
        '<div class="placeinfo">' +
        '   <a class="title" href="' +
        place.place_url +
        '" target="_blank" title="' +
        place.place_name +
        '">' +
        place.place_name +
        '</a>';

      if (place.road_address_name) {
        content +=
          '    <span title="' +
          place.road_address_name +
          '">' +
          place.road_address_name +
          '</span>' +
          '  <span class="jibun" title="' +
          place.address_name +
          '">(지번 : ' +
          place.address_name +
          ')</span>';
      } else {
        content +=
          '    <span title="' +
          place.address_name +
          '">' +
          place.address_name +
          '</span>';
      }

      content +=
        '    <span class="tel">' +
        place.phone +
        '</span>' +
        '</div>' +
        '<div class="after"></div>';

      contentNode.innerHTML = content;
      placeOverlay.setPosition(new kakao.maps.LatLng(place.y, place.x));
      placeOverlay.setMap(map);
    }

    // 각 카테고리에 클릭 이벤트를 등록
    function addCategoryClickEvent() {
      var category = document.getElementById('category'),
        children = category.children;

      for (var i = 0; i < children.length; i++) {
        children[i].onclick = onClickCategory;
      }
    }

    // 카테고리를 클릭했을 때 호출되는 함수
    function onClickCategory() {
      var id = this.id,
        className = this.className;

      placeOverlay.setMap(null);

      if (className === 'on') {
        currCategory = '';
        changeCategoryClass();
        removeMarker();
      } else {
        currCategory = id;
        changeCategoryClass(this);
        searchPlaces();
      }
    }

    // 클릭된 카테고리에만 클릭된 스타일을 적용하는 함수
    function changeCategoryClass(el) {
      var category = document.getElementById('category'),
        children = category.children,
        i;

      for (i = 0; i < children.length; i++) {
        children[i].className = '';
      }

      if (el) {
        el.className = 'on';
      }
    }
  }, []);

  return (
    <>
      <div>
        <ul id="category">
          <li id="FD6" data-order="0">
            <span className="category_bg bank"></span>
            음식점
          </li>
          <li id="MT1" data-order="1">
            <span className="category_bg mart"></span>
            마트
          </li>
          <li id="PM9" data-order="2">
            <span className="category_bg pharmacy"></span>
            약국
          </li>
          <li id="SW8" data-order="3">
            <span className="category_bg oil"></span>
            지하철
          </li>
          <li id="CE7" data-order="4">
            <span className="category_bg cafe"></span>
            카페
          </li>
          <li id="CS2" data-order="5">
            <span className="category_bg store"></span>
            편의점
          </li>
          <li> </li> {/*관광지 버튼 들어갈 스타일 공간이므로 삭제하면 안됨*/}
        </ul>
      </div>
    </>
  );
};

export default MapCategoryMarkers;
