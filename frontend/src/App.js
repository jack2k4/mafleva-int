import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { COUNTRY_OPTIONS, resolveCurrencyFromLocale } from './utils/currency';

// Import all pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Gallery from './pages/Gallery';
import Beauty from './pages/Beauty';
import Clothing from './pages/Clothing';
import PerfumeSubCategory from './pages/PerfumeSubCategory';
import About from './pages/About';
import Account from './pages/Account';
import Contact from './pages/Contact';
import TestimonialsPage from './pages/TestimonialsPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import CartPage from './pages/Cart';

const Navbar = ({ cartCount = 0 }) => {
  return (
    <nav style={{
      background: '#f3efe7',
      color: '#111111',
      padding: '7px 16px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
      overflow: 'hidden'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        position: 'relative',
        zIndex: 1
      }}>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '50% auto auto 50%',
            transform: 'translate(-50%, -50%)',
            width: '230px',
            maxWidth: '32vw',
            pointerEvents: 'none',
            userSelect: 'none',
            opacity: 0.14
          }}
        >
          <img
            src="/images/logo.jpeg"
            alt=""
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              filter: 'grayscale(100%) contrast(1) brightness(0.98)'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img
              src="/images/logo.jpeg"
              alt="Mafleva International logo"
              style={{
                width: '138px',
                maxWidth: '60vw',
                height: 'auto',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </Link>
        </div>

        <div style={{
          display: 'flex',
          gap: '14px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <Link to="/" style={{ color: '#111111', textDecoration: 'none' }}>Home</Link>
          <Link to="/shop" style={{ color: '#111111', textDecoration: 'none' }}>Shop</Link>
          <Link to="/about" style={{ color: '#111111', textDecoration: 'none' }}>About</Link>
          <Link to="/gallery" style={{ color: '#111111', textDecoration: 'none' }}>Gallery</Link>
          <Link to="/testimonials" style={{ color: '#111111', textDecoration: 'none' }}>Testimonials</Link>
          <Link to="/contact" style={{ color: '#111111', textDecoration: 'none' }}>Contact</Link>
          <Link to="/account" style={{ color: '#111111', textDecoration: 'none' }}>Account</Link>
          <Link to="/admin" style={{ color: '#111111', textDecoration: 'none' }}>👑 Admin</Link>
          <Link to="/cart" style={{ color: '#111111', textDecoration: 'none', position: 'relative', fontWeight: 700 }}>
            Cart
            {cartCount > 0 && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '18px',
                height: '18px',
                borderRadius: '999px',
                background: '#ff6b6b',
                color: 'white',
                fontSize: '10px',
                marginLeft: '6px',
                padding: '0 5px'
              }}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

const paymentMethods = ['M-Pesa', 'Airtel Money', 'Visa', 'Mastercard', 'PayPal', 'Stripe'];
const socialLinks = [
  { name: 'Facebook', url: 'https://facebook.com/maflevainternational', icon: 'f' },
  { name: 'Instagram', url: 'https://instagram.com/maflevainternational', icon: '◎' },
  { name: 'TikTok', url: 'https://tiktok.com/@maflevainternational', icon: '♪' },
  { name: 'Threads', url: 'https://www.threads.net/@maflevainternational', icon: '◌' },
  { name: 'X', url: 'https://x.com/maflevainternational', icon: 'X' }
];

const FloatingWhatsAppButton = () => (
  <a
    href="https://wa.me/254700123456?text=Hello%20Mafleva%20International%2C%20I%20would%20like%20to%20learn%20more%20about%20your%20products."
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    title="Chat on WhatsApp"
    style={{
      position: 'fixed',
      right: '22px',
      bottom: '24px',
      width: '62px',
      height: '62px',
      borderRadius: '50%',
      background: '#25d366',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 12px 30px rgba(37, 211, 102, 0.35)',
      fontSize: '1.8rem',
      zIndex: 1200,
      textDecoration: 'none'
    }}
  >
    💬
  </a>
);

const Footer = () => (
  <footer style={{
    background: '#f3efe7',
    color: '#111111',
    padding: '32px 20px 18px',
    marginTop: '40px',
    borderTop: '1px solid rgba(17,17,17,0.08)'
  }}>
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '24px',
      alignItems: 'start'
    }}>
      <div>
        <h3 style={{ marginBottom: '12px' }}>Mafleva International</h3>
        <p style={{ color: '#4b5563', lineHeight: 1.7, margin: 0 }}>
          Premium beauty, wellness, fashion, and fragrance products for shoppers across Kenya and the world.
        </p>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px' }}>Payment Methods</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {paymentMethods.map((method) => (
            <span
              key={method}
              style={{
                background: '#ffffff',
                border: '1px solid rgba(17,17,17,0.08)',
                color: '#111111',
                padding: '6px 10px',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              {method}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px' }}>Follow Us</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              title={social.name}
              style={{
                width: '34px',
                height: '34px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: '#111111',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </div>

    <div style={{
      borderTop: '1px solid rgba(17,17,17,0.08)',
      marginTop: '24px',
      paddingTop: '16px',
      textAlign: 'center',
      fontSize: '0.9rem',
      color: '#4b5563'
    }}>
      <p>&copy; 2026 Mafleva International Limited. All rights reserved.</p>
    </div>
  </footer>
);

function App() {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('mafleva-cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      return [];
    }
  });

  const getDefaultCountry = () => {
    try {
      const savedCountry = localStorage.getItem('mafleva-country');
      if (savedCountry) {
        return savedCountry;
      }
    } catch (error) {
      // ignore storage issues and fall back to Kenya default
    }

    return 'KE';
  };

  const [selectedCountry, setSelectedCountry] = useState(() => {
    try {
      const savedCountry = localStorage.getItem('mafleva-country');
      return savedCountry || getDefaultCountry();
    } catch (error) {
      return getDefaultCountry();
    }
  });

  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    try {
      const savedCurrency = localStorage.getItem('mafleva-currency');
      return savedCurrency || 'KES';
    } catch (error) {
      return 'KES';
    }
  });

  useEffect(() => {
    localStorage.setItem('mafleva-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const match = COUNTRY_OPTIONS.find((option) => option.value === selectedCountry);
    const nextCurrency = match ? match.currency : resolveCurrencyFromLocale();
    setSelectedCurrency(nextCurrency);
    localStorage.setItem('mafleva-country', selectedCountry);
    localStorage.setItem('mafleva-currency', nextCurrency);
  }, [selectedCountry]);

  const addToCart = (product) => {
    if (!product) return;

    const productId = String(product.id ?? product._id ?? `${product.name}-${Math.random()}`);
    const normalizedProduct = {
      id: productId,
      name: product.name || product.title || 'Mafleva Product',
      price: Number(product.discountPrice ?? product.price ?? 0),
      image: product.image || product.images?.[0]?.url || '/images/logo.jpeg',
      category: product.category || 'general'
    };

    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === productId);

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...currentCart, { ...normalizedProduct, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart((currentCart) =>
      currentCart.flatMap((item) => {
        if (item.id !== productId) return [item];

        const nextQuantity = item.quantity + delta;
        return nextQuantity > 0 ? [{ ...item, quantity: nextQuantity }] : [];
      })
    );
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Router>
      <div className="App">
        <Navbar cartCount={cartCount} />
        <FloatingWhatsAppButton />
        <main style={{ minHeight: 'calc(100vh - 200px)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop onAddToCart={addToCart} selectedCurrency={selectedCurrency} />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/health" element={<Shop defaultCategory="health" onAddToCart={addToCart} selectedCurrency={selectedCurrency} />} />
            <Route path="/beauty" element={<Beauty />} />
            <Route path="/clothing" element={<Clothing />} />
            <Route path="/perfumes" element={<PerfumeSubCategory />} />
            <Route path="/about" element={<About />} />
            <Route path="/account" element={<Account />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route
              path="/cart"
              element={
                <CartPage
                  cart={cart}
                  subtotal={subtotal}
                  onRemove={removeFromCart}
                  onUpdateQuantity={updateQuantity}
                  selectedCountry={selectedCountry}
                  selectedCurrency={selectedCurrency}
                  onCountryChange={setSelectedCountry}
                />
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
