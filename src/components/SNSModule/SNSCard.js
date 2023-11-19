import { Box, Card, CardContent, Typography } from "@mui/material";

import Slider from "react-slick";

function SNSCard({ card, setMode }) {

    return (

        <Card sx={{ p: 3, m: 3 }}>
            <Slider dots={true} style={{ margin: "0 auto", maxWidth: 500 }} >
                {card.imageFiles.map((image, key) => (
                    <div key={key}>
                        <img src={'http://localhost:8080/posts/images/' + image.storeFileName} style={{ margin: "0 auto", maxHeight: 300 }} />
                    </div>
                ))
                }

            </Slider>
            <CardContent onClick={() => setMode(card)}>
                <Box>
                    <Typography variant="h6">{card.userName}</Typography>
                    <Typography variant="p">{card.createDate}</Typography>
                </Box>
                <Typography noWrap={true} color="text.secondary">
                    {card.memo}
                </Typography>
            </CardContent>

        </Card>


    )
}

export default SNSCard;