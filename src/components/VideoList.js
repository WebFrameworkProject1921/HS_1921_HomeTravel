import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import YouTube from 'react-youtube';

const VideoListContainer = styled.div`
  overflow-y: auto;
  gap: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  margin-top: 10px;
`;

const VideoList = ({ keyword, videos }) => {
  if (keyword === '') return <div>여행지를 검색해주세요</div>;

  return (
    <VideoListContainer>
      {videos.map((video) => (
        <YouTube
          key={video.id.videoId}
          videoId={video.id.videoId}
          opts={{
            width: '300',
            height: '160',
            playerVars: {
              autoplay: 0,
              rel: 0,
              modestbranding: 1,
            },
          }}
          onEnd={(e) => {
            e.target.stopVideo(0);
          }}
        />
      ))}
    </VideoListContainer>
  );
};

export default VideoList;
