import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styles from '../../../styles/youtubeBar.module.css';
import btnStyles from '../../../styles/buttonAnimation.module.css';
import YoutubeVideoList from './YoutubeVideoList';
import { YOUTUBE_API_KEY } from '../../../config/youtubeKey';
import { GoChevronRight } from 'react-icons/go';

// 버튼으로 우측 사이드바 열기/닫기
// 키워드로 영상 정보 가져오기
// 사이드바 버튼이 클릭되었을 때 영상이 로딩됩니다.
const YoutubeBar = ({ keyword }) => {
  const width = 320; // 사이드바 너비
  const maxResults = 5; // 가져올 영상 수
  const [isOpen, setOpen] = useState(false);
  const [xPosition, setX] = useState(-width);
  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(''); // 추가 영상을 불러오기 위한 nextPageToken state
  const [isHovered, setHovered] = useState(null); // 버튼 애니메이션 관련 변수
  const side = useRef();

  // button 클릭 시 토글
  const toggleMenu = () => {
    if (xPosition < 0) {
      setX(0);
      setOpen(true);
      // 검색어 입력을 안하고 영상을 한 번도 불러오지 않은 경우 영상 가져오기
      if (keyword !== '' && videos.length === 0) fetchVideos();
    } else {
      setX(-width);
      setOpen(false);
    }
  };

  // 사이드바 외부 클릭시 닫히는 함수
  const handleClose = async (e) => {
    let sideArea = side.current;
    let sideCildren = side.current.contains(e.target);
    if (isOpen && (!sideArea || !sideCildren)) {
      await setX(-width);
      await setOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClose);
    return () => {
      window.removeEventListener('click', handleClose);
    };
  });

  const fetchVideos = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${
          keyword + ' 여행 맛집'
        }&order=viewCount&type=video&key=${YOUTUBE_API_KEY}`
      );
      setVideos(response.data.items);
      setNextPageToken(response.data.nextPageToken); // nextPageToken을 저장
    } catch (error) {
      console.error('Fetching videos failed: ', error);
      alert('Fetching videos failed');
    }
  };

  const fetchMoreVideos = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${
          keyword + ' 여행 맛집'
        }&order=viewCount&type=video&pageToken=${nextPageToken}&key=${YOUTUBE_API_KEY}` // nextPageToken을 요청 URL에 추가합니다.
      );
      setVideos([...videos, ...response.data.items]); // 기존의 영상 목록에 새로운 영상을 추가합니다.
      setNextPageToken(response.data.nextPageToken); // 새로운 nextPageToken을 저장합니다.
    } catch (error) {
      console.error('Fetching more videos failed: ', error);
      alert('Fetching more videos failed');
    }
  };

  return (
    <div className={styles.container}>
      {isOpen ? (
        <GoChevronRight
          className={styles.closeButton}
          onClick={() => toggleMenu()}
        />
      ) : (
        <button
          className={`${styles.openButton} ${
            isHovered === null
              ? btnStyles.initialState
              : isHovered
              ? btnStyles.rotateClockwise
              : btnStyles.rotateCounterClockwise
          }`}
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu();
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        ></button>
      )}
      <div
        ref={side}
        className={styles.sidebar}
        style={{
          width: `${width}px`,
          transform: `translatex(${-xPosition}px)`,
        }}
      >
        <YoutubeVideoList
          videos={videos}
          toggleMenu={toggleMenu}
          fetchMoreVideos={fetchMoreVideos}
        />
      </div>
    </div>
  );
};

export default YoutubeBar;
