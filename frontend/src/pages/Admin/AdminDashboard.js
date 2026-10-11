import React, { useMemo, useState } from 'react';

const ADMIN_EMAIL = 'admin@mafleva.com';
const ADMIN_PASSWORD = 'admin123';

function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('mf_admin_auth') === '1');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

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

  const [coupons, setCoupons] = useState([
    { id: 1, code: 'WELCOME10', discount: 10, active: true },
    { id: 2, code: 'BEAUTY15', discount: 15, active: true }
  ]);

  const [promoVideo, setPromoVideo] = useState('/videos/Luxury%20Kandura%20Collection.mhtml');
  const [newVideoUrl, setNewVideoUrl] = useState('');

  const [productForm, setProductForm] = useState({
    id: null,
    name: '',
    category: 'beauty',
    price: '',
    stock: '',
    image: ''
  });

  const [couponForm, setCouponForm] = useState({ code: '', discount: '' });

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    return {
      products: products.length,
      orders: orders.length,
      messages: messages.length,
      revenue: totalRevenue
    };
  }, [products, orders, messages]);

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
    setProductForm({ id: null, name: '', category: 'beauty', price: '', stock: '', image: '' });
  };

  const saveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    if (productForm.id) {
      setProducts((prev) => prev.map((p) => (p.id === productForm.id ? { ...productForm, price: Number(productForm.price), stock: Number(productForm.stock || 0) } : p)));
    } else {
      const nextId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
      setProducts((prev) => [...prev, { ...productForm, id: nextId, price: Number(productForm.price), stock: Number(productForm.stock || 0) }]);
    }
    resetProductForm();
  };

  const editProduct = (product) => {
    setActiveTab('products');
    setProductForm({
      id: product.id,
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock || 0),
      image: product.image || ''
    });
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (productForm.id === id) resetProductForm();
  };

  const uploadProductPhoto = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProductForm((prev) => ({ ...prev, image: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const updateOrderStatus = (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const markMessageReplied = (id) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, replied: true } : m)));
  };

  const addCoupon = (e) => {
    e.preventDefault();
    if (!couponForm.code || !couponForm.discount) return;
    const nextId = coupons.length ? Math.max(...coupons.map((c) => c.id)) + 1 : 1;
    setCoupons((prev) => [...prev, { id: nextId, code: couponForm.code.toUpperCase(), discount: Number(couponForm.discount), active: true }]);
    setCouponForm({ code: '', discount: '' });
  };

  const toggleCoupon = (id) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
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
          <input
            type="password"
            value={loginForm.password}
            onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '12px' }}
          />

          {loginError && <div style={{ color: '#e17055', marginBottom: '12px' }}>{loginError}</div>}

          <button type="submit" style={{ width: '100%', padding: '10px 14px', border: 'none', borderRadius: '8px', background: '#ff6b6b', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
            Login
          </button>

          <p style={{ fontSize: '0.85rem', color: '#6c757d', marginTop: '12px' }}>Demo: admin@mafleva.com / admin123</p>
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
            ['overview', 'Overview'],
            ['products', 'Products'],
            ['orders', 'Orders'],
            ['messages', 'Messages'],
            ['reports', 'Reports'],
            ['coupons', 'Coupons'],
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

        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <StatCard label="Total Products" value={stats.products} />
            <StatCard label="Total Orders" value={stats.orders} />
            <StatCard label="Customer Messages" value={stats.messages} />
            <StatCard label="Sales Revenue" value={'$' + stats.revenue} />
          </div>
        )}

        {activeTab === 'products' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                  {products.map((p) => (
                    <tr key={p.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                      <td style={tdStyle}>{p.name}</td>
                      <td style={tdStyle}>{p.category}</td>
                      <td style={tdStyle}>${p.price}</td>
                      <td style={tdStyle}>{p.stock}</td>
                      <td style={tdStyle}>
                        <button onClick={() => editProduct(p)} style={smallBtn('#0984e3')}>Edit</button>
                        <button onClick={() => deleteProduct(p.id)} style={smallBtn('#e17055')}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={panelStyle}>
              <h3>{productForm.id ? 'Edit Product' : 'Add Product'}</h3>
              <form onSubmit={saveProduct}>
                <input placeholder="Product name" value={productForm.name} onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))} style={inputStyle} required />
                <select value={productForm.category} onChange={(e) => setProductForm((prev) => ({ ...prev, category: e.target.value }))} style={inputStyle}>
                  <option value="beauty">Beauty</option>
                  <option value="clothing">Clothing</option>
                  <option value="perfumes">Perfumes</option>
                </select>
                <input type="number" placeholder="Price" value={productForm.price} onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))} style={inputStyle} required />
                <input type="number" placeholder="Stock" value={productForm.stock} onChange={(e) => setProductForm((prev) => ({ ...prev, stock: e.target.value }))} style={inputStyle} />
                <input placeholder="Image URL" value={productForm.image} onChange={(e) => setProductForm((prev) => ({ ...prev, image: e.target.value }))} style={inputStyle} />
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
            <p style={{ margin: '6px 0' }}>Total Revenue: <strong>${stats.revenue}</strong></p>
            <p style={{ margin: '6px 0' }}>Total Orders: <strong>{stats.orders}</strong></p>
            <p style={{ margin: '6px 0' }}>Average Order Value: <strong>${stats.orders ? (stats.revenue / stats.orders).toFixed(2) : '0.00'}</strong></p>
            <p style={{ margin: '6px 0' }}>Top Product: <strong>{products[0] ? products[0].name : 'N/A'}</strong></p>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={panelStyle}>
              <h3>Create Discount Coupon</h3>
              <form onSubmit={addCoupon}>
                <input placeholder="Coupon code" value={couponForm.code} onChange={(e) => setCouponForm((prev) => ({ ...prev, code: e.target.value }))} style={inputStyle} required />
                <input type="number" placeholder="Discount %" value={couponForm.discount} onChange={(e) => setCouponForm((prev) => ({ ...prev, discount: e.target.value }))} style={inputStyle} required />
                <button type="submit" style={primaryBtn}>Add Coupon</button>
              </form>
            </div>
            <div style={panelStyle}>
              <h3>Active Coupons</h3>
              {coupons.map((c) => (
                <div key={c.id} style={rowCard}>
                  <div><strong>{c.code}</strong> - {c.discount}%</div>
                  <button onClick={() => toggleCoupon(c.id)} style={smallBtn(c.active ? '#00b894' : '#6c757d')}>
                    {c.active ? 'Active' : 'Inactive'}
                  </button>
                </div>
              ))}
            </div>
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
    <div style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
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
