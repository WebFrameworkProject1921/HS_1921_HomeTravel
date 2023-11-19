import SNSCard from "./SNSCard";



function SNSCardList({cards, setMode}) {


    return (
        <>
            {
                cards.map(card => (
                        <SNSCard key={card.id} card={card} setMode={setMode} />
                ))

            }
        </>


    )
}

export default SNSCardList;
