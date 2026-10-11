import React from 'react';
import { Link } from 'react-router-dom';
import Testimonials from '../components/common/Testimonials';

const cream = '#f7f1e7';
const creamDeep = '#efe3d2';
const creamCard = '#f9f4ee';

const categories = [
  { name: 'Beauty', icon: '/images%201/ba741899489fc321a99b0860f1d38847.jpg', link: '/beauty', color: '#fd79a8', desc: 'Skincare & Makeup' },
  { name: 'Clothing', icon: '/images%201/clothing.jpg', link: '/clothing', color: '#0984e3', desc: 'Men, Women & Kids' },
  { name: 'Perfumes', icon: '/images%201/download.png', link: '/perfumes', color: '#6c5ce7', desc: 'Branded & Niche' },
  { name: 'Health Products', icon: '🌿', link: '/health', color: '#2ecc71', desc: 'Wellness & Care' }
];

const featureCollections = [
  {
    title: 'Explore Our Beauty Collection',
    description: 'Discover premium skincare, makeup, and haircare products',
    image: '/images%201/ba741899489fc321a99b0860f1d38847.jpg',
    button: 'Shop Beauty →',
    link: '/shop?category=beauty',
    highlight: '#8d6d4e'
  },
  {
    title: 'Explore Our Clothing Collection',
    description: 'Discover the latest trends for men, women, and kids',
    image: '/images%201/clothing.jpg',
    button: 'Shop Clothing →',
    link: '/clothing',
    highlight: '#f1e6d3'
  },
  {
    title: 'Explore Our Perfumes Collection',
    description: 'Discover elegant scents for men, women, and unisex styles',
    image: '/images%201/download.png',
    button: 'Shop Perfumes →',
    link: '/perfumes',
    highlight: '#f1e6d3'
  },
  {
    title: 'Explore Our Health Collection',
    description: 'Support your wellness with trusted essentials and daily care',
    image: '/images/logo.jpeg',
    button: 'Shop Health →',
    link: '/health',
    highlight: '#dfeecf'
  }
];

const galleryItems = [
  { type: 'image', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.30.jpeg' },
  { type: 'image', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.31.jpeg' },
  { type: 'image', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.33.jpeg' },
  { type: 'image', src: '/images%201/clothing.jpg' },
  { type: 'image', src: '/images%201/download.png' },
  { type: 'image', src: '/images/logo.jpeg' },
  { type: 'image', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.30.jpeg' },
  { type: 'image', src: '/images%201/clothing.jpg' },
  { type: 'image', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.31.jpeg' },
  { type: 'image', src: '/images%201/download.png' }
].filter((item) => Boolean(item.src));

function Home() {
  return (
    <>
      <style>{`
        @keyframes heroZoom {
          0% { transform: scale(1.04); }
          50% { transform: scale(1.18); }
          100% { transform: scale(1.04); }
        }

        @keyframes gallerySlide {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
      <div style={{ background: cream, minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '40px 20px 60px' }}>
        <div
          style={{
            marginBottom: '24px',
            overflow: 'hidden',
            borderRadius: '18px',
            background: '#000',
            boxShadow: '0 10px 30px rgba(58, 41, 29, 0.08)',
            border: '1px solid rgba(142, 104, 71, 0.08)'
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '18px',
              width: 'max-content',
              animation: 'gallerySlide 28s linear infinite',
              willChange: 'transform',
              padding: '18px 0'
            }}
          >
            {[...galleryItems, ...galleryItems].map((item, index) => (
              <div
                key={`${item.src}-${index}`}
                style={{
                  flex: '0 0 auto',
                  width: '260px',
                  height: '220px',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 30px rgba(58, 41, 29, 0.08)',
                  border: '1px solid rgba(142, 104, 71, 0.08)'
                }}
              >
                <img
                  src={item.src}
                  alt="Mafleva product"
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    background: '#f9f4ee'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            textAlign: 'center',
            padding: '28px 18px 18px',
            background: 'rgba(247, 241, 231, 0.88)',
            borderRadius: '18px',
            color: '#2d3436',
            boxShadow: '0 10px 30px rgba(58, 41, 29, 0.08)',
            border: '1px solid rgba(142, 104, 71, 0.08)'
          }}
        >
          <img
            src="/images/logo.jpeg"
            alt="Mafleva logo"
            style={{
              display: 'block',
              width: '100%',
              maxWidth: '1100px',
              height: 'auto',
              margin: '0 auto'
            }}
          />
          <Link to="/shop" style={{ display: 'inline-block', marginTop: '8px' }}>
            <button
              style={{
                padding: '14px 36px',
                background: '#8e6847',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                letterSpacing: '0.04em'
              }}
            >
              SHOP NOW
            </button>
          </Link>
        </div>

        <div style={{ marginTop: '50px' }}>
        <h2 style={{ textAlign: 'center', color: '#2d3436', marginBottom: '30px' }}>
          Shop by Category
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}
        >
          {categories.map((category) => (
            <Link key={category.name} to={category.link} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  background: '#f9f4ee',
                  padding: '30px',
                  textAlign: 'center',
                  borderRadius: '10px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease',
                  borderBottom: '4px solid ' + category.color,
                  border: '1px solid rgba(142, 104, 71, 0.08)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '90px'
                  }}
                >
                  {category.icon.startsWith('/') ? (
                    <img
                      src={category.icon}
                      alt={category.name}
                      style={{
                        width: '100%',
                        maxWidth: '130px',
                        height: '100%',
                        maxHeight: '110px',
                        objectFit: 'contain',
                        borderRadius: '12px'
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: '3rem' }}>{category.icon}</div>
                  )}
                </div>
                <h3 style={{ color: '#2d3436', marginTop: '10px' }}>{category.name}</h3>
                <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>{category.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {featureCollections.map((collection) => (
        <Link key={collection.title} to={collection.link} style={{ textDecoration: 'none' }}>
          <div
            style={{
              marginTop: '30px',
              padding: '40px',
              background: 'linear-gradient(135deg, ' + creamDeep + ' 0%, ' + cream + ' 100%)',
              borderRadius: '15px',
              color: '#111111',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 25px rgba(58, 41, 29, 0.08)',
              border: '1px solid rgba(142, 104, 71, 0.08)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <img
              src="/images/logo.jpeg"
              alt="Mafleva logo"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.04,
                filter: 'grayscale(100%) brightness(1.2)',
                pointerEvents: 'none'
              }}
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <img
                src={collection.image}
                alt={collection.title}
                style={{
                  display: 'block',
                  width: '180px',
                  maxWidth: '55%',
                  height: 'auto',
                  margin: '0 auto 18px',
                  borderRadius: '16px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
                }}
              />
              <h2 style={{ fontSize: '2rem', margin: '0 0 12px' }}>{collection.title}</h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: '0 0 18px' }}>{collection.description}</p>
              <button
                style={{
                  marginTop: '10px',
                  padding: '12px 30px',
                  background: collection.highlight,
                  color: '#111111',
                  border: '1px solid rgba(17,17,17,0.08)',
                  borderRadius: '30px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {collection.button}
              </button>
            </div>
          </div>
        </Link>
      ))}

      <div style={{ marginTop: '44px' }}>
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <p style={{ color: '#8e6847', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, fontSize: '0.82rem', margin: '0 0 10px' }}>
            Property Gallery
          </p>
          <h2 style={{ color: '#2d3436', margin: 0 }}>All products</h2>
        </div>

        <div
          style={{
            overflow: 'hidden',
            borderRadius: '24px',
            background: '#fff',
            border: '1px solid rgba(142, 104, 71, 0.08)',
            boxShadow: '0 18px 45px rgba(58, 41, 29, 0.08)',
            padding: '18px 0'
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 'max-content',
              gap: '18px',
              animation: 'gallerySlide 32s linear infinite',
              willChange: 'transform'
            }}
          >
            {[...galleryItems, ...galleryItems].map((item, index) => (
              <div
                key={`${item.src}-${index}`}
                style={{
                  flex: '0 0 auto',
                  width: '260px',
                  background: '#fff',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 25px rgba(58, 41, 29, 0.08)',
                  border: '1px solid rgba(142, 104, 71, 0.08)'
                }}
              >
                <img
                  src={item.src}
                  alt={item.title || 'Mafleva product'}
                  style={{ display: 'block', width: '100%', height: '220px', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Testimonials />
      </div>
    </div>
    </>
  );
}

export default Home;
