import 'bootstrap/dist/css/bootstrap.min.css';
import { HashLoader } from 'react-spinners';
import { BiSolidErrorAlt } from 'react-icons/bi';

// 이미지 경로명 저장
const cloudy = 'cloudy';
const snow = 'snow';
const sunny = 'sunny';
const rain = 'rain';
const rainAndSnow = 'rainAndSnow';
const cloudyHeavy = 'cloudyHeavy';
const imgPath = 'img/weatherImg';

// 날씨에 따라 표시할 날씨 이름과 이미지 경로를 객체로 저장
const weatherMap = {
  sunny: {
    text: '맑음',
    img: `${imgPath}/${sunny}.jpg`,
  },
  cloudy: {
    text: '구름 많음',
    img: `${imgPath}/${cloudy}.jpg`,
  },
  cloudyHeavy: {
    text: '흐림',
    img: `${imgPath}/${cloudyHeavy}.jpg`,
  },
  rain: {
    text: '비',
    img: `${imgPath}/${rain}.jpg`,
  },
  rainAndSnow: {
    text: '비/눈',
    img: `${imgPath}/${rainAndSnow}.jpg`,
  },
  snow: {
    text: '눈',
    img: `${imgPath}/${snow}.jpg`,
  },
};

// 비 안오는 날씨 타입 매핑
const weatherTypeMap = {
  1: sunny,
  3: cloudy,
  4: cloudyHeavy,
};

// 비 오는 날씨 타입 매핑
const weatherRainTypeMap = {
  1: rain,
  2: rainAndSnow,
  3: snow,
  4: rain,
};

// 날씨 정보 받아서 매핑하는 함수
// API 로직 특성상 비가 오는/안오는 날씨 모두를 검사해야 정확한 데이터를 얻을 수 있음.
function getWeatherType(weatherInfo, index) {
  let weatherType = weatherTypeMap[weatherInfo[index].fcstValue];
  if (weatherInfo[index + 1].fcstValue in weatherRainTypeMap) {
    weatherType = weatherRainTypeMap[weatherInfo[index + 1].fcstValue];
  }
  return weatherType || '';
}

//이 컴포넌트는 AddWeatherUI로 부터 받은 지역정보를 표시하고,
//그 아래에는 AddWeatherUI로 부터 받은 날씨 예측정보를 토대로 정보를 출력합니다.
// regionName: 지역명(서울)
// regionData: 지역 날씨 데이터 객체
const AddWeatherInfo = function ({
  regionName,
  regionData,
  isLoading,
  isError,
}) {
  let weatherInfo = [];
  if (
    regionData &&
    regionData.response &&
    regionData.response.body &&
    regionData.response.body.items &&
    regionData.response.body.items.item
  ) {
    weatherInfo = regionData.response.body.items.item;

    // 오전과 오후의 날씨 정보 저장
    let daySky = getWeatherType(weatherInfo, 36 + 5);
    let nightSky = getWeatherType(weatherInfo, 145 + 5);

    // 오전과 오후의 기온 정보 저장
    let dayTmp = weatherInfo[36].fcstValue;
    let nightTmp = weatherInfo[145].fcstValue;

    // 화면에 표시할 문자열 지정하기
    let daySkyStr = weatherMap[daySky]?.text || '오전 데이터 가져오기 실패';
    let nightSkyStr = weatherMap[nightSky]?.text || '오후 데이터 가져오기 실패';

    // 날씨 아이콘
    let dayImg = weatherMap[daySky]?.img || '';
    let nightImg = weatherMap[nightSky]?.img || '';

    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center m-3 p-3 border rounded shadow bg-white"
        style={{ height: '27vh', transition: '0.4s ease', overflow: 'hidden' }}
      >
        {isLoading ? (
          <HashLoader />
        ) : isError ? (
          <>
            <BiSolidErrorAlt
              style={{
                width: '50px',
                height: '50px',
                color: 'red',
                marginBottom: '20px',
              }}
            />
            <div>오류가 발생했습니다.</div>
            <div>나중에 다시 시도해주세요...</div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    );
  }
};

export default AddWeatherInfo;
