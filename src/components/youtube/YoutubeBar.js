import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/youtubeBar.module.css';
import YoutubeVideoList from './YoutubeVideoList';
import { YOUTUBE_API_KEY } from '../../config/youtubeKey';
import { GoChevronRight } from 'react-icons/go';

// 버튼으로 우측 사이드바 열기/닫기
// 키워드로 영상 정보 가져오기
// 사이드바 버튼이 클릭되었을 때 영상이 로딩됩니다.
const YoutubeBar = ({ keyword }) => {
  const width = 320; // 사이드바 너비
  const maxResults = 0; // 가져올 영상 수
  const [isOpen, setOpen] = useState(false);
  const [xPosition, setX] = useState(-width);
  const [videos, setVideos] = useState([]);
  const side = useRef();

  // button 클릭 시 토글
  const toggleMenu = () => {
    if (xPosition < 0) {
      setX(0);
      setOpen(true);
      if (keyword !== '') fetchVideos();
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
    } catch (error) {
      console.error('Fetching videos failed: ', error);
      // 필요하다면 여기서 추가적인 오류 처리를 할 수 있습니다.
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
          className={styles.openButton}
          style={{ backgroundImage: "url('img/youtube.png')" }}
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu();
          }}
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
        <YoutubeVideoList videos={videos} toggleMenu={toggleMenu} />
      </div>
    </div>
  );
};

export default YoutubeBar;
