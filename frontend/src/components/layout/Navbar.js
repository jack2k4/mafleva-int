import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = ({ cartCount = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/shop?search=' + encodeURIComponent(searchQuery));
      setSearchQuery('');
    }
  };

  return (
    <nav style={{
      background: '#2d3436',
      color: 'white',
      padding: '15px 20px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>👑 Admin</Link>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>
            🛍️ Mafleva International
          </h2>
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div style={{
          display: isOpen ? 'flex' : 'flex',
          gap: '20px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
          <Link to="/shop" style={{ color: 'white', textDecoration: 'none' }}>Shop</Link>
          <Link to="/beauty" style={{ color: 'white', textDecoration: 'none' }}>💄 Beauty</Link>
          <Link to="/clothing" style={{ color: 'white', textDecoration: 'none' }}>👗 Clothing</Link>
          <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>About</Link>
          <Link to="/testimonials" style={{ color: 'white', textDecoration: 'none' }}>Testimonials</Link>
          <Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</Link>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '20px',
                border: 'none',
                outline: 'none',
                width: '150px'
              }}
            />
            <button type="submit" style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              marginLeft: '-30px'
            }}>
              <FaSearch />
            </button>
          </form>

          <Link to="/cart" style={{ color: 'white', position: 'relative' }}>
            <FaShoppingCart size={20} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#ff6b6b',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          <Link to="/account" style={{ color: 'white' }}>
            <FaUser size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
