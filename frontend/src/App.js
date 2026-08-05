import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation */}
        <nav style={{
          background: '#2d3436',
          color: 'white',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
            🛍️ Mafleva International Limited
          </h2>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
            <Link to="/shop" style={{ color: 'white', textDecoration: 'none' }}>Shop</Link>
            <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>About</Link>
            <Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</Link>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

        {/* Footer */}
        <footer style={{
          background: '#2d3436',
          color: 'white',
          padding: '20px',
          textAlign: 'center',
          marginTop: '40px'
        }}>
          <p>&copy; 2024 Mafleva International Limited. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
