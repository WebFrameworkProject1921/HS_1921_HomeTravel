import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import '../../styles/Calender.css';
import Column from './Column';
import BoardDeleteModal from './BoardDeleteModal';
import axios from 'axios';
import { BsTrash3Fill, BsPlusSquare } from 'react-icons/bs';

//DragDropDontext 컴포넌트에서 등록된 드래그 작업이 종료될 때 자동으로 호출, 이 함수를 사용자 정의 함수로 만들고 DragDropContext에 등록 함으로써 드래그 앤 드롭 작업이 발생할 때 데이터를 제어할 수 있음
const onDragEnd = (
  result,
  columns,
  setColumns,
  boardIndex,
  boards,
  setBoards
) => {
  if (!result.destination) return; //드롭된 위치가 이상하면 종료시킴
  const { source, destination } = result; //소스는 드래그 된 아이템의 위치, destination은 드롭된 아이템의 위치

  if (source.droppableId !== destination.droppableId) {
    //source와 destination이 다르면 아이템이 다른 컬럼으로 이동한 것임
    const sourceColumn = columns[source.droppableId]; //우선 source와 destination에 해당하는 컬럼 객체를 가져와서 저장
    const destColumn = columns[destination.droppableId];
    const sourceCards = [...sourceColumn.cards]; //items는 컬럼에 속한 아이템들의 id를 담은 배열임, 역시 복사
    const destCards = [...destColumn.cards];
    const [removed] = sourceCards.splice(source.index, 1); //sourceItems에서 item을 삭제하고 removed에 저장
    destCards.splice(destination.index, 0, removed); //removed를 destination.index에 삽입

    // 복사한 columns로 업데이트
    const newColumns = {
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        cards: sourceCards,
      },
      [destination.droppableId]: {
        ...destColumn,
        cards: destCards,
      },
    };
    setColumns(newColumns);

    const newBoards = [...boards]; // 기존 배열을 복사
    newBoards[boardIndex].columnList = { ...newColumns }; // 변경된 columns로 업데이트
    setBoards(newBoards); // boards 배열을 업데이트
  } else {
    //source와 destination이 같다면 아이템이 동일한 컬럼으로 이동한 것임
    const column = columns[source.droppableId]; //해당 컬럼의 객체를 가져오고 item도 복사
    const copiedCards = [...column.cards];
    const [removed] = copiedCards.splice(source.index, 1); //source.index를 제거하고 그걸 destination.index 위치에 삽입
    copiedCards.splice(destination.index, 0, removed);

    const newColumns = {
      ...columns,
      [source.droppableId]: {
        ...column,
        cards: copiedCards,
      },
    };
    setColumns(newColumns);

    const newBoards = [...boards]; // 기존 배열을 복사
    newBoards[boardIndex].columnList = { ...newColumns }; // 변경된 columns로 업데이트
    setBoards(newBoards); // boards 배열을 업데이트
  }
};

function Board({
  boardIndex,
  setBoardKey,
  boards,
  setBoards,
  scrollContainerRef,
}) {
  const initialColumns = boards[boardIndex]?.columnList || {}; //컬럼 없으면 빈 배열
  const [columns, setColumns] = useState(initialColumns);
  const [isEditTitle, setEditTitle] = useState(false);
  const inputRef = useRef(null);

  //보드 삭제 모달
  const [isBoardDeleteModalOpen, setBoardDeleteModalOpen] = useState(false);
  const openBoardDeleteModal = () => {
    setBoardDeleteModalOpen(true);
  };
  const closeBoardDeleteModal = () => {
    setBoardDeleteModalOpen(false);
  };

  //보드 타이틀 변경 함수
  const titleStateChange = () => {
    //타이틀을 text 또는 inputText로 바꾸는 함수
    if (isEditTitle) setEditTitle(false);
    else setEditTitle(true);
  };
  const titleChange = (e) => {
    const updatedBoards = [...boards];
    updatedBoards[boardIndex] = {
      ...updatedBoards[boardIndex],
      boardTitle: e.target.value,
    };
    setBoards([...updatedBoards]); // boards 배열을 업데이트
  };
  const titleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setEditTitle(false); //inputText->text

      //서버에 제목 업데이트 요청
      const updatedBoard = {
        ...boards[boardIndex],
        columnList: Object.values(columns || {}),
      };
      axios.put(
        `http://localhost:8080/boards/${updatedBoard.id}`,
        updatedBoard
      );
    }
  };

  useEffect(() => {
    //타이틀을 더블클릭하면 inputText에 focus가 가게함
    if (inputRef.current && isEditTitle) {
      inputRef.current.focus();
    }
  }, [isEditTitle]);

  //보드에 변경이 생기면 column도 다시 설정해줌
  useEffect(() => {
    const board = boards[boardIndex];
    if (board && board.columnList) {
      setColumns(board.columnList);
    } else {
      setColumns({});
    }
  }, [boardIndex, boards]);

  //컬럼이 변경되면 서버에 보드를 저장하는 함수, 서버는 보드 단위로 데이터를 관리하며 보드의 데이터가 바뀌면 컬럼의 데이터를 다시 설정하기 때문에 역시 자동으로 변경됨
  useEffect(() => {
    const updatedBoard = {
      ...boards[boardIndex],
      columnList: Object.values(columns || {}), // columns를 배열로 변환, 변환 안하면 오류 생김, 만약 columns가 undefind 인 경우 빈 배열<- boards의 길이가 2이상이고 index가 0인 board를 지우면 columns가 undefind가 반환되는 데 이유는 모르겠지만 빈 배열로 바꾸면 잘 적용됨
    };
    axios
      .put(`http://localhost:8080/boards/${updatedBoard.id}`, updatedBoard)
      .then((res) => {
        //alert('서버 업데이트 성공.');
      })
      .catch((err) => {
        //alert('서버 업데이트 실패.');
      });
  }, [columns]); // columns가 변경되면 서버에 보드 정보를 업데이트

  //컬럼 추가 함수
  const addColumn = () => {
    const newColumns = { ...columns }; // 기존 컬럼리스트를 복사 후 새로운 컬럼 추가
    newColumns[Object.keys(newColumns).length] = { cards: [] };
    const newBoard = {
      ...boards[boardIndex],
      duration: boards[boardIndex].duration + 1,
      columnList: newColumns,
    }; //현 보드의 duration을 1올림
    const newBoards = [...boards];
    newBoards[boardIndex] = newBoard;
    setColumns(newColumns);
    setBoards(newBoards);
  };

  //텍스트 길이 조절 함수
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    } else {
      return text;
    }
  };
  return (
    <div className="big-board">
      <div className="board-title">
        {isEditTitle ? (
          <input
            type="text"
            value={boards[boardIndex]?.boardTitle}
            onChange={titleChange}
            onKeyDown={titleKeyDown}
            onBlur={titleStateChange} //포커스 잃으면 다시 text로 바뀜
            ref={inputRef}
          />
        ) : (
          <div onDoubleClick={titleStateChange}>
            {truncateText(boards[boardIndex]?.boardTitle, 26)}&nbsp;&nbsp;
          </div>
        )}
        <div style={{ cursor: 'pointer' }}>
          <BsTrash3Fill
            onClick={openBoardDeleteModal}
            size="33px"
            className="trash-icon"
          />
        </div>
      </div>
      <div
        className="main-board"
        ref={scrollContainerRef}
        style={{
          transition: 'transform 1s ease-in-out',
        }}
      >
        <DragDropContext
          onDragEnd={(result) =>
            onDragEnd(
              result,
              columns,
              setColumns,
              boardIndex,
              boards,
              setBoards
            )
          }
        >
          {columns &&
            Object.entries(columns).map(([columnId, column], index) => (
              <Column
                key={columnId}
                columnIndex={index}
                columnId={columnId}
                column={column}
                onDragEnd={onDragEnd}
                columns={columns}
                setColumns={setColumns}
                boards={boards}
                boardIndex={boardIndex}
                setBoards={setBoards}
              />
            ))}
        </DragDropContext>
        <div className="column-add-button" onClick={() => addColumn()}>
          <BsPlusSquare size="40px" className="plus-icon" />
        </div>
      </div>
      <BoardDeleteModal
        isOpen={isBoardDeleteModalOpen}
        onClose={closeBoardDeleteModal}
        boardIndex={boardIndex}
        setBoardKey={setBoardKey}
        boards={boards}
        setBoards={setBoards}
        setColumns={setColumns}
      />
    </div>
  );
}

export default Board;
