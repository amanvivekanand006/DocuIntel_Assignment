
import React from 'react';
import './Css/Navbar.css';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('access_token'); // Or replace 'token' with your actual login key

  const handleLogout = () => {
    localStorage.removeItem('access_token'); // Adjust based on your auth logic
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-text">Docu<span>Intel</span></span>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><a href="#">Features</a></li>
        <li><a href="#">Docs</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>

      <div className="navbar-actions">
        {isLoggedIn ? (
          <>
            <Link to="/filechat" className="btn-login">Upload File</Link>
            <button onClick={handleLogout} className="btn-signup logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/register" className="btn-signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
