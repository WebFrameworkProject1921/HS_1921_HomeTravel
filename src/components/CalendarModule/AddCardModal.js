import React, { useState, useEffect } from 'react';
import '../../styles/Calender.css';
import Modal from 'react-modal';
import { ListItem, List, ListItemButton, ListItemText } from '@mui/material';

import { Map, MapMarker } from 'react-kakao-maps-sdk';
const { kakao } = window;
Modal.setAppElement('#root');

const AddCardModal = ({ isOpen, onClose, addCard }) => {
  const [info, setInfo] = useState({
    position: { lat: '37.5665', lng: '126.9780' },
  });
  const [keyword, setKeyword] = useState('');
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState();

  const [currentPlace, setCurrentPlace] = useState({}); //현재 선택된 위치

  const handleSearch = (e) => {
    //검색어가 입력되면
    e.preventDefault();
    const searchKeyword = e.target.keyword.value;
    setKeyword(searchKeyword); //키워드를 업데이트

    // 위치 검색
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(searchKeyword, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        console.log(data);
        const newMarkers = data.map((result) => ({
          name: result.place_name,
          address: result.address_name,
          category: result.category_group_name,
          categoryDetail: result.category_name,
          phone: result.phone,
          position: {
            lat: result.y,
            lng: result.x,
          },
        }));
        setMarkers(newMarkers);
        setCurrentPlace(newMarkers[0]); //가져올 아이템을 첫번째 마커로 설정
        if (newMarkers.length > 0) {
          // 첫 번째 결과로 지도 위치 업데이트
          setInfo({
            position: newMarkers[0].position,
          });
        }
      }
    });
  };
  const centerMarkerUpdate = (marker) => {
    setInfo(marker);
    setCurrentPlace(marker);
  };

  useEffect(() => {
    if (!isOpen) {
      //모달이 닫힐 때 상태 초기화
      setKeyword('');
      setMarkers([]);
      setCurrentPlace({});
    }
  }, [isOpen]);

  useEffect(() => {
    if (!map) return;
  }, [map]);

  const truncateText = (text, maxLength) => {
    //텍스트 길이 조절 함수
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    } else {
      return text;
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="add-card-modal"
      overlayClassName="modal-overlay"
    >
      <div className="modal-head">
        <span className="modal-title">여행지 입력</span>
      </div>
      <div style={{ width: '100%', height: '450px' }}>
        <div
          id="search_bar"
          style={{
            height: '400px',
            overflowY: 'scroll',
            position: 'absolute',
            top: 60,
            left: 20,
            zIndex: 2,
            background: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          <form onSubmit={handleSearch} style={{ padding: '10px' }}>
            <div
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <input
                id="outlined-basic"
                placeholder="장소를 검색하세요"
                variant="outlined"
                name="keyword"
                value={keyword} // 검색어 필드에 현재 검색어 표시
                onChange={(e) => setKeyword(e.target.value)} // 검색어 업데이트
              />
              <button type="submit">검색</button>
            </div>
          </form>
          <List>
            {markers.map((marker, index) => (
              <ListItem disablePadding key={index}>
                <ListItemButton
                  onClick={() => centerMarkerUpdate(marker)}
                  onDoubleClick={() => addCard(currentPlace)}
                >
                  <ListItemText primary={marker.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>
        <Map
          isPanto={true}
          center={info.position}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            zIndex: 1,
          }}
          level={6}
          onCreate={setMap}
        >
          {markers.map((marker) => (
            <MapMarker
              key={`marker-${marker.name}-${marker.position.lat},${marker.position.lng}`}
              position={marker.position}
              onClick={() => centerMarkerUpdate(marker)}
            >
              {truncateText(marker.name, 12)}
            </MapMarker>
          ))}
        </Map>
      </div>

      <div className="add-card-modal-foot">
        <div className="add-card-modal-close" onClick={onClose}>
          닫기
        </div>
        <div
          className="add-card-modal-add"
          onClick={() => addCard(currentPlace)}
        >
          추가
        </div>
      </div>
    </Modal>
  );
};

export default AddCardModal;
