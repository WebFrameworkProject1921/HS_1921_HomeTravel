import { Select } from 'antd';

//이 컴포넌트는 선택된 값을 App로 보내고, 그 값은 AddSearchBox로 보내져 검색어와 조합됩니다
const BottomTypeFilter = function ({ onSelect }) {
  const onChange = (value) => {
    // 선택된 값을 App으로 전달
    onSelect(value);
  };

  const onSearch = (value) => {
    //아무 기능도 없지만, 있어야 컴포넌트가 동작함
  };

  const filterOption = (
    input,
    option //antd 라이브러리
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <>
      <Select
        showSearch
        placeholder="장소 분류 선택"
        optionFilterProp="children"
        onChange={onChange}
        onSearch={onSearch}
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
};

export default BottomTypeFilter;
