import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaFilter } from 'react-icons/fa';

function Beauty() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    fetchBeauty();
  }, [activeCategory]);

  const fetchBeauty = () => {
    setLoading(true);
    let url = 'http://localhost:5000/api/products?category=beauty';
    
    if (activeCategory !== 'all') {
      url = url + '&subCategory=' + activeCategory;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        let productsData = data.products || [];
        
        if (priceRange.min) {
          productsData = productsData.filter(p => p.price >= Number(priceRange.min));
        }
        if (priceRange.max) {
          productsData = productsData.filter(p => p.price <= Number(priceRange.max));
        }
        
        if (sortBy === 'price-low') {
          productsData.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
          productsData.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'rating') {
          productsData.sort((a, b) => b.rating - a.rating);
        }
        
        setProducts(productsData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching beauty products:', err);
        setLoading(false);
      });
  };

  // Subcategory categories for filtering
  const categories = [
    { id: 'all', name: 'All Beauty', icon: '/images/WhatsApp Image 2026-08-12 at 18.53.30.jpeg' },
    { id: 'skincare', name: 'Skincare', icon: '/images/WhatsApp Image 2026-08-12 at 18.53.33.jpeg' },
    { id: 'herbal', name: 'Herbal', icon: '/images/WhatsApp Image 2026-08-12 at 18.53.34.jpeg' },
    { id: 'oils', name: 'Oils', icon: '/images/oils.jpeg' },
    { id: 'makeup', name: 'Makeup', icon: '/images 1/ba741899489fc321a99b0860f1d38847.jpg' },
    { id: 'haircare', name: 'Haircare', icon: '/images/WhatsApp Image 2026-08-12 at 18.53.35 (1).jpeg' }
  ];

  // Subcategory cards for quick navigation (displayed prominently)
  const subCategoryCards = [
    { 
      id: 'herbal', 
      name: 'Herbal', 
      icon: '/images/WhatsApp Image 2026-08-12 at 18.53.34.jpeg', 
      description: 'Natural herbal beauty products', 
      color: '#00b894',
      bgColor: '#e8f8f5'
    },
    { 
      id: 'oils', 
      name: 'Oils', 
      icon: '/images/oils.jpeg', 
      description: 'Pure natural oils for skin & hair', 
      color: '#fdcb6e',
      bgColor: '#fef9e7'
    },
    { 
      id: 'skincare', 
      name: 'Skincare', 
      icon: '/images/WhatsApp Image 2026-08-12 at 18.53.33.jpeg', 
      description: 'Premium skincare essentials', 
      color: '#fd79a8',
      bgColor: '#fdf0f3'
    },
    { 
      id: 'makeup', 
      name: 'Makeup', 
      icon: '/images 1/ba741899489fc321a99b0860f1d38847.jpg', 
      description: 'High-quality makeup products', 
      color: '#e17055',
      bgColor: '#fae9e6'
    },
    { 
      id: 'haircare', 
      name: 'Haircare', 
      icon: '/images/WhatsApp Image 2026-08-12 at 18.53.35 (1).jpeg', 
      description: 'Nourishing hair care products', 
      color: '#0984e3',
      bgColor: '#e8f4fd'
    }
  ];

  const getCategoryIcon = (product) => {
    switch(product.subCategory) {
      case 'skincare': return '✨';
      case 'herbal': return '🌿';
      case 'oils': return '🧴';
      case 'makeup': return '💄';
      case 'haircare': return '💇‍♀️';
      default: return '💄';
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          style={{
            color: i <= Math.round(rating) ? '#fdcb6e' : '#dfe6e9',
            fontSize: '14px'
          }}
        />
      );
    }
    return stars;
  };

  const handleApplyFilters = () => {
    fetchBeauty();
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2d3436', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <img
            src="/images/WhatsApp Image 2026-08-12 at 18.53.30.jpeg"
            alt="Beauty collection"
            style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'cover' }}
          />
          Beauty Collection
        </h1>
        <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>
          Discover premium skincare, makeup, haircare, herbal, and oils products
        </p>
      </div>

      {/* Subcategory Cards - Prominent Display */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#2d3436', marginBottom: '15px' }}>Browse by Category</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '15px'
        }}>
          {subCategoryCards.map(card => (
            <div
              key={card.id}
              onClick={() => setActiveCategory(card.id)}
              style={{
                background: activeCategory === card.id ? card.color : card.bgColor,
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: activeCategory === card.id ? '2px solid ' + card.color : '2px solid transparent',
                boxShadow: activeCategory === card.id ? '0 4px 15px rgba(0,0,0,0.15)' : 'none',
                transform: activeCategory === card.id ? 'scale(1.05)' : 'scale(1)'
              }}
              onMouseEnter={(e) => {
                if (activeCategory !== card.id) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeCategory !== card.id) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <div style={{ fontSize: '2.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {typeof card.icon === 'string' && card.icon.startsWith('/') ? (
                  <img
                    src={card.icon}
                    alt={card.name}
                    style={{ width: '42px', height: '42px', borderRadius: '12px', objectFit: 'cover' }}
                  />
                ) : (
                  card.icon
                )}
              </div>
              <h4 style={{ 
                margin: '10px 0 5px 0', 
                color: activeCategory === card.id ? 'white' : '#2d3436'
              }}>
                {card.name}
              </h4>
              <p style={{ 
                fontSize: '0.85rem', 
                color: activeCategory === card.id ? 'rgba(255,255,255,0.9)' : '#6c757d',
                margin: 0
              }}>
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        borderBottom: '2px solid #f0f0f0',
        paddingBottom: '15px'
      }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '8px 18px',
              background: activeCategory === cat.id ? '#ff6b6b' : 'transparent',
              color: activeCategory === cat.id ? 'white' : '#2d3436',
              border: activeCategory === cat.id ? 'none' : '2px solid #e9ecef',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {typeof cat.icon === 'string' && cat.icon.startsWith('/') ? (
              <img
                src={cat.icon}
                alt={cat.name}
                style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              cat.icon
            )}
            {cat.name}
          </button>
        ))}
      </div>

      {/* Filters and Sort */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '20px',
        gap: '15px'
      }}>
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            padding: '10px 20px',
            background: '#f8f9fa',
            border: '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 'bold'
          }}
        >
          <FaFilter /> Filters
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: '#6c757d' }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '8px 15px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              outline: 'none'
            }}
          >
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
          <button
            onClick={handleApplyFilters}
            style={{
              padding: '8px 20px',
              background: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Apply
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
              Min Price ($)
            </label>
            <input
              type="number"
              value={priceRange.min}
              onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ddd'
              }}
              placeholder="0"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
              Max Price ($)
            </label>
            <input
              type="number"
              value={priceRange.max}
              onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ddd'
              }}
              placeholder="100"
            />
          </div>
        </div>
      )}

      {/* Results Count */}
      <p style={{ color: '#6c757d', marginBottom: '20px' }}>
        Showing {products.length} items
        {activeCategory !== 'all' && ' in ' + activeCategory}
      </p>

      {/* Products Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>💄</div>
          <p style={{ fontSize: '1.2rem', color: '#6c757d' }}>Loading beauty products...</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#f8f9fa', borderRadius: '10px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>😕</div>
          <h3 style={{ color: '#2d3436' }}>No beauty products found</h3>
          <p style={{ color: '#6c757d' }}>Try adjusting your filters or check back later</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '25px'
        }}>
          {products.map(product => (
            <div
              key={product.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
              }}
            >
              {/* Sale Badge */}
              {product.discountPrice && (
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: '#ff6b6b',
                  color: 'white',
                  padding: '5px 15px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  zIndex: 1
                }}>
                  SALE
                </div>
              )}

              {/* Category Badge */}
              <div style={{
                position: 'absolute',
                top: '15px',
                left: '15px',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '3px 12px',
                borderRadius: '20px',
                fontSize: '10px',
                fontWeight: 'bold',
                zIndex: 1
              }}>
                {product.subCategory || 'Beauty'}
              </div>

              {/* Product Image */}
              <Link to={'/product/' + product.id}>
                <div style={{
                  height: '250px',
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '5rem'
                }}>
                  {getCategoryIcon(product)}
                </div>
              </Link>

              {/* Product Info */}
              <div style={{ padding: '20px' }}>
                <Link to={'/product/' + product.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h3 style={{
                    margin: '0 0 5px 0',
                    fontSize: '1.1rem',
                    color: '#2d3436'
                  }}>
                    {product.name}
                  </h3>
                </Link>
                
                <p style={{
                  color: '#6c757d',
                  fontSize: '0.9rem',
                  margin: '0 0 8px 0'
                }}>
                  {product.brand || 'Mafleva Beauty'}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  marginBottom: '10px'
                }}>
                  {renderStars(product.rating)}
                  <span style={{ fontSize: '0.85rem', color: '#6c757d', marginLeft: '5px' }}>
                    ({product.numReviews || 0})
                  </span>
                </div>

                {product.ingredients && product.ingredients.length > 0 && (
                  <div style={{
                    display: 'flex',
                    gap: '5px',
                    flexWrap: 'wrap',
                    marginBottom: '12px'
                  }}>
                    {product.ingredients.slice(0, 3).map((ingredient, index) => (
                      <span key={index} style={{
                        padding: '2px 8px',
                        background: '#f8f9fa',
                        borderRadius: '4px',
                        fontSize: '10px',
                        color: '#6c757d'
                      }}>
                        {ingredient}
                      </span>
                    ))}
                    {product.ingredients.length > 3 && (
                      <span style={{
                        padding: '2px 8px',
                        fontSize: '10px',
                        color: '#6c757d'
                      }}>
                        +{product.ingredients.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '10px'
                }}>
                  <div>
                    {product.discountPrice ? (
                      <>
                        <span style={{
                          fontSize: '1.4rem',
                          fontWeight: 'bold',
                          color: '#ff6b6b'
                        }}>
                          
                        </span>
                        <span style={{
                          fontSize: '0.9rem',
                          color: '#6c757d',
                          textDecoration: 'line-through',
                          marginLeft: '8px'
                        }}>
                          
                        </span>
                      </>
                    ) : (
                      <span style={{
                        fontSize: '1.4rem',
                        fontWeight: 'bold',
                        color: '#2d3436'
                      }}>
                        
                      </span>
                    )}
                  </div>
                  <button
                    style={{
                      padding: '10px 18px',
                      background: '#ff6b6b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#e55a5a';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#ff6b6b';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <FaShoppingCart /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Beauty;
