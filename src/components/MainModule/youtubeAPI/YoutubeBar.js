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
  const [isLoading, setIsLoading] = useState(false); // 데이터 로딩 중 표시
  const [isError, setIsError] = useState(false); // fetch 에러 여부 표시
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 표시
  const side = useRef();

  // button 클릭 시 토글
  const toggleMenu = () => {
    if (xPosition < 0) {
      setX(0);
      setOpen(true);
      // 새 영상 가져오기
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
    if (!isLoading && !isError && isOpen && (!sideArea || !sideCildren)) {
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

  // 영상 불러오기 함수
  const fetchVideos = async () => {
    setIsLoading(true); // 로딩 초기화
    setIsError(false); // 에러 초기화
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${
          keyword + ' 여행'
        }&order=viewCount&type=video&key=${YOUTUBE_API_KEY}`
      );
      setVideos(response.data.items);
      setNextPageToken(response.data.nextPageToken); // nextPageToken을 저장
    } catch (error) {
      if (error.response) {
        // 에러 처리
        switch (error.response.status) {
          case 400:
            setErrorMessage('잘못된 요청입니다.');
            break;
          case 403:
            setErrorMessage('사용량을 초과했습니다. ');
            break;
          default:
            setErrorMessage('오류가 발생했습니다.');
        }
      } else if (error.request) {
        // 요청이 만들어졌으나 응답을 받지 못함
        setErrorMessage('응답을 받지 못했습니다.');
      } else {
        // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생
        setErrorMessage('오류가 발생했습니다.');
      }
      setIsError(true); // 에러 상태 표시
    }
    setIsLoading(false); // 로딩 끝
  };

  // 추가 영상 불러오기 함수
  const fetchMoreVideos = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${
          keyword + ' 여행'
        }&order=viewCount&type=video&pageToken=${nextPageToken}&key=${YOUTUBE_API_KEY}` // nextPageToken을 요청 URL에 추가합니다.
      );
      setVideos([...videos, ...response.data.items]); // 기존의 영상 목록에 새로운 영상을 추가합니다.
      setNextPageToken(response.data.nextPageToken); // 새로운 nextPageToken을 저장합니다.
    } catch (error) {
      setIsError(true); // 에러 상태 표시
      console.error('Fetching more videos failed: ', error);
    }
  };

  return (
    <div className={styles.container}>
      {/* 사이드바 열림 / 닫힘 버튼 처리*/}
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
      {/* 사이드바 내부 콘텐츠 */}
      <div
        ref={side}
        className={styles.sidebar}
        style={{
          width: `${width}px`,
          transform: `translatex(${-xPosition}px)`,
          overflowY: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <YoutubeVideoList
          videos={videos}
          toggleMenu={toggleMenu}
          fetchMoreVideos={fetchMoreVideos}
          isLoading={isLoading}
          isError={isError}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
};

export default YoutubeBar;
