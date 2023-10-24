import styled from 'styled-components';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

const StyledBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 0;
  cursor: auto;
`;

const StyledModalContainer = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .myMap {
    border-radius: 20px;
    box-shadow: 1px 1px 10px 1px rgb(71, 181, 255);
  }
`;

export const KakaoMapModal = ({ showModal, closeModal }) => {
  return (
    <>
      <StyledBackground onClick={closeModal}>
        <StyledModalContainer onClick={(e) => e.stopPropagation()}>
          <Map
            className="myMap"
            style={{ width: '500px', height: '500px' }}
            center={{ lat: 33.5563, lng: 126.79581 }}
            level={3}
          >
            <MapMarker position={{ lat: 33.55635, lng: 126.795841 }}>
              <div style={{ color: '#000' }}>월정리에옹</div>
            </MapMarker>
          </Map>
        </StyledModalContainer>
      </StyledBackground>
      {/* {showModal ? (
        
      ) : null} */}
    </>
  );
};
