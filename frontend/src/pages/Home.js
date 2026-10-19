import React from 'react';
import { Link } from 'react-router-dom';
import Testimonials from '../components/common/Testimonials';

const cream = '#f7f1e7';
const creamDeep = '#efe3d2';
const creamCard = '#f9f4ee';
const categories = [
  { name: 'Beauty', icon: '/images%201/ba741899489fc321a99b0860f1d38847.jpg', link: '/shop', color: '#fd79a8', desc: 'Skincare & Makeup' },
  { name: 'Clothing', icon: '/images%201/clothing.jpg', link: '/shop', color: '#0984e3', desc: 'Men, Women & Kids' },
  { name: 'Perfumes', icon: '/images%201/download.png', link: '/shop', color: '#6c5ce7', desc: 'Branded & Niche' },
  { name: 'Health Products', icon: '🌿', link: '/shop', color: '#2ecc71', desc: 'Wellness & Care' }
];

const categoryMotion = [
  { rotate: '-2deg', translateY: '10px' },
  { rotate: '1.5deg', translateY: '0px' },
  { rotate: '-1deg', translateY: '16px' },
  { rotate: '2deg', translateY: '6px' }
];

const featureCollections = [
  {
    title: 'Explore Our beauty products',
    description: 'Discover premium skincare, makeup, and haircare products',
    image: '/images%201/ba741899489fc321a99b0860f1d38847.jpg',
    link: '/beauty',
    highlight: '#8d6d4e'
  },
  {
    title: 'Explore Our clothing products',
    description: 'Discover the latest trends for men, women, and kids',
    image: '/images%201/clothing.jpg',
    link: '/clothing',
    highlight: '#f1e6d3'
  },
  {
    title: 'Explore Our perfume products',
    description: 'Discover elegant scents for men, women, and unisex styles',
    image: '/images%201/download.png',
    link: '/perfumes',
    highlight: '#f1e6d3'
  },
  {
    title: 'Explore Our health products',
    description: 'Support your wellness with trusted essentials and daily care',
    image: '/images/logo.jpeg',
    link: '/health',
    highlight: '#dfeecf'
  }
];

const galleryItems = [
  { type: 'image', src: '/accesories/download.png' },
  { type: 'image', src: '/perfumes/0a39becdd6041d93bb9b9b5645501342.jpg' },
  { type: 'image', src: '/wear/23626f85d3836f72d6a10dc547adb601.jpg' },
  { type: 'image', src: '/images/logo.jpeg' },
  { type: 'image', src: '/accesories/6db323804a9f4645979497746c845ef4.jpg' },
  { type: 'image', src: '/images/oils.jpeg' },
  { type: 'image', src: '/perfumes/1f943a1d5fc12debdd2dfc91cf717cf9.jpg' },
  { type: 'image', src: '/wear/45591080c617ba19d510476947307a2e.jpg' },
  { type: 'image', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.30.jpeg' },
  { type: 'image', src: '/accesories/8a92eec6a8186163482425f70ed9d613.jpg' },
  { type: 'image', src: '/perfumes/6262dda8914ce0fe8f83107ac06b1be2.jpg' },
  { type: 'image', src: '/wear/62a50cc5b187807962bc6d67691c97d8.jpg' },
  { type: 'image', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.31%20(1).jpeg' },
  { type: 'image', src: '/accesories/ca720f38098d7d171e41e23814096d6a.jpg' },
  { type: 'image', src: '/perfumes/aebf343bbc78ebd41c49ab993a51ceb3.jpg' },
  { type: 'image', src: '/wear/732d3d01a39c6e2cc6278e7b7ca7fd20.jpg' },
  { type: 'image', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.31%20(2).jpeg' },
  { type: 'image', src: '/accesories/feb8532a0255bb57747e9f2711315f89.jpg' },
  { type: 'image', src: '/perfumes/aebf343bbc78ebd41c49ab993a51ceb3.jpg' },
  { type: 'image', src: '/wear/97d67efc93c9e1ea705a9845ece40b13.jpg' },
  { type: 'image', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.31.jpeg' },
  { type: 'image', src: '/wear/9a9c7e6e063fe62302f281fbacbccb09.jpg' },
  { type: 'image', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.33%20(1).jpeg' },
  { type: 'image', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.33.jpeg' },
  { type: 'image', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.34%20(1).jpeg' },
  { type: 'image', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.34%20(2).jpeg' },
  { type: 'image', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.34.jpeg' },
  { type: 'image', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.35%20(1).jpeg' },
  { type: 'image', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.36.jpeg' },
  { type: 'image', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.38%20(1).jpeg' }
].filter((item) => Boolean(item.src));

const clothingLoopImages = [
  '/wear/732d3d01a39c6e2cc6278e7b7ca7fd20.jpg',
  '/wear/23626f85d3836f72d6a10dc547adb601.jpg',
  '/wear/9a9c7e6e063fe62302f281fbacbccb09.jpg',
  '/wear/62a50cc5b187807962bc6d67691c97d8.jpg',
  '/wear/97d67efc93c9e1ea705a9845ece40b13.jpg',
  '/wear/45591080c617ba19d510476947307a2e.jpg'
];

const perfumeLoopImages = [
  '/perfumes/aebf343bbc78ebd41c49ab993a51ceb3.jpg',
  '/perfumes/0a39becdd6041d93bb9b9b5645501342.jpg',
  '/perfumes/6262dda8914ce0fe8f83107ac06b1be2.jpg',
  '/perfumes/aebf343bbc78ebd41c49ab993a51ceb3.jpg',
  '/perfumes/1f943a1d5fc12debdd2dfc91cf717cf9.jpg'
];

const beautyLoopImages = [
  '/images/oils.jpeg',
  '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.30.jpeg',
  '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.31.jpeg',
  '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.33.jpeg',
  '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.34.jpeg',
  '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.36.jpeg'
];

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
                    background: creamCard
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

        <div id="main-shopping-options" style={{ marginTop: '50px' }}>
        <h2 style={{ textAlign: 'center', color: '#2d3436', marginBottom: '30px' }}>
          Shop by Category
        </h2>
        <div
          style={{
            overflow: 'hidden',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(249, 244, 238, 0.95) 0%, rgba(247, 241, 231, 0.92) 100%)',
            boxShadow: '0 10px 30px rgba(58, 41, 29, 0.08)',
            border: '1px solid rgba(142, 104, 71, 0.08)'
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '20px',
              width: 'max-content',
              animation: 'gallerySlide 24s linear infinite',
              willChange: 'transform',
              padding: '24px 16px 30px'
            }}
          >
            {[...categories, ...categories].map((category, index) => {
              const motion = categoryMotion[index % categoryMotion.length];

              return (
                <Link
                  key={`${category.name}-${index}`}
                  to={category.link}
                  style={{
                    textDecoration: 'none',
                    flex: '0 0 230px',
                    transform: `translateY(${motion.translateY}) rotate(${motion.rotate})`
                  }}
                >
                  <div
                    style={{
                      background: creamCard,
                      padding: '30px',
                      textAlign: 'center',
                      borderRadius: '18px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      borderBottom: '4px solid ' + category.color,
                      border: '1px solid rgba(142, 104, 71, 0.08)',
                      minHeight: '250px'
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
              );
            })}
          </div>
        </div>
      </div>

      {featureCollections.map((collection) => (
          <div
            key={collection.title}
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
              {collection.link === '/beauty' ? (
                <div
                  style={{
                    overflow: 'hidden',
                    borderRadius: '16px',
                    border: '1px solid rgba(142, 104, 71, 0.14)',
                    background: 'rgba(255, 255, 255, 0.55)',
                    padding: '10px',
                    margin: '0 auto 18px',
                    maxWidth: '1000px'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      width: 'max-content',
                      animation: 'gallerySlide 25s linear infinite',
                      willChange: 'transform'
                    }}
                  >
                    {[...beautyLoopImages, ...beautyLoopImages].map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        style={{
                          flex: '0 0 auto',
                          width: '130px',
                          height: index % 2 === 0 ? '165px' : '150px',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: '1px solid rgba(142, 104, 71, 0.16)',
                          boxShadow: '0 8px 18px rgba(58, 41, 29, 0.14)'
                        }}
                      >
                        <img
                          src={image}
                          alt="Beauty style"
                          style={{
                            display: 'block',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : collection.link === '/clothing' ? (
                <div
                  style={{
                    overflow: 'hidden',
                    borderRadius: '16px',
                    border: '1px solid rgba(142, 104, 71, 0.14)',
                    background: 'rgba(255, 255, 255, 0.55)',
                    padding: '10px',
                    margin: '0 auto 18px',
                    maxWidth: '1000px'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      width: 'max-content',
                      animation: 'gallerySlide 26s linear infinite',
                      willChange: 'transform'
                    }}
                  >
                    {[...clothingLoopImages, ...clothingLoopImages].map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        style={{
                          flex: '0 0 auto',
                          width: '130px',
                          height: index % 2 === 0 ? '165px' : '150px',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: '1px solid rgba(142, 104, 71, 0.16)',
                          boxShadow: '0 8px 18px rgba(58, 41, 29, 0.14)'
                        }}
                      >
                        <img
                          src={image}
                          alt="Clothing style"
                          style={{
                            display: 'block',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : collection.link === '/perfumes' ? (
                <div
                  style={{
                    overflow: 'hidden',
                    borderRadius: '16px',
                    border: '1px solid rgba(142, 104, 71, 0.14)',
                    background: 'rgba(255, 255, 255, 0.55)',
                    padding: '10px',
                    margin: '0 auto 18px',
                    maxWidth: '1000px'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      width: 'max-content',
                      animation: 'gallerySlide 24s linear infinite',
                      willChange: 'transform'
                    }}
                  >
                    {[...perfumeLoopImages, ...perfumeLoopImages].map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        style={{
                          flex: '0 0 auto',
                          width: '130px',
                          height: index % 2 === 0 ? '165px' : '150px',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: '1px solid rgba(142, 104, 71, 0.16)',
                          boxShadow: '0 8px 18px rgba(58, 41, 29, 0.14)'
                        }}
                      >
                        <img
                          src={image}
                          alt="Perfume style"
                          style={{
                            display: 'block',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
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
              )}
              <h2 style={{ fontSize: '2rem', margin: '0 0 12px' }}>{collection.title}</h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: 0 }}>{collection.description}</p>
            </div>
          </div>
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
