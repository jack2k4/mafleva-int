import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      background: '#2d3436',
      color: 'white',
      padding: '40px 20px',
      marginTop: '40px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '30px'
      }}>
        <div>
          <h3 style={{ marginBottom: '15px' }}>Mafleva International</h3>
          <p style={{ color: '#b2bec3', fontSize: '0.9rem' }}>
            Your premium destination for beauty, fashion, and fragrances.
          </p>
        </div>
        <div>
          <h3 style={{ marginBottom: '15px' }}>Quick Links</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><Link to="/" style={{ color: '#b2bec3', textDecoration: 'none' }}>Home</Link></li>
            <li><Link to="/shop" style={{ color: '#b2bec3', textDecoration: 'none' }}>Shop</Link></li>
            <li><Link to="/about" style={{ color: '#b2bec3', textDecoration: 'none' }}>About</Link></li>
            <li><Link to="/contact" style={{ color: '#b2bec3', textDecoration: 'none' }}>Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 style={{ marginBottom: '15px' }}>Categories</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><Link to="/shop?category=beauty" style={{ color: '#b2bec3', textDecoration: 'none' }}>Beauty</Link></li>
            <li><Link to="/shop?category=clothing" style={{ color: '#b2bec3', textDecoration: 'none' }}>Clothing</Link></li>
            <li><Link to="/shop?category=perfumes" style={{ color: '#b2bec3', textDecoration: 'none' }}>Perfumes</Link></li>
          </ul>
        </div>
      </div>
      <div style={{
        borderTop: '1px solid #636e72',
        marginTop: '20px',
        paddingTop: '20px',
        textAlign: 'center',
        color: '#b2bec3',
        fontSize: '0.9rem'
      }}>
        <p>&copy; 2024 Mafleva International Limited. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
