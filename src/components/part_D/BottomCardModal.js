import React, { useState } from 'react';
import { Card, Modal } from 'antd';
const { Meta } = Card;

// 이 컴포넌트는 카드 1개의 정보를 표시합니다.
// 카드를 클릭하면 모달창을 띄웁니다.
const BottomCardModal = function ({ data, name, address, image }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  //모달 열기
  const openModal = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  //모달 닫기
  const closeModal = () => {
    setSelectedCard(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <Card
        onClick={() => openModal(data)}
        hoverable
        style={{
          width: '10vw',
        }}
        cover={
          <img
            alt="삭제된 사진입니다."
            src={image}
            style={{ height: '16vh' }}
          />
        }
      >
        <Meta title={name} description={address} />
      </Card>
      <br />
      <Modal
        title=""
        open={isModalOpen}
        onOk={closeModal}
        onCancel={closeModal}
        width={'30vw'}
        height={'40vh'}
      >
        {selectedCard && (
          <div>
            <h2>{selectedCard.title}</h2>
            <p>{selectedCard.addr1}</p>
            <img
              style={{ width: '28vw', height: '45vh' }}
              src={selectedCard.firstimage}
              alt="삭제된 사진입니다."
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default BottomCardModal;
