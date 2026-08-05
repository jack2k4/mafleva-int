import React, { useState } from 'react';
import SocialMedia from '../components/SocialMedia';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
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
      <h1 style={{ color: '#2d3436' }}>Contact Mafleva International Limited</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '30px' }}>
        <div>
          <h3>Get in Touch</h3>
          <p style={{ lineHeight: '2' }}>
            Email: info@mafleva.com<br />
            Phone: +254 700 123 456<br />
            Location: Nairobi, Kenya
          </p>
          <div style={{ marginTop: '20px' }}>
            <h4>Business Hours</h4>
            <p style={{ lineHeight: '1.8' }}>
              Monday - Friday: 8:00 AM - 6:00 PM<br />
              Saturday: 9:00 AM - 4:00 PM<br />
              Sunday: Closed
            </p>
          </div>
          <div style={{ marginTop: '20px' }}>
            <h4>Connect With Us</h4>
            <SocialMedia />
          </div>
        </div>

        <div>
          {submitted ? (
            <div style={{
              padding: '20px',
              background: '#d4edda',
              borderRadius: '8px',
              color: '#155724'
            }}>
              <h3>Message Sent!</h3>
              <p>Thank you for contacting Mafleva International Limited. We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Name
                </label>
                <input
                  type="text"
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Subject
                </label>
                <input
                  type="text"
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Message
                </label>
                <textarea
                  required
                  rows="4"
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: '12px 30px',
                  background: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Contact;
