import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import Admin
import AdminDashboard from './pages/Admin/AdminDashboard';

// Simple Home Component
const Home = () => (
  <div style={{ padding: '50px', textAlign: 'center' }}>
    <h1>🛍️ Mafleva International</h1>
    <p>Welcome to our e-commerce platform!</p>
    <Link to="/admin" style={{ 
      padding: '10px 20px', 
      background: '#ff6b6b', 
      color: 'white', 
      textDecoration: 'none', 
      borderRadius: '5px',
      display: 'inline-block',
      marginTop: '20px'
    }}>
      Go to Admin
    </Link>
  </div>
);

// Simple Navbar
const Navbar = () => (
  <nav style={{ 
    background: '#2d3436', 
    color: 'white', 
    padding: '15px 20px', 
    display: 'flex', 
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <h2 style={{ margin: 0 }}>🛍️ Mafleva</h2>
    <div style={{ display: 'flex', gap: '20px' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
      <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>👑 Admin</Link>
    </div>
  </nav>
);

function App() {
  console.log('App is rendering');
  
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
