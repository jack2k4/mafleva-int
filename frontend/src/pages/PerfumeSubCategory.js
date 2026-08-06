import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaFilter } from 'react-icons/fa';

function PerfumeSubCategory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    fetchPerfumes();
  }, [activeCategory]);

  const fetchPerfumes = () => {
    setLoading(true);
    let url = 'http://localhost:5000/api/products?category=perfumes';
    
    if (activeCategory !== 'all') {
      url = 'http://localhost:5000/api/perfumes/' + activeCategory;
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
        console.error('Error fetching perfumes:', err);
        setLoading(false);
      });
  };

  const subCategoryCards = [
    { 
      id: 'men', 
      name: 'Men', 
      icon: '👔', 
      description: 'Bold & masculine fragrances', 
      color: '#2d3436',
      bgColor: '#dfe6e9'
    },
    { 
      id: 'women', 
      name: 'Women', 
      icon: '👗', 
      description: 'Elegant & floral scents', 
      color: '#fd79a8',
      bgColor: '#fdf0f3'
    },
    { 
      id: 'unisex', 
      name: 'Unisex', 
      icon: '♻️', 
      description: 'Versatile & unique blends', 
      color: '#00b894',
      bgColor: '#e8f8f5'
    },
    { 
      id: 'refillable', 
      name: 'Refillable', 
      icon: '🔄', 
      description: 'Sustainable & refillable', 
      color: '#0984e3',
      bgColor: '#e8f4fd'
    }
  ];

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
    fetchPerfumes();
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2d3436', marginBottom: '10px' }}>
          🌸 Premium Perfumes
        </h1>
        <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>
          Discover our exquisite collection of fragrances for every personality and occasion
        </p>
      </div>

      {/* Subcategory Cards */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#2d3436', marginBottom: '15px' }}>Browse by Collection</h3>
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
            >
              <div style={{ fontSize: '2.5rem' }}>{card.icon}</div>
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
              placeholder="200"
            />
          </div>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🌸</div>
          <p style={{ fontSize: '1.2rem', color: '#6c757d' }}>Loading perfumes...</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#f8f9fa', borderRadius: '10px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>😕</div>
          <h3 style={{ color: '#2d3436' }}>No perfumes found</h3>
          <p style={{ color: '#6c757d' }}>Try adjusting your filters or check back later</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '25px'
        }}>
          {products.map(product => (
            <div key={product.id} style={{
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}>
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

              <Link to={'/product/' + product.id}>
                <div style={{
                  height: '200px',
                  background: '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '4rem'
                }}>
                  {product.subCategory === 'men' ? '👔' :
                   product.subCategory === 'women' ? '👗' :
                   product.subCategory === 'unisex' ? '♻️' :
                   product.subCategory === 'refillable' ? '🔄' : '🌸'}
                </div>
              </Link>
              <div style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 5px 0' }}>{product.name}</h3>
                <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>{product.brand}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
                  {renderStars(product.rating)}
                  <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                    ({product.numReviews || 0})
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    {product.discountPrice ? (
                      <>
                        <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#ff6b6b' }}>
                          
                        </span>
                        <span style={{ fontSize: '0.9rem', color: '#6c757d', textDecoration: 'line-through', marginLeft: '8px' }}>
                          
                        </span>
                      </>
                    ) : (
                      <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
                        
                      </span>
                    )}
                  </div>
                  <button style={{
                    padding: '8px 16px',
                    background: '#ff6b6b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}>
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

export default PerfumeSubCategory;
