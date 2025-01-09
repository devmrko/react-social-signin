import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <div className="navbar-nav">
          <Link className="nav-link" to="/billboard">Billboard Chart</Link>
          <Link className="nav-link" to="/artists">Artists</Link>
          <Link className="nav-link" to="/about">About</Link>
          <Link className="nav-link" to="/contact">Contact</Link>
          <Link className="nav-link" to="/search">Search Artist</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;