import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import InputMask from 'react-input-mask';
import { GPT_API_KEY } from '../../config/GPTkey';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const api_key = GPT_API_KEY;

function GPTComponent() {
  const [destination, setDestination] = useState(''); // 목적지
  const [days, setDays] = useState(''); // 여행 일 수

  const [result, setResult] = useState(''); // 결과
  const [loading, setLoading] = useState(false); // 로딩 여부

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
    setLoading(true);
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
        setLoading(false);
        setResult(response.data.choices[0].message.content);
        setDestination('');
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
            onChange={handleDestinationChange}
          />
          <TextField
            label="며칠간 갈까요?"
            variant="outlined"
            value={days}
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
          {loading ? (
            <img
              src="https://studentrights.sen.go.kr/images/common/loading.gif"
              alt="loading"
            />
          ) : result ? (
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                padding: '0 10px',
              }}
            >
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
