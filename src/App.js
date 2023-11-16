import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Main from './components/MainModule/Main';
import SNS from './components/SNSModule/SNS';
import Calendar from './components/CalendarModule/Calendar';
import YoutubeBar from './components/MainModule/youtubeAPI/YoutubeBar';
import GPTOpen from './components/MainModule/GPTAPI/GPTOpen';

function App() {
  const [keyword, setKeyword] = useState('서울'); // 검색 키워드 저장

  return (
    <div>
      <YoutubeBar keyword={keyword} />
      <GPTOpen keyword={keyword} setKeyword={setKeyword} />

      <BrowserRouter>
        <div className="App">
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                <Main
                  keyword={keyword}
                  setKeyword={(newKeyword) => setKeyword(newKeyword)}
                />
              }
            />
            <Route path="/SNS" element={<SNS />} />
            <Route path="/Calendar" element={<Calendar />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
