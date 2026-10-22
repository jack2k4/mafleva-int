import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

const STORAGE_KEYS = {
  session: 'mf_customer_session'
};

const readJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
};

const saveJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

function Account() {
  const [activeTab, setActiveTab] = useState('register');
  const [registerForm, setRegisterForm] = useState({ fullName: '', email: '', password: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [authMessage, setAuthMessage] = useState('');
  const [authError, setAuthError] = useState('');
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    localStorage.removeItem('mf_customers');
    localStorage.removeItem('mf_customer_orders');
    fetch(`${API_BASE_URL}/api/customers/me`, { credentials: 'include' }).then(async (customerResponse) => {
      if (!customerResponse.ok) {
        localStorage.removeItem(STORAGE_KEYS.session);
        return;
      }
      const customerData = await customerResponse.json();
      const ordersResponse = await fetch(`${API_BASE_URL}/api/customers/orders`, { credentials: 'include' });
      const ordersData = ordersResponse.ok ? await ordersResponse.json() : { orders: [] };
      setCurrentCustomer(customerData.customer);
      setOrderHistory(ordersData.orders || []);
      setActiveTab('orders');
      saveJson(STORAGE_KEYS.session, customerData.customer);
    }).catch(() => {});
  }, []);

  const syncCustomerSession = async (customer) => {
    setCurrentCustomer(customer);
    saveJson(STORAGE_KEYS.session, customer);
    const response = await fetch(`${API_BASE_URL}/api/customers/orders`, {
      credentials: 'include'
    });
    const data = await response.json();
    setOrderHistory(response.ok ? data.orders || [] : []);
    setActiveTab('orders');
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setAuthError('');
    setAuthMessage('');

    const fullName = registerForm.fullName.trim();
    const email = registerForm.email.trim().toLowerCase();
    const password = registerForm.password;

    if (!fullName || !email || !password) {
      setAuthError('Please complete all registration fields.');
      return;
    }

    if (password.length < 12) {
      setAuthError('Use a password with at least 12 characters.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/customers/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not create your account.');
      await syncCustomerSession(data.customer);
      setRegisterForm({ fullName: '', email: '', password: '' });
      setAuthMessage('Your account has been created and you are now signed in.');
    } catch (error) {
      setAuthError(error.message || 'Could not connect to the account service.');
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setAuthError('');
    setAuthMessage('');

    const email = loginForm.email.trim().toLowerCase();
    const password = loginForm.password;
    try {
      const response = await fetch(`${API_BASE_URL}/api/customers/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Invalid email or password.');
      await syncCustomerSession(data.customer);
      setLoginForm({ email: '', password: '' });
      setAuthMessage('You are signed in to your Mafleva account.');
    } catch (error) {
      setAuthError(error.message || 'Could not connect to the account service.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/customers/logout`, { method: 'POST', credentials: 'include' });
    } catch (error) {
      // Clear the local view even when the API is unavailable.
    }
    localStorage.removeItem(STORAGE_KEYS.session);
    setCurrentCustomer(null);
    setOrderHistory([]);
    setActiveTab('login');
    setAuthMessage('You have been signed out.');
    setAuthError('');
  };

  const panelStyle = {
    background: '#fffaf4',
    borderRadius: '20px',
    border: '1px solid rgba(142, 104, 71, 0.12)',
    boxShadow: '0 12px 28px rgba(58, 41, 29, 0.08)',
    padding: '28px'
  };

  return (
    <div style={{ background: '#f7f1e7', minHeight: '100vh', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ ...panelStyle, marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              right: '-30px',
              top: '-20px',
              width: '210px',
              opacity: 0.09,
              pointerEvents: 'none'
            }}
          >
            <img src="/images/logo.jpeg" alt="" style={{ width: '100%', display: 'block' }} />
          </div>
          <p style={{ margin: 0, color: '#8e6847', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.8rem' }}>
            Customer account
          </p>
          <h1 style={{ color: '#2d3436', fontSize: 'clamp(2.2rem, 4vw, 3.6rem)', margin: '12px 0 12px', fontWeight: 700 }}>
            Register, sign in, and track your Mafleva orders
          </h1>
          <p style={{ maxWidth: '720px', color: '#5c5248', lineHeight: '1.8', margin: 0 }}>
            Create your customer account to keep your details in one place, return to your favorites faster, and review your order history whenever you need it.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 360px) minmax(0, 1fr)', gap: '24px' }}>
          <div style={panelStyle}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '22px', flexWrap: 'wrap' }}>
              {['register', 'login', 'orders'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '999px',
                    border: activeTab === tab ? 'none' : '1px solid rgba(142, 104, 71, 0.18)',
                    background: activeTab === tab ? '#8e6847' : '#f7f1e7',
                    color: activeTab === tab ? 'white' : '#5c5248',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {authMessage && <div style={{ marginBottom: '14px', padding: '12px 14px', borderRadius: '12px', background: '#e8f4ea', color: '#2f6b3b' }}>{authMessage}</div>}
            {authError && <div style={{ marginBottom: '14px', padding: '12px 14px', borderRadius: '12px', background: '#fdeaea', color: '#a94442' }}>{authError}</div>}

            {activeTab === 'register' && (
              <form onSubmit={handleRegister}>
                <h2 style={{ margin: '0 0 10px', color: '#2d3436' }}>Create your account</h2>
                <p style={{ color: '#6c757d', marginTop: 0, marginBottom: '16px', lineHeight: '1.7' }}>Register once and use the same details to sign in whenever you come back.</p>
                <label style={{ display: 'block', marginBottom: '6px', color: '#5c5248', fontWeight: 600 }}>Full name</label>
                <input
                  type="text"
                  value={registerForm.fullName}
                  onChange={(event) => setRegisterForm((prev) => ({ ...prev, fullName: event.target.value }))}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '14px' }}
                />
                <label style={{ display: 'block', marginBottom: '6px', color: '#5c5248', fontWeight: 600 }}>Email address</label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(event) => setRegisterForm((prev) => ({ ...prev, email: event.target.value }))}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '14px' }}
                />
                <label style={{ display: 'block', marginBottom: '6px', color: '#5c5248', fontWeight: 600 }}>Password</label>
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(event) => setRegisterForm((prev) => ({ ...prev, password: event.target.value }))}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '18px' }}
                />
                <button type="submit" style={{ width: '100%', padding: '12px 18px', border: 'none', borderRadius: '999px', background: '#8e6847', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
                  Register account
                </button>
              </form>
            )}

            {activeTab === 'login' && (
              <form onSubmit={handleLogin}>
                <h2 style={{ margin: '0 0 10px', color: '#2d3436' }}>Sign in</h2>
                <p style={{ color: '#6c757d', marginTop: 0, marginBottom: '16px', lineHeight: '1.7' }}>Access your account details and review your previous Mafleva orders.</p>
                <label style={{ display: 'block', marginBottom: '6px', color: '#5c5248', fontWeight: 600 }}>Email address</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '14px' }}
                />
                <label style={{ display: 'block', marginBottom: '6px', color: '#5c5248', fontWeight: 600 }}>Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '18px' }}
                />
                <button type="submit" style={{ width: '100%', padding: '12px 18px', border: 'none', borderRadius: '999px', background: '#2d3436', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
                  Login
                </button>
              </form>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 style={{ margin: '0 0 10px', color: '#2d3436' }}>Order history</h2>
                {!currentCustomer ? (
                  <p style={{ color: '#6c757d', lineHeight: '1.7', margin: 0 }}>Please sign in to view your order history.</p>
                ) : (
                  <>
                    <p style={{ color: '#6c757d', lineHeight: '1.7', marginTop: 0 }}>Signed in as <strong>{currentCustomer.fullName}</strong>.</p>
                    <button onClick={handleLogout} style={{ padding: '10px 18px', border: '1px solid rgba(142, 104, 71, 0.18)', borderRadius: '999px', background: '#fff', color: '#5c5248', fontWeight: 700, cursor: 'pointer' }}>
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div style={panelStyle}>
            {currentCustomer ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '22px' }}>
                  <div>
                    <h2 style={{ margin: '0 0 8px', color: '#2d3436' }}>Welcome back, {currentCustomer.fullName}</h2>
                    <p style={{ margin: 0, color: '#6c757d' }}>{currentCustomer.email}</p>
                  </div>
                  <div style={{ padding: '14px 18px', background: '#f7f1e7', borderRadius: '16px', minWidth: '180px' }}>
                    <div style={{ color: '#8e6847', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Member since</div>
                    <strong style={{ color: '#2d3436' }}>{new Date(currentCustomer.joinedAt).toLocaleDateString()}</strong>
                  </div>
                </div>

                {orderHistory.length === 0 ? (
                  <div style={{ padding: '22px', borderRadius: '16px', background: '#f7f1e7', color: '#5c5248' }}>
                    You do not have any orders yet.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {orderHistory.map((order) => (
                      <div key={order.id} style={{ border: '1px solid rgba(142, 104, 71, 0.12)', borderRadius: '18px', padding: '20px', background: '#fffdfb' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '10px' }}>
                          <div>
                            <strong style={{ color: '#2d3436' }}>Order {order.id}</strong>
                            <div style={{ color: '#6c757d', marginTop: '4px' }}>{new Date(order.date).toLocaleDateString()}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ color: '#8e6847', fontWeight: 700 }}>{order.status}</div>
                            <div style={{ color: '#2d3436', marginTop: '4px', fontWeight: 700 }}>{order.currency} {Number(order.total).toFixed(2)}</div>
                          </div>
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '18px', color: '#5c5248', lineHeight: '1.8' }}>
                          {order.items.map((item) => (
                            <li key={item.productId || item.name}>{item.quantity} × {item.name}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={{ padding: '10px 0' }}>
                <h2 style={{ marginTop: 0, color: '#2d3436' }}>Your account benefits</h2>
                <div style={{ display: 'grid', gap: '14px' }}>
                  {[
                    'Register once and keep your details ready for future orders.',
                    'Sign in securely from any browser and view your order history.',
                    'Track past purchases in one place with status and item summaries.'
                  ].map((text) => (
                    <div key={text} style={{ padding: '16px 18px', background: '#f7f1e7', borderRadius: '16px', color: '#5c5248', lineHeight: '1.7' }}>
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
