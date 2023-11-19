import { Box, DialogTitle, Button, Dialog, DialogActions, DialogContent, Typography, ListItem, TextField, IconButton, List, ListItemButton, ListItemText, Divider } from "@mui/material"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Textarea from '@mui/joy/Textarea';
import { styled } from '@mui/system';
import { useEffect, useState } from 'react'
import axios from 'axios';
import Slider from "react-slick";

import SearchIcon from '@mui/icons-material/Search';

import { Map, MapMarker } from "react-kakao-maps-sdk";
import DeleteIcon from '@mui/icons-material/Delete';



const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});




function SNSCardUpdateModal({ open, onClose, card, setCards }) {


    const [memo, setMemo] = useState(card.memo);

    const [serverImages, setServerImages] = useState(card.imageFiles);

    const [images, setImages] = useState([]);




    const { kakao } = window;


    const [info, setInfo] = useState({
        // 지도의 초기 위치
        position: { lat: card.location.lat, lng: card.location.lng },
        content: card.location.name
    }
    )

    const [keyword, setKeyword] = useState(card.location.name); // 검색 키워드를 위한 상태값을 추가합니다.

    const [markers, setMarkers] = useState([])


    const [map, setMap] = useState()



    useEffect(() => {
        if (!map) return
        const ps = new kakao.maps.services.Places()

        ps.keywordSearch(keyword, (data, status, _pagination) => {
            if (status === kakao.maps.services.Status.OK) {
                let markers = []

                for (var i = 0; i < data.length; i++) {
                    markers.push({
                        position: {
                            lat: data[i].y,
                            lng: data[i].x,
                        },
                        content: data[i].place_name,
                    })
                }
                setMarkers(markers)
            }
        })
    }, [map, keyword])



    const handleFindLocation = (e) => {
        e.preventDefault();
        const keyword = e.target.keyword.value;
        setKeyword(keyword)
    }


    const handleSubmit = async () => {

        var formData = new FormData();


        console.log(images, serverImages)


        images.forEach((image) => {
            formData.append('imageFiles', image);
        });


        // serverImages 상태값 추가

        formData.append("serverImages", new Blob([JSON.stringify(serverImages)], {
            type: "application/json"
        }));


        formData.append('userName', localStorage.getItem('nickname'));
        formData.append('memo', memo);
        formData.append('authorId', localStorage.getItem('id'));
        formData.append('location.name', info.content);
        formData.append('location.lat', info.position.lat);
        formData.append('location.lng', info.position.lng);


        await axios.put(`http://localhost:8080/posts/${card.id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then(res => {
            console.log(res.data);
        }).catch(err => {
            alert('등록을 실패하였습니다.');
        });

        await axios.get("http://localhost:8080/posts")
            .then(res => {
                setCards(res.data);
            }).catch(err => {
                alert('등록을 실패하였습니다.');
            });

        // 모달창 닫기
        onClose(false);
    }


    



    const resetData = () => {
        setImages([]);
        setMemo('');
    }



    const handleDeleteServerImage = async (storeFileName) => {
        setServerImages(serverImages.filter((image) => image.storeFileName !== storeFileName));
    }


    const handleDeleteImage = (imageIndex) => {
        setImages(images.filter((_, index) => index !== imageIndex));
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={"md"} scroll={'paper'}>
            <DialogTitle>게시물 수정</DialogTitle>
            <DialogContent dividers={true}>
                <Box sx={{ display: 'flex', justifyContent: 'center', m: 2 }}>
                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                        이미지 업로드
                        <VisuallyHiddenInput type="file" accept="image/*" onChange={(e) => {
                            setImages([...images, ...e.target.files])
                            e.target.value = '';
                        }} multiple />
                    </Button>
                </Box>



                <Slider dots={true} style={{ margin: "0 auto", maxWidth: 600 }} >


                    {/* 이미 서버에 올라간 이미지 */}
                    {serverImages.map((image, key) => (
                        <Box key={key} sx={ {textAlign: "right" }}>
                            <img src={'http://localhost:8080/posts/images/' + image.storeFileName} style={{ margin: "0 auto", maxHeight: 400 }} />
                            <Button variant="contained" color="error" startIcon={<DeleteIcon />}  onClick={() => handleDeleteServerImage(image.storeFileName)}> 삭제</Button>
                        </Box>
                    ))
                    }

                    {/* 사용자가 추가로 올린 이미지 */}
                    {images.map((image, key) => (
                        <Box key={key} sx={ {textAlign: "right" }}>
                            <img src={URL.createObjectURL(image)} style={{ margin: "0 auto", maxHeight: 400 }} />
                            <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => { handleDeleteImage(key) }}> 삭제</Button>
                        </Box>
                    ))
                    }


                </Slider>



                <Typography sx={{ fontWeight: 'bold' }} gutterBottom>
                    메모
                </Typography>

                <Textarea placeholder="메모를 작성하세요" required sx={{ mb: 1 }} minRows={5} value={memo} onChange={(e) => setMemo(e.target.value)} />


                <Typography sx={{ fontWeight: 'bold' }} gutterBottom>
                    위치정보
                </Typography>

                {/* Kakao Map API */}


                <Box style={{ position: "relative" }}>
                    <Map // 로드뷰를 표시할 Container
                        center={info.position}
                        isPanto={true}
                        style={{
                            width: "100%",
                            height: "350px",
                        }}
                        level={3}
                        onCreate={setMap}
                    >
                        {markers.map((marker) => (
                            
                            <MapMarker
                                key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
                                position={marker.position}
                                onClick={() => {setInfo(marker); console.log(marker)}}
                            >
                                {info && (info.position.lat === marker.position.lat) && (info.position.lng === marker.position.lng) &&

                                    (

                                        <div style={{ color: "#000" }}>{marker.content}</div>
                                    )}
                            </MapMarker>
                        ))}
                    </Map>

                    <Box sx={{ position: "absolute", top: 0, left: 0, bottom: 0, zIndex: 1, background: "rgb(255, 255, 255, 0.75)", overflowY: 'scroll' }}>
                        <form onSubmit={handleFindLocation} style={{ padding: '10px' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <TextField id="outlined-basic" placeholder="장소를 검색하세요" variant="outlined" name="keyword" />
                                <IconButton aria-label="delete" size="large" type="sumbit">
                                    <SearchIcon />
                                </IconButton>
                            </Box>
                        </form>

                        <Divider />
                        <List>
                            {markers.map((marker, index) => (
                                <ListItem disablePadding key={index} onClick={() => setInfo(marker)}>
                                    <ListItemButton>
                                        <ListItemText primary={marker.content} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>

                </Box>


            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    resetData();
                    onClose();
                }} >취소</Button>
                <Button variant="contained" onClick={handleSubmit}>수정</Button>
            </DialogActions>
        </Dialog>
    )
}

export default SNSCardUpdateModal;
