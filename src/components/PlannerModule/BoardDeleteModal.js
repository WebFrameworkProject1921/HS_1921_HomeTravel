import '../../styles/Planner.css';
import Modal from 'react-modal';
import axios from 'axios';
import { Button } from '@mui/material';

Modal.setAppElement('#root'); //모달이 나타날 때 모달창 아래의 콘텐츠의 포커스 처리를 도와주는 코드
const BoardDeleteModal = ({
  isOpen,
  onClose,
  boardIndex,
  setBoardKey,
  boards,
  setBoards,
  setColumns,
}) => {
  //보드 삭제 함수
  const deleteBoard = async () => {
    onClose(); //입력 끝나면 모달 닫기
    const newBoards = [...boards];
    if (boardIndex >= 0 && boardIndex < newBoards.length) {
      const boardToDelete = newBoards[boardIndex];
      if (boardToDelete) {
        try {
          axios
            .delete(`http://localhost:8080/boards/${boardToDelete.id}`)
            .then((res) => {
              //alert('삭제 성공하였습니다.');
            });
          newBoards.splice(boardIndex, 1); // 특정 인덱스의 항목을 삭제
          setBoardKey(0);
          setBoards(newBoards);
          if (newBoards.length > 0) setColumns(newBoards[0].cardStatus);
          else {
            setColumns({});
          }
        } catch (err) {
          alert('삭제를 실패하였습니다.');
        }
      }
    }
  };
  const truncateText = (text, maxLength) => {
    //텍스트 길이 조절 함수
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    } else {
      return text;
    }
  };

  if (!isOpen) {
    return null; // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  }
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="delete-modal"
      overlayClassName="modal-overlay"
    >
      <h3 style={{ fontSize: '18px' }}>
        <span style={{ color: 'red' }}>
          {truncateText(boards[boardIndex].boardTitle, 15)}
        </span>
        를 삭제하시겠습니까?
      </h3>
      <div className="modal-button">
        <Button
          variant="outlined"
          onClick={onClose}
          style={{ marginRight: '10px' }}
        >
          취소
        </Button>
        <Button variant="outlined" color="error" onClick={deleteBoard}>
          삭제
        </Button>
      </div>
    </Modal>
  );
};

export default BoardDeleteModal;
