import React, { useEffect, useMemo, useState } from 'react';

const ADMIN_EMAIL = 'yusuf.nganga@gmail.com';
const ADMIN_PASSWORD = 'maflevainternational@254';

function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('mf_admin_auth') === '1');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [analyticsSummary, setAnalyticsSummary] = useState(null);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  const [dashboardError, setDashboardError] = useState('');
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [productActionStatus, setProductActionStatus] = useState('');

  const [products, setProducts] = useState([
    { id: 1, name: 'Glow Bloom Face Cream', category: 'beauty', price: 45, stock: 30, image: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.30.jpeg' },
    { id: 2, name: 'Rose Glow Gel Cream', category: 'beauty', price: 39, stock: 21, image: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.31.jpeg' },
    { id: 3, name: 'Classic Wear Set', category: 'clothing', price: 69, stock: 15, image: '/wear/23626f85d3836f72d6a10dc547adb601.jpg' },
    { id: 4, name: 'Signature Perfume', category: 'perfumes', price: 89, stock: 11, image: '/perfumes/0a39becdd6041d93bb9b9b5645501342.jpg' }
  ]);

  const [orders, setOrders] = useState([
    { id: 'ORD-1001', customer: 'Jane Doe', total: 132, status: 'Pending', date: '2026-10-02' },
    { id: 'ORD-1002', customer: 'John Kim', total: 89, status: 'Shipped', date: '2026-10-03' },
    { id: 'ORD-1003', customer: 'Aisha Noor', total: 214, status: 'Delivered', date: '2026-10-04' }
  ]);

  const [messages, setMessages] = useState([
    { id: 1, name: 'Sarah', email: 'sarah@email.com', subject: 'Order delay', text: 'Please help check my order status.', replied: false },
    { id: 2, name: 'Mike', email: 'mike@email.com', subject: 'Coupon issue', text: 'Coupon code not working on checkout.', replied: false }
  ]);

  const [promoVideo, setPromoVideo] = useState('/videos/Luxury%20Kandura%20Collection.mhtml');
  const [newVideoUrl, setNewVideoUrl] = useState('');

  const defaultSubCategoryMap = {
    beauty: 'skincare',
    clothing: 'women',
    perfumes: 'women',
    health: 'wellness'
  };

  const subCategoryOptions = {
    beauty: ['skincare', 'herbal', 'oils', 'makeup', 'haircare'],
    clothing: ['men', 'women', 'kids'],
    perfumes: ['men', 'women', 'unisex', 'refillable'],
    health: ['wellness', 'care', 'herbal', 'supplements']
  };

  const [productForm, setProductForm] = useState({
    id: null,
    name: '',
    category: 'beauty',
    subCategory: defaultSubCategoryMap.beauty,
    price: '',
    stock: '',
    image: '',
    imageFile: null
  });

  const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const normalizeProduct = (product) => {
    const imageUrl = product.image || (Array.isArray(product.images) && product.images[0]?.url) || '/images/logo.jpeg';
    return {
      ...product,
      image: imageUrl,
      images: Array.isArray(product.images) && product.images.length ? product.images : [{ url: imageUrl }],
      price: Number(product.price || 0),
      stock: Number(product.stock || 0)
    };
  };

  const syncStoredProducts = (nextProducts) => {
    const normalized = nextProducts.map(normalizeProduct);
    setProducts(normalized);
    localStorage.setItem('mafleva_admin_products', JSON.stringify(normalized));
    window.dispatchEvent(new Event('mafleva-products-updated'));
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    const controller = new AbortController();

    const loadDashboardData = async () => {
      setDashboardLoading(true);
      setDashboardError('');

      try {
        const [analyticsResponse, alertsResponse] = await Promise.all([
          fetch(apiBaseUrl + '/api/analytics/summary', { signal: controller.signal }),
          fetch(apiBaseUrl + '/api/inventory/alerts?threshold=10', { signal: controller.signal })
        ]);

        if (!analyticsResponse.ok) {
          throw new Error('Failed to load analytics summary');
        }

        if (!alertsResponse.ok) {
          throw new Error('Failed to load inventory alerts');
        }

        const analyticsData = await analyticsResponse.json();
        const alertsData = await alertsResponse.json();

        setAnalyticsSummary(analyticsData);
        setInventoryAlerts(alertsData.products || []);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setDashboardError('Live analytics could not be loaded. Showing local dashboard data.');
        }
      } finally {
        setDashboardLoading(false);
      }
    };

    loadDashboardData();

    return () => controller.abort();
  }, [isLoggedIn, apiBaseUrl]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const loadProducts = async () => {
      try {
        const response = await fetch(apiBaseUrl + '/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        const apiProducts = Array.isArray(data) ? data : (data.products || []);

        if (apiProducts.length > 0) {
          syncStoredProducts(apiProducts);
        } else {
          const storedProducts = JSON.parse(localStorage.getItem('mafleva_admin_products') || '[]');
          if (storedProducts.length > 0) syncStoredProducts(storedProducts);
        }
      } catch (error) {
        const storedProducts = JSON.parse(localStorage.getItem('mafleva_admin_products') || '[]');
        if (storedProducts.length > 0) syncStoredProducts(storedProducts);
      }
    };

    loadProducts();
  }, [apiBaseUrl, isLoggedIn]);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const lowStockProducts = products.filter((product) => Number(product.stock || 0) < 10);
    const salesByCategory = products.reduce((accumulator, product) => {
      const category = product.category || 'other';
      accumulator[category] = (accumulator[category] || 0) + Number(product.price || 0) * Number(product.stock || 0);
      return accumulator;
    }, {});
    return {
      products: products.length,
      orders: orders.length,
      messages: messages.length,
      revenue: totalRevenue,
      lowStockProducts,
      salesByCategory
    };
  }, [products, orders, messages]);

  const activeStats = analyticsSummary
    ? {
        products: analyticsSummary.totalProducts ?? stats.products,
        orders: analyticsSummary.totalOrders ?? stats.orders,
        messages: stats.messages,
        revenue: analyticsSummary.totalRevenue ?? stats.revenue,
        lowStockProducts: inventoryAlerts.length > 0 ? inventoryAlerts : stats.lowStockProducts,
        salesByCategory: analyticsSummary.revenueByCategory || stats.salesByCategory,
        orderStatuses: analyticsSummary.orderStatuses || {}
      }
    : stats;

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.email === ADMIN_EMAIL && loginForm.password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError('');
      localStorage.setItem('mf_admin_auth', '1');
      return;
    }
    setLoginError('Invalid admin email or password.');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('mf_admin_auth');
  };

  const resetProductForm = () => {
    setProductForm({
      id: null,
      name: '',
      category: 'beauty',
      subCategory: defaultSubCategoryMap.beauty,
      price: '',
      stock: '',
      image: '',
      imageFile: null
    });
  };

  const handleCategoryChange = (nextCategory) => {
    setProductForm((prev) => ({
      ...prev,
      category: nextCategory,
      subCategory: defaultSubCategoryMap[nextCategory] || defaultSubCategoryMap.beauty
    }));
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    const hasImageUrl = !!String(productForm.image || '').trim();
    const hasImageFile = !!productForm.imageFile;
    if (!hasImageUrl && !hasImageFile) {
      setProductActionStatus('');
      setDashboardError('Please provide a product image URL or upload a photo before saving.');
      return;
    }

    setProductActionStatus('Saving product...');
    setDashboardError('');

    const safeImage = productForm.image || '/images/logo.jpeg';
    const selectedSubCategory = subCategoryOptions[productForm.category]?.includes(productForm.subCategory)
      ? productForm.subCategory
      : (defaultSubCategoryMap[productForm.category] || 'skincare');

    const payload = {
      name: productForm.name,
      category: productForm.category,
      subCategory: selectedSubCategory,
      description: productForm.name,
      price: Number(productForm.price),
      discountPrice: Number(productForm.price),
      stock: Number(productForm.stock || 1),
      brand: 'Mafleva',
      rating: 4.8,
      image: safeImage,
      images: [{ url: safeImage }]
    };

    try {
      let response;
      let nextProduct;
      const hasFile = !!productForm.imageFile;

      if (hasFile) {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, value);
            }
          }
        });
        formData.append('image', productForm.imageFile);

        if (productForm.id) {
          response = await fetch(apiBaseUrl + '/api/products/' + productForm.id, {
            method: 'PUT',
            body: formData
          });
        } else {
          response = await fetch(apiBaseUrl + '/api/products', {
            method: 'POST',
            body: formData
          });
        }
      } else {
        if (productForm.id) {
          response = await fetch(apiBaseUrl + '/api/products/' + productForm.id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } else {
          response = await fetch(apiBaseUrl + '/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to save product');
      }

      const result = await response.json();
      nextProduct = result.product || { ...payload, id: productForm.id || Date.now() };
      setProducts((currentProducts) => {
        const updatedProducts = productForm.id
          ? currentProducts.map((p) => (p.id === productForm.id ? normalizeProduct({ ...p, ...nextProduct }) : p))
          : [...currentProducts, normalizeProduct(nextProduct)];

        localStorage.setItem('mafleva_admin_products', JSON.stringify(updatedProducts));
        window.dispatchEvent(new Event('mafleva-products-updated'));
        return updatedProducts;
      });
      setProductActionStatus(productForm.id ? 'Product updated successfully.' : 'Product added successfully.');
      resetProductForm();
    } catch (error) {
      console.error('Error saving product:', error);
      setProductActionStatus('');
      setDashboardError(error.message || 'Product could not be saved to the backend.');
    }
  };

  const editProduct = (product) => {
    setActiveTab('products');
    setProductForm({
      id: product.id,
      name: product.name,
      category: product.category,
      subCategory: product.subCategory || defaultSubCategoryMap[product.category] || defaultSubCategoryMap.beauty,
      price: String(product.price),
      stock: String(product.stock || 0),
      image: product.image || '',
      imageFile: null
    });
  };

  const deleteProduct = async (id) => {
    try {
      setProductActionStatus('Deleting product...');
      setDashboardError('');
      const response = await fetch(apiBaseUrl + '/api/products/' + id, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete product');
      setProducts((currentProducts) => {
        const updatedProducts = currentProducts.filter((p) => p.id !== id);
        localStorage.setItem('mafleva_admin_products', JSON.stringify(updatedProducts));
        window.dispatchEvent(new Event('mafleva-products-updated'));
        return updatedProducts;
      });
      setProductActionStatus('Product deleted successfully.');
      if (productForm.id === id) resetProductForm();
    } catch (error) {
      console.error('Error deleting product:', error);
      setProductActionStatus('');
      setDashboardError('Product could not be deleted from the backend.');
    }
  };

  const uploadProductPhoto = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setProductForm((prev) => ({
      ...prev,
      image: previewUrl,
      imageFile: file
    }));
  };

  const updateOrderStatus = (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const markMessageReplied = (id) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, replied: true } : m)));
  };

  const applyPromoVideo = (e) => {
    e.preventDefault();
    if (!newVideoUrl.trim()) return;
    setPromoVideo(newVideoUrl.trim());
    setNewVideoUrl('');
  };

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#faf7f2', padding: '20px' }}>
        <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '420px', background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 10px 24px rgba(0,0,0,0.08)' }}>
          <h2 style={{ marginTop: 0, color: '#2d3436' }}>Admin Login</h2>
          <p style={{ color: '#6c757d', marginTop: 0 }}>Sign in to manage products, orders, reports, and promotions.</p>

          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Email</label>
          <input
            type="email"
            value={loginForm.email}
            onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '12px' }}
          />

          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Password</label>
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={loginForm.password}
              onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
              required
              style={{ width: '100%', padding: '10px 42px 10px 10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '1.1rem',
                color: '#6c757d'
              }}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {loginError && <div style={{ color: '#e17055', marginBottom: '12px' }}>{loginError}</div>}

          <button type="submit" style={{ width: '100%', padding: '10px 14px', border: 'none', borderRadius: '8px', background: '#ff6b6b', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#faf7f2', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ margin: 0, color: '#2d3436' }}>Admin Dashboard</h1>
          <button onClick={handleLogout} style={{ border: 'none', borderRadius: '8px', background: '#2d3436', color: 'white', padding: '8px 14px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {[
            ['products', 'Products'],
            ['orders', 'Orders'],
            ['messages', 'Messages'],
            ['reports', 'Reports'],
            ['video', 'Promo Video']
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                padding: '8px 14px',
                borderRadius: '999px',
                border: activeTab === id ? 'none' : '1px solid #ddd',
                background: activeTab === id ? '#ff6b6b' : 'white',
                color: activeTab === id ? 'white' : '#2d3436',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'products' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <div style={panelStyle}>
              <h3>Products</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f5f1e8' }}>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Category</th>
                    <th style={thStyle}>Price</th>
                    <th style={thStyle}>Stock</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const stockValue = Number(p.stock || 0);
                    const stockLabel = stockValue <= 0 ? 'Out of stock' : (stockValue <= 5 ? 'Low stock' : 'In stock');
                    const stockBadgeStyle = stockValue <= 0
                      ? { background: '#ffe5e2', color: '#c0392b' }
                      : (stockValue <= 5
                        ? { background: '#fff4dd', color: '#b9770e' }
                        : { background: '#e8f8f1', color: '#1e8449' });

                    return (
                    <tr key={p.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                      <td style={tdStyle}>{p.name}</td>
                      <td style={tdStyle}>{p.category}</td>
                      <td style={tdStyle}>${p.price}</td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span>{stockValue}</span>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '999px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              ...stockBadgeStyle
                            }}
                          >
                            {stockLabel}
                          </span>
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <button type="button" onClick={() => editProduct(p)} style={smallBtn('#0984e3')}>Edit</button>
                        <button type="button" onClick={() => deleteProduct(p.id)} style={smallBtn('#e17055')}>Delete</button>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>

              {productActionStatus && (
                <div style={{ marginTop: '12px', color: '#2d3436', fontWeight: 600 }}>
                  {productActionStatus}
                </div>
              )}
            </div>

            <div style={panelStyle}>
              <h3>{productForm.id ? 'Edit Product' : 'Add Product'}</h3>
              <form onSubmit={saveProduct}>
                <input placeholder="Product name" value={productForm.name} onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))} style={inputStyle} required />
                <select value={productForm.category} onChange={(e) => handleCategoryChange(e.target.value)} style={inputStyle}>
                  <option value="beauty">Beauty</option>
                  <option value="clothing">Clothing</option>
                  <option value="perfumes">Perfumes</option>
                  <option value="health">Health</option>
                </select>

                <select
                  value={productForm.subCategory}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, subCategory: e.target.value }))}
                  style={inputStyle}
                >
                  {(subCategoryOptions[productForm.category] || subCategoryOptions.beauty).map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>

                <input type="number" placeholder="Price" value={productForm.price} onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))} style={inputStyle} required />
                <input type="number" placeholder="Stock" value={productForm.stock} onChange={(e) => setProductForm((prev) => ({ ...prev, stock: e.target.value }))} style={inputStyle} />
                <input
                  placeholder="Image URL"
                  value={productForm.image}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, image: e.target.value }))}
                  style={inputStyle}
                  required={!productForm.imageFile}
                />
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Upload Product Photo</label>
                <input type="file" accept="image/*" onChange={uploadProductPhoto} style={{ marginBottom: '10px' }} />

                {productForm.image && (
                  <img
                    src={productForm.image}
                    alt="Preview"
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', display: 'block', marginBottom: '10px' }}
                  />
                )}

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="submit" style={primaryBtn}>{productForm.id ? 'Update' : 'Add'} Product</button>
                  <button type="button" onClick={resetProductForm} style={secondaryBtn}>Clear</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div style={panelStyle}>
            <h3>Order Management</h3>
            {orders.map((o) => (
              <div key={o.id} style={rowCard}>
                <div>
                  <strong>{o.id}</strong> - {o.customer} - ${o.total}
                  <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>{o.date}</div>
                </div>
                <select value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)} style={{ padding: '8px', borderRadius: '8px' }}>
                  <option>Pending</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'messages' && (
          <div style={panelStyle}>
            <h3>Customer Messages</h3>
            {messages.map((m) => (
              <div key={m.id} style={rowCard}>
                <div>
                  <strong>{m.subject}</strong> by {m.name} ({m.email})
                  <div style={{ color: '#6c757d' }}>{m.text}</div>
                </div>
                <button onClick={() => markMessageReplied(m.id)} style={smallBtn(m.replied ? '#00b894' : '#ff6b6b')}>
                  {m.replied ? 'Replied' : 'Reply'}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reports' && (
          <div style={panelStyle}>
            <h3>Sales Reports</h3>
            <p style={{ margin: '6px 0' }}>Total Revenue: <strong>${activeStats.revenue}</strong></p>
            <p style={{ margin: '6px 0' }}>Total Orders: <strong>{activeStats.orders}</strong></p>
            <p style={{ margin: '6px 0' }}>Average Order Value: <strong>${activeStats.orders ? (activeStats.revenue / activeStats.orders).toFixed(2) : '0.00'}</strong></p>
            <p style={{ margin: '6px 0' }}>Top Product: <strong>{products[0] ? products[0].name : 'N/A'}</strong></p>
            {analyticsSummary && analyticsSummary.orderStatuses && (
              <div style={{ marginTop: '12px' }}>
                <h4 style={{ marginBottom: '8px' }}>Order Status Breakdown</h4>
                {Object.entries(analyticsSummary.orderStatuses).map(([status, count]) => (
                  <div key={status} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f3f3' }}>
                    <span>{status}</span>
                    <strong>{count}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'video' && (
          <div style={panelStyle}>
            <h3>Promotional Video</h3>
            <form onSubmit={applyPromoVideo} style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <input value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} placeholder="Paste video URL or local path" style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
              <button type="submit" style={primaryBtn}>Update Video</button>
            </form>
            <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '10px' }}>
              <video src={promoVideo} controls style={{ width: '100%', borderRadius: '8px' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', minWidth: 0 }}>
      <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>{label}</div>
      <div style={{ color: '#2d3436', fontSize: '1.8rem', fontWeight: 'bold' }}>{value}</div>
    </div>
  );
}

const panelStyle = {
  background: 'white',
  borderRadius: '12px',
  padding: '16px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
};

const thStyle = { padding: '10px', textAlign: 'left', color: '#6c757d' };
const tdStyle = { padding: '10px' };
const rowCard = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '10px',
  border: '1px solid #f0f0f0',
  borderRadius: '10px',
  padding: '10px',
  marginBottom: '10px'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  marginBottom: '10px'
};

const primaryBtn = {
  border: 'none',
  borderRadius: '8px',
  background: '#ff6b6b',
  color: 'white',
  padding: '10px 14px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const secondaryBtn = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  background: 'white',
  color: '#2d3436',
  padding: '10px 14px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const smallBtn = (bg) => ({
  border: 'none',
  borderRadius: '8px',
  background: bg,
  color: 'white',
  padding: '6px 10px',
  marginLeft: '6px',
  cursor: 'pointer'
});

export default AdminDashboard;
