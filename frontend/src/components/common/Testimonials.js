import React, { useState, useEffect } from 'react';
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

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

  // For displaying all testimonials in grid view
  const renderGrid = () => {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '25px'
      }}>
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            style={{
              background: 'white',
              padding: '25px',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease'
            }}
            className="testimonial-card"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{ marginBottom: '15px' }}>
              {renderStars(testimonial.rating)}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <FaQuoteLeft style={{ color: '#ff6b6b', opacity: 0.3, fontSize: '24px' }} />
              <p style={{
                fontSize: '1rem',
                lineHeight: '1.6',
                color: '#2d3436',
                margin: '0'
              }}>
                "{testimonial.comment}"
              </p>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              borderTop: '1px solid #f0f0f0',
              paddingTop: '15px'
            }}>
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <div>
                <h4 style={{ margin: '0 0 3px 0', fontSize: '1rem' }}>
                  {testimonial.name}
                </h4>
                <p style={{
                  margin: 0,
                  color: '#6c757d',
                  fontSize: '0.85rem'
                }}>
                  {testimonial.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // For carousel/slider view
  const renderCarousel = () => {
    return (
      <div style={{ position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px'
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
            maxWidth: '700px',
            margin: '0 auto',
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ marginBottom: '15px' }}>
              {renderStars(testimonials[currentIndex].rating)}
            </div>
            <FaQuoteLeft style={{ color: '#ff6b6b', opacity: 0.2, fontSize: '36px' }} />
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.8',
              color: '#2d3436',
              margin: '10px 0',
              fontStyle: 'italic'
            }}>
              "{testimonials[currentIndex].comment}"
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px',
              marginTop: '15px'
            }}>
              <img
                src={testimonials[currentIndex].avatar}
                alt={testimonials[currentIndex].name}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ margin: '0 0 3px 0', fontSize: '1.1rem' }}>
                  {testimonials[currentIndex].name}
                </h4>
                <p style={{
                  margin: 0,
                  color: '#6c757d',
                  fontSize: '0.9rem'
                }}>
                  {testimonials[currentIndex].role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            transition: 'all 0.3s ease'
          }}
          className="nav-btn"
          onMouseEnter={(e) => e.currentTarget.style.background = '#ff6b6b'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={nextSlide}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            transition: 'all 0.3s ease'
          }}
          className="nav-btn"
          onMouseEnter={(e) => e.currentTarget.style.background = '#ff6b6b'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
        >
          <FaChevronRight />
        </button>

        {/* Dots indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '20px'
        }}>
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                border: 'none',
                background: index === currentIndex ? '#ff6b6b' : '#dfe6e9',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{
          fontSize: '2.5rem',
          color: '#2d3436',
          marginBottom: '10px'
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: '1.1rem',
          color: '#6c757d',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          {subtitle}
        </p>
      </div>

      {/* Carousel View */}
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
