import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AddCardModal from './AddCardModal';
import '../../styles/Planner.css';
import { CiCirclePlus } from 'react-icons/ci';

const AddCard = ({ columnId, columns, setColumns, boards }) => {
  //모달창 구현
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    console.log('보드리스트' + { boards });
    console.log('컬럼리스트' + { columns });
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  //AddCardModal로 부터 place를 받아 카드 추가
  const addCard = (place) => {
    if (Object.keys(place).length === 0) {
      //아무 위치도 선택되지 않았으면 오류처리
      alert('오류: 위치가 선택되지 않았습니다.');
    } else {
      const newCard = {
        id: uuidv4(),
        memo: '',
        place: {
          name: place.name,
          address: place.address,
          category: place.category,
          categoryDetail: place.categoryDetail,
          phone: place.phone,
          lat: place.position.lat,
          lng: place.position.lng,
        },
      };
      const updatedColumns = { ...columns }; //기존의 컬럼 복사 후 new Card 추가
      updatedColumns[columnId].cards.push(newCard);
      setColumns(updatedColumns); //컬럼 변경
      closeModal();
    }
  };

  return (
    <>
      <div className="add-card-button" onMouseUp={() => openModal()}>
        <CiCirclePlus size={30} />
        &nbsp;여행지 추가
      </div>
      <AddCardModal
        isOpen={isModalOpen}
        onClose={closeModal}
        addCard={addCard}
      />
    </>
  );
};

export default AddCard;
