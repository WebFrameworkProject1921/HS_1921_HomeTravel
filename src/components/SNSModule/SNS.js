
import Container from '@mui/material/Container';
import SNSCardList from './SNSCardList';
import { useEffect, useState } from 'react'

import { Box, Button, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SNSCardModal from './SNSCardModal';
import axios from "axios";
import SNSCardCreateModal from './SNSCardCreateModal';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./css/Silder.css"
import SNSCardUpdateModal from './SNSCardUpdateModal';
import { Link, Route, Routes, useLocation } from "react-router-dom";



function SNS({ isLoggedIn }) {
  // SNS는 z-index 30 ~ 49 사이로 해야함 css 충돌방지
  // 붙일 때 z-index조절해서 유튜브, gpt버튼이 안나오게 해야한다.
  const [cards, setCards] = useState([]);
  const location = useLocation();
  const [user, setUser] = useState(null);



  // 모달창의 모드 (CREATE, READ UPDATE, DELETE)
  const [mode, setMode] = useState();

  // 선택한 카드
  const [card, setCard] = useState();

  // 모달창 표시 여부
  const [open, setOpen] = useState(false);

  // 모달창 활성화 함수
  const handleClickOpen = () => {
    setOpen(true);
  };

  // 모달창 비활성화 함수
  const handleClose = (event, reason) => {

    if (reason && reason == "backdropClick") {
      return;
    }

    setOpen(false);
  };

  // 컴포넌트 첫 렌더링 시 실행
  useEffect(
    () => {
      async function getData() {
        try {
          const res = await axios.get("http://localhost:8080/posts");
          setCards(res.data);
        } catch (error) {
          console.error(error);
          alert('데이더를 가져오는데 오류가 발생했습니다.')
        }
      }
      getData();
    }, []
  );

  let modal = null;

  const handleDelete = async (cardId) => {
    await axios.delete(`http://localhost:8080/posts/${cardId}`)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log('Error', error);
        });



    await axios.get("http://localhost:8080/posts")
        .then(res => {
            setCards(res.data);
        }).catch(err => {
            alert('데이더를 가져오는데 오류가 발생했습니다.');
            console.log(err)
        });

  }

  if (mode === "CREATE") {
    modal = <SNSCardCreateModal open={open} onClose={handleClose} setCards={setCards} />
  } else if (mode === "READ") {
    modal = <SNSCardModal isLoggedIn={isLoggedIn} open={open} onClose={handleClose} card={card} setMode={setMode} handleDelete={handleDelete} />
  } else if (mode === "UPDATE") {
    modal = <SNSCardUpdateModal open={open} onClose={handleClose} card={card} setCards={setCards} />
  }

  return (

    <>

      <Container sx={{position: 'relative', zIndex: 50, marginTop: 19, backgroundColor: 'white', width: '100vw'}}>
        <h1 style={{ textAlign: "center" }}>방구석 국내 여행 SNS</h1>
        <SNSCardList cards={cards} setMode={(card) => {
          setMode("READ");
          setCard(card);
          handleClickOpen();
        }} />
      </Container>

      {modal}

      {isLoggedIn &&
        <Fab color="primary" aria-label="add" onClick={() => {
          setMode("CREATE");
          handleClickOpen();
        }} style={{ position: 'fixed', bottom: '50px', right: '50px' }}>
          <AddIcon />
        </Fab>
      }
    </>
  )
}

export default SNS;
