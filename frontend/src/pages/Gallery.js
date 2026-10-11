import React, { useMemo, useState } from 'react';

const allProducts = [
  { title: 'Glow Serum', category: 'Beauty', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.30.jpeg', accent: '#f8d6dd', type: 'image' },
  { title: 'Luxury Finish', category: 'Beauty', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.31.jpeg', accent: '#d8d4ff', type: 'image' },
  { title: 'Soft Care', category: 'Beauty', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.33.jpeg', accent: '#d9f3d9', type: 'image' },
  { title: 'Silk Collection', category: 'Clothing', src: '/images%201/clothing.jpg', accent: '#cfe8ff', type: 'image' },
  { title: 'Luxury Fragrance', category: 'Perfumes', src: '/images%201/download.png', accent: '#f5e3c5', type: 'image' },
  { title: 'Signature Oils', category: 'Wellness', src: '/videos/king%20of%20oils.mp4', accent: '#e3f5d9', type: 'video' },
  { title: 'Beauty Essentials', category: 'Beauty', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.30.jpeg', accent: '#fbe4d1', type: 'image' },
  { title: 'Premium Fashion', category: 'Clothing', src: '/videos/king%20of%20oils.mp4', accent: '#dfeaff', type: 'video' }
];

function Gallery() {
  const [selectedItem, setSelectedItem] = useState(null);

  const marqueeItems = useMemo(() => {
    const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
    return [...shuffled, ...shuffled];
  }, []);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px 60px' }}>
      <div style={{ textAlign: 'center', marginBottom: '18px' }}>
        <p style={{
          margin: '0 0 10px',
          color: '#8e6847',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          fontWeight: 700,
          fontSize: '0.82rem'
        }}>Beauty Gallery</p>
        <h1 style={{ margin: 0, color: '#2d3436', fontSize: '2.6rem' }}>Mafleva Product Gallery</h1>
      </div>

      <div style={{
        overflow: 'hidden',
        borderRadius: '26px',
        border: '1px solid rgba(142, 104, 71, 0.12)',
        background: '#f9f5f0',
        boxShadow: '0 18px 45px rgba(58, 41, 29, 0.08)',
        padding: '18px 0',
        marginBottom: '36px'
      }}>
        <div style={{
          display: 'flex',
          width: 'max-content',
          gap: '18px',
          animation: 'gallery-marquee 32s linear infinite',
          willChange: 'transform'
        }}>
          {marqueeItems.map((item, index) => (
            <button
              key={`${item.title}-${index}`}
              type="button"
              onClick={() => setSelectedItem(item)}
              style={{
                flex: '0 0 auto',
                width: '260px',
                border: 'none',
                background: 'transparent',
                padding: 0,
                textAlign: 'left',
                cursor: 'pointer',
                borderRadius: '18px',
                overflow: 'hidden',
                boxShadow: '0 12px 30px rgba(58, 41, 29, 0.08)'
              }}
            >
              <div style={{ background: '#fff', border: '1px solid rgba(142, 104, 71, 0.08)' }}>
                <img
                  src={item.src}
                  alt={item.title}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '220px',
                    objectFit: 'cover',
                    background: item.accent
                  }}
                />
                <div style={{ padding: '14px 16px 16px' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '5px 9px',
                    borderRadius: '999px',
                    background: item.accent,
                    color: '#111111',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    marginBottom: '10px'
                  }}>
                    {item.category}
                  </div>
                  <h3 style={{ margin: '0', color: '#2d3436', fontSize: '1.08rem' }}>{item.title}</h3>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes gallery-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: '26px' }}>
        <h2 style={{ margin: '0 0 12px', color: '#2d3436' }}>Discover all our collections</h2>
        <p style={{ margin: 0, color: '#6c757d', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
          Watch our brand campaigns and promotional videos from beauty, fashion, fragrance, and wellness collections.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        {allProducts.filter((item) => item.type === 'video').map((item) => (
          <button
            key={`${item.title}-${item.category}`}
            type="button"
            onClick={() => setSelectedItem(item)}
            style={{
              border: 'none',
              background: 'transparent',
              textAlign: 'left',
              padding: 0,
              cursor: 'pointer',
              borderRadius: '18px',
              overflow: 'hidden',
              boxShadow: '0 12px 28px rgba(58, 41, 29, 0.08)'
            }}
          >
            <div style={{ background: '#fff', border: '1px solid rgba(142, 104, 71, 0.08)' }}>
              <video
                src={item.src}
                muted
                loop
                autoPlay
                playsInline
                style={{ display: 'block', width: '100%', height: '220px', objectFit: 'cover', background: '#000' }}
              />
              <div style={{ padding: '14px 15px 16px' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', color: '#8e6847', marginBottom: '8px' }}>{item.category}</div>
                <h3 style={{ margin: '0', color: '#2d3436', fontSize: '1.04rem' }}>{item.title}</h3>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedItem(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(17,17,17,0.76)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 2000
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              position: 'relative',
              width: 'min(92vw, 980px)',
              background: '#fff',
              borderRadius: '22px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.36)'
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              aria-label="Close gallery preview"
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                zIndex: 1,
                border: 'none',
                background: 'rgba(17,17,17,0.75)',
                color: 'white',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
            {selectedItem.type === 'video' ? (
              <video
                src={selectedItem.src}
                controls
                autoPlay
                style={{ display: 'block', width: '100%', maxHeight: '72vh', objectFit: 'cover', background: '#000' }}
              />
            ) : (
              <img src={selectedItem.src} alt={selectedItem.title} style={{ display: 'block', width: '100%', maxHeight: '72vh', objectFit: 'cover' }} />
            )}
            <div style={{ padding: '18px 22px 22px' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8e6847', fontWeight: '700', marginBottom: '8px' }}>{selectedItem.category}</div>
              <h2 style={{ margin: '0', color: '#2d3436' }}>{selectedItem.title}</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
