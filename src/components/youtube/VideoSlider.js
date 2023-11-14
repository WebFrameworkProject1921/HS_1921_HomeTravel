import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Navigation } from 'swiper/modules';
import YouTube from 'react-youtube';

// 모달창에서 비디오를 슬라이드 할 수 있게 하는 로직
const VideoSlider = ({ videos }) => {
  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={30}
      loop={true}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Pagination, Navigation]}
      className="mySwiper"
      style={{
        width: '900px',
        height: '600px',
      }}
    >
      {videos.map((video) => (
        <SwiperSlide key={video.id.videoId}>
          <YouTube
            videoId={video.id.videoId}
            opts={{
              width: '100%',
              height: '500px',
              playerVars: {
                autoplay: 0,
                rel: 0,
                modestbranding: 1,
              },
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default VideoSlider;
