import React from 'react';
import { Link } from 'react-router-dom';
import Testimonials from '../components/common/Testimonials';

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
            { name: 'Beauty', icon: '💄', link: '/beauty', color: '#fd79a8', desc: 'Skincare & Makeup' },
            { name: 'Clothing', icon: '👗', link: '/clothing', color: '#0984e3', desc: 'Men, Women & Kids' },
            { name: 'Perfumes', icon: '🌸', link: '/shop?category=perfumes', color: '#6c5ce7', desc: 'Branded & Niche' }
          ].map(category => (
            <Link key={category.name} to={category.link} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white',
                padding: '30px',
                textAlign: 'center',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                borderBottom: '4px solid ' + category.color
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }}>
                <div style={{ fontSize: '3rem' }}>{category.icon}</div>
                <h3 style={{ color: '#2d3436', marginTop: '10px' }}>{category.name}</h3>
                <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>{category.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Beauty Collection Banner */}
      <Link to="/beauty" style={{ textDecoration: 'none' }}>
        <div style={{
          marginTop: '50px',
          padding: '40px',
          background: 'linear-gradient(135deg, #fd79a8 0%, #e17055 100%)',
          borderRadius: '15px',
          color: 'white',
          textAlign: 'center',
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💄</div>
          <h2 style={{ fontSize: '2rem' }}>Explore Our Beauty Collection</h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            Discover premium skincare, makeup, and haircare products
          </p>
          <button style={{
            marginTop: '20px',
            padding: '12px 30px',
            background: 'white',
            color: '#e17055',
            border: 'none',
            borderRadius: '30px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Shop Beauty →
          </button>
        </div>
      </Link>

      {/* Clothing Collection Banner */}
      <Link to="/clothing" style={{ textDecoration: 'none' }}>
        <div style={{
          marginTop: '30px',
          padding: '40px',
          background: 'linear-gradient(135deg, #0984e3 0%, #6c5ce7 100%)',
          borderRadius: '15px',
          color: 'white',
          textAlign: 'center',
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👗</div>
          <h2 style={{ fontSize: '2rem' }}>Explore Our Clothing Collection</h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            Discover the latest trends for men, women, and kids
          </p>
          <button style={{
            marginTop: '20px',
            padding: '12px 30px',
            background: 'white',
            color: '#0984e3',
            border: 'none',
            borderRadius: '30px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Shop Clothing →
          </button>
        </div>
      </Link>

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
}

export default Home;
