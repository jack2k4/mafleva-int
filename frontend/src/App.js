import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import './App.css';
import { COUNTRY_OPTIONS, resolveCurrencyFromLocale } from './utils/currency';

// Import all pages lazily to reduce the initial bundle size.
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Gallery = lazy(() => import('./pages/Gallery'));
const About = lazy(() => import('./pages/About'));
const Account = lazy(() => import('./pages/Account'));
const Contact = lazy(() => import('./pages/Contact'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const CartPage = lazy(() => import('./pages/Cart'));

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
  { name: 'Facebook', url: 'https://www.facebook.com/share/1JC9Kzb4eU/', icon: 'f' },
  { name: 'Instagram', url: 'https://www.instagram.com/mafleva?psln=Y3p4a2d2OGlpcnIz', icon: '◎' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@maflevaint?_r=1&_t=ZS-9AUH9ffdiQI', icon: '♪' },
  { name: 'Threads', url: 'https://www.threads.com/@mafleva', icon: '◌' },
  { name: 'X', url: 'https://x.com/maflevaint', icon: 'X' }
];

const seoDefaults = {
  title: 'Mafleva International Limited',
  description: 'Mafleva International Limited offers premium beauty, wellness, clothing, and fragrance products for shoppers in Kenya and beyond.',
  canonical: '/',
  keywords: 'Mafleva International, beauty products, clothing, perfumes, health products, Kenyan ecommerce, online store',
  robots: 'index,follow'
};

const seoPages = {
  '/': {
    title: 'Mafleva International Limited | Beauty, Clothing, Perfumes & Health',
    description: 'Shop premium beauty, clothing, perfumes, and health essentials from Mafleva International Limited. Discover quality products and convenient shopping.',
    canonical: '/',
    robots: 'index,follow'
  },
  '/shop': {
    title: 'Shop Products | Mafleva International Limited',
    description: 'Browse all Mafleva International products, including beauty, clothing, perfumes, and wellness essentials.',
    canonical: '/shop',
    robots: 'index,follow'
  },
  '/beauty': {
    title: 'Beauty Collection | Mafleva International Limited',
    description: 'Explore skincare, makeup, haircare, herbal, and oils products in the Mafleva beauty collection.',
    canonical: '/beauty',
    robots: 'index,follow'
  },
  '/clothing': {
    title: 'Clothing Collection | Mafleva International Limited',
    description: 'Shop stylish men, women, and kids clothing from the Mafleva International fashion range.',
    canonical: '/clothing',
    robots: 'index,follow'
  },
  '/perfumes': {
    title: 'Perfumes Collection | Mafleva International Limited',
    description: 'Discover branded, niche, and signature fragrances for men, women, and unisex styles.',
    canonical: '/perfumes',
    robots: 'index,follow'
  },
  '/health': {
    title: 'Health & Wellness | Mafleva International Limited',
    description: 'Find trusted health and wellness essentials for everyday care and support.',
    canonical: '/health',
    robots: 'index,follow'
  },
  '/gallery': {
    title: 'Gallery | Mafleva International Limited',
    description: 'See Mafleva International Limited products and brand imagery across beauty, fashion, fragrances, and wellness.',
    canonical: '/gallery',
    robots: 'index,follow'
  },
  '/testimonials': {
    title: 'Customer Testimonials | Mafleva International Limited',
    description: 'Read customer testimonials and feedback about Mafleva International Limited products and service.',
    canonical: '/testimonials',
    robots: 'index,follow'
  },
  '/about': {
    title: 'About Mafleva International Limited',
    description: 'Learn about Mafleva International Limited and the products, values, and service behind the brand.',
    canonical: '/about',
    robots: 'index,follow'
  },
  '/contact': {
    title: 'Contact Mafleva International Limited',
    description: 'Reach out to Mafleva International Limited for product inquiries, support, and business questions.',
    canonical: '/contact',
    robots: 'index,follow'
  },
  '/account': {
    title: 'Account | Mafleva International Limited',
    description: 'Manage your Mafleva International Limited customer account settings and details.',
    canonical: '/account',
    robots: 'noindex,nofollow'
  },
  '/cart': {
    title: 'Cart | Mafleva International Limited',
    description: 'Review your Mafleva International Limited cart items before checkout.',
    canonical: '/cart',
    robots: 'noindex,nofollow'
  },
  '/admin': {
    title: 'Admin Dashboard | Mafleva International Limited',
    description: 'Administrative dashboard for Mafleva International Limited.',
    canonical: '/admin',
    robots: 'noindex,nofollow'
  }
};

const FloatingWhatsAppButton = () => (
  <a
    href="https://wa.me/254772688023?text=Hello%20Mafleva%20International%20Limited"
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

  const getProductStock = (product) => Number(product?.stock ?? product?.inventory ?? 1);

  const syncProductStock = (productId, nextStock) => {
    try {
      const storedProducts = JSON.parse(localStorage.getItem('mafleva_admin_products') || '[]');
      if (!Array.isArray(storedProducts) || storedProducts.length === 0) return;

      const updatedProducts = storedProducts
        .map((item) => (String(item.id) === String(productId) ? { ...item, stock: Number(nextStock ?? 0) } : item))
        .filter((item) => Number(item.stock ?? 1) > 0);

      localStorage.setItem('mafleva_admin_products', JSON.stringify(updatedProducts));
      window.dispatchEvent(new Event('mafleva-products-updated'));
    } catch (error) {
      // Ignore storage sync errors and keep the storefront available.
    }
  };

  const addToCart = (product) => {
    if (!product) return;

    const productId = String(product.id ?? product._id ?? `${product.name}-${Math.random()}`);
    const productStock = getProductStock(product);

    if (productStock <= 0) {
      return;
    }

    const normalizedProduct = {
      id: productId,
      name: product.name || product.title || 'Mafleva Product',
      price: Number(product.discountPrice ?? product.price ?? 0),
      image: product.image || product.images?.[0]?.url || '/images/logo.jpeg',
      category: product.category || 'general',
      stock: productStock
    };

    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === productId);
      const nextQuantity = existingItem ? existingItem.quantity + 1 : 1;

      if (nextQuantity > productStock) {
        return currentCart;
      }

      const nextCart = existingItem
        ? currentCart.map((item) =>
            item.id === productId ? { ...item, quantity: nextQuantity } : item
          )
        : [...currentCart, { ...normalizedProduct, quantity: 1 }];

      syncProductStock(productId, Math.max(productStock - nextQuantity, 0));
      return nextCart;
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
  const defaultSeo = useMemo(() => seoDefaults, []);

  return (
    <HelmetProvider>
      <Router>
        <SEOManager defaultSeo={defaultSeo} />
        <div className="App">
          <Navbar cartCount={cartCount} />
          <FloatingWhatsAppButton />
          <main style={{ minHeight: 'calc(100vh - 200px)' }}>
            <Suspense fallback={<RouteLoading />}> 
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop onAddToCart={addToCart} selectedCurrency={selectedCurrency} />} />
                <Route path="/product/:productId" element={<ProductDetail onAddToCart={addToCart} selectedCurrency={selectedCurrency} />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/health" element={<Navigate to="/shop" replace />} />
                <Route path="/beauty" element={<Navigate to="/shop" replace />} />
                <Route path="/clothing" element={<Navigate to="/shop" replace />} />
                <Route path="/perfumes" element={<Navigate to="/shop" replace />} />
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
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

const SEOManager = ({ defaultSeo }) => {
  const location = useLocation();
  const pageSeo = seoPages[location.pathname] || {};
  const mergedSeo = { ...defaultSeo, ...pageSeo };
  const canonicalUrl = `${window.location.origin}${mergedSeo.canonical || location.pathname}`;

  return (
    <Helmet>
      <title>{mergedSeo.title}</title>
      <meta name="description" content={mergedSeo.description} />
      <meta name="keywords" content={mergedSeo.keywords} />
      <meta name="robots" content={mergedSeo.robots} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Mafleva International Limited" />
      <meta property="og:title" content={mergedSeo.title} />
      <meta property="og:description" content={mergedSeo.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content="/images/logo.jpeg" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={mergedSeo.title} />
      <meta name="twitter:description" content={mergedSeo.description} />
      <meta name="twitter:image" content="/images/logo.jpeg" />
    </Helmet>
  );
};

const RouteLoading = () => (
  <div style={{ minHeight: '50vh', display: 'grid', placeItems: 'center', color: '#6c757d', fontWeight: 600 }}>
    Loading page...
  </div>
);

export default App;
