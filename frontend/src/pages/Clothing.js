import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaFilter } from 'react-icons/fa';
import StructuredData, { buildCatalogStructuredData } from '../components/seo/StructuredData';

function Clothing({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('default');
  const clothingSubCategories = ['men', 'women', 'kids'];

  const wearImages = [
    '/wear/23626f85d3836f72d6a10dc547adb601.jpg',
    '/wear/45591080c617ba19d510476947307a2e.jpg',
    '/wear/62a50cc5b187807962bc6d67691c97d8.jpg',
    '/wear/732d3d01a39c6e2cc6278e7b7ca7fd20.jpg',
    '/wear/97d67efc93c9e1ea705a9845ece40b13.jpg',
    '/wear/9a9c7e6e063fe62302f281fbacbccb09.jpg'
  ];

  const clothingBannerImages = [
    wearImages[3],
    wearImages[0],
    wearImages[5],
    wearImages[2],
    wearImages[4],
    wearImages[1]
  ];

  const buildWearFallbackProducts = () => {
    const subCategoryNames = {
      men: "Men's",
      women: "Women's",
      kids: "Kids'"
    };

    return clothingSubCategories.flatMap((subCategory) => (
      Array.from({ length: 10 }, (_, index) => ({
        id: `wear-${subCategory}-${index + 1}`,
        name: `${subCategoryNames[subCategory]} Collection ${index + 1}`,
        brand: 'Mafleva Wear',
        price: 49 + index * 3,
        rating: 4.4 + (index % 3) * 0.2,
        numReviews: 18 + index * 2,
        subCategory,
        image: '',
        sizes: ['S', 'M', 'L']
      }))
    ));
  };

  const ensureTenPerCategory = (sourceProducts, selectedCategory) => {
    const fallbackProducts = buildWearFallbackProducts();

    const fillCategory = (subCategory) => {
      const fromSource = sourceProducts
        .filter((product) => product?.subCategory === subCategory)
        .slice(0, 10);

      if (fromSource.length === 10) return fromSource;

      const fillers = fallbackProducts
        .filter((product) => product.subCategory === subCategory)
        .slice(0, 10 - fromSource.length)
        .map((product) => ({
          ...product,
          id: `${product.id}-fallback`
        }));

      return [...fromSource, ...fillers];
    };

    if (selectedCategory === 'all') {
      return clothingSubCategories.flatMap(fillCategory);
    }

    return fillCategory(selectedCategory);
  };

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
        
        productsData = ensureTenPerCategory(productsData, activeCategory);

        setProducts(productsData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching clothing:', err);
        const fallback = ensureTenPerCategory([], activeCategory);
        setProducts(fallback);
        setLoading(false);
      });
  };

  const categories = [
    { id: 'all', name: 'All Clothing', image: wearImages[0] },
    { id: 'men', name: "Men's Fashion", image: wearImages[1] },
    { id: 'women', name: "Women's Fashion", image: wearImages[2] },
    { id: 'kids', name: "Kids' Fashion", image: wearImages[3] }
  ];

  const getCategoryImage = (product, index) => {
    if (product?.image) {
      return product.image;
    }

    const bySubCategory = {
      men: wearImages[1],
      women: wearImages[2],
      kids: wearImages[3],
      all: wearImages[0]
    };

    return bySubCategory[product?.subCategory] || wearImages[(Number(product?.id || index) + 1) % wearImages.length];
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

  const structuredData = buildCatalogStructuredData({
    pageTitle: 'Clothing Collection | Mafleva International Limited',
    pageDescription: 'Shop stylish men, women, and kids clothing from the Mafleva International fashion range.',
    pagePath: '/clothing',
    products,
    currency: 'KES',
    fallbackDescription: 'Clothing product from Mafleva International Limited.'
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
            src="/images%201/clothing.jpg"
            alt="Clothing collection"
            style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'cover' }}
          />
          Clothing Collection
        </h1>
        <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>
          Discover our premium clothing collection for every style and occasion
        </p>
      </div>

      <div
        style={{
          marginBottom: '30px',
          overflow: 'hidden',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(249, 244, 238, 0.95) 0%, rgba(239, 227, 210, 0.95) 100%)',
          border: '1px solid rgba(142, 104, 71, 0.08)',
          boxShadow: '0 10px 30px rgba(58, 41, 29, 0.08)'
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '16px',
            width: 'max-content',
            animation: 'gallerySlide 30s linear infinite',
            willChange: 'transform',
            padding: '14px'
          }}
        >
          {[...clothingBannerImages, ...clothingBannerImages].map((image, index) => (
            <div
              key={`${image}-${index}`}
              style={{
                flex: '0 0 auto',
                width: '200px',
                height: index % 2 === 0 ? '250px' : '230px',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(142, 104, 71, 0.15)',
                boxShadow: '0 10px 24px rgba(58, 41, 29, 0.12)'
              }}
            >
              <img
                src={image}
                alt="Clothing style"
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
            <img
              src={cat.image}
              alt={cat.name}
              style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover', marginRight: '8px' }}
            />
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
          {products.map((product, index) => (
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

              {/* Product Image Placeholder */}
              <div style={{
                height: '250px',
                background: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6c757d',
                fontWeight: 'bold',
                letterSpacing: '0.02em'
              }}>
                Waiting for products
              </div>

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
                    onClick={() => onAddToCart && onAddToCart({
                      ...product,
                      category: 'clothing',
                      image: getCategoryImage(product, index)
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

export default Clothing;
