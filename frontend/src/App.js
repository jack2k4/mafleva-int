import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import all pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Beauty from './pages/Beauty';
import Clothing from './pages/Clothing';
import PerfumeSubCategory from './pages/PerfumeSubCategory';
import About from './pages/About';
import Contact from './pages/Contact';
import TestimonialsPage from './pages/TestimonialsPage';
import AdminDashboard from './pages/Admin/AdminDashboard';

// Simple Navbar Component
const Navbar = ({ cartCount = 0 }) => {
  return (
    <nav style={{
      background: '#2d3436',
      color: 'white',
      padding: '15px 20px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>
            🛍️ Mafleva International
          </h2>
        </Link>

        <div style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
          <Link to="/shop" style={{ color: 'white', textDecoration: 'none' }}>Shop</Link>
          <Link to="/beauty" style={{ color: 'white', textDecoration: 'none' }}>💄 Beauty</Link>
          <Link to="/clothing" style={{ color: 'white', textDecoration: 'none' }}>👗 Clothing</Link>
          <Link to="/perfumes" style={{ color: 'white', textDecoration: 'none' }}>🌸 Perfumes</Link>
          <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>About</Link>
          <Link to="/testimonials" style={{ color: 'white', textDecoration: 'none' }}>Testimonials</Link>
          <Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</Link>
          <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>👑 Admin</Link>
        </div>
      </div>
    </nav>
  );
};

// Simple Footer
const Footer = () => (
  <footer style={{
    background: '#2d3436',
    color: 'white',
    padding: '20px',
    textAlign: 'center',
    marginTop: '40px'
  }}>
    <p>&copy; 2024 Mafleva International Limited. All rights reserved.</p>
  </footer>
);

function App() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <Router>
      <div className="App">
        <Navbar cartCount={cartCount} />
        <main style={{ minHeight: 'calc(100vh - 200px)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/beauty" element={<Beauty />} />
            <Route path="/clothing" element={<Clothing />} />
            <Route path="/perfumes" element={<PerfumeSubCategory />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
