import React, { useState, useEffect } from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const Testimonials = ({ 
  title = "What Our Customers Say",
  subtitle = "Real reviews from real customers",
  items = [],
  autoPlay = true,
  autoPlayInterval = 5000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Default testimonials if none provided
  const defaultTestimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Beauty Enthusiast",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=ff6b6b&color=fff&size=60",
      rating: 5,
      comment: "Absolutely love the products from Mafleva! The quality is exceptional and the customer service is outstanding. I've been shopping here for months and I'm never disappointed.",
      date: "2024-01-15"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Fashion Blogger",
      avatar: "https://ui-avatars.com/api/?name=Michael+Chen&background=2d3436&color=fff&size=60",
      rating: 5,
      comment: "The clothing collection is amazing! Great quality fabrics and the designs are very trendy. I've recommended Mafleva to all my followers on Instagram.",
      date: "2024-01-10"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Perfume Collector",
      avatar: "https://ui-avatars.com/api/?name=Emily+Rodriguez&background=fd79a8&color=fff&size=60",
      rating: 4,
      comment: "The perfume selection is incredible. I found my signature scent here and the prices are very reasonable. Shipping is always fast and packaging is beautiful.",
      date: "2024-01-05"
    },
    {
      id: 4,
      name: "David Kim",
      role: "Skincare Specialist",
      avatar: "https://ui-avatars.com/api/?name=David+Kim&background=00b894&color=fff&size=60",
      rating: 5,
      comment: "As a skincare professional, I'm very particular about products. Mafleva's skincare line is top-notch with natural ingredients that actually work.",
      date: "2023-12-28"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Fashion Designer",
      avatar: "https://ui-avatars.com/api/?name=Lisa+Thompson&background=fdcb6e&color=fff&size=60",
      rating: 5,
      comment: "I've been buying clothes from Mafleva for my fashion brand. Their quality and attention to detail is impressive. Highly recommended!",
      date: "2023-12-20"
    },
    {
      id: 6,
      name: "James Ochieng",
      role: "Business Executive",
      avatar: "https://ui-avatars.com/api/?name=James+Ochieng&background=0984e3&color=fff&size=60",
      rating: 4,
      comment: "Great service and high-quality products. I especially love their formal wear collection. Perfect for business meetings and events.",
      date: "2023-12-15"
    }
  ];

  const testimonials = items.length > 0 ? items : defaultTestimonials;

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isPaused, testimonials.length]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        style={{
          color: index < rating ? '#fdcb6e' : '#dfe6e9',
          fontSize: '18px'
        }}
      />
    ));
  };

  // For the editorial-style testimonial layout matching the reference
  const renderCarousel = () => {
    const active = testimonials[currentIndex];

    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f6ede1',
            borderRadius: '24px',
            padding: '36px 28px',
            boxShadow: '0 12px 30px rgba(58, 41, 29, 0.08)',
            border: '1px solid rgba(142, 104, 71, 0.08)',
            minHeight: '420px'
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ marginBottom: '18px' }}>{renderStars(active.rating)}</div>

            <h2
              style={{
                margin: '0 0 10px 0',
                fontSize: 'clamp(2.6rem, 4vw, 4.6rem)',
                lineHeight: '1.05',
                color: '#2d3436',
                letterSpacing: '-0.04em',
                fontWeight: 300,
                fontFamily: 'Georgia, "Times New Roman", serif'
              }}
            >
              {title}
            </h2>

            <p
              style={{
                margin: '0 0 16px 0',
                fontSize: '1.25rem',
                lineHeight: '1.5',
                color: '#4b4b4b',
                fontWeight: 400,
                fontStyle: 'italic'
              }}
            >
              {subtitle}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <FaQuoteLeft style={{ color: '#c8b5a0', fontSize: '28px' }} />
              <p
                style={{
                  margin: 0,
                  fontSize: '1.16rem',
                  lineHeight: '1.7',
                  color: '#374151',
                  fontWeight: 400
                }}
              >
                "{active.comment}"
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '22px' }}>
              <img
                src={active.avatar}
                alt={active.name}
                style={{
                  width: '58px',
                  height: '58px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid rgba(142, 104, 71, 0.12)'
                }}
              />
              <div>
                <h4 style={{ margin: '0 0 2px 0', fontSize: '1.1rem', color: '#2d3436' }}>{active.name}</h4>
                <p style={{ margin: 0, color: '#6c757d', fontSize: '0.92rem' }}>{active.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ marginTop: '30px', padding: '40px 20px 60px', background: '#f6ede1', borderRadius: '28px' }}>
      {/* Editorial Layout */}
      {renderCarousel()}

      {/* Grid View - Uncomment to show all testimonials */}
      {/*
      <div style={{ marginTop: '40px' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>All Testimonials</h3>
        {renderGrid()}
      </div>
      */}
    </div>
  );
};

export default Testimonials;
