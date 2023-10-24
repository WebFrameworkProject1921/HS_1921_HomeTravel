import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/header.css';

function Header() {
  return (
    <nav
      className="navbar"
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <img src="your-logo-src" alt="Logo" />
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
  );
}

export default Header;
