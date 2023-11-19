import React, { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import btnStyles from '../../../styles/buttonAnimation.module.css';
import GPTContent from './GPTContent';

// GPT 버튼과 버튼을 클릭 시 모달창이 나타나게 한다.
const StyledModal = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: '100vw',
    height: '100vh',
    zIndex: '99',
    position: 'fixed',
    top: '0',
    left: '0',
  },
  content: {
    userSelect: 'none',
    width: '650px',
    height: '700px',
    zIndex: '100',
    position: 'relative',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '10px',
    border: '3px solid rgb(116, 170, 156)',
    boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.25)',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    justifyContent: 'center',
    overflow: 'auto',
  },
};

const OpenButton = styled.button`
  position: fixed;
  right: 330px;
  top: calc(22vh + 15px);
  border: none;
  border-radius: 50%;
  width: 2.5vw;
  height: 5vh;
  min-width: 50px;
  min-height: 50px;
  max-width: 55px;
  max-height: 55px;
  background-color: #f00;
  background-image: url('img/chatgpt.png');
  background-size: cover;
  background-position: center;
  cursor: pointer;
  z-index: 20;
`;

// 버튼을 클릭하면 모달창이 나타남
function GPTOpen({ keyword, setKeyword = (f) => f }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isHovered, setHovered] = useState(null); // 버튼 애니메이션 관련 변수

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  return (
    <div>
      <OpenButton
        onClick={openModal}
        className={`${
          isHovered === null
            ? btnStyles.initialState
            : isHovered
            ? btnStyles.rotateClockwise
            : btnStyles.rotateCounterClockwise
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      ></OpenButton>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="GPT Modal"
        style={StyledModal}
      >
        <GPTContent keyword={keyword} setKeyword={setKeyword} />
      </Modal>
    </div>
  );
}

export default GPTOpen;
