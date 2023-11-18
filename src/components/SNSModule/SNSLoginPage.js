import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { KAKAO_AUTH_URL } from '../../OAuth';
import { Copyright } from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SNSLoginPage({ setIsLoggedIn }) {
  const [mode, setMode] = useState('SIGNIN');

  const navigate = useNavigate();

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    const data = {
      loginId: f.get('loginId'),
      password: f.get('password'),
    };
    console.log(data);

    Login(data);
  };

  const handleSignUpSubmit = (event) => {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    const data = {
      loginId: f.get('loginId'),
      password: f.get('password'),
      email: f.get('email'),
      nickname: f.get('nickname'),
    };
    console.log(data);

    SignUp(data);
  };

  const Login = async (data) => {
    await axios
      .post('http://localhost:8080/login', data)
      .then((res) => {
        console.log(res.data);
        // 사용자 정보는 localStorage에 저장
        localStorage.setItem('id', res.data.member.id);
        localStorage.setItem('email', res.data.member.email);
        localStorage.setItem('nickname', res.data.member.nickname);
        //로그인이 성공하면 이동할 페이지
        setIsLoggedIn(true);
        alert('성공적으로 로그인 하였습니다!');
        navigate('/');
      })
      .catch((err) => {
        alert('등록을 실패하였습니다.');
      });
  };

  const SignUp = async (data) => {
    await axios
      .post('http://localhost:8080/signup', data)
      .then((res) => {
        console.log(res.data);
        // 사용자 정보는 localStorage에 저장
        localStorage.setItem('id', res.data.member.id);
        localStorage.setItem('email', res.data.member.email);
        localStorage.setItem('nickname', res.data.member.nickname);
        //로그인이 성공하면 이동할 페이지
        setIsLoggedIn(true);
        alert('성공적으로 로그인 하였습니다!');
        navigate('/');
      })
      .catch((err) => {
        alert('등록을 실패하였습니다.');
      });
  };

  return (
    <Container maxWidth="md">
      <h1 style={{ textAlign: 'center' }}>방구석 여행 SNS</h1>

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {mode === 'SIGNIN' ? '로그인' : '회원가입'}
          </Typography>

          {mode === 'SIGNIN' ? (
            <Box
              component="form"
              onSubmit={handleLoginSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="loginId"
                label="아이디"
                name="loginId"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="비밀번호"
                type="password"
                id="password"
                autoComplete="current-password"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                로그인
              </Button>

              <Link
                href="#"
                variant="body2"
                onClick={() => {
                  setMode('SIGNUP');
                }}
              >
                {'회원이 아니신가요? 여기를 클릭하세요'}
              </Link>
            </Box>
          ) : (
            <>
              <Box
                component="form"
                onSubmit={handleSignUpSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="loginId"
                  label="아이디"
                  name="loginId"
                  autoFocus
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="비밀번호"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="이메일"
                  name="email"
                  autoFocus
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="nickname"
                  label="사용자 이름"
                  name="nickname"
                  autoFocus
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  회원가입
                </Button>
              </Box>

              <Link
                href="#"
                variant="body2"
                onClick={() => {
                  setMode('SIGNIN');
                }}
              >
                {'로그인으로 하시려면 여기를 클릭하세요'}
              </Link>
            </>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', m: 2 }}>
            <a href={KAKAO_AUTH_URL}>
              <img src={'/images/kakao_login.png'} alt="카카오 로그인" />
            </a>
          </Box>
        </Box>
      </Container>
    </Container>
  );
}

export default SNSLoginPage;
