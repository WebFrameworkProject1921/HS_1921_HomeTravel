import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashLoader } from 'react-spinners';
import { BiSolidErrorAlt } from 'react-icons/bi';
const { kakao } = window;

//이 컴포넌트는 검색창에 쓰여진 지역을 네이버 뉴스api에 보내서 검색결과를 응답받고 출력합니다
// 네이버 뉴스 api는 프록시 서버로 우회하여 요청해야 하므로 setupProxy.js 작성 필요
// 원본: AddNews.js
const News = function ({ keyword }) {
  const [data, setData] = useState(null); //뉴스검색결과
  const [regionName, setRegionName] = useState('서울'); //검색어
  const [isLoading, setIsLoading] = useState(false); // 데이터 로딩 중 표시
  const [isError, setIsError] = useState(false); // fetch 에러 여부 표시

  // 뉴스 데이터 가져오기
  const fetchNews = (region) => {
    let url = `/v1/search/news.json?query=${region}&display=15&start=1&sort=sim`;

    setIsLoading(true); // 로딩 시작
    setIsError(false); // 에러 초기화

    fetch(url, {
      headers: {
        'X-Naver-Client-Id': 'E_E3qYAz_RU8Cgal2wDM',
        'X-Naver-Client-Secret': 'pcDLWEldn2',
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.log(response);
          throw new Error('응답이 없음');
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setIsLoading(false); // 로딩 완료
      })
      .catch((error) => {
        console.error('데이터 가져오기 오류(NewsBar):', error);
        setIsError(true); // 에러 발생
        setIsLoading(false); // 로딩 완료
      });
  };

  // keyword 유효성 검사 후 데이터 가져오는 fetchNews 호출
  useEffect(() => {
    setRegionName(keyword);

    // 주소-좌표 변환 객체를 생성합니다
    var geocoder = new kakao.maps.services.Geocoder();

    // 주소로 좌표를 검색합니다
    geocoder.addressSearch(keyword, function (result, status) {
      if (status !== kakao.maps.services.Status.OK) {
        setRegionName('서울');
        fetchNews('서울');
      } else {
        setRegionName(keyword);
        fetchNews(keyword);
      }
    });
  }, [keyword]);

  return (
    <>
      {isLoading ? (
        <div
          className="d-flex flex-column align-items-center m-3 p-3 justify-content-center border rounded shadow bg-white"
          style={{ height: '52vh', overflowY: 'auto' }}
        >
          <HashLoader />
        </div>
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
          <div>나중에 다시 시도해주세요...</div>
        </>
      ) : (
        <div
          className="d-flex flex-column align-items-center m-3 p-3 border rounded shadow bg-white"
          style={{ maxHeight: '52vh', overflowY: 'auto' }}
        >
          <div className="border-bottom border-primary mb-3">
            <h4 className="text-center">{regionName}의 News</h4>
          </div>
          <div className="d-flex flex-column justify-content-around w-100">
            {data &&
              data.items.map((news, i) => (
                <div
                  className="text-center mb-1"
                  style={{ borderBottom: '1px solid #dee2e6' }}
                  key={i}
                >
                  <p
                    className="text-primary small"
                    style={{ cursor: 'pointer', fontSize: '0.75rem' }}
                    onClick={() => {
                      window.open(
                        news.link,
                        'NewWindow',
                        'width=700, height=800'
                      );
                    }}
                  >
                    {news.title.replace(/<\/?b>|&quot;|&gt;/g, '')}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default News;
