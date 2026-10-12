import React from 'react';
import { Link } from 'react-router-dom';

const paymentMethods = ['M-Pesa', 'Airtel Money', 'Visa', 'Mastercard', 'PayPal', 'Stripe'];
const socialLinks = [
  { name: 'Facebook', url: 'https://www.facebook.com/share/1JC9Kzb4eU/', icon: 'f' },
  { name: 'Instagram', url: 'https://www.instagram.com/mafleva?psln=Y3p4a2d2OGlpcnIz', icon: '◎' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@maflevaint?_r=1&_t=ZS-9AUH9ffdiQI', icon: '♪' },
  { name: 'Threads', url: 'https://www.threads.com/@mafleva', icon: '◌' },
  { name: 'X', url: 'https://x.com/maflevaint', icon: 'X' }
];

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
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '30px'
      }}>
        <div>
          <h3 style={{ marginBottom: '15px' }}>Mafleva International</h3>
          <p style={{ color: '#b2bec3', fontSize: '0.9rem', lineHeight: 1.7 }}>
            Your premium destination for beauty, fashion, and fragrances.
          </p>
        </div>

        <div>
          <h3 style={{ marginBottom: '15px' }}>Payment Methods</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {paymentMethods.map((method) => (
              <span
                key={method}
                style={{
                  background: '#636e72',
                  color: 'white',
                  padding: '6px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '15px' }}>Follow Us</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                title={social.name}
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  background: '#ffffff',
                  color: '#2d3436',
                  textDecoration: 'none',
                  fontWeight: '700'
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>
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
      </div>
      <div style={{
        borderTop: '1px solid #636e72',
        marginTop: '20px',
        paddingTop: '20px',
        textAlign: 'center',
        color: '#b2bec3',
        fontSize: '0.9rem'
      }}>
        <p>&copy; 2026 Mafleva International Limited. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
