import React, { useState } from 'react';
import { Button, Drawer, Space } from 'antd';
import BottomCardList from './BottomCardList';
import BottomTypeFilter from './BottomTypeFilter';

// 이 컴포넌트는 하단사이드바를 열 수 있는 버튼을 제공합니다.
// 버튼을 누르면 하단사이드바를 띄우고, 내용을 BottomCardModal에는 지정합니다.
// BottomCardModal에는 App에서의 검색결과를 넘겨줍니다
const BottomSideBar = ({ keyword }) => {
  const [selectedType, setSelectedType] = useState(''); //장소 분류 저장
  const [open, setOpen] = useState(false);
  const placement = 'bottom';
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div
        style={{
          zIndex: '15',
          position: 'absolute',
          left: '631px',
          top: '16.5vh',
        }}
      >
        <Space>
          <Button
            type="primary"
            danger
            onClick={showDrawer}
            style={{
              padding: '1px',
              width: '50px',
              height: '6vh',
            }}
          >
            관광
          </Button>
        </Space>
        <Drawer
          title=""
          placement={placement}
          closable={false}
          onClose={onClose}
          open={open}
          key={placement}
          height={'60vh'}
        >
          <BottomTypeFilter onSelect={(value) => setSelectedType(value)} />
          <BottomCardList keyword={keyword} selectedType={selectedType} />
        </Drawer>
      </div>
    </>
  );
};
export default BottomSideBar;
