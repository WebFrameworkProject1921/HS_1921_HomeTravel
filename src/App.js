import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Header from './components/Layout/Header';
import Main from './components/Main';
import SNS from './components/SNS';
import Calendar from './components/Calendar';
import YoutubeBar from './components/YoutubeBar';

function App() {
  const [keyword, setKeyword] = useState('국내');

  return (
    <div>
      <YoutubeBar width={320} keyword={keyword} />
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
