import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatCurrency, resolveCurrencyFromLocale } from '../utils/currency';

function ProductDetail({ onAddToCart, selectedCurrency }) {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-KE';
  const currency = selectedCurrency || resolveCurrencyFromLocale(locale);

  const fallbackProduct = useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('mafleva_admin_products') || '[]');
      if (!Array.isArray(stored)) return null;
      return stored.find((item) => String(item?.id) === String(productId)) || null;
    } catch (err) {
      return null;
    }
  }, [productId]);

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch('http://localhost:5000/api/products/' + productId);

        if (response.ok) {
          const data = await response.json();
          if (isMounted) setProduct(data);
        } else if (fallbackProduct) {
          if (isMounted) setProduct(fallbackProduct);
        } else {
          throw new Error('Product not found');
        }
      } catch (err) {
        if (fallbackProduct) {
          if (isMounted) setProduct(fallbackProduct);
        } else if (isMounted) {
          setError('Product not found.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [productId, fallbackProduct]);

  const imageUrl = product?.image
    || (Array.isArray(product?.images) ? product.images[0]?.url : '')
    || '/images/logo.jpeg';

  if (loading) {
    return (
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 20px' }}>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 20px' }}>
        <p>{error || 'Product not found.'}</p>
        <Link to="/shop" style={{ color: '#ff6b6b', textDecoration: 'none', fontWeight: 'bold' }}>
          Back to shop
        </Link>
      </div>
    );
  }

  const displayName = product.name || product.title || 'Product';
  const displayBrand = product.brand || 'Mafleva';
  const displayPrice = product.discountPrice || product.price || 0;

  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/shop" style={{ color: '#2d3436', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Back to shop
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', alignItems: 'start' }}>
        <div style={{ background: 'white', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', minHeight: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={imageUrl}
            alt={displayName}
            style={{ width: '100%', height: '420px', display: 'block', objectFit: 'contain' }}
            onError={(event) => {
              event.currentTarget.src = '/images/logo.jpeg';
            }}
          />
        </div>

        <div style={{ padding: '10px 0' }}>
          <p style={{ color: '#ff6b6b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {product.category || 'Product'}
          </p>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.2rem', color: '#111111' }}>{displayName}</h1>
          <p style={{ margin: '0 0 18px 0', color: '#6c757d', fontSize: '1.05rem' }}>{displayBrand}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2d3436' }}>
              {formatCurrency(displayPrice, locale, currency)}
            </span>
            {product.discountPrice && product.price && (
              <span style={{ color: '#6c757d', textDecoration: 'line-through', fontSize: '1rem' }}>
                {formatCurrency(product.price, locale, currency)}
              </span>
            )}
          </div>

          <p style={{ color: '#444', lineHeight: 1.8, marginBottom: '20px' }}>
            {product.description || 'Product details are available for this selected item.'}
          </p>

          <div style={{ display: 'grid', gap: '10px', marginBottom: '24px' }}>
            <div><strong>Category:</strong> {product.category || 'N/A'}</div>
            <div><strong>Sub-category:</strong> {product.subCategory || 'N/A'}</div>
            <div><strong>Stock:</strong> {Number(product.stock ?? 0)}</div>
            <div><strong>Rating:</strong> {Number(product.rating || 0).toFixed(1)}</div>
          </div>

          <button
            onClick={() => onAddToCart && onAddToCart({
              id: product.id,
              name: displayName,
              price: displayPrice,
              image: imageUrl,
              category: product.category,
              images: product.images || []
            })}
            style={{
              padding: '12px 22px',
              background: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;