import React from 'react';
import { Link } from 'react-router-dom';
import SocialMedia from '../components/SocialMedia';

function Home() {
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '15px',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
          Welcome to Mafleva International Limited 🛍️
        </h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 30px' }}>
          Your premium destination for beauty, fashion, and fragrances
        </p>
        <Link to="/shop">
          <button style={{
            padding: '15px 40px',
            background: 'white',
            color: '#764ba2',
            border: 'none',
            borderRadius: '30px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Start Shopping
          </button>
        </Link>
      </div>

      {/* Categories */}
      <div style={{ marginTop: '50px' }}>
        <h2 style={{ textAlign: 'center', color: '#2d3436', marginBottom: '30px' }}>
          Shop by Category
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          {[
            { name: 'Beauty', icon: '💄', link: '/shop?category=beauty' },
            { name: 'Clothing', icon: '👗', link: '/shop?category=clothing' },
            { name: 'Perfumes', icon: '🌸', link: '/shop?category=perfumes' }
          ].map(category => (
            <Link key={category.name} to={category.link} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white',
                padding: '30px',
                textAlign: 'center',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease'
              }}>
                <div style={{ fontSize: '3rem' }}>{category.icon}</div>
                <h3 style={{ color: '#2d3436', marginTop: '10px' }}>{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Social Media Section */}
      <div style={{
        marginTop: '60px',
        padding: '40px',
        background: 'white',
        borderRadius: '15px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#2d3436', marginBottom: '20px' }}>Follow Us</h2>
        <p style={{ maxWidth: '700px', margin: '0 auto 30px', fontSize: '1.1rem', lineHeight: '1.8' }}>
          Connect with us on social media for updates, exclusive offers, and inspiration!
        </p>
        <SocialMedia />
      </div>
    </div>
  );
}

export default Home;
