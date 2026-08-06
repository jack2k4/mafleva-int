import React from 'react';

function AdminDashboard() {
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center',
      backgroundColor: '#f8f9fa',
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '500px',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#ff6b6b', fontSize: '3rem' }}>✅ Admin Works!</h1>
        <p>React Router is now installed and working.</p>
        <div style={{ marginTop: '20px' }}>
          <a href="/" style={{ 
            padding: '10px 20px', 
            background: '#2d3436', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '5px' 
          }}>
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
