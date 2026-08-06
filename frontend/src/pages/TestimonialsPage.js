import React from 'react';
import Testimonials from '../components/common/Testimonials';

function TestimonialsPage() {
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', color: '#2d3436' }}>
        Customer Testimonials
      </h1>
      <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#6c757d', marginBottom: '40px' }}>
        What our customers say about us
      </p>
      <Testimonials />
    </div>
  );
}

export default TestimonialsPage;
