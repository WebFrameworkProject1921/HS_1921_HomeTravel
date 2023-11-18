import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Container, Typography } from '@mui/material';
import { Height } from '@mui/icons-material';

function SNSLoginLodingPage({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get('code');

  //인가코드 백으로 보내는 코드
  useEffect(() => {
    const kakaoLogin = async () => {
      await axios({
        method: 'GET',
        url: `http://localhost:8080/login/oauth2/kakao?code=${code}`,
        headers: {
          'Content-Type': 'application/json;charset=utf-8', //json형태로 데이터를 보내겠다는뜻
        },
      }).then((res) => {
        // 백엔드에서 토큰 넘겨주는게 성공했다면
        console.log(res.data);
        // 사용자 정보는 localStorage에 저장
        localStorage.setItem('id', res.data.kakaoMember.id);
        localStorage.setItem('email', res.data.kakaoMember.email);
        localStorage.setItem('nickname', res.data.kakaoMember.nickname);
        //로그인이 성공하면 이동할 페이지
        setIsLoggedIn(true);
        alert('성공적으로 로그인 하였습니다!');
        navigate('/');
      });
    };
    kakaoLogin();
  }, []);

  return (
    <>
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <CircularProgress sx={{ m: 2 }} />

            <Typography sx={{ fontWeight: 'bold' }} gutterBottom>
              로그인 중입니다. 잠시만 기다려주세요
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default SNSLoginLodingPage;
