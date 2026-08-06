import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaFilter } from 'react-icons/fa';

function Clothing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    fetchClothing();
  }, [activeCategory]);

  const fetchClothing = () => {
    setLoading(true);
    let url = 'http://localhost:5000/api/products?category=clothing';
    
    if (activeCategory !== 'all') {
      url = url + '&subCategory=' + activeCategory;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        let productsData = data.products || [];
        
        // Apply price filter
        if (priceRange.min) {
          productsData = productsData.filter(p => p.price >= Number(priceRange.min));
        }
        if (priceRange.max) {
          productsData = productsData.filter(p => p.price <= Number(priceRange.max));
        }
        
        // Apply sorting
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
        console.error('Error fetching clothing:', err);
        setLoading(false);
      });
  };

  const categories = [
    { id: 'all', name: 'All Clothing', icon: '👗' },
    { id: 'men', name: "Men's Fashion", icon: '👔' },
    { id: 'women', name: "Women's Fashion", icon: '👗' },
    { id: 'kids', name: "Kids' Fashion", icon: '🧒' }
  ];

  const getCategoryIcon = (product) => {
    switch(product.subCategory) {
      case 'men': return '👔';
      case 'women': return '👗';
      case 'kids': return '🧒';
      default: return '👕';
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
    fetchClothing();
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2d3436', marginBottom: '10px' }}>
          👗 Clothing Collection
        </h1>
        <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>
          Discover our premium clothing collection for every style and occasion
        </p>
      </div>

      {/* Category Navigation */}
      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '30px',
        flexWrap: 'wrap',
        borderBottom: '2px solid #f0f0f0',
        paddingBottom: '20px'
      }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '12px 25px',
              background: activeCategory === cat.id ? '#ff6b6b' : 'transparent',
              color: activeCategory === cat.id ? 'white' : '#2d3436',
              border: activeCategory === cat.id ? 'none' : '2px solid #e9ecef',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'all 0.3s ease'
            }}
          >
            {cat.icon} {cat.name}
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
              placeholder="1000"
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
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>👗</div>
          <p style={{ fontSize: '1.2rem', color: '#6c757d' }}>Loading clothing collection...</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#f8f9fa', borderRadius: '10px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>😕</div>
          <h3 style={{ color: '#2d3436' }}>No clothing items found</h3>
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
                  {product.brand || 'Mafleva Collection'}
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

                {product.sizes && product.sizes.length > 0 && (
                  <div style={{
                    display: 'flex',
                    gap: '5px',
                    flexWrap: 'wrap',
                    marginBottom: '12px'
                  }}>
                    {product.sizes.map(size => (
                      <span key={size} style={{
                        padding: '2px 8px',
                        background: '#f8f9fa',
                        borderRadius: '4px',
                        fontSize: '11px',
                        color: '#6c757d'
                      }}>
                        {size}
                      </span>
                    ))}
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

export default Clothing;
