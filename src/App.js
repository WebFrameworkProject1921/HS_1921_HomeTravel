import logo from './logo.svg';
import './App.css';
import Kakao from './KakaoMap/Kakao';
import TestUI from './TestUI';

function App() {
  return (
    <div className="map_wrap" style={{ width: '100%', height: '100%' }}>
      <Kakao />
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
        <TestUI />
      </div>
    </div>
  );
}

export default App;
