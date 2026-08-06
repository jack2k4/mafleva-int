import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    console.log('Form submitted:', formData);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#2d3436' }}>Contact Us</h1>
      <div style={{ marginTop: '30px' }}>
        <p>Email: info@mafleva.com</p>
        <p>Phone: +254 700 123 456</p>
        <p>Location: Nairobi, Kenya</p>
      </div>
      {submitted ? (
        <div style={{ padding: '20px', background: '#d4edda', borderRadius: '8px', color: '#155724' }}>
          <h3>✅ Message Sent!</h3>
          <p>We'll get back to you within 24 hours.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name</label>
            <input
              type="text"
              required
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
            <input
              type="email"
              required
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Message</label>
            <textarea
              required
              rows="4"
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
          </div>
          <button type="submit" style={{
            padding: '12px 30px',
            background: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>Send Message</button>
        </form>
      )}
    </div>
  );
}

export default Contact;
