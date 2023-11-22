import React, { useEffect, useState } from 'react';
import '../../styles/Planner.css';
import Modal from 'react-modal';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import Textarea from '@mui/joy/Textarea';
import { Button, IconButton } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from 'axios';
import { safeJSON } from 'openai/core';
Modal.setAppElement('#root'); //모달이 나타날 때 모달창 아래의 콘텐츠의 포커스 처리를 도와주는 코드

const CardDeleteModal = ({
  isOpen,
  onClose,
  parentClose,
  deleteCard,
  cardTitle,
}) => {
  if (!isOpen) {
    return null; // 카드 모달이 닫혀있으면 아무것도 렌더링하지 않음
  }
  const deleteCardModal = () => {
    onClose();
    parentClose();
    deleteCard();
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="delete-modal"
      overlayClassName="modal-overlay"
    >
      <h3 style={{ fontSize: '18px' }}>
        <span style={{ color: 'red' }}>{cardTitle}</span>를 여행일정에서
        삭제하시겠습니까?
      </h3>
      <div className="modal-button">
        <Button
          variant="outlined"
          onClick={onClose}
          style={{ marginRight: '10px' }}
        >
          취소
        </Button>
        <Button variant="outlined" color="error" onClick={deleteCardModal}>
          삭제
        </Button>
      </div>
    </Modal>
  );
};

const CardModal = ({
  isOpen,
  onClose,
  card,
  deleteCard,
  boards,
  boardIndex,
  columns
}) => {
  const [memo, setMemo] = useState(card.memo || '');
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); //모달의 상태관리

  // 모달이 열릴 때 memo를 초기화합니다.
  useEffect(() => {
    if (isOpen) {
      setMemo(card.memo || '');
    }
  }, [isOpen, card.memo]);
  const openDeleteModal = () => {
    //모달 열기& 닫기 함수
    setDeleteModalOpen(true);
  };
  const closDeleteeModal = () => {
    setDeleteModalOpen(false);
  };

  if (!isOpen) {
    return null; // 카드 모달이 닫혀있으면 아무것도 렌더링하지 않음
  }

  const truncateText = (text, maxLength) => {
    //텍스트 길이 조절 함수
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    } else {
      return text;
    }
  };

  const handleSaveMemo = async () => {
    // 저장 버튼 클릭 시, card.memo 업데이트,
    card.memo = memo;

    const updatedBoard = {
      ...boards[boardIndex],
      columnList: Object.values(columns || []).map(column => ({
        ...column,
        cards: column.cards.map(c => (c.id === card.id ? card : c)),
      })),
    };//메모 정보를 보드에 반영하고 서버에 보낸다. 만약 새로운 보드를 만들지 않고 기존 보드를 보내면 컬럼 추가, 삭제 후에 메모 기능이 작동을 안하기 때문에 아예 새로운 보드를 만들어야함. 

    axios
      .put(
        `http://localhost:8080/boards/${updatedBoard.id}`,
        updatedBoard
      )
      .catch((err) => {
        alert(safeJSON(boards[boardIndex])+'서버 업데이트 실패');
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="card-modal"
      overlayClassName="modal-overlay"
    >
      <div className="modal-head">
        <span
          className="modal-title"
          style={{ marginLeft: '10%', width: '75%', textAlign: 'center' }}
        >
          {truncateText(card.place.name, 14)}
        </span>
        <div>
          <IconButton
            variant="contained"
            color="error"
            size="small"
            aria-label="delete"
            onClick={openDeleteModal}
          >
            <DeleteForeverIcon />
          </IconButton>
        </div>
      </div>
      <div className="card-modal-body">
        <br />
        정보
        <hr color="lightgray" />
        <ul>
          <li>이름: {card.place.name}</li>
          <li>카테고리: {card.place.category}</li>
          <li>상세: {card.place.categoryDetail}</li>
          <li>주소: {card.place.address}</li>
          <li>전화번호: {card.place.phone}</li>
        </ul>
        <br />
        메모
        <hr color="lightgray" />
        <div style={{ width: '100%', paddingBottom: '10px' }}>
          <Textarea
            placeholder="메모를 작성하세요"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          ></Textarea>
        </div>
        <div className="modal-button">
          <Button variant="contained" onClick={handleSaveMemo}>
            저장
          </Button>
        </div>
        <br />
        지도
        <hr color="lightgray" />
        <Map
          isPanto={true}
          center={{ lat: card.place.lat, lng: card.place.lng }}
          style={{
            width: '100%',
            height: '400px',
          }}
          level={6}
        >
          <MapMarker position={{ lat: card.place.lat, lng: card.place.lng }}>
            {truncateText(card.place.name, 14)}
          </MapMarker>
        </Map>
        <br />
      </div>
      <div className="modal-close" onClick={onClose}>
        <span className="modal-close-text">닫기</span>
      </div>
      <CardDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closDeleteeModal}
        parentClose={onClose}
        deleteCard={deleteCard}
        cardTitle={card.place.name}
      />
    </Modal>
  );
};

export default CardModal;
