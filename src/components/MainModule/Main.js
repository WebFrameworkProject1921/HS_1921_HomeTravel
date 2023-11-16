import KakaoMapAPI from '../kakaoMap/KakaoMapAPI';

function Main({ keyword, setKeyword = (f) => f }) {
  return (
    <div>
      <KakaoMapAPI
        keyword={keyword}
        setKeyword={(newKeyword) => setKeyword(newKeyword)}
      />
    </div>
  );
}

export default Main;
