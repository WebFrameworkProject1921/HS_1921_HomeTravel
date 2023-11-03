import KakaoMap from './KakaoMap';

function Main({ keyword, setKeyword = (f) => f }) {
  return (
    <div>
      <KakaoMap
        keyword={keyword}
        setKeyword={(newKeyword) => setKeyword(newKeyword)}
      />
    </div>
  );
}

export default Main;
