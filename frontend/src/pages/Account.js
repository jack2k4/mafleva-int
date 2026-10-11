import React, { useEffect, useState } from 'react';

const STORAGE_KEYS = {
  customers: 'mf_customers',
  session: 'mf_customer_session',
  orders: 'mf_customer_orders'
};

const sampleOrders = (customerName) => [
  {
    id: 'MF-2048',
    date: '2026-09-28',
    status: 'Delivered',
    total: 84.5,
    items: [
      customerName + ' Signature Glow Kit',
      'Mafleva Luxe Body Oil'
    ]
  },
  {
    id: 'MF-1976',
    date: '2026-09-11',
    status: 'Processing',
    total: 129.99,
    items: [
      'Mafleva Classic Casual Fit',
      'Velvet Oud Perfume'
    ]
  }
];

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
    const session = readJson(STORAGE_KEYS.session, null);
    if (!session) {
      return;
    }

    setCurrentCustomer(session);
    setActiveTab('orders');

    const ordersByEmail = readJson(STORAGE_KEYS.orders, {});
    setOrderHistory(ordersByEmail[session.email] || []);
  }, []);

  const syncCustomerSession = (customer) => {
    setCurrentCustomer(customer);
    saveJson(STORAGE_KEYS.session, customer);
    const ordersByEmail = readJson(STORAGE_KEYS.orders, {});
    setOrderHistory(ordersByEmail[customer.email] || []);
    setActiveTab('orders');
  };

  const handleRegister = (event) => {
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

    const customers = readJson(STORAGE_KEYS.customers, []);
    const existingCustomer = customers.find((customer) => customer.email === email);

    if (existingCustomer) {
      setAuthError('An account with that email already exists. Please log in instead.');
      setActiveTab('login');
      return;
    }

    const newCustomer = {
      fullName,
      email,
      password,
      joinedAt: new Date().toISOString()
    };

    const nextCustomers = [...customers, newCustomer];
    saveJson(STORAGE_KEYS.customers, nextCustomers);

    const ordersByEmail = readJson(STORAGE_KEYS.orders, {});
    if (!ordersByEmail[email]) {
      ordersByEmail[email] = sampleOrders(fullName.split(' ')[0] || 'Customer');
      saveJson(STORAGE_KEYS.orders, ordersByEmail);
    }

    const customerSession = { fullName: newCustomer.fullName, email: newCustomer.email, joinedAt: newCustomer.joinedAt };
    syncCustomerSession(customerSession);
    setRegisterForm({ fullName: '', email: '', password: '' });
    setAuthMessage('Your account has been created and you are now signed in.');
  };

  const handleLogin = (event) => {
    event.preventDefault();
    setAuthError('');
    setAuthMessage('');

    const email = loginForm.email.trim().toLowerCase();
    const password = loginForm.password;
    const customers = readJson(STORAGE_KEYS.customers, []);
    const customer = customers.find((entry) => entry.email === email && entry.password === password);

    if (!customer) {
      setAuthError('Invalid email or password.');
      return;
    }

    syncCustomerSession({ fullName: customer.fullName, email: customer.email, joinedAt: customer.joinedAt });
    setLoginForm({ email: '', password: '' });
    setAuthMessage('You are signed in to your Mafleva account.');
  };

  const handleLogout = () => {
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
                            <div style={{ color: '#2d3436', marginTop: '4px', fontWeight: 700 }}>${order.total.toFixed(2)}</div>
                          </div>
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '18px', color: '#5c5248', lineHeight: '1.8' }}>
                          {order.items.map((item) => (
                            <li key={item}>{item}</li>
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
                    'Sign in from any browser on this device and view your saved history.',
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