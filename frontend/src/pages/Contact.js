import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [sendVia, setSendVia] = useState('email');
  const [submitted, setSubmitted] = useState(false);

  const quickActions = [
    {
      label: 'WhatsApp',
      icon: '💬',
      href: 'https://wa.me/254772688023?text=Hello%20Mafleva%20International%20Limited',
      color: '#25d366',
      textColor: '#fff'
    },
    {
      label: 'Message us',
      icon: '✉️',
      href: 'mailto:info@mafleva.com?subject=Customer%20Inquiry',
      color: '#8e6847',
      textColor: '#fff'
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: 'f', url: 'https://www.facebook.com/share/1JC9Kzb4eU/', color: '#1877f2' },
    { name: 'Instagram', icon: '◎', url: 'https://www.instagram.com/mafleva?psln=Y3p4a2d2OGlpcnIz', color: '#e4405f' },
    { name: 'TikTok', icon: '♪', url: 'https://www.tiktok.com/@maflevaint?_r=1&_t=ZS-9AUH9ffdiQI', color: '#000000' },
    { name: 'Threads', icon: '◌', url: 'https://www.threads.com/@mafleva', color: '#111111' },
    { name: 'X', icon: 'X', url: 'https://x.com/maflevaint', color: '#1d9bf0' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const subject = encodeURIComponent(`Customer inquiry from ${formData.name || 'website visitor'}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );

    if (sendVia === 'whatsapp') {
      const whatsappMessage = encodeURIComponent(
        `Hello Mafleva International, my name is ${formData.name}. Email: ${formData.email}. Message: ${formData.message}`
      );
      window.open(`https://wa.me/254772688023?text=${whatsappMessage}`, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = `mailto:info@mafleva.com?subject=${subject}&body=${body}`;
    }

    setSubmitted(true);
  };

  return (
    <div style={{
      maxWidth: '980px',
      margin: '0 auto',
      padding: '48px 20px 80px',
      color: '#2d3436',
      background: '#f7f1e7'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 18px 45px rgba(58, 41, 29, 0.08)',
        border: '1px solid rgba(142, 104, 71, 0.08)'
      }}>
        <div style={{ marginBottom: '28px' }}>
          <p style={{
            margin: '0 0 10px',
            color: '#8e6847',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontSize: '0.76rem'
          }}>
            Contact us
          </p>
          <h1 style={{ margin: 0, fontSize: '2.5rem', color: '#2d3436' }}>We’re here to help</h1>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px'
        }}>
          {quickActions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              target={action.href.startsWith('http') ? '_blank' : undefined}
              rel={action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                minWidth: '190px',
                padding: '14px 22px',
                background: action.color,
                color: action.textColor,
                borderRadius: '999px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: '0 10px 20px rgba(18, 18, 18, 0.08)'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{action.icon}</span>
              {action.label}
            </a>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '30px'
        }}>
          <div style={{ background: '#f9f4ee', borderRadius: '16px', padding: '18px', border: '1px solid rgba(142, 104, 71, 0.06)' }}>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8e6847', marginBottom: '8px' }}>Email</div>
            <a href="mailto:info@mafleva.com" style={{ color: '#2d3436', textDecoration: 'none', fontWeight: 600 }}>info@mafleva.com</a>
          </div>
          <div style={{ background: '#f9f4ee', borderRadius: '16px', padding: '18px', border: '1px solid rgba(142, 104, 71, 0.06)' }}>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8e6847', marginBottom: '8px' }}>Phone</div>
            <a href="tel:+254700123456" style={{ color: '#2d3436', textDecoration: 'none', fontWeight: 600 }}>+254 700 123 456</a>
          </div>
          <div style={{ background: '#f9f4ee', borderRadius: '16px', padding: '18px', border: '1px solid rgba(142, 104, 71, 0.06)' }}>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8e6847', marginBottom: '8px' }}>Location</div>
            <div style={{ color: '#2d3436', fontWeight: 600 }}>Nairobi, Kenya</div>
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ margin: '0 0 14px', color: '#2d3436' }}>Reach us on social media</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: '999px',
                  textDecoration: 'none',
                  color: '#fff',
                  background: social.color,
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}
              >
                <span>{social.icon}</span>
                {social.name}
              </a>
            ))}
          </div>
        </div>

        {submitted ? (
          <div style={{
            padding: '20px 22px',
            background: '#d4edda',
            borderRadius: '14px',
            color: '#155724',
            border: '1px solid rgba(21, 87, 36, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 8px' }}>✅ Message Sent!</h3>
            <p style={{ margin: 0 }}>We’ll get back to you within 24 hours. You can also message us directly on WhatsApp or social media.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ maxWidth: '680px' }}>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="contact-name" style={{ display: 'block', marginBottom: '8px', fontWeight: '700' }}>Your name</label>
              <input
                id="contact-name"
                type="text"
                required
                value={formData.name}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #d8d8d8', fontSize: '1rem' }}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="contact-email" style={{ display: 'block', marginBottom: '8px', fontWeight: '700' }}>Your email address</label>
              <input
                id="contact-email"
                type="email"
                required
                value={formData.email}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #d8d8d8', fontSize: '1rem' }}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700' }}>Send via</label>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="send-via"
                    value="email"
                    checked={sendVia === 'email'}
                    onChange={(e) => setSendVia(e.target.value)}
                    aria-label="Send via email"
                  />
                  Email
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="send-via"
                    value="whatsapp"
                    checked={sendVia === 'whatsapp'}
                    onChange={(e) => setSendVia(e.target.value)}
                    aria-label="Send via WhatsApp"
                  />
                  WhatsApp
                </label>
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="contact-message" style={{ display: 'block', marginBottom: '8px', fontWeight: '700' }}>Your message</label>
              <textarea
                id="contact-message"
                required
                rows="5"
                value={formData.message}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #d8d8d8', fontSize: '1rem', resize: 'vertical' }}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            <button type="submit" style={{
              padding: '14px 28px',
              background: '#8e6847',
              color: 'white',
              border: 'none',
              borderRadius: '999px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}>
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Contact;
