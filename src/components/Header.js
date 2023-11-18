import { React } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';

// 상단 헤더 컴포넌트
// 회원가입 버튼에 로직 추가 필요함.
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

const StyledNavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 16vh;

  background: url(img/headerImage.jpg) no-repeat center;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
`;

const NavLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

const NavRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding-right: 50px;
  padding-bottom: 20px;
  gap: 10px;
`;

function Header({ isLoggedIn, setIsLoggedIn }) {
  const handleLogout = () => {
    //로그아웃
    console.log('gg');
    localStorage.removeItem('id');
    localStorage.removeItem('nickname');
    localStorage.removeItem('email');
    setIsLoggedIn(false);
  };
  return (
    <NavbarContainer>
      <StyledNavContainer>
        <NavLeft>
          <LogoText>방구석 국내여행</LogoText>
          <div style={{ display: 'flex', gap: '10px' }}>
            <StyledLink to={'/'}>Main</StyledLink>
            <StyledLink to={'/SNS'}>SNS</StyledLink>
            <StyledLink to={'/Calendar'}>Calendar</StyledLink>
          </div>
        </NavLeft>
        <NavRight>
          {isLoggedIn ? (
            <StyledLink to={'/'}>
              <AwesomeButton
                type="danger"
                onPress={() => {
                  handleLogout();
                }}
              >
                로그아웃
              </AwesomeButton>
            </StyledLink>
          ) : (
            <>
              <Link to={'/login'}>
                <AwesomeButton type="messenger">로그인</AwesomeButton>
              </Link>
              <Link to={'/회원가입 경로 넣기'}>
                <AwesomeButton type="messenger">회원가입</AwesomeButton>
              </Link>
            </>
          )}
        </NavRight>
      </StyledNavContainer>
    </NavbarContainer>
  );
}

export default Header;
