import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaFilter } from 'react-icons/fa';
import StructuredData, { buildCatalogStructuredData } from '../components/seo/StructuredData';
import { resolveMediaUrl } from '../utils/resolveMediaUrl';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Beauty({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('default');
  const beautySubCategories = ['skincare', 'herbal', 'oils', 'makeup', 'haircare'];

  const beautyBannerImages = [
    '/images/oils.jpeg',
    '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.30.jpeg',
    '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.31.jpeg',
    '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.33.jpeg',
    '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.34.jpeg',
    '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.35%20(1).jpeg',
    '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.36.jpeg',
    '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.38%20(1).jpeg'
  ];

  const beautyFallbackProducts = [
    {
      id: 'beauty-fallback-skincare-1',
      name: 'Shea Butter Body Lotion',
      brand: 'Mafleva Beauty',
      price: 950,
      rating: 4.8,
      numReviews: 33,
      subCategory: 'skincare',
      image: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.30.jpeg'
    },
    {
      id: 'beauty-fallback-skincare-2',
      name: 'Sultan Beard Cream',
      brand: 'Mafleva Beauty',
      price: 760,
      rating: 4.6,
      numReviews: 21,
      subCategory: 'skincare',
      image: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.33.jpeg'
    },
    {
      id: 'beauty-fallback-skincare-3',
      name: 'Raw Shea Butter Jar',
      brand: 'Mafleva Beauty',
      price: 680,
      rating: 4.7,
      numReviews: 19,
      subCategory: 'skincare',
      image: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.34.jpeg'
    },
    {
      id: 'beauty-fallback-herbal-1',
      name: 'Herbal Black Seed Soap',
      brand: 'Mafleva Herbal',
      price: 540,
      rating: 4.5,
      numReviews: 17,
      subCategory: 'herbal',
      image: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.34%20(1).jpeg'
    },
    {
      id: 'beauty-fallback-herbal-2',
      name: 'Castor Oil Treatment Pack',
      brand: 'Mafleva Herbal',
      price: 890,
      rating: 4.7,
      numReviews: 24,
      subCategory: 'herbal',
      image: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.34%20(2).jpeg'
    },
    {
      id: 'beauty-fallback-herbal-3',
      name: 'Hair Mister & Treatment',
      brand: 'Mafleva Herbal',
      price: 620,
      rating: 4.6,
      numReviews: 14,
      subCategory: 'herbal',
      image: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.38%20(1).jpeg'
    },
    {
      id: 'beauty-fallback-oils-1',
      name: 'Signature Oils Blend',
      brand: 'Mafleva Oils',
      price: 790,
      rating: 4.8,
      numReviews: 28,
      subCategory: 'oils',
      image: '/images/oils.jpeg'
    },
    {
      id: 'beauty-fallback-oils-2',
      name: 'Castor Oil Pure',
      brand: 'Mafleva Oils',
      price: 840,
      rating: 4.7,
      numReviews: 23,
      subCategory: 'oils',
      image: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.36.jpeg'
    },
    {
      id: 'beauty-fallback-makeup-1',
      name: 'Beauty Essentials Kit',
      brand: 'Mafleva Beauty',
      price: 980,
      rating: 4.4,
      numReviews: 11,
      subCategory: 'makeup',
      image: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.31%20(2).jpeg'
    },
    {
      id: 'beauty-fallback-makeup-2',
      name: 'Glow Finish Collection',
      brand: 'Mafleva Beauty',
      price: 1100,
      rating: 4.5,
      numReviews: 12,
      subCategory: 'makeup',
      image: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.31.jpeg'
    },
    {
      id: 'beauty-fallback-haircare-1',
      name: 'Hair Meal Shea Butter',
      brand: 'Mafleva Haircare',
      price: 730,
      rating: 4.6,
      numReviews: 20,
      subCategory: 'haircare',
      image: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.31%20(1).jpeg'
    },
    {
      id: 'beauty-fallback-haircare-2',
      name: 'Hair Nourish Formula',
      brand: 'Mafleva Haircare',
      price: 760,
      rating: 4.5,
      numReviews: 18,
      subCategory: 'haircare',
      image: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.33%20(1).jpeg'
    },
    {
      id: 'beauty-fallback-haircare-3',
      name: 'Hair Restore Care',
      brand: 'Mafleva Haircare',
      price: 810,
      rating: 4.7,
      numReviews: 16,
      subCategory: 'haircare',
      image: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.35%20(1).jpeg'
    }
  ];

  const beautyImagesBySubCategory = {
    skincare: beautyFallbackProducts.filter((product) => product.subCategory === 'skincare').map((product) => product.image),
    herbal: beautyFallbackProducts.filter((product) => product.subCategory === 'herbal').map((product) => product.image),
    oils: beautyFallbackProducts.filter((product) => product.subCategory === 'oils').map((product) => product.image),
    makeup: beautyFallbackProducts.filter((product) => product.subCategory === 'makeup').map((product) => product.image),
    haircare: beautyFallbackProducts.filter((product) => product.subCategory === 'haircare').map((product) => product.image)
  };

  const normalizeBeautySubCategory = (value) => {
    const normalized = String(value || '').trim().toLowerCase();
    const aliasMap = {
      habit: 'herbal',
      herbals: 'herbal',
      herbs: 'herbal',
      skin: 'skincare',
      skincare: 'skincare',
      hair: 'haircare',
      'hair-care': 'haircare'
    };

    if (aliasMap[normalized]) {
      return aliasMap[normalized];
    }

    return beautySubCategories.includes(normalized) ? normalized : 'skincare';
  };

  const getBeautyImageForProduct = (product, index) => {
    if (product?.image) {
      return resolveMediaUrl(product.image);
    }

    const subCategory = product?.subCategory || 'skincare';
    const candidates = beautyImagesBySubCategory[subCategory] || beautyBannerImages;
    return resolveMediaUrl(candidates[index % candidates.length] || beautyBannerImages[index % beautyBannerImages.length]);
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
      productsData.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }

    return productsData;
  };

  const ensureBeautyCatalog = (sourceProducts, selectedCategory) => {
    const normalizedSource = (sourceProducts || []).map((product, index) => ({
      ...product,
      id: product?.id || `beauty-live-${selectedCategory}-${index}`,
      subCategory: normalizeBeautySubCategory(product?.subCategory),
      brand: product?.brand || 'Mafleva Beauty',
      rating: Number(product?.rating || 4.5),
      numReviews: Number(product?.numReviews || 12),
      price: Number(product?.price || 0),
      image: product?.image || getBeautyImageForProduct(product, index)
    }));

    const scopedSource = selectedCategory === 'all'
      ? normalizedSource
      : normalizedSource.filter((product) => product.subCategory === normalizeBeautySubCategory(selectedCategory));

    const scopedFallback = selectedCategory === 'all'
      ? beautyFallbackProducts
      : beautyFallbackProducts.filter((product) => product.subCategory === normalizeBeautySubCategory(selectedCategory));

    const fallbackRemainder = scopedFallback.filter((fallbackProduct) => (
      !scopedSource.some((liveProduct) => (
        liveProduct.id === fallbackProduct.id || liveProduct.image === fallbackProduct.image
      ))
    ));

    if (selectedCategory === 'all') {
      const grouped = beautySubCategories.flatMap((subCategory) => {
        const live = scopedSource.filter((product) => product.subCategory === subCategory);
        const fallback = fallbackRemainder.filter((product) => product.subCategory === subCategory);
        return [...live, ...fallback];
      });

      return grouped;
    }

    return [...scopedSource, ...fallbackRemainder];
  };

  useEffect(() => {
    fetchBeauty();

    const handleProductUpdate = () => fetchBeauty();
    window.addEventListener('mafleva-products-updated', handleProductUpdate);
    return () => window.removeEventListener('mafleva-products-updated', handleProductUpdate);
  }, [activeCategory]);

  const fetchBeauty = () => {
    setLoading(true);
    let url = `${API_BASE_URL}/api/products?category=beauty`;
    
    if (activeCategory !== 'all') {
      url = url + '&subCategory=' + activeCategory;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const liveApiProducts = Array.isArray(data?.products) ? data.products : [];
        const storedProducts = JSON.parse(localStorage.getItem('mafleva_admin_products') || '[]');
        const storedBeautyProducts = storedProducts.filter(
          (product) => String(product?.category || '').toLowerCase() === 'beauty'
        );
        const sourceProducts = liveApiProducts.length > 0 ? liveApiProducts : storedBeautyProducts;

        let productsData = ensureBeautyCatalog(sourceProducts, activeCategory);
        productsData = applyFiltersAndSort(productsData);
        setProducts(productsData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching beauty products:', err);
        const fallback = applyFiltersAndSort(ensureBeautyCatalog([], activeCategory));
        setProducts(fallback);
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

  const structuredData = buildCatalogStructuredData({
    pageTitle: 'Beauty Collection | Mafleva International Limited',
    pageDescription: 'Explore skincare, makeup, haircare, herbal, and oils products in the Mafleva beauty collection.',
    pagePath: '/beauty',
    products,
    currency: 'KES',
    fallbackDescription: 'Beauty product from Mafleva International Limited.'
  });

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <StructuredData data={structuredData} />
      <style>{`
        @keyframes gallerySlide {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
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
        <div
          style={{
            marginTop: '16px',
            overflow: 'hidden',
            borderRadius: '16px',
            border: '1px solid rgba(142, 104, 71, 0.14)',
            background: 'rgba(255, 255, 255, 0.68)',
            padding: '10px'
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '12px',
              width: 'max-content',
              animation: 'gallerySlide 25s linear infinite',
              willChange: 'transform'
            }}
          >
            {[...beautyBannerImages, ...beautyBannerImages].map((image, index) => (
              <div
                key={`${image}-${index}`}
                style={{
                  flex: '0 0 auto',
                  width: '130px',
                  height: index % 2 === 0 ? '165px' : '150px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid rgba(142, 104, 71, 0.16)',
                  boxShadow: '0 8px 18px rgba(58, 41, 29, 0.14)'
                }}
              >
                <img
                  src={image}
                  alt="Beauty product"
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            ))}
          </div>
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
          {products.map((product, index) => {
            const productStock = Number(product?.stock ?? 1);
            return (
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
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <img
                    src={getBeautyImageForProduct(product, index)}
                    alt={product.name}
                    style={{
                      display: 'block',
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
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

                <div style={{ marginBottom: '10px', color: '#2d3436', fontWeight: 700, fontSize: '0.85rem' }}>
                  Stock: {productStock}
                </div>
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
                          KES {Number(product.discountPrice).toLocaleString()}
                        </span>
                        <span style={{
                          fontSize: '0.9rem',
                          color: '#6c757d',
                          textDecoration: 'line-through',
                          marginLeft: '8px'
                        }}>
                          KES {Number(product.price).toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span style={{
                        fontSize: '1.4rem',
                        fontWeight: 'bold',
                        color: '#2d3436'
                      }}>
                        KES {Number(product.price || 0).toLocaleString()}
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
                    onClick={() => onAddToCart && onAddToCart({
                      ...product,
                      category: 'beauty',
                      image: getBeautyImageForProduct(product, index)
                    })}
                  >
                    <FaShoppingCart /> Add
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Beauty;
