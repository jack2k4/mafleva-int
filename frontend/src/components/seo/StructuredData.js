import React from 'react';
import { Helmet } from 'react-helmet-async';

const resolveAbsoluteUrl = (value) => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  if (typeof window === 'undefined') return value;
  return new URL(value, window.location.origin).toString();
};

const cleanProductName = (product) => product?.name || product?.title || 'Mafleva Product';

const cleanProductDescription = (product, fallbackDescription) => {
  if (product?.description) return product.description;
  if (product?.category) return `${cleanProductName(product)} from the ${product.category} collection.`;
  return fallbackDescription || `${cleanProductName(product)} available from Mafleva International Limited.`;
};

const normalizeImage = (product) => {
  if (product?.image) return resolveAbsoluteUrl(product.image);
  if (Array.isArray(product?.images) && product.images.length > 0) {
    const image = product.images[0]?.url || product.images[0];
    return resolveAbsoluteUrl(image);
  }
  return '';
};

export const buildCatalogStructuredData = ({
  pageTitle,
  pageDescription,
  pagePath,
  products = [],
  currency = 'KES',
  fallbackDescription
}) => {
  const pageUrl = resolveAbsoluteUrl(pagePath);
  const filteredProducts = products.filter(Boolean).slice(0, 24);

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageTitle,
    description: pageDescription,
    url: pageUrl,
    mainEntity: {
      '@type': 'ItemList',
      name: pageTitle,
      itemListElement: filteredProducts.map((product, index) => {
        const productName = cleanProductName(product);
        const price = Number(product?.discountPrice ?? product?.price ?? 0);
        const image = normalizeImage(product);
        const slug = encodeURIComponent(String(product?.id ?? `${productName}-${index + 1}`));
        const rating = Number(product?.rating);
        const reviewCount = Number(product?.numReviews);

        const productNode = {
          '@type': 'Product',
          '@id': `${pageUrl}#product-${slug}`,
          name: productName,
          description: cleanProductDescription(product, fallbackDescription),
          sku: String(product?.id ?? slug),
          category: product?.category || undefined,
          brand: product?.brand ? { '@type': 'Brand', name: product.brand } : undefined,
          image: image ? [image] : undefined,
          offers: {
            '@type': 'Offer',
            url: `${pageUrl}#product-${slug}`,
            priceCurrency: currency,
            price: Number.isFinite(price) ? price.toFixed(2) : '0.00',
            availability: 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition'
          },
          aggregateRating:
            Number.isFinite(rating) && rating > 0 && Number.isFinite(reviewCount) && reviewCount > 0
              ? {
                  '@type': 'AggregateRating',
                  ratingValue: rating,
                  reviewCount
                }
              : undefined
        };

        return {
          '@type': 'ListItem',
          position: index + 1,
          item: productNode
        };
      })
    }
  };
};

function StructuredData({ data }) {
  if (!data) return null;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}

export default StructuredData;