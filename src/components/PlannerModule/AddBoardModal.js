import React, { useState } from 'react';
import '../../styles/Planner.css';
import Modal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { TextField, Button, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

Modal.setAppElement('#root'); //모달이 나타날 때 모달창 아래의 콘텐츠의 포커스 처리를 도와주는 코드
const AddBoardModal = ({ isOpen, onClose, boards, setBoards, changeBoard }) => {
  const [visitPlan, setVisitPlan] = useState({
    title: 'New Board',
    day: 1,
  }); //추가할 보드의 정보를 저장하는 상태변수
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(visitPlan);
    onClose(); //입력 끝나면 모달 닫기
    addBoard();
  };

  //보드 추가
  const addBoard = async () => {
    const newBoardCard = {
      id: uuidv4(),
      boardTitle: visitPlan.title,
      duration: visitPlan.day,
      authorId: localStorage.id,
      columnList: [],
    };
    for (let i = 1; i <= newBoardCard.duration; i++) {
      //매개변수로 받은 size만큼 컬럼 생성
      newBoardCard.columnList.push({
        cards: [],
      });
    }
    const newBoards = [...boards, newBoardCard];

    await axios
      .post('http://localhost:8080/boards', newBoardCard, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .catch((err) => {
        alert(newBoardCard.columnList + '보내기을 실패하였습니다.');
      });

    await axios
      .get('http://localhost:8080/boards', {
        params: { authorId: localStorage.getItem('id') },
      })
      .then((res) => {
        setBoards(res.data);
      })
      .catch((err) => {
        alert('가져오기을 실패하였습니다.');
      });

    changeBoard(newBoards.length - 1, newBoards);
    setVisitPlan({ title: 'New Board', day: 1 });
  };

  //-+버튼 누르면 day 변경
  const calcDay = (operator) => {
    if (operator == 'plus') {
      setVisitPlan((prev) => ({ ...prev, day: visitPlan.day + 1 }));
    } else {
      if (visitPlan.day > 1)
        setVisitPlan((prev) => ({ ...prev, day: visitPlan.day - 1 }));
    }
  };
  if (!isOpen) {
    return null; // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  }
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="add-board-modal"
      overlayClassName="modal-overlay"
    >
      <div className="modal-head" style={{ borderRadius: '8px 8px 0 0' }}>
        <span className="modal-title">일정추가</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            height: '60px',
            alignItems: 'flex-end',
          }}
        >
          <TextField
            id="outlined-basic"
            label="제목"
            variant="outlined"
            type="text"
            required
            value={visitPlan.title}
            size="small"
            onChange={(e) =>
              setVisitPlan((prev) => ({ ...prev, title: e.target.value }))
            } //내용이 바뀌면 setVisitPlan을 이용해 데이터를 바꿈
          />
        </div>
        <div
          style={{
            height: '100px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: '60px',
          }}
        >
          <IconButton variant="contained" size="small" aria-label="delete">
            <RemoveCircleIcon
              style={{ fontSize: 40 }}
              onClick={() => calcDay('minus')}
            />
          </IconButton>
          <text style={{ fontFamily: 'Dongle', fontSize: '50px' }}>
            &nbsp;{visitPlan.day}&nbsp;
          </text>
          <IconButton variant="contained" size="small" aria-label="delete">
            <AddCircleIcon
              style={{ fontSize: 40 }}
              onClick={() => calcDay('plus')}
            />
          </IconButton>
          <h2>&nbsp;days</h2>
        </div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div className="modal-button">
            <Button
              variant="outlined"
              style={{ marginRight: '10px' }}
              onClick={onClose}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="contained"
              style={{ marginRight: '40px' }}
            >
              확인
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddBoardModal;
