import Modal from 'react-modal';
import { Button } from '@mui/material';
Modal.setAppElement('#root');

const ColumnDeleteModal = ({ isOpen, onClose, columnIndex, deleteColumn }) => {
  if (!isOpen) {
    return null; // 카드 모달이 닫혀있으면 아무것도 렌더링하지 않음
  }
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="delete-modal"
      overlayClassName="modal-overlay"
    >
      <h3 style={{ fontSize: '18px' }}>
        <span style={{ color: 'red' }}>Day {columnIndex + 1}</span>를
        여행일정에서 삭제하시겠습니까?
      </h3>
      <div className="modal-button">
        <Button
          variant="outlined"
          onClick={onClose}
          style={{ marginRight: '10px' }}
        >
          취소
        </Button>
        <Button variant="outlined" color="error" onClick={deleteColumn}>
          삭제
        </Button>
      </div>
    </Modal>
  );
};

export default ColumnDeleteModal;
