import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Kakao from './components/Kakao';
import Header from './components/Layout/Header';
import Main from './components/Main';
import SNS from './components/SNS';
import Calendar from './components/Calendar';
import { KakaoMap } from './components/KakaoMap';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div>
      <KakaoMap />
      <Sidebar width={320} />
      <BrowserRouter>
        <div className="App">
          <Header />
          {/* <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/SNS" element={<SNS />} />
            <Route path="/Calendar" element={<Calendar />} />
          </Routes> */}
        </div>
      </BrowserRouter>
    </div>
    // <div className="map_wrap" style={{ width: '100%', height: '100%' }}>
    //  <Kakao />
    // </div>
  );
}

export default App;
