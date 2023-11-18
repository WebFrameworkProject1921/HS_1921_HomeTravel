import Board from './Board';
import React, { useState, useRef, useEffect } from 'react';
import '../../styles/Calender.css';
import axios from 'axios';
import BoardSelectList from './BoardSelectList';
import { useNavigate } from 'react-router-dom';

function Calendar({ setIsLoggedIn, setUser }) {
  //캘린더>보드>컬럼>카드 순으로 소유
  const [boards, setBoards] = useState([]);
  const [boardKey, setBoardKey] = useState(0); //현재 화면에 보여지고 있는 보드의 index
  const navigate = useNavigate();

  useEffect(() => {
    //서버에서 데이터를 가져오는 부분
    async function getData() {
      try {
        const authorId = localStorage.getItem('id');
        const res = await axios.get('http://localhost:8080/boards', {
          params: { authorId: authorId },
        }); //서버에서 데이터를 가져오면 res에 저장
        const responseData = res.data;
        setBoards(responseData);
      } catch (error) {
        console.error(error);
        alert('데이터를 가져오는데 오류가 발생했습니다.');
      }
    }
    const id = localStorage.getItem('id');
    const email = localStorage.getItem('email');
    const nickname = localStorage.getItem('nickname');

    if (id && email && nickname) {
      //로컬 스토리지에 is, email, nickname이 있으면 로그인 되어있는 걸로 간주함
      getData();
    } else {
      alert('로그인되어 있지 않습니다.');
      navigate('/');
    }
  }, []);

  const changeBoard = (key, bds = boards) => {
    //현재 보여지고 있는 보드를 변경하는 함수
    const newBoards = [...bds];
    setBoards(newBoards);
    setBoardKey(key); // Key 값을 변경하여 Board 컴포넌트를 다시 렌더링
  };

  const scrollContainerRef = useRef(null); //보드 스크롤 이동을 위해 필요
  const handleScrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollLeft -= 270;
    }
  };
  const handleScrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollLeft += 270;
    }
  };

  return (
    <div style={{ zIndex: 50, position: 'relative' }}>
      <div style={{ height: '16vh' }}></div>

      <div className="calender-wrapper">
        <BoardSelectList
          changeBoard={changeBoard}
          boards={boards}
          setBoards={setBoards}
        />
        <div className="scroll-button-div">
          <button className="scroll-button" onClick={handleScrollLeft}>
            ◀
          </button>
        </div>
        {boards.length > 0 ? ( //boards에 아무것도 든게 없다면 빈 화면을 보여준다.
          <Board
            key={boardKey}
            boardIndex={boardKey}
            setBoardKey={setBoardKey}
            boards={boards}
            setBoards={setBoards}
            scrollContainerRef={scrollContainerRef}
          />
        ) : (
          <div
            className="big-board"
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '20px',
              color: 'blue',
            }}
          >
            일정을 추가 해주세요
          </div>
        )}
        <div className="scroll-button-div">
          <button className="scroll-button" onClick={handleScrollRight}>
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
