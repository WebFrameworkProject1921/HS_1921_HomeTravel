import React, { useState, useEffect } from 'react';
import BottomCardModal from './BottomCardModal';
import { Row, Col } from 'antd';

//이 컴포넌트는 검색결과의 수만큼 카드를 띄웁니다.
//그리고 카드들의 정렬을 담당합니다.
//각 카드에 대한 정보는 AddBottomCards가 아니라, AddBottomCard가 표시합니다.
//AddBottomCard에는 App에서의 검색결과를 넘겨줍니다
const BottomCardList = function ({ keyword, selectedType }) {
  const [placeData, setPlaceData] = useState();
  const { kakao } = window;
  let cardInfo = [];

  useEffect(() => {
    let url = `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?numOfRows=100&MobileOS=WIN&MobileApp=App&_type=json&keyword=${keyword}&contentTypeId=${selectedType}&serviceKey=jSLG7PhndCZp9dBtSCY5UGFS4dLgXrtHWCe4JURn1K7VE7UDXwRv9xyHgez0UaGVP8L9%2Bv22bAKf9Uy%2BPWrFeQ%3D%3D`;
    // 주소-좌표 변환 객체를 생성합니다
    var geocoder = new kakao.maps.services.Geocoder();

    // 주소로 좌표를 검색합니다
    geocoder.addressSearch(keyword, function (result, status) {
      if (status !== kakao.maps.services.Status.OK) {
        // 좌표 검색 실패하면 디폴트 서울로 검색
        url = `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?numOfRows=100&MobileOS=WIN&MobileApp=App&_type=json&keyword=%EC%84%9C%EC%9A%B8&serviceKey=jSLG7PhndCZp9dBtSCY5UGFS4dLgXrtHWCe4JURn1K7VE7UDXwRv9xyHgez0UaGVP8L9%2Bv22bAKf9Uy%2BPWrFeQ%3D%3D`;
      }
    });

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('응답이 없음');
        }
        return response.json();
      })
      .then((data) => {
        setPlaceData(data); //응답받은 검색결과를 App 컴포넌트에 보낸다
      })
      .catch((error) => {
        console.error('데이터 가져오기 오류(AddSearchBox):', error);
      });
  }, [keyword, selectedType]);

  if (
    placeData &&
    placeData.response &&
    placeData.response.body &&
    placeData.response.body.items &&
    placeData.response.body.items.item
  ) {
    cardInfo = placeData.response.body.items.item;
  }

  return (
    <>
      <Row gutter={0} style={{ width: '100vw' }}>
        {cardInfo.map((card, i) => (
          <Col span={4} key={i}>
            <BottomCardModal
              data={card}
              name={card.title}
              address={card.addr1}
              image={card.firstimage}
            />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default BottomCardList;
