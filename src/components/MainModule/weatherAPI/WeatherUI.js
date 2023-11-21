import React, { useState, useEffect } from 'react';
import AddWeatherInfo from './AddWeatherInfo';
const { kakao } = window;

//이 컴포넌트는 검색창에 쓰여진 지역을 카카오 api에 보내서 좌표를 응답받고,
//좌표를 기상청 전용 좌표로 변환하고,
//좌표에 따른 날씨정보를 요청한 후 응답받은 값을 AddWeatherInfo에 넘깁니다
// 원본: AddWeatherUI.js
// search: 검색한 keyword (성수동 등)
const WeatherUI = function ({ keyword }) {
  const [regionData, setRegionData] = useState(null); // 날씨 검색을 위한 지역 정보 객체
  const [regionName, setRegionName] = useState('서울'); // 지역명
  const [x, setX] = useState(126.978652258309); //x
  const [y, setY] = useState(37.566826004661); //y

  const [isLoading, setIsLoading] = useState(false); // 데이터 로딩 중 표시
  const [isError, setIsError] = useState(false); // fetch 에러 여부 표시

  var today = new Date(); //오늘 날짜
  var year; // 년도
  var month; // 월
  var date; // 일
  var newToday; //202311 -> 20230101

  useEffect(() => {
    today = new Date();
    year = today.getFullYear();
    month = today.getMonth() + 1;
    date = today.getDate();
    date--; //'어제' 예측된 오늘의 날씨이므로 1일을 뺍니다

    if (month < 10) {
      //month가 1의 자리수면
      month = '0' + month;
    }

    if (date < 10) {
      //date가 1의 자리수면
      date = '0' + date;
    }

    newToday = '' + year + month + date;

    // 주소-좌표 변환 객체를 생성합니다
    var geocoder = new kakao.maps.services.Geocoder();

    // 주소로 좌표를 검색합니다
    geocoder.addressSearch(keyword, function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        //정상적으로 검색되면 좌표와 검색어 업데이트
        setX(result[0].x);
        setY(result[0].y);
        setRegionName(keyword);
        fetchWeatherData(result[0].x, result[0].y, keyword);
      } else {
        //검색결과 없을 시 - 서울
        setX(126.978652258309);
        setY(37.566826004661);
        setRegionName('서울');
        fetchWeatherData(126.978652258309, 37.566826004661, '서울');
      }
    });
  }, [keyword]);

  const fetchWeatherData = (x, y) => {
    // 기상청에서 제공한 GPS -> GRID 좌표변환 코드 (시작)
    var RE = 6371.00877; // 지구 반경(km)
    var GRID = 5.0; // 격자 간격(km)
    var SLAT1 = 30.0; // 투영 위도1(degree)
    var SLAT2 = 60.0; // 투영 위도2(degree)
    var OLON = 126.0; // 기준점 경도(degree)
    var OLAT = 38.0; // 기준점 위도(degree)
    var XO = 43; // 기준점 X좌표(GRID)
    var YO = 136; // 기준점 Y좌표(GRID)

    var rs = dfs_xy_conv('toXY', y, x);

    function dfs_xy_conv(code, v1, v2) {
      var DEGRAD = Math.PI / 180.0;
      var RADDEG = 180.0 / Math.PI;

      var re = RE / GRID;
      var slat1 = SLAT1 * DEGRAD;
      var slat2 = SLAT2 * DEGRAD;
      var olon = OLON * DEGRAD;
      var olat = OLAT * DEGRAD;

      var sn =
        Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
        Math.tan(Math.PI * 0.25 + slat1 * 0.5);
      sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
      var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
      sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
      var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
      ro = (re * sf) / Math.pow(ro, sn);
      var rs = {};
      if (code == 'toXY') {
        rs['lat'] = v1;
        rs['lng'] = v2;
        var ra = Math.tan(Math.PI * 0.25 + v1 * DEGRAD * 0.5);
        ra = (re * sf) / Math.pow(ra, sn);
        var theta = v2 * DEGRAD - olon;
        if (theta > Math.PI) theta -= 2.0 * Math.PI;
        if (theta < -Math.PI) theta += 2.0 * Math.PI;
        theta *= sn;
        rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
        rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
      }

      return rs;
    }
    // 기상청에서 제공한 GPS -> GRID 좌표변환 코드 (끝)

    let url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=jSLG7PhndCZp9dBtSCY5UGFS4dLgXrtHWCe4JURn1K7VE7UDXwRv9xyHgez0UaGVP8L9%2Bv22bAKf9Uy%2BPWrFeQ%3D%3D&pageNo=1&numOfRows=160&dataType=JSON&base_date=${newToday}&base_time=0500&nx=${rs.x}&ny=${rs.y}`;

    setIsLoading(true); // 로딩 시작
    setIsError(false); // 에러 초기화

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('응답이 없음');
        }
        return response.json();
      })
      .then((data) => {
        setRegionData(data);
        setIsLoading(false); // 로딩 완료
      })
      .catch((error) => {
        console.error('데이터 가져오기 오류(AddWeather):', error);
        setIsError(true); // 에러 발생
        setIsLoading(false); // 로딩 완료
      });
  };

  return (
    <>
      <AddWeatherInfo
        regionName={regionName}
        regionData={regionData}
        isLoading={isLoading}
        isError={isError}
        setIsLoading={setIsLoading}
        setIsError={setIsError}
      />
    </>
  );
};

export default WeatherUI;
