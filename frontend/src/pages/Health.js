import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaFilter } from 'react-icons/fa';
import StructuredData, { buildCatalogStructuredData } from '../components/seo/StructuredData';

function Health({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('default');
  const healthSubCategories = ['wellness', 'care'];

  const filterProductsByCategory = (sourceProducts, selectedCategory) => {
    if (!Array.isArray(sourceProducts) || sourceProducts.length === 0) {
      return [];
    }

    if (selectedCategory === 'all') {
      return sourceProducts.filter(Boolean);
    }

    return sourceProducts.filter(
      (product) => String(product?.subCategory || '').toLowerCase() === selectedCategory
    );
  };

  const applyFiltersAndSort = (items) => {
    let productsData = [...items];

    if (priceRange.min) {
      productsData = productsData.filter((product) => Number(product.price) >= Number(priceRange.min));
    }

    if (priceRange.max) {
      productsData = productsData.filter((product) => Number(product.price) <= Number(priceRange.max));
    }

    if (sortBy === 'price-low') {
      productsData.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-high') {
      productsData.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'rating') {
      productsData.sort((a, b) => Number(b.rating) - Number(a.rating));
    }

    return productsData;
  };

  useEffect(() => {
    fetchHealth();

    const handleProductUpdate = () => fetchHealth();
    window.addEventListener('mafleva-products-updated', handleProductUpdate);
    return () => window.removeEventListener('mafleva-products-updated', handleProductUpdate);
  }, [activeCategory, priceRange.min, priceRange.max, sortBy]);

  const fetchHealth = () => {
    setLoading(true);
    let url = 'http://localhost:5000/api/products?category=health';

    if (activeCategory !== 'all') {
      url = `${url}&subCategory=${activeCategory}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const storedProducts = JSON.parse(localStorage.getItem('mafleva_admin_products') || '[]');
        const sourceProducts = Array.isArray(data?.products) && data.products.length > 0
          ? data.products
          : storedProducts.filter((product) => String(product?.category || '').toLowerCase() === 'health');

        const completeCatalog = filterProductsByCategory(sourceProducts, activeCategory);
        const refinedCatalog = applyFiltersAndSort(completeCatalog);

        setProducts(refinedCatalog);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching health products:', err);
        const storedProducts = JSON.parse(localStorage.getItem('mafleva_admin_products') || '[]');
        const fallback = applyFiltersAndSort(
          filterProductsByCategory(
            storedProducts.filter((product) => String(product?.category || '').toLowerCase() === 'health'),
            activeCategory
          )
        );
        setProducts(fallback);
        setLoading(false);
      });
  };

  const categories = [
    { id: 'all', name: 'All Health Products', icon: '🌿' },
    { id: 'wellness', name: 'Wellness', icon: '💪' },
    { id: 'care', name: 'Care', icon: '🩺' }
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
    const refinedCatalog = applyFiltersAndSort(filterProductsByCategory(products, activeCategory));
    setProducts(refinedCatalog);
  };

  const structuredData = buildCatalogStructuredData({
    pageTitle: 'Health & Wellness | Mafleva International Limited',
    pageDescription: 'Find trusted health and wellness essentials for everyday care and support.',
    pagePath: '/health',
    products,
    currency: 'KES',
    fallbackDescription: 'Health product from Mafleva International Limited.'
  });

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <StructuredData data={structuredData} />
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2d3436', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '2.2rem' }}>🌿</span>
          Health Collection
        </h1>
        <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>
          Discover wellness and care essentials from Mafleva Health
        </p>
      </div>

      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        borderBottom: '2px solid #f0f0f0',
        paddingBottom: '15px'
      }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '10px 20px',
              background: activeCategory === cat.id ? '#2ecc71' : 'transparent',
              color: activeCategory === cat.id ? 'white' : '#2d3436',
              border: activeCategory === cat.id ? 'none' : '2px solid #e9ecef',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.95rem',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

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
              background: '#2ecc71',
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
              Min Price (KES)
            </label>
            <input
              type="number"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
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
              Max Price (KES)
            </label>
            <input
              type="number"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ddd'
              }}
              placeholder="2000"
            />
          </div>
        </div>
      )}

      <p style={{ color: '#6c757d', marginBottom: '20px' }}>
        Showing {products.length} items
        {activeCategory !== 'all' && ` in ${activeCategory}`}
      </p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🌿</div>
          <p style={{ fontSize: '1.2rem', color: '#6c757d' }}>Loading health products...</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#f8f9fa', borderRadius: '10px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>😕</div>
          <h3 style={{ color: '#2d3436' }}>No health products found</h3>
          <p style={{ color: '#6c757d' }}>Try adjusting your filters or check back later</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '25px'
        }}>
          {products.map((product) => (
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
                {product.subCategory || 'health'}
              </div>

              <div style={{
                height: '250px',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <img
                  src={product.image || (Array.isArray(product.images) ? product.images[0]?.url : '') || '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.30.jpeg'}
                  alt={product.name}
                  onError={(event) => {
                    event.currentTarget.src = '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.30.jpeg';
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>

              <div style={{ padding: '20px' }}>
                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                  {product.brand || 'Mafleva Health'}
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

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '10px'
                }}>
                  <span style={{
                    fontSize: '1.4rem',
                    fontWeight: 'bold',
                    color: '#2d3436'
                  }}>
                    KES {Number(product.price || 0).toLocaleString()}
                  </span>

                  <button
                    style={{
                      padding: '10px 18px',
                      background: '#2ecc71',
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
                      e.currentTarget.style.background = '#27ae60';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#2ecc71';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    onClick={() => onAddToCart && onAddToCart({
                      ...product,
                      category: 'health',
                      image: ''
                    })}
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

export default Health;
