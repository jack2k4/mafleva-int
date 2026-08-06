import React, { useState, useEffect } from 'react';

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
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
        setProducts([]);
        setLoading(false);
      });
  }, [category, subCategory]);

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'beauty', name: 'Beauty' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'perfumes', name: 'Perfumes' }
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
    ]
  };

  const getSubCategories = () => {
    if (category === 'all') return [];
    return subCategories[category] || [];
  };

  const getCategoryIcon = (product) => {
    switch(product.category) {
      case 'beauty': return '💄';
      case 'clothing': return '👗';
      case 'perfumes': return '🌸';
      default: return '📦';
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
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
          {products.map(product => (
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
                {getCategoryIcon(product)}
                {product.discountPrice && (
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
              <div style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>
                  {product.name}
                </h3>
                <p style={{ color: '#6c757d', fontSize: '0.9rem', margin: '0 0 5px 0' }}>
                  {product.brand || product.category}
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
                        fontSize: '1.3rem',
                        fontWeight: 'bold',
                        color: '#2d3436'
                      }}>
                        
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
                    Add to Cart
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

export default Shop;
