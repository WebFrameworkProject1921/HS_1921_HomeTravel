import { Draggable } from 'react-beautiful-dnd';
import CardModal from './CardModal';
import React, { useState } from 'react';

const Card = ({
  card,
  index,
  columnId,
  columns,
  setColumns,
  boards,
  boardIndex,
}) => {
  const [isModalOpen, setModalOpen] = useState(false); //카드 정보 모달
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  //카드 삭제 함수
  const deleteCard = () => {
    const updatedColumns = { ...columns };
    updatedColumns[columnId].cards.splice(index, 1);
    setColumns(updatedColumns);
  };

  //카카오맵 api 카테고리에 따른 카드 배경 스타일 지정 함수
  const findKeyword = (categoryDetail) => {
    //카테고리디테일은 여행 > 관광,명소 > 해수욕장,해변 등의 값이 있다. 내가 원하는 건 해수욕장, 해변이 있는지 확인해서 있으면 bitch로 css스타일을 지정하는 것
    const tokens = categoryDetail.split(' > '); //>를 기준으로 토큰을 분리한다.

    const targetKeywords = [
      '해수욕장,해변',
      '섬',
      '스포츠,레저',
      '천문대',
      '절,사찰',
      '산',
      '편의점',
      '계곡',
      '도보여행',
      '주차장',
      '교육,학문',
    ]; //원하는 키워드 들은 이 배열에 저장해준다.

    const keyword = tokens.find((token) =>
      targetKeywords.some((keyword) => token === keyword)
    ); //tokens와 targetKeywords를 비교하면서 같은 단어가 있으면 keyword에 저장됨, some은 키워드가 있는 지 true/false를 리턴 해주고 find는 true가 있으면 해당 키워드를 리턴해준다.

    return keyword || ''; // 키워드를 찾으면 리턴, 찾지 못하면 빈 문자열 리턴
  };
  const categoryToEnglish = ({ category, categoryDetail }) => {
    // 카테고리 값을 해당하는 배경색으로 매핑바꾸기 위해 영어로 바꿉니다.
    const categoryMappings = {
      관광명소: 'attraction',
      카페: 'cafe',
      음식점: 'restaurant',
      숙박: 'accommodation',
      공공기관: 'government-office',
      '주유소,충전소': 'gas-station',
      '해수욕장,해변': 'beach',
      섬: 'island',
      '스포츠,레저': 'sport',
      천문대: 'observatory',
      '절,사찰': 'temple',
      산: 'mountain',
      편의점: 'convenience-store',
      계곡: 'creek',
      도보여행: 'road',
      주차장: 'parking-lot',
      '교육,학문': 'school',
      '': '', // 카테고리가 비어있는 경우의 기본색상
    };
    const keyword = findKeyword(categoryDetail); //먼저 카테고리 디테일에서 해당하는 키워드가 있는지 확인
    if (keyword) {
      //키워드가 있으면 리턴
      return categoryMappings[keyword];
    } else return categoryMappings[category] || ''; //키워드가 없으면 카테고리를 리턴, 카테고리도 없으면 "" 리턴
  };

  return (
    <>
      <Draggable
        key={card.id} //렌더링될 때 각각의 Card를 고유하게 식별하기 위해 필요, 어떤 아이템이 추가, 수정, 삭제 되는지 파악할 때 사용됨
        draggableId={card.id} //드래그 가능한 항목을 식별할 때 사용, key와 draggableId는 서로 다른 기능에서 각각 필요한 식별자 이므로 따로 관리함
        index={index} //배열의 인덱스와 일치, dnd 작업 시 index 값이 변경되며 Card가 재배열 된다.
      >
        {(provided, snapshot) => {
          const categoryStyle = categoryToEnglish(card.place);
          return (
            <div
              className={`card ${
                snapshot.isDragging ? 'dragging' : `${categoryStyle}`
              }`}
              ref={provided.innerRef} //드래그 시 요소의 위치와 스타일을 업데이트
              {...provided.draggableProps} //드래그 하는 동안 요소의 위치 및 스타일 제어에 사용
              {...provided.dragHandleProps} //터치하여 드래그 하는 데 사용
              onClick={openModal} //클릭시 모달 오픈
            >
              {card.place.name}
            </div>
          );
        }}
      </Draggable>
      <CardModal
        isOpen={isModalOpen}
        onClose={closeModal}
        card={card}
        deleteCard={deleteCard}
        boards={boards}
        boardIndex={boardIndex}
      />
    </>
  );
};

export default Card;
