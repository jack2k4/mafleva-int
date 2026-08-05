import React from 'react';

const SocialMedia = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      icon: '📘',
      url: 'https://facebook.com/maflevainternational',
      color: '#1877f2'
    },
    {
      name: 'Instagram',
      icon: '📸',
      url: 'https://instagram.com/maflevainternational',
      color: '#e4405f'
    },
    {
      name: 'TikTok',
      icon: '🎵',
      url: 'https://tiktok.com/@maflevainternational',
      color: '#000000'
    },
    {
      name: 'Twitter',
      icon: '🐦',
      url: 'https://twitter.com/mafleva',
      color: '#1da1f2'
    },
    {
      name: 'YouTube',
      icon: '▶️',
      url: 'https://youtube.com/@maflevainternational',
      color: '#ff0000'
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      url: 'https://wa.me/254700123456',
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
