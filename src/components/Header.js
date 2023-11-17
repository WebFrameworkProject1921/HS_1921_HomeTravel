import { React } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// 상단 헤더 컴포넌트
// 이곳에 로그인 회원가입 버튼 만들어야 한다.
const NavbarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  z-index: 99;
`;

const StyledNav = styled.nav`
  width: 100vw;
  height: 16vh; // 헤더 세로길이
  background: url(img/headerImage.jpg) no-repeat center;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 2;
`;

const StyledLink = styled(Link)`
  color: white;
  padding: 0vh;
  text-decoration: none;
  font-size: 1.3em;
  z-index: 3;
  margin-left: 1vw;
  line-height: 2em;
`;

const LogoText = styled.h1`
  color: white;
  font-size: 2em;
  margin-left: 1vw;
  margin-top: 2vh;
`;

function Header() {
  return (
    <NavbarContainer>
      <StyledNav>
        <LogoText>방구석 국내여행</LogoText>
        <div style={{ display: 'flex', gap: '10px' }}>
          <StyledLink to={'/'}>Main</StyledLink>
          <StyledLink to={'/SNS'}>SNS</StyledLink>
          <StyledLink to={'/Calendar'}>Calendar</StyledLink>
        </div>
      </StyledNav>
    </NavbarContainer>
  );
}

export default Header;
