import React, { useState, useEffect } from 'react';
import { formatCurrency, resolveCurrencyFromLocale } from '../utils/currency';
import StructuredData, { buildCatalogStructuredData } from '../components/seo/StructuredData';

function Shop({ defaultCategory = 'all', onAddToCart, selectedCurrency }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(defaultCategory);
  const [subCategory, setSubCategory] = useState('all');

  useEffect(() => {
    let url = 'http://localhost:5000/api/products';
    const params = new URLSearchParams();
    
    if (category !== 'all') {
      params.append('category', category);
    }
    if (subCategory !== 'all') {
      params.append('subCategory', subCategory);
    }
    
    const queryString = params.toString();
    if (queryString) {
      url += '?' + queryString;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        // Handle both array and object responses
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setProducts(fallbackProducts);
        setLoading(false);
      });
  }, [category, subCategory]);

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'beauty', name: 'Beauty' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'perfumes', name: 'Perfumes' },
    { id: 'health', name: 'Health Products' }
  ];

  const categoryImageLibrary = {
    beauty: [
      '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.30.jpeg',
      '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.31.jpeg',
      '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.33.jpeg',
      '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.34.jpeg',
      '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.39.jpeg'
    ],
    clothing: [
      '/wear/23626f85d3836f72d6a10dc547adb601.jpg',
      '/wear/45591080c617ba19d510476947307a2e.jpg',
      '/wear/62a50cc5b187807962bc6d67691c97d8.jpg',
      '/wear/732d3d01a39c6e2cc6278e7b7ca7fd20.jpg',
      '/wear/97d67efc93c9e1ea705a9845ece40b13.jpg'
    ],
    shop: [
      '/shop/23626f85d3836f72d6a10dc547adb601.jpg',
      '/shop/45591080c617ba19d510476947307a2e.jpg',
      '/shop/62a50cc5b187807962bc6d67691c97d8.jpg',
      '/shop/732d3d01a39c6e2cc6278e7b7ca7fd20.jpg',
      '/shop/97d67efc93c9e1ea705a9845ece40b13.jpg',
      '/shop/9a9c7e6e063fe62302f281fbacbccb09.jpg'
    ],
    perfumes: [
      '/perfumes/0a39becdd6041d93bb9b9b5645501342.jpg',
      '/perfumes/1f943a1d5fc12debdd2dfc91cf717cf9.jpg',
      '/perfumes/6262dda8914ce0fe8f83107ac06b1be2.jpg',
      '/perfumes/8fd0f7aa4fef27c2fa0deb1104a42a42.jpg',
      '/perfumes/aebf343bbc78ebd41c49ab993a51ceb3.jpg'
    ],
    health: [
      '/shop/23626f85d3836f72d6a10dc547adb601.jpg',
      '/shop/45591080c617ba19d510476947307a2e.jpg',
      '/shop/62a50cc5b187807962bc6d67691c97d8.jpg',
      '/shop/732d3d01a39c6e2cc6278e7b7ca7fd20.jpg',
      '/shop/97d67efc93c9e1ea705a9845ece40b13.jpg'
    ]
  };

  const fallbackProducts = [
    {
      id: 1,
      name: 'Luxury Beauty Blend',
      price: 45.99,
      discountPrice: 39.99,
      category: 'beauty',
      subCategory: 'skincare',
      brand: 'Mafleva Beauty',
      rating: 4.8,
      numReviews: 120,
      images: [{ url: categoryImageLibrary.beauty[0] }]
    },
    {
      id: 2,
      name: 'Glow Renewal Kit',
      price: 52.5,
      discountPrice: 44.99,
      category: 'beauty',
      subCategory: 'makeup',
      brand: 'Mafleva Beauty',
      rating: 4.6,
      numReviews: 92,
      images: [{ url: categoryImageLibrary.beauty[1] }]
    },
    {
      id: 3,
      name: 'Herbal Care Set',
      price: 39.99,
      discountPrice: 33.5,
      category: 'beauty',
      subCategory: 'herbal',
      brand: 'Mafleva Care',
      rating: 4.7,
      numReviews: 88,
      images: [{ url: categoryImageLibrary.beauty[2] }]
    },
    {
      id: 4,
      name: 'Silk Skin Essentials',
      price: 58.99,
      discountPrice: 49.99,
      category: 'beauty',
      subCategory: 'haircare',
      brand: 'Mafleva Care',
      rating: 4.5,
      numReviews: 76,
      images: [{ url: categoryImageLibrary.beauty[3] }]
    },
    {
      id: 5,
      name: 'Luxury Essentials',
      price: 61.5,
      discountPrice: 54.25,
      category: 'beauty',
      subCategory: 'oils',
      brand: 'Mafleva Beauty',
      rating: 4.8,
      numReviews: 104,
      images: [{ url: categoryImageLibrary.beauty[4] }]
    },
    {
      id: 6,
      name: 'Signature Fashion Look',
      price: 65.99,
      discountPrice: 54.99,
      category: 'clothing',
      subCategory: 'women',
      brand: 'Mafleva Style',
      rating: 4.7,
      numReviews: 98,
      images: [{ url: categoryImageLibrary.clothing[0] }]
    },
    {
      id: 7,
      name: 'Modern Street Look',
      price: 72.0,
      discountPrice: 62.0,
      category: 'clothing',
      subCategory: 'men',
      brand: 'Mafleva Style',
      rating: 4.8,
      numReviews: 110,
      images: [{ url: categoryImageLibrary.clothing[1] }]
    },
    {
      id: 8,
      name: 'Kids Everyday Set',
      price: 48.75,
      discountPrice: 41.5,
      category: 'clothing',
      subCategory: 'kids',
      brand: 'Mafleva Kids',
      rating: 4.6,
      numReviews: 68,
      images: [{ url: categoryImageLibrary.clothing[2] }]
    },
    {
      id: 9,
      name: 'Classic Casual Fit',
      price: 79.0,
      discountPrice: 69.25,
      category: 'clothing',
      subCategory: 'women',
      brand: 'Mafleva Style',
      rating: 4.7,
      numReviews: 90,
      images: [{ url: categoryImageLibrary.clothing[3] }]
    },
    {
      id: 10,
      name: 'Premium Layer Look',
      price: 88.5,
      discountPrice: 75.99,
      category: 'clothing',
      subCategory: 'men',
      brand: 'Mafleva Style',
      rating: 4.9,
      numReviews: 128,
      images: [{ url: categoryImageLibrary.clothing[4] }]
    },
    {
      id: 11,
      name: 'Perfume Collection',
      price: 89.99,
      discountPrice: 79.99,
      category: 'perfumes',
      subCategory: 'women',
      brand: 'Mafleva Fragrance',
      rating: 4.9,
      numReviews: 140,
      images: [{ url: categoryImageLibrary.perfumes[0] }]
    },
    {
      id: 12,
      name: 'Signature Scent',
      price: 94.5,
      discountPrice: 82.25,
      category: 'perfumes',
      subCategory: 'men',
      brand: 'Mafleva Fragrance',
      rating: 4.8,
      numReviews: 117,
      images: [{ url: categoryImageLibrary.perfumes[1] }]
    },
    {
      id: 13,
      name: 'Fresh Unisex Blend',
      price: 83.99,
      discountPrice: 74.5,
      category: 'perfumes',
      subCategory: 'unisex',
      brand: 'Mafleva Atelier',
      rating: 4.7,
      numReviews: 96,
      images: [{ url: categoryImageLibrary.perfumes[2] }]
    },
    {
      id: 14,
      name: 'Refillable Luxury Mist',
      price: 76.0,
      discountPrice: 66.0,
      category: 'perfumes',
      subCategory: 'refillable',
      brand: 'Mafleva Fragrance',
      rating: 4.9,
      numReviews: 131,
      images: [{ url: categoryImageLibrary.perfumes[3] }]
    },
    {
      id: 15,
      name: 'Golden Notes Edition',
      price: 99.99,
      discountPrice: 89.25,
      category: 'perfumes',
      subCategory: 'women',
      brand: 'Mafleva Fragrance',
      rating: 5.0,
      numReviews: 154,
      images: [{ url: categoryImageLibrary.perfumes[4] }]
    },
    {
      id: 16,
      name: 'Daily Wellness Care',
      price: 34.99,
      discountPrice: 29.99,
      category: 'health',
      subCategory: 'wellness',
      brand: 'Mafleva Health',
      rating: 4.8,
      numReviews: 84,
      images: []
    },
    {
      id: 17,
      name: 'Herbal Vitality Boost',
      price: 28.5,
      discountPrice: 24.99,
      category: 'health',
      subCategory: 'care',
      brand: 'Mafleva Health',
      rating: 4.7,
      numReviews: 71,
      images: []
    },
    {
      id: 18,
      name: 'Natural Recovery Blend',
      price: 41.99,
      discountPrice: 36.5,
      category: 'health',
      subCategory: 'wellness',
      brand: 'Mafleva Health',
      rating: 4.9,
      numReviews: 93,
      images: []
    }
  ];

  const subCategories = {
    clothing: [
      { id: 'all', name: 'All Clothing' },
      { id: 'men', name: 'Men' },
      { id: 'women', name: 'Women' },
      { id: 'kids', name: 'Kids' }
    ],
    beauty: [
      { id: 'all', name: 'All Beauty' },
      { id: 'skincare', name: 'Skincare' },
      { id: 'makeup', name: 'Makeup' },
      { id: 'herbal', name: 'Herbal' },
      { id: 'oils', name: 'Oils' },
      { id: 'haircare', name: 'Haircare' }
    ],
    perfumes: [
      { id: 'all', name: 'All Perfumes' },
      { id: 'men', name: 'Men' },
      { id: 'women', name: 'Women' },
      { id: 'unisex', name: 'Unisex' },
      { id: 'refillable', name: 'Refillable' }
    ],
    health: [
      { id: 'all', name: 'All Health Products' },
      { id: 'wellness', name: 'Wellness' },
      { id: 'care', name: 'Care' }
    ]
  };

  const getSubCategories = () => {
    if (category === 'all') return [];
    return subCategories[category] || [];
  };

  const getNormalizedCategory = (product) => {
    const raw = String(product?.category || '').toLowerCase();
    if (raw.includes('beaut')) return 'beauty';
    if (raw.includes('cloth') || raw.includes('wear') || raw.includes('fashion')) return 'clothing';
    if (raw.includes('perfume') || raw.includes('fragrance') || raw.includes('scent')) return 'perfumes';
    if (raw.includes('health') || raw.includes('wellness') || raw.includes('care') || raw.includes('herbal') || raw.includes('supplement')) return 'health';
    return raw;
  };

  const getProductImage = (product, index) => {
    const productCategory = getNormalizedCategory(product);
    const activeCategory = category !== 'all' ? category : productCategory;

    // Enforce folder separation by category.
    if (activeCategory === 'beauty' || activeCategory === 'clothing' || activeCategory === 'perfumes' || activeCategory === 'health') {
      const pool = categoryImageLibrary[activeCategory] || [];
      if (pool.length > 0) {
        return pool[(Number(product?.id || index) + 1) % pool.length] || pool[0];
      }
    }

    const productImages = Array.isArray(product?.images)
      ? product.images.map((img) => img?.url || '').filter(Boolean)
      : [];

    if (productImages.length > 0) {
      return productImages[0];
    }

    const shopPool = categoryImageLibrary.shop || [];
    return shopPool[(Number(product?.id || index) + 1) % shopPool.length] || shopPool[0];
  };

  const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-KE';
  const currency = selectedCurrency || resolveCurrencyFromLocale(locale);
  const structuredData = buildCatalogStructuredData({
    pageTitle: 'Shop Products | Mafleva International Limited',
    pageDescription: 'Browse all Mafleva International products, including beauty, clothing, perfumes, and wellness essentials.',
    pagePath: '/shop',
    products,
    currency,
    fallbackDescription: 'Mafleva International Limited catalog product.'
  });

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', background: '#f6efe7', borderRadius: '18px' }}>
      <StructuredData data={structuredData} />
      <h1 style={{ color: '#2d3436', marginBottom: '20px' }}>Shop Our Collection</h1>
      
      {/* Category Filters */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setCategory(cat.id);
              setSubCategory('all');
            }}
            style={{
              padding: '10px 20px',
              background: category === cat.id ? '#ff6b6b' : '#f8f9fa',
              color: category === cat.id ? 'white' : '#2d3436',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Sub-Category Filters */}
      {getSubCategories().length > 0 && (
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {getSubCategories().map(sub => (
            <button
              key={sub.id}
              onClick={() => setSubCategory(sub.id)}
              style={{
                padding: '8px 16px',
                background: subCategory === sub.id ? '#2d3436' : '#f8f9fa',
                color: subCategory === sub.id ? 'white' : '#2d3436',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      {/* Results Count */}
      <p style={{ color: '#6c757d', marginBottom: '20px' }}>
        Showing {Array.isArray(products) ? products.length : 0} products
        {category !== 'all' && ' in ' + category}
        {subCategory !== 'all' && ' - ' + subCategory}
      </p>

      {/* Products Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '2rem' }}>⏳</div>
          <p>Loading products...</p>
        </div>
      ) : !Array.isArray(products) || products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '3rem' }}>😕</div>
          <h3>No products found</h3>
          <p style={{ color: '#6c757d' }}>Try adjusting your filters</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '25px'
        }}>
          {products.map((product, index) => {
            const normalizedCategory = getNormalizedCategory(product);
            const displayName = product.name || product.title || (normalizedCategory === 'health' ? 'Health Product' : 'Product');
            const displayBrand = product.brand || (normalizedCategory === 'health' ? 'Mafleva Health' : product.category || 'Mafleva');
            const isWaitingCategory = category === 'clothing' || category === 'perfumes';
            const productImage = isWaitingCategory ? '' : getProductImage(product, index);

            return (
            <div key={product.id} style={{
              background: 'white',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{
                height: '200px',
                background: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem',
                position: 'relative'
              }}>
                  {productImage ? (
                    <img
                      src={productImage}
                      alt={product.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.parentNode.querySelector('[data-fallback="icon"]');
                        if (fallback) fallback.style.display = 'flex';
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: '#f8f9fa'
                      }}
                    />
                  )}
                {!isWaitingCategory && product.discountPrice && (
                  <span style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#ff6b6b',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    SALE
                  </span>
                )}
              </div>
              {isWaitingCategory ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <p style={{ margin: 0, color: '#6c757d', fontWeight: 'bold' }}>Waiting for products</p>
                </div>
              ) : (
                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>
                    {displayName}
                  </h3>
                  <p style={{ color: '#6c757d', fontSize: '0.9rem', margin: '0 0 5px 0' }}>
                    {displayBrand}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
                    <span style={{ color: '#fdcb6e' }}>★</span>
                    <span style={{ fontSize: '0.9rem' }}>{product.rating || 0}</span>
                    <span style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                      ({product.numReviews || 0} reviews)
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      {product.discountPrice ? (
                        <>
                          <span style={{
                            fontSize: '1.3rem',
                            fontWeight: 'bold',
                            color: '#ff6b6b'
                          }}>
                            {formatCurrency(product.discountPrice, locale, currency)}
                          </span>
                          <span style={{
                            fontSize: '0.9rem',
                            color: '#6c757d',
                            textDecoration: 'line-through',
                            marginLeft: '8px'
                          }}>
                            {formatCurrency(product.price, locale, currency)}
                          </span>
                        </>
                      ) : (
                        <span style={{
                          fontSize: '1.3rem',
                          fontWeight: 'bold',
                          color: '#2d3436'
                        }}>
                          {formatCurrency(product.price, locale, currency)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => onAddToCart && onAddToCart({
                        id: product.id,
                        name: displayName,
                        price: product.discountPrice || product.price,
                        image: getProductImage(product, index),
                        category: normalizedCategory,
                        images: product.images || []
                      })}
                      style={{
                      padding: '8px 16px',
                      background: '#ff6b6b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              )}
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Shop;
