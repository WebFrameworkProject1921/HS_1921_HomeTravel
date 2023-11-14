import Modal from 'react-modal';

import VideoSlider from './VideoSlider';

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
    width: '900px',
    height: '600px',
    zIndex: '100',
    position: 'relative',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '10px',
    border: '3px solid red',
    boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.25)',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    justifyContent: 'center',
    overflow: 'auto',
  },
};

// 유튜브 바에서 영상 하단 버튼 클릭 시 나오는 모달 로직
const YoutubeModal = ({
  videos,
  selectedVideo,
  modalIsOpen,
  closeModal = (f) => f,
}) => {
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Youtube Modal"
      shouldCloseOnOverlayClick={true}
      style={StyledModal}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <VideoSlider
          videos={
            selectedVideo
              ? [
                  selectedVideo,
                  ...videos.filter(
                    (video) => video.id.videoId !== selectedVideo.id.videoId
                  ),
                ]
              : videos
          }
        />
      </div>
    </Modal>
  );
};
export default YoutubeModal;
