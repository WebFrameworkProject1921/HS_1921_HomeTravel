import React from 'react';

function SNS() {
  // SNS는 z-index 30 ~ 49 사이로 해야함 css 충돌방지
  // 붙일 때 z-index조절해서 유튜브, gpt버튼이 안나오게 해야한다.
  return <div style={{ zIndex: 30 }}></div>;
}

export default SNS;
