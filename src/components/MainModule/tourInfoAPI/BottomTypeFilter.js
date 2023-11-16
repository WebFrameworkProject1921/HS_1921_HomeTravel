import { Select } from 'antd';

// 사용자가 선택한 옵션 값을 전달반은 onSelect 의 매개변수로 메시지 전송
// onSelect는 BottomSideBar.js의 setSelectedType 에게 메시지 전송으로 상태변수 변경한다.
// 상태변수 변경 시 BottomCardList.js 로 전달된 selectedType 을 감시하던ㄷ useEffect에 의해
// 표시하는 관광지 정보가 업데이트된다.
function BottomTypeFilter({ onSelect }) {
  // antd 라이브러리 활용 - 분류 옵션 표시.
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <>
      <Select
        showSearch
        placeholder="장소 분류 선택"
        optionFilterProp="children"
        onChange={(value) => onSelect(value)}
        filterOption={filterOption}
        style={{ width: '200px', left: '90%', marginBottom: '50px' }}
        options={[
          {
            value: '',
            label: '전체',
          },
          {
            value: '12',
            label: '관광특화',
          },
          {
            value: '14',
            label: '문화시설',
          },
          {
            value: '15',
            label: '행사/공연/축제',
          },
          {
            value: '25',
            label: '여행코스',
          },
          {
            value: '28',
            label: '레포츠',
          },
          {
            value: '32',
            label: '숙박',
          },
          {
            value: '38',
            label: '쇼핑',
          },
          {
            value: '39',
            label: '음식',
          },
        ]}
      />
    </>
  );
}

export default BottomTypeFilter;
