import React from 'react';

function About() {
  const sectionStyle = {
    background: '#f8f3ee',
    border: '1px solid rgba(142, 104, 71, 0.08)',
    borderRadius: '20px',
    padding: '32px 28px',
    boxShadow: '0 10px 30px rgba(58, 41, 29, 0.05)'
  };

  return (
    <div style={{ background: '#f7f1e7', minHeight: '100vh', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <p style={{ margin: 0, color: '#8e6847', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.8rem' }}>
          About us
        </p>
        <h1 style={{ color: '#2d3436', fontSize: 'clamp(2.2rem, 4vw, 4rem)', margin: '12px 0 0', fontWeight: 700 }}>
          About Mafleva International Limited
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div style={sectionStyle}>
          <h2 style={{ color: '#2d3436', marginTop: 0, fontSize: '2rem', marginBottom: '16px' }}>Our Mission</h2>
          <p style={{ fontSize: '1.08rem', lineHeight: '1.9', color: '#374151', margin: 0 }}>
            To provide customers with premium, thoughtfully selected beauty, fashion, wellness, and lifestyle products that elevate everyday living while delivering exceptional value, trust, and service.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={{ color: '#2d3436', marginTop: 0, fontSize: '2rem', marginBottom: '16px' }}>Our Vision</h2>
          <p style={{ fontSize: '1.08rem', lineHeight: '1.9', color: '#374151', margin: 0 }}>
            To become a leading international lifestyle brand recognized for quality, innovation, and customer satisfaction across beauty, fashion, health, and fragrance categories.
          </p>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <div style={{ ...sectionStyle, background: '#fffdfb' }}>
          <h2 style={{ color: '#2d3436', marginTop: 0, fontSize: '2rem', marginBottom: '16px' }}>Our Story</h2>
          <p style={{ fontSize: '1.08rem', lineHeight: '1.9', color: '#374151', margin: 0 }}>
            Mafleva International Limited was founded with a simple purpose: to bring premium beauty, fashion, wellness, and fragrance products to customers around the world. We are committed to curating collections that combine quality, elegance, and reliability, helping people look and feel their best every day.
          </p>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <div style={sectionStyle}>
          <h2 style={{ color: '#2d3436', marginTop: 0, fontSize: '2rem', marginBottom: '16px' }}>Our Values</h2>
          <ul style={{ fontSize: '1.08rem', lineHeight: '2', color: '#374151', paddingLeft: '20px', margin: 0 }}>
            <li><strong>Quality:</strong> We source products that meet high standards of excellence.</li>
            <li><strong>Sustainability:</strong> We support responsible practices and mindful consumption.</li>
            <li><strong>Customer First:</strong> We prioritize trust, satisfaction, and long-term relationships.</li>
            <li><strong>Integrity:</strong> We are committed to honest service and dependable business standards.</li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: '36px', textAlign: 'center' }}>
        <img
          src="/images/logo.jpeg"
          alt="Mafleva logo"
          style={{
            display: 'block',
            width: '100%',
            maxWidth: '420px',
            height: 'auto',
            margin: '0 auto',
            filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.08))'
          }}
        />
      </div>
      </div>
    </div>
  );
}
export default About;
