import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { COUNTRY_OPTIONS, formatCurrency } from '../utils/currency';
import { resolveMediaUrl } from '../utils/resolveMediaUrl';

function CartPage({
  cart = [],
  subtotal = 0,
  onRemove,
  onUpdateQuantity,
  selectedCountry = 'KE',
  selectedCurrency = 'KES',
  onCountryChange,
  onCheckout
}) {
  const [checkoutDetails, setCheckoutDetails] = useState({ fullName: '', email: '', phone: '', address: '' });
  const [checkoutError, setCheckoutError] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-KE';
  const isLocalDelivery = selectedCountry === 'KE';
  const shippingLabel = isLocalDelivery ? 'Delivery' : 'Shipping';
  const shipping = cart.length > 0 ? (isLocalDelivery ? 0 : 12) : 0;
  const total = subtotal + shipping;

  const submitCheckout = async (event) => {
    event.preventDefault();
    setCheckoutError('');
    setCheckingOut(true);
    try {
      await onCheckout({ ...checkoutDetails, address: checkoutDetails.address });
    } catch (error) {
      setCheckoutError(error.message || 'Checkout could not be started. Please try again.');
      setCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '24px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '16px' }}>Your cart</h1>
        <p style={{ color: '#6c757d', marginBottom: '24px' }}>Your cart is empty, but there are beautiful items waiting for you.</p>
        <Link
          to="/shop"
          style={{
            display: 'inline-block',
            background: '#ff6b6b',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '999px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ marginBottom: '24px' }}>Your cart</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ display: 'grid', gap: '16px' }}>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                gap: '20px',
                padding: '20px',
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 2px 12px rgba(17,17,17,0.08)'
              }}
            >
              <img
                src={resolveMediaUrl(item.image || '/images/logo.jpeg')}
                alt={item.name}
                style={{ width: '130px', height: '130px', objectFit: 'cover', borderRadius: '12px' }}
              />

              <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px' }}>{item.name}</h3>
                  <p style={{ margin: '0 0 10px', color: '#6c757d' }}>{item.category}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, -1)}
                      style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}
                    >
                      -
                    </button>
                    <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, 1)}
                      style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '1.1rem' }}>{formatCurrency(item.price * item.quantity, locale, selectedCurrency)}</strong>
                  <button
                    type="button"
                    onClick={() => onRemove && onRemove(item.id)}
                    style={{ border: 'none', background: 'transparent', color: '#d74b4b', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 12px rgba(17,17,17,0.08)', padding: '24px', height: 'fit-content' }}>
          <h2 style={{ marginTop: 0 }}>Order summary</h2>

          <div style={{ marginBottom: '18px' }}>
            <label htmlFor="country-select" style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Country / Currency
            </label>
            <select
              id="country-select"
              value={selectedCountry}
              onChange={(event) => onCountryChange && onCountryChange(event.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #dfe6e9',
                background: '#fff',
                fontSize: '0.95rem'
              }}
            >
              {COUNTRY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.currency})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <div style={{ marginBottom: '8px', fontWeight: '600' }}>Shipping option</div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '999px',
                background: isLocalDelivery ? '#eaf7ef' : '#fdf1e8',
                color: isLocalDelivery ? '#1d6f42' : '#8d5a29',
                fontWeight: '700',
                border: `1px solid ${isLocalDelivery ? '#bfe3c7' : '#f4d8b4'}`
              }}
            >
              {shippingLabel}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span>Subtotal</span>
            <strong>{formatCurrency(subtotal, locale, selectedCurrency)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span>Shipping fee</span>
            <strong>{formatCurrency(shipping, locale, selectedCurrency)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '1.2rem', fontWeight: 'bold' }}>
            <span>Total</span>
            <span>{formatCurrency(total, locale, selectedCurrency)}</span>
          </div>

          <form onSubmit={submitCheckout} style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
            <label htmlFor="checkout-name" style={{ fontWeight: 600 }}>Full name</label>
            <input id="checkout-name" required autoComplete="name" value={checkoutDetails.fullName} onChange={(event) => setCheckoutDetails((current) => ({ ...current, fullName: event.target.value }))} />
            <label htmlFor="checkout-email" style={{ fontWeight: 600 }}>Email address</label>
            <input id="checkout-email" type="email" required autoComplete="email" value={checkoutDetails.email} onChange={(event) => setCheckoutDetails((current) => ({ ...current, email: event.target.value }))} />
            <label htmlFor="checkout-phone" style={{ fontWeight: 600 }}>Phone number</label>
            <input id="checkout-phone" type="tel" required autoComplete="tel" value={checkoutDetails.phone} onChange={(event) => setCheckoutDetails((current) => ({ ...current, phone: event.target.value }))} />
            <label htmlFor="checkout-address" style={{ fontWeight: 600 }}>Delivery address</label>
            <textarea id="checkout-address" required autoComplete="street-address" rows="3" value={checkoutDetails.address} onChange={(event) => setCheckoutDetails((current) => ({ ...current, address: event.target.value }))} />
            {checkoutError && <p role="alert" style={{ color: '#b42318', margin: 0 }}>{checkoutError}</p>}
            <button
              type="submit"
              disabled={checkingOut}
              style={{
                width: '100%',
                padding: '14px 18px',
                background: checkingOut ? '#9ca3af' : '#ff6b6b',
                color: '#fff',
                border: 'none',
                borderRadius: '999px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: checkingOut ? 'wait' : 'pointer'
              }}
            >
              {checkingOut ? 'Opening secure checkout…' : 'Checkout securely'}
            </button>
          </form>

          <Link
            to="/shop"
            style={{
              display: 'block',
              textAlign: 'center',
              marginTop: '16px',
              color: '#111111',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default CartPage;
