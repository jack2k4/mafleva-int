import React, { useState, useEffect } from 'react';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      const productsArray = data.products || data || [];
      setProducts(productsArray);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ color: '#2d3436', marginBottom: '20px' }}>📦 Product Management</h2>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <p style={{ color: '#6c757d' }}>Total Products: {products.length}</p>
        <button style={{
          padding: '10px 20px',
          background: '#ff6b6b',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f8f9fa', borderRadius: '8px' }}>
          <p>No products found</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Category</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Price</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Stock</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '10px' }}>{product.name}</td>
                  <td style={{ padding: '10px' }}>{product.category}</td>
                  <td style={{ padding: '10px' }}></td>
                  <td style={{ padding: '10px' }}>{product.stock || 0}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <button style={{ padding: '5px 10px', marginRight: '5px', background: '#0984e3', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Edit</button>
                    <button style={{ padding: '5px 10px', background: '#e17055', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;
