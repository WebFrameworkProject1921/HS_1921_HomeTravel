import { Box, DialogTitle, Button, Dialog, DialogActions, DialogContent, Typography, ListItem, TextField, IconButton, List, ListItemButton, ListItemText, Divider, FormControl } from "@mui/material"
import { Textarea } from "@mui/joy"
import Slider from "react-slick"
import { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import { StaticMap } from "react-kakao-maps-sdk";
import SendIcon from '@mui/icons-material/Send';
import axios from "axios";


function SNSCardModal({ open, onClose, card, setMode, isLoggedIn, handleDelete }) {

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [CommentMode, setCommentMode] = useState("READ");
  const [editingCommentId, setEditingCommentId] = useState(null);  // 수정중인 댓글의 ID를 저장하는 상태를 추가합니다


  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/comments/${card.id}`);
      console.log(res.data);
      setComments(res.data);
    } catch (error) {
      console.log(error);
      alert('데이더를 가져오는데 오류가 발생했습니다.')
    }
  };


  useEffect(() => {
    if (open) {
      fetchComments(); // 다이얼로그가 열릴 때마다 fetchComments를 호출합니다.
    }
  }, [open]);



  const postComment = async () => { // 댓글을 전송하는 함수입니다

    let today = new Date();


    try {
      const response = await axios.post('http://localhost:8080/comments', {
        postId: card.id,
        author: localStorage.getItem('nickname'),
        authorId: localStorage.getItem('id'),
        createDate: today.getFullYear() + "." + (today.getMonth() + 1) + "." + today.getDate(),
        comment: comment
      });

      if (response.status === 200) {
        alert('댓글이 성공적으로 등록되었습니다.');
        setComment(''); // 댓글 상태를 초기화합니다.
        fetchComments(); // 댓글을 다시 가져옵니다
      }
    } catch (error) {
      console.error(error);
    }
  };



  const updateComment = async () => { // 댓글을 수정하는 함수입니다



    try {
      const response = await axios.put(`http://localhost:8080/comments/${editingCommentId}`, { // PUT 메소드를 사용하여 댓글을 수정합니다
        comment: comment
      });

      if (response.status === 200) {
        alert('댓글이 성공적으로 수정되었습니다.');
        setComment(''); // 댓글 상태를 초기화합니다.
        setEditingCommentId(null); // 수정중인 댓글 상태를 초기화합니다.
        setCommentMode("READ");
        fetchComments(); // 댓글을 다시 가져옵니다
        
      }
    } catch (error) {
      console.error(error);
    }
  };



  const deleteComment = async (commentId) => { // 댓글을 전송하는 함수입니다



    try {
      const response = await axios.delete(`http://localhost:8080/comments/${commentId}`);

      if (response.status === 200) {
        alert('댓글이 성공적으로 삭제되었습니다.');
        fetchComments(); // 댓글을 다시 가져옵니다
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={"md"} scroll={'paper'}>
      <DialogTitle>게시물 조회</DialogTitle>
      <DialogContent dividers={true}>



        <Slider dots={true} style={{ margin: "0 auto", maxWidth: 600 }} >
          {card.imageFiles.map((image, key) => (
            <div key={key}>
              <img src={'http://localhost:8080/posts/images/' + image.storeFileName} style={{ margin: "0 auto", maxHeight: 400 }} />
            </div>
          ))
          }

        </Slider>

        <Divider fullWidth sx={{ m: 6 }} />

        <Typography sx={{ fontWeight: 'bold' }} gutterBottom>
          메모
        </Typography>

        <Textarea placeholder="메모를 작성하세요" required sx={{ mb: 1 }} minRows={5} disabled={true} value={card.memo} />

        <Typography sx={{ fontWeight: 'bold' }} gutterBottom>
          위치정보
        </Typography>

        {/* Kakao Map API */}




        <StaticMap // 지도를 표시할 Container
          center={{
            // 지도의 중심좌표
            lat: card.location.lat,
            lng: card.location.lng
          }}
          style={{
            // 지도의 크기
            width: "100%",
            height: "450px",
            margin: "30px 0"
          }}
          marker={[
            {
              position: card.location,
              text: card.location.name
            }
          ]}
          level={3} // 지도의 확대 레벨
        />

        <Typography sx={{ fontWeight: 'bold' }} gutterBottom>
          댓글
        </Typography>


        <TableContainer >
          <Table sx={{ minWidth: 650, maxWidth: 700, margin: "0 auto" }} aria-label="simple table">
            <TableBody>
              {comments.map((comment) => (
                <TableRow
                  key={comment.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="center">
                    {comment.author}
                  </TableCell>

                  <TableCell align="center">

                    {comment.comment}


                  </TableCell>

                  <TableCell align="center">{comment.createDate}</TableCell>
                  <TableCell align="center">

                    {isLoggedIn && localStorage.getItem("id") == comment.authorId && (
                      <>
                        <Button variant="contained" color="primary" onClick={() => {
                          if (CommentMode == "READ") {
                            setCommentMode("UPDATE");
                            setEditingCommentId(comment.id); // 수정할 댓글의 ID를 설정합니다.

                            setComment(comment.comment); // 해당 댓글 내용을 Textarea에 보여줍니다
                          } else if (CommentMode == "UPDATE") {
                            setEditingCommentId(null); // 수정할 댓글의 ID를 설정합니다.
                            setCommentMode("READ");
                            setComment(''); // 댓글 상태를 초기화합니다.
                          }
                        }}>수정하기</Button>

                        <Button variant="contained" color="error" onClick={() => deleteComment(comment.id)} >삭제하기</Button>
                      </>
                    )
                    }

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ m: 2 }} />

        {
          isLoggedIn && (
            <FormControl fullWidth>
              <Textarea
                placeholder="댓글을 작성해주세요."
                minRows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)} // 댓글 입력 시, comment 상태를 업데이트합니다
                endDecorator={
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 'var(--Textarea-paddingBlock)',
                      pt: 'var(--Textarea-paddingBlock)',
                      borderTop: '1px solid',
                      borderColor: 'divider',
                      flex: 'auto',
                    }}
                  >
                    <IconButton
                      variant={'soft'}
                      color={'primary'}
                      sx={{ ml: 'auto' }}
                      onClick={(e) => {
                        if (CommentMode === "UPDATE") {
                          updateComment();
                        } else {
                          
                          postComment();
                        }
                      }
                      }
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                }
                sx={{
                  minWidth: 300
                }}
              />
            </FormControl>
          )
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          onClose();
        }} >닫기</Button>

        {isLoggedIn && localStorage.getItem("id") == card.authorId && (
          <>
            <Button variant="contained" onClick={() => { setMode("UPDATE") }}>수정하기</Button>
            <Button variant="contained" color="error" onClick={()=> {
              handleDelete(card.id);
              onClose();
            }}>삭제하기</Button>
          </>
        )
        }


      </DialogActions>
    </Dialog>
  )

}

export default SNSCardModal