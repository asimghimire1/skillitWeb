import React from 'react';
import { Link } from 'react-router-dom';
import '../css/navBar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">SkillIt</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/courses">Courses</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
