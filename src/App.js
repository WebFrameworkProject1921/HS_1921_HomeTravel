import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Kakao from './components/Kakao';
import Header from './components/Layout/Header';
import Main from './components/Main';
import SNS from './components/SNS';
import Calendar from './components/Calendar';
import { KakaoMapModal } from './components/KakaoMapModal';

function App() {
  return (
    <div>
      <KakaoMapModal />
    </div>
    // <BrowserRouter>
    //   <div className="App">
    //     <Header />
    //     <Routes>
    //       <Route path="/" element={<Main />} />
    //       <Route path="/SNS" element={<SNS />} />
    //       <Route path="/Calendar" element={<Calendar />} />
    //     </Routes>
    //   </div>
    // </BrowserRouter>
    // <div className="map_wrap" style={{ width: '100%', height: '100%' }}>
    //   <Kakao />
    //   <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
    //     {/* <TestUI /> */}
    //   </div>
    // </div>
  );
}

export default App;
