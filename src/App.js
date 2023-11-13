import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Header from './components/Layout/Header';
import Main from './components/Main';
import SNS from './components/SNS';
import Calendar from './components/Calendar';
import YoutubeBar from './components/youtube/YoutubeBar';
import GPTOpen from './components/GPT/GPTOpen';

function App() {
  const [keyword, setKeyword] = useState('서울');

  return (
    <div>
      <YoutubeBar width={320} keyword={keyword} />
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
