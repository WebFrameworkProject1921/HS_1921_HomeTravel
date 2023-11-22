import React, { useState } from 'react';
import axios from 'axios';
import { GPT_API_KEY } from '../../../config/GPTkey';
import { BeatLoader } from 'react-spinners';
import { BiSolidErrorAlt } from 'react-icons/bi';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const api_key = GPT_API_KEY;

// GPT 모달창 내부 로직
// 입력을 받아 GPT에게서 답을 얻어 표시
function GPTComponent() {
  const [destination, setDestination] = useState(''); // 목적지
  const [days, setDays] = useState(''); // 여행 일 수

  const [result, setResult] = useState(''); // 결과
  const [isLoading, setIsLoading] = useState(false); // 데이터 로딩 중 표시
  const [isError, setIsError] = useState(false); // fetch 에러 여부 표시
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 표시

  // destination 정규 표현식 검사
  const handleDestinationChange = (e) => {
    const newValue = e.target.value;
    if (/^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z|A-Z|0-9|\s]*$/.test(newValue)) {
      setDestination(newValue);
    }
  };

  // days 정규 표현식 검사
  const handleDaysChange = (e) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      setDays(newValue);
    }
  };

  // 두 인풋박스가 모두 채워져야 검색 가능
  const handleSubmit = (e) => {
    e.preventDefault();
    if (destination && days) {
      chatGPT();
    } else {
      alert('모든 필드를 채워주세요.');
    }
  };

  const chatGPT = () => {
    setResult();
    setIsLoading(true); // 로딩 시작
    setIsError(false); // 에러 초기화
    const messages = [
      {
        role: 'system',
        content: 'assistant는 한국 여행을 잘 아는 가이드이다.',
      },
      {
        role: 'user',
        content: `${destination} 으로 ${days}일간의 여행 계획을 간결하게 만들어서 알려줘`,
      },
    ];

    const data = {
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 600,
      messages: messages,
    };

    axios
      .post('https://api.openai.com/v1/chat/completions', data, {
        headers: {
          Authorization: `Bearer ${api_key}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setResult(response.data.choices[0].message.content);
        setDestination('');
        setDays('');
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.response) {
          // 에러 처리
          switch (error.response.status) {
            case 401:
              setErrorMessage('인증되지 않은 사용자입니다.');
            case 429:
              setErrorMessage('사용량을 초과했습니다. ');
              break;
            case 500:
              setErrorMessage('chat GPT 서버 점검 중입니다.');
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
        setIsError(true); // 에러 발생
        setIsLoading(false); // 로딩 완료
      });
  };

  return (
    <div className="GPTComponent">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
        p={2}
      >
        <h1>AI 여행 플래너</h1>
        <Box component="form" display="flex" gap={2} onSubmit={handleSubmit}>
          <TextField
            label="어디로 갈까요?"
            variant="outlined"
            value={destination}
            required="true"
            type="text"
            onChange={handleDestinationChange}
          />
          <TextField
            label="며칠간 갈까요?"
            variant="outlined"
            value={days}
            required="true"
            type="text"
            onChange={handleDaysChange}
          />
          <Button variant="contained" type="submit">
            입력
          </Button>
        </Box>
        <Box
          p={2}
          border={1}
          borderRadius={1}
          borderColor="grey.500"
          bgcolor="grey.100"
          width={550}
          height={450}
          overflow="auto"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {isLoading ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '5vh',
              }}
            >
              {/* 로딩 중 표시*/}
              <BeatLoader color={'#123abc'} isLoading={true} size={15} />
              <Typography
                variant="h6"
                color="black"
                fontSize="16px"
                style={{ marginTop: '5vh' }}
              >
                AI가 열심히 답변을 생성하고 있어요!
              </Typography>
            </div>
          ) : isError ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BiSolidErrorAlt
                style={{
                  width: '50px',
                  height: '50px',
                  color: 'red',
                  marginBottom: '20px',
                }}
              />
              <div>{errorMessage}</div>
              <div>나중에 다시 시도해주세요...</div>
            </div>
          ) : result ? (
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                padding: '0 10px',
              }}
            >
              {/* 결과 표시*/}
              {result}
            </pre>
          ) : (
            <Typography variant="h6" color="gray" fontSize="16px">
              AI가 여러분의 여행 계획을 만들어 드립니다!
            </Typography>
          )}
        </Box>
      </Box>
    </div>
  );
}

export default GPTComponent;
