import { React } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavbarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  z-index: 2;
`;

const StyledNav = styled.nav`
  width: 100%;
  height: 130px;
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
  padding: 3px;
  text-decoration: none;
  font-size: 1.1em;
  z-index: 3;
  margin-left: 31px;
  line-height: 2em;
`;

const LogoText = styled.h1`
  color: white;
  font-size: 2em;
  margin-left: 32px;
  margin-top: 10px;
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
