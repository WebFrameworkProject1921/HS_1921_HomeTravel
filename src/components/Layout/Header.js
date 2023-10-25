import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/header.css';
import styled from 'styled-components';

const NavbarContainer = styled.div`
  position: fixed;
  width: 100%;
  height: 9%;
`;

function Header() {
  return (
    <NavbarContainer>
      <nav className="navbar">
        <img
          src="img/logo.PNG"
          alt="Logo"
          style={{
            width: 12 + '%',
            height: 100 + '%',
          }}
        />
        <div>
          <Link className="navbarMenu" to={'/'}>
            Main
          </Link>
          <Link className="navbarMenu" to={'/SNS'}>
            SNS
          </Link>
          <Link className="navbarMenu" to={'/Calendar'}>
            Calender
          </Link>
        </div>
      </nav>
    </NavbarContainer>
  );
}

export default Header;
