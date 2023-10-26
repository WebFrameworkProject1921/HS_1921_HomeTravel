import { React } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavbarContainer = styled.div`
  position: fixed;
  width: 100%;
  height: 130px;
  z-index: 2;
`;

const StyledNav = styled.nav`
  width: 100%;
  height: 100%;
  background-color: rgb(51, 63, 80);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
`;

const StyledLink = styled(Link)`
  color: white;
  padding: 10px;
  text-decoration: none;
  font-size: 1.5em;
  z-index: 2;
`;

const LogoImage = styled.img`
  margin-top: 10px;
  width: 200px;
  height: 60px;
`;

function Header() {
  return (
    <NavbarContainer>
      <StyledNav>
        <div>
          <LogoImage src="img/logo.PNG" alt="Logo" />
        </div>
        <div style={{ margin: 1 + 'vh' }}>
          <StyledLink to={'/'}>Main</StyledLink>
          <StyledLink to={'/SNS'}>SNS</StyledLink>
          <StyledLink to={'/Calendar'}>Calendar</StyledLink>
        </div>
      </StyledNav>
    </NavbarContainer>
  );
}

export default Header;
