import { Droppable } from 'react-beautiful-dnd';
import React, { useState } from 'react';
import Card from './Card';
import AddCard from './AddCard';
import '../../styles/Calender.css';
import ColumnModal from './ColumnModal';
import ColumnDeleteModal from './ColumnDeleteModal';
import { BsTrash3Fill } from 'react-icons/bs';

const Column = ({
  columnId,
  columnIndex,
  column,
  onDragEnd,
  columns,
  setColumns,
  boards,
  boardIndex,
  setBoards,
  isDragable,
}) => {
  const [isColumnModalOpen, setColumnModalOpen] = useState(false); // 컬럼 정보 모달
  const [isColumnDeleteModalOpen, setColumnDeleteModalOpen] = useState(false); // 컬럼 삭제 모달
  const openColumnModal = () => {
    setColumnModalOpen(true);
  };
  const closeColumnModal = () => {
    setColumnModalOpen(false);
  };
  const openColumnDeleteModal = () => {
    setColumnDeleteModalOpen(true);
  };
  const closeColumnDeleteModal = () => {
    setColumnDeleteModalOpen(false);
  };

  //현재 컬럼을 삭제하는 함수
  const deleteColumn = () => {
    closeColumnDeleteModal(); //모달창 닫기
    const newColumns = { ...columns }; //컬럼 복사
    let deleted = false; //컬럼이 삭제되면 한 칸씩 당겨져야하기 때문에 Object.keys를 돌며 key가 현재 키랑 같을 때 true로 바꿔 그 다음 컬럼들의 key를 한 칸 씩 당긴다.
    Object.keys(newColumns).forEach((key) => {
      if (deleted) {
        newColumns[key - 1] = newColumns[key];
        delete newColumns[key]; //한 칸 당겨주고 삭제
      } else if (key === columnId) {
        deleted = true;
        delete newColumns[key];
      }
    });
    const newBoard = {
      ...boards[boardIndex],
      duration: boards[boardIndex].duration - 1,
      columnList: newColumns,
    };
    const newBoards = [...boards];
    newBoards[boardIndex] = newBoard;
    setColumns(newColumns);
    setBoards(newBoards);
  };

  return (
    //열의 제목 + Droppable 영역을 합친 div를 반환해준다.
    <div className="big-column">
      <h2 className="column-title">
        <span onClick={openColumnModal} style={{ fontWeight: 'bold' }}>
          &nbsp; Day {columnIndex + 1}
        </span>
        <span onClick={openColumnDeleteModal}>
          <BsTrash3Fill className="column-delete-button" />
        </span>
      </h2>
      <Droppable droppableId={columnId} key={columnId}>
        {/*변경이 생기면 순서가 바뀌게 id와 key를 준다 */}
        {(provided, snapshot) => {
          //콜백함수 스냅샷 사용, 드래그 할 때 Card의 색상이 바뀌는 등의 상태변화를 동적으로 표시할 수 있도록 하기 위해 사용
          return (
            //Droppable 컴포넌트를 반환
            <div
              className={`column ${
                snapshot.isDraggingOver ? 'dragging-over' : ''
              }`} //마우스 드래깅 시 배경 색 변경
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {column.cards.map((card, index) => (
                <div className="column-div">
                  <Card
                    card={card}
                    index={index}
                    columnId={columnId}
                    columns={columns}
                    setColumns={setColumns}
                    boards={boards}
                    boardIndex={boardIndex}
                    isDragable={isDragable}
                  />
                </div>
              ))}
              {provided.placeholder}
              {/*영역 내에 드래그 작업이 시작되면 아이템이 드롭될 위치에 있는 아이템들이 움직이면서 시각적으로 공간을 비워주는 미리보기 같은 기능 */}
              <AddCard
                columnId={columnId}
                columns={columns}
                setColumns={setColumns}
                boards={boards}
              />
            </div>
          );
        }}
      </Droppable>
      <ColumnModal
        isOpen={isColumnModalOpen}
        onClose={closeColumnModal}
        column={column}
        columnIndex={columnIndex}
      />
      <ColumnDeleteModal
        isOpen={isColumnDeleteModalOpen}
        onClose={closeColumnDeleteModal}
        columnIndex={columnIndex}
        deleteColumn={deleteColumn}
      ></ColumnDeleteModal>
    </div>
  );
};

export default Column;
