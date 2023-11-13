import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// 이미지 경로 설정
const cloudy = 'cloudy';
const snow = 'snow';
const sunny = 'sunny';
const rain = 'rain';
const rainAndSnow = 'rainAndSnow';
const cloudyHeavy = 'cloudyHeavy';
const imgPath = 'img/weatherImg';

//이 컴포넌트는 AddWeatherUI로 부터 받은 지역정보를 표시하고,
//그 아래에는 AddWeatherUI로 부터 받은 날씨 예측정보를 토대로 정보를 출력합니다.
// regionName: 지역명(서울)
// regionData: 지역 날씨 데이터 객체
const AddWeatherInfo = function ({ regionName, regionData }) {
  let weatherInfo = [];

  if (
    regionData &&
    regionData.response &&
    regionData.response.body &&
    regionData.response.body.items &&
    regionData.response.body.items.item
  ) {
    weatherInfo = regionData.response.body.items.item;

    let daySky; //오전날씨
    let dayTmp = weatherInfo[36].fcstValue; //오전 기온
    let nightSky = weatherInfo[145 + 5].fcstValue; //오후날씨
    let nightTmp = weatherInfo[145].fcstValue; //오후 기온
    let dayImg; //오전 날씨 아이콘
    let nightImg; //오후 날씨 아이콘

    let daySkyStr;
    let nightSkyStr;

    //기본 날씨 (오전)
    if (weatherInfo[36 + 5].fcstValue == 1) daySky = sunny;
    else if (weatherInfo[36 + 5].fcstValue == 3) daySky = cloudy;
    else if (weatherInfo[36 + 5].fcstValue == 4) daySky = cloudyHeavy;

    //비가 올 경우 업데이트 (오전)
    if (weatherInfo[36 + 6].fcstValue == 1) daySky = rain;
    else if (weatherInfo[36 + 6].fcstValue == 2) daySky = rainAndSnow;
    else if (weatherInfo[36 + 6].fcstValue == 3) daySky = snow;
    else if (weatherInfo[36 + 6].fcstValue == 4) daySky = rain;

    //기본 날씨(오후)
    if (weatherInfo[145 + 5].fcstValue == 1) nightSky = sunny;
    else if (weatherInfo[145 + 5].fcstValue == 3) nightSky = cloudy;
    else if (weatherInfo[145 + 5].fcstValue == 4) nightSky = cloudyHeavy;

    //비가 올 경우 업데이트 (오전)
    if (weatherInfo[146 + 6].fcstValue == 1) nightSky = rain;
    else if (weatherInfo[146 + 6].fcstValue == 2) nightSky = rainAndSnow;
    else if (weatherInfo[146 + 6].fcstValue == 3) nightSky = snow;

    // 화면에 표시할 문자열 지정하기
    switch (daySky) {
      case sunny:
        daySkyStr = '맑음';
        break;
      case cloudy:
        daySkyStr = '구름 많음';
        break;
      case cloudyHeavy:
        daySkyStr = '흐림';
        break;
      case rain:
        daySkyStr = '비';
        break;
      case rainAndSnow:
        daySkyStr = '비/눈';
        break;
      case snow:
        daySkyStr = '눈';
        break;
      default:
        daySkyStr = '오전 데이터 가져오기 실패';
    }

    switch (nightSky) {
      case sunny:
        nightSkyStr = '맑음';
        break;
      case cloudy:
        nightSkyStr = '구름 많음';
        break;
      case cloudyHeavy:
        nightSkyStr = '흐림';
        break;
      case rain:
        nightSkyStr = '비';
        break;
      case rainAndSnow:
        nightSkyStr = '비/눈';
        break;
      case snow:
        nightSkyStr = '눈';
        break;
      default:
        nightSkyStr = '오후 데이터 가져오기 실패';
    }

    //날씨 아이콘 (오전)
    if (daySky == sunny) dayImg = `${imgPath}/${sunny}.jpg`;
    else if (daySky == cloudy) dayImg = `${imgPath}/${cloudy}.jpg`;
    else if (daySky == cloudyHeavy) dayImg = `${imgPath}/${cloudyHeavy}.jpg`;
    else if (daySky == rain) dayImg = `${imgPath}/${rain}.jpg`;
    else if (daySky == rainAndSnow) dayImg = `${imgPath}/${rainAndSnow}.jpg`;
    else if (daySky == snow) dayImg = `${imgPath}/${snow}.jpg`;
    else if (daySky == rain) dayImg = `${imgPath}/${rain}.jpg`;

    //날씨 아이콘 (오후)
    if (nightSky == sunny) nightImg = `${imgPath}/${sunny}.jpg`;
    else if (nightSky == cloudy) nightImg = `${imgPath}/${cloudy}.jpg`;
    else if (nightSky == cloudyHeavy)
      nightImg = `${imgPath}/${cloudyHeavy}.jpg`;
    else if (nightSky == rain) nightImg = `${imgPath}/${rain}.jpg`;
    else if (nightSky == rainAndSnow)
      nightImg = `${imgPath}/${rainAndSnow}.jpg`;
    else if (nightSky == snow) nightImg = `${imgPath}/${snow}.jpg`;
    else if (nightSky == rain) nightImg = `${imgPath}/${rain}.jpg`;

    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center m-3 p-3 border rounded shadow bg-white"
        style={{ height: '27vh', transition: '0.4s ease', overflow: 'hidden' }}
      >
        <div className="border-bottom border-primary mb-3">
          <h4 className="text-center">{regionName}의 날씨</h4>
        </div>

        <div className="d-flex justify-content-around w-100">
          <div className="text-center">
            <img src={dayImg} className="mb-3 rounded-circle" />
            <div>
              <strong>오전</strong>
            </div>
            <div className="text-primary">
              <strong>
                <span style={{ color: '#007bff' }}>{daySkyStr}</span>{' '}
                <span style={{ color: '#dc3545' }}>{dayTmp}º</span>
              </strong>
            </div>
          </div>

          <div className="text-center">
            <img src={nightImg} className="mb-3 rounded-circle" />
            <div>
              <strong>오후</strong>
            </div>
            <div className="text-primary">
              <strong>
                <span style={{ color: '#007bff' }}>{nightSkyStr}</span>{' '}
                <span style={{ color: '#dc3545' }}>{nightTmp}º</span>
              </strong>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default AddWeatherInfo;
