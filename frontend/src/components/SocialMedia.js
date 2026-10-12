import React from 'react';

const SocialMedia = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      icon: '📘',
      url: 'https://www.facebook.com/share/1JC9Kzb4eU/',
      color: '#1877f2'
    },
    {
      name: 'Instagram',
      icon: '📸',
      url: 'https://www.instagram.com/mafleva?psln=Y3p4a2d2OGlpcnIz',
      color: '#e4405f'
    },
    {
      name: 'TikTok',
      icon: '🎵',
      url: 'https://www.tiktok.com/@maflevaint?_r=1&_t=ZS-9AUH9ffdiQI',
      color: '#000000'
    },
    {
      name: 'Threads',
      icon: '◌',
      url: 'https://www.threads.com/@mafleva',
      color: '#111111'
    },
    {
      name: 'X',
      icon: 'X',
      url: 'https://x.com/maflevaint',
      color: '#1d9bf0'
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      url: 'https://wa.me/254772688023?text=Hello%20Mafleva%20International%20Limited',
      color: '#25d366'
    }
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '15px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    }}>
      {socialLinks.map(social => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: social.color,
            color: 'white',
            borderRadius: '25px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>{social.icon}</span>
          {social.name}
        </a>
      ))}
    </div>
  );
};

export default SocialMedia;
