import React, { useEffect, useMemo, useState } from 'react';

const allProducts = [
  { title: 'Accessories Highlight', category: 'Accessories', src: '/accesories/download.png', accent: '#f5e3c5', type: 'image' },
  { title: 'Perfume Focus', category: 'Perfumes', src: '/perfumes/0a39becdd6041d93bb9b9b5645501342.jpg', accent: '#dfeaff', type: 'image' },
  { title: 'Wear Signature', category: 'Wear', src: '/wear/23626f85d3836f72d6a10dc547adb601.jpg', accent: '#f8d6dd', type: 'image' },
  { title: 'Brand Mark', category: 'Beauty', src: '/images/logo.jpeg', accent: '#fbe4d1', type: 'image' },
  { title: 'Accessories Premium', category: 'Accessories', src: '/accesories/6db323804a9f4645979497746c845ef4.jpg', accent: '#d9f3d9', type: 'image' },
  { title: 'Natural Oils', category: 'Beauty', src: '/images/oils.jpeg', accent: '#e3f5d9', type: 'image' },
  { title: 'Fragrance Noir', category: 'Perfumes', src: '/perfumes/1f943a1d5fc12debdd2dfc91cf717cf9.jpg', accent: '#d8d4ff', type: 'image' },
  { title: 'Wear Classics', category: 'Wear', src: '/wear/45591080c617ba19d510476947307a2e.jpg', accent: '#cfe8ff', type: 'image' },
  { title: 'Beauty Glow', category: 'Beauty', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.30.jpeg', accent: '#f8d6dd', type: 'image' },
  { title: 'Accessories Detail', category: 'Accessories', src: '/accesories/8a92eec6a8186163482425f70ed9d613.jpg', accent: '#f5e3c5', type: 'image' },
  { title: 'Fragrance Bronze', category: 'Perfumes', src: '/perfumes/6262dda8914ce0fe8f83107ac06b1be2.jpg', accent: '#fbe4d1', type: 'image' },
  { title: 'Wear Motion', category: 'Wear', src: '/wear/62a50cc5b187807962bc6d67691c97d8.jpg', accent: '#dfeaff', type: 'image' },
  { title: 'Beauty Finish', category: 'Beauty', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.31%20%281%29.jpeg', accent: '#d8d4ff', type: 'image' },
  { title: 'Accessories Luxe', category: 'Accessories', src: '/accesories/ca720f38098d7d171e41e23814096d6a.jpg', accent: '#f8d6dd', type: 'image' },
  { title: 'Fragrance Elixir', category: 'Perfumes', src: '/perfumes/8fd0f7aa4fef27c2fa0deb1104a42a42.jpg', accent: '#cfe8ff', type: 'image' },
  { title: 'Wear Atelier', category: 'Wear', src: '/wear/732d3d01a39c6e2cc6278e7b7ca7fd20.jpg', accent: '#d9f3d9', type: 'image' },
  { title: 'Beauty Essentials', category: 'Beauty', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.31%20%282%29.jpeg', accent: '#fbe4d1', type: 'image' },
  { title: 'Accessories Core', category: 'Accessories', src: '/accesories/feb8532a0255bb57747e9f2711315f89.jpg', accent: '#e3f5d9', type: 'image' },
  { title: 'Fragrance Gold', category: 'Perfumes', src: '/perfumes/aebf343bbc78ebd41c49ab993a51ceb3.jpg', accent: '#f5e3c5', type: 'image' },
  { title: 'Wear Studio', category: 'Wear', src: '/wear/97d67efc93c9e1ea705a9845ece40b13.jpg', accent: '#d8d4ff', type: 'image' },
  { title: 'Beauty Care', category: 'Beauty', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.31.jpeg', accent: '#dfeaff', type: 'image' },
  { title: 'Wear Refined', category: 'Wear', src: '/wear/9a9c7e6e063fe62302f281fbacbccb09.jpg', accent: '#f8d6dd', type: 'image' },
  { title: 'Beauty Texture', category: 'Beauty', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.33%20%281%29.jpeg', accent: '#cfe8ff', type: 'image' },
  { title: 'Beauty Soft Care', category: 'Beauty', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.33.jpeg', accent: '#d9f3d9', type: 'image' },
  { title: 'Beauty Herbal', category: 'Beauty', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.34%20%281%29.jpeg', accent: '#e3f5d9', type: 'image' },
  { title: 'Beauty Ritual', category: 'Beauty', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.34%20%282%29.jpeg', accent: '#fbe4d1', type: 'image' },
  { title: 'Beauty Botanics', category: 'Beauty', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.34.jpeg', accent: '#d8d4ff', type: 'image' },
  { title: 'Beauty Haircare', category: 'Beauty', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.35%20%281%29.jpeg', accent: '#f5e3c5', type: 'image' },
  { title: 'Beauty Daily Care', category: 'Beauty', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.36.jpeg', accent: '#f8d6dd', type: 'image' },
  { title: 'Beauty Signature', category: 'Beauty', src: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.38%20%281%29.jpeg', accent: '#cfe8ff', type: 'image' }
];

const videoItems = [
  { title: 'Signature Oils', category: 'Wellness', src: '/videos/king%20of%20oils.mp4', type: 'video' },
  { title: 'Premium Fashion', category: 'Clothing', src: '/videos/king%20of%20oils.mp4', type: 'video' }
];

function Gallery() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [customGalleryItems, setCustomGalleryItems] = useState([]);

  useEffect(() => {
    const loadCustomGalleryItems = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('mafleva_gallery_items') || '[]');
        setCustomGalleryItems(Array.isArray(stored) ? stored : []);
      } catch (error) {
        setCustomGalleryItems([]);
      }
    };

    loadCustomGalleryItems();
    window.addEventListener('mafleva-gallery-updated', loadCustomGalleryItems);
    return () => window.removeEventListener('mafleva-gallery-updated', loadCustomGalleryItems);
  }, []);

  const marqueeItems = useMemo(() => {
    const sourceItems = customGalleryItems.length > 0 ? customGalleryItems : allProducts;
    const shuffled = [...sourceItems].sort(() => Math.random() - 0.5);
    return [...shuffled, ...shuffled];
  }, [customGalleryItems]);

  const galleryVideos = useMemo(() => {
    if (customGalleryItems.length === 0) return videoItems;
    const items = customGalleryItems.filter((item) => item.type === 'video');
    return items.length > 0 ? items : videoItems;
  }, [customGalleryItems]);

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
        {galleryVideos.map((item) => (
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
