import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styles from '../styles/sidebar.module.css';
import YoutubeVideoList from './YoutubeVideoList';
import { YOUTUBE_API_KEY } from '../config/youtubeKey';
import { GoChevronRight } from 'react-icons/go';

const YoutubeBar = ({ width = 280, keyword }) => {
  const [isOpen, setOpen] = useState(false);
  const [xPosition, setX] = useState(-width);
  const [videos, setVideos] = useState([]);
  const side = useRef();
  const maxResults = 10;

  // button 클릭 시 토글
  const toggleMenu = () => {
    if (xPosition < 0) {
      setX(0);
      setOpen(true);
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

  useEffect(() => {
    const fetchVideos = async () => {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${
          keyword + '여행'
        }&order=viewCount&type=video&key=${YOUTUBE_API_KEY}`
      );
      setVideos(response.data.items);
    };
    if (keyword !== '') fetchVideos();
  }, [keyword]);

  return (
    <div className={styles.container}>
      <div
        ref={side}
        className={styles.sidebar}
        style={{
          width: `${width}px`,
          transform: `translatex(${-xPosition}px)`,
        }}
      >
        <button onClick={() => toggleMenu()} className={styles.button}>
          {isOpen ? (
            <GoChevronRight className={styles.openBtn} />
          ) : (
            <img
              src="img/youtube.png"
              className={styles.openBtn}
              onClick={(e) => {
                e.stopPropagation();
                toggleMenu();
              }}
            />
          )}
        </button>
        <YoutubeVideoList videos={videos} toggleMenu={toggleMenu} />
      </div>
    </div>
  );
};

export default YoutubeBar;
