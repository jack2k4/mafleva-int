import React from 'react';

function About() {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#2d3436' }}>About Mafleva International Limited</h1>
      <div style={{ marginTop: '30px' }}>
        <h2>Our Story</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
          Mafleva International Limited was founded with a simple mission: to bring premium beauty, 
          fashion, and fragrance products to customers around the world.
        </p>
        
        <h2 style={{ marginTop: '30px' }}>Our Values</h2>
        <ul style={{ fontSize: '1.1rem', lineHeight: '2' }}>
          <li>✨ Quality - We source only the best products</li>
          <li>🌱 Sustainability - Eco-friendly packaging and practices</li>
          <li>❤️ Customer First - Your satisfaction is our priority</li>
          <li>🌟 Authenticity - Every product is verified</li>
        </ul>
      </div>
    </div>
  );
}

export default About;
