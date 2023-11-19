import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Main from './components/MainModule/Main';
import SNS from './components/SNSModule/SNS';
import Calendar from './components/CalendarModule/Calendar';
import YoutubeBar from './components/MainModule/youtubeAPI/YoutubeBar';
import GPTOpen from './components/MainModule/GPTAPI/GPTOpen';
import SNSLoginPage from './components/SNSModule/SNSLoginPage';
import SNSLoginLodingPage from './components/SNSModule/SNSLoginLodingPage';

function App() {
  const [keyword, setKeyword] = useState('서울'); // 검색 키워드 저장
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부
  const [user, setUser] = useState(null);

  //새로고침시 로그인 정보를 다시 받음
  useEffect(() => {
    const id = localStorage.getItem('id');
    const email = localStorage.getItem('email');
    const nickname = localStorage.getItem('nickname');
    if (id && email && nickname) {
      setIsLoggedIn(true);
    }
  });

  return (
    <div>
      <YoutubeBar keyword={keyword} />
      <GPTOpen keyword={keyword} setKeyword={setKeyword} />

      <BrowserRouter>
        <div className="App">
          <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
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
            <Route path="/SNS" element={<SNS isLoggedIn={isLoggedIn} />} />
            <Route
              path="/Calendar"
              element={
                <Calendar setIsLoggedIn={setIsLoggedIn} setUser={setUser} />
              }
            />
          </Routes>
          <Routes>
            <Route
              path="/login"
              element={
                <SNSLoginPage setIsLoggedIn={setIsLoggedIn}></SNSLoginPage>
              }
            />
            <Route
              path="/login/oauth2/kakao"
              element={
                <SNSLoginLodingPage
                  setIsLoggedIn={setIsLoggedIn}
                ></SNSLoginLodingPage>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
