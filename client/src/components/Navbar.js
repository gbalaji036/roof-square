import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';

const Navbar = () => {
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    fetchLogo();
  }, []);

  const fetchLogo = async () => {
    try {
      const response = await adminAPI.getLogo();
      setLogo(response.data.logoUrl);
    } catch (error) {
      console.error('Error fetching logo:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="logo">
            {logo ? (
              <img 
                src={`http://localhost:5000${logo}`} 
                alt="ROOF SQUARE REALTY" 
                style={{ height: '40px' }}
              />
            ) : (
              'ROOF SQUARE REALTY'
            )}
          </Link>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/properties/Upcoming Project">Upcoming Projects</Link></li>
            <li><Link to="/properties/New Launch">New Launch</Link></li>
            <li><Link to="/properties/Luxury Homes">Luxury Homes</Link></li>
            <li><Link to="/properties">All Properties</Link></li>
            <li><Link to="/admin/login">Admin</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
