import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';
import Reports from './Reports';
import Settings from './Settings';

function AdminDashboard() {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/admin' },
    { id: 'products', label: 'Products', icon: '📦', path: '/admin/products' },
    { id: 'orders', label: 'Orders', icon: '🛒', path: '/admin/orders' },
    { id: 'users', label: 'Users', icon: '👥', path: '/admin/users' },
    { id: 'reports', label: 'Reports', icon: '📈', path: '/admin/reports' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/admin/settings' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Sidebar */}
      <aside style={{
        width: '250px',
        background: '#2d3436',
        color: 'white',
        minHeight: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'auto'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #636e72',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: 0 }}>🛍️ Admin</h2>
        </div>

        <nav style={{ padding: '10px 0' }}>
          {menuItems.map(item => (
            <Link
              key={item.id}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '12px 20px',
                color: '#b2bec3',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                background: window.location.pathname === item.path ? '#ff6b6b' : 'transparent'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #636e72',
          padding: '15px 20px'
        }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            color: '#b2bec3',
            textDecoration: 'none'
          }}>
            <span style={{ fontSize: '1.2rem' }}>🚪</span>
            <span>Back to Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        marginLeft: '250px',
        flex: 1,
        padding: '20px',
        minHeight: '100vh'
      }}>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          minHeight: '80vh'
        }}>
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

// Dashboard Overview Component
function DashboardOverview() {
  return (
    <div>
      <h1 style={{ marginBottom: '20px', color: '#2d3436' }}>Dashboard Overview</h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Total Products</p>
          <h2 style={{ fontSize: '2rem', color: '#ff6b6b' }}>18</h2>
        </div>
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Total Orders</p>
          <h2 style={{ fontSize: '2rem', color: '#0984e3' }}>24</h2>
        </div>
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Total Revenue</p>
          <h2 style={{ fontSize: '2rem', color: '#00b894' }}>,450</h2>
        </div>
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>Total Users</p>
          <h2 style={{ fontSize: '2rem', color: '#6c5ce7' }}>156</h2>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
