import { useState } from 'react';
import '../../styles/Calender.css';
import AddBoardModal from './AddBoardModal';
function BoardCard({ item, index, changeBoard }) {
  const truncateText = (text, maxLength) => {
    //텍스트 길이 조절 함수
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    } else {
      return text;
    }
  };
  return (
    <div className="board-card" onClick={() => changeBoard(index)}>
      {truncateText(item.boardTitle, 9)}
    </div>
  );
}
function BoardSelectList({ changeBoard, boards, setBoards }) {
  //모달창 구현
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="board-select-list">
      {boards.map(
        (
          item,
          index //여기서 item은 board를 뜻한다.
        ) => (
          <div
            key={item.id} // Card 컴포넌트의 고유한 키를 설정해야 함
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <BoardCard item={item} index={index} changeBoard={changeBoard} />
          </div>
        )
      )}
      <div className="add-board-button" onClick={openModal}>
        일정 추가
      </div>
      <AddBoardModal
        isOpen={isModalOpen}
        onClose={closeModal}
        boards={boards}
        setBoards={setBoards}
        changeBoard={changeBoard}
      />
    </div>
  );
}

export default BoardSelectList;
