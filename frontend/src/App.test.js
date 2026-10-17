import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import Clothing from './pages/Clothing';
import Shop from './pages/Shop';

test('renders a cart page with checkout options', async () => {
  localStorage.setItem(
    'mafleva-cart',
    JSON.stringify([
      {
        id: 'sample-1',
        name: 'Sample Product',
        price: 45,
        quantity: 1,
        image: '/images/logo.jpeg',
        category: 'beauty'
      }
    ])
  );

  window.history.pushState({}, '', '/cart');

  render(<App />);

  expect(
    await screen.findByRole('heading', { name: /your cart/i, level: 1 })
  ).toBeInTheDocument();

  const countrySelect = screen.getByLabelText(/country \/ currency/i);
  expect(screen.getAllByText(/delivery/i).length).toBeGreaterThan(0);

  fireEvent.change(countrySelect, { target: { value: 'US' } });

  expect(countrySelect.value).toBe('US');
  expect(screen.getAllByText(/shipping/i).length).toBeGreaterThan(0);
  expect(screen.getByRole('button', { name: /checkout/i })).toBeInTheDocument();
});

test('renders a dedicated gallery page', async () => {
  window.history.pushState({}, '', '/gallery');

  render(<App />);

  expect(
    await screen.findByRole('heading', { name: /mafleva product gallery/i, level: 1 }, { timeout: 5000 })
  ).toBeInTheDocument();
});

test('shows a floating WhatsApp action and allows channel-specific contact sending', async () => {
  window.history.pushState({}, '', '/contact');

  render(<App />);

  await screen.findByRole('heading', { name: /we’re here to help/i, level: 1 }, { timeout: 5000 });

  const whatsappBubble = await screen.findByRole('link', { name: /chat on whatsapp/i }, { timeout: 5000 });
  expect(whatsappBubble).toHaveAttribute('href', expect.stringContaining('wa.me'));

  const emailChoice = screen.getByRole('radio', { name: /email/i });
  const whatsappChoice = screen.getByRole('radio', { name: /whatsapp/i });

  expect(emailChoice).toBeInTheDocument();
  expect(whatsappChoice).toBeInTheDocument();

  fireEvent.click(whatsappChoice);
  fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: 'Jane Doe' } });
  fireEvent.change(screen.getByLabelText(/your email address/i), { target: { value: 'jane@example.com' } });
  fireEvent.change(screen.getByLabelText(/your message/i), { target: { value: 'Hello Mafleva' } });
  fireEvent.click(screen.getByRole('button', { name: /send message/i }));

  expect(whatsappChoice).toBeChecked();
});

test('renders real clothing products on cards instead of the waiting placeholder', async () => {
  const mockedFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
    json: async () => ({
      products: [
        {
          id: 'uploaded-clothing-1',
          name: 'Custom Shirt',
          category: 'clothing',
          subCategory: 'men',
          price: 120,
          rating: 4.8,
          numReviews: 12,
          brand: 'Mafleva',
          image: 'http://localhost:5000/uploads/test-shirt.jpg',
          images: [{ url: 'http://localhost:5000/uploads/test-shirt.jpg' }]
        }
      ]
    })
  });

  render(
    <HelmetProvider>
      <MemoryRouter>
        <Clothing />
      </MemoryRouter>
    </HelmetProvider>
  );

  expect(await screen.findByText(/custom shirt/i)).toBeInTheDocument();
  expect(screen.queryByText(/waiting for products/i)).not.toBeInTheDocument();

  mockedFetch.mockRestore();
});

test('shows an empty state instead of fallback products after a clothing item is deleted', async () => {
  const mockedFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
    json: async () => ({ products: [] })
  });

  render(
    <HelmetProvider>
      <MemoryRouter>
        <Clothing />
      </MemoryRouter>
    </HelmetProvider>
  );

  expect(await screen.findByText(/no clothing items found/i)).toBeInTheDocument();
  expect(screen.queryByText(/waiting for products/i)).not.toBeInTheDocument();

  mockedFetch.mockRestore();
});

test('does not pad clothing cards with fake filler products to ten items', async () => {
  const mockedFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
    json: async () => ({
      products: [
        {
          id: 'uploaded-clothing-1',
          name: 'Custom Shirt',
          category: 'clothing',
          subCategory: 'men',
          price: 120,
          rating: 4.8,
          numReviews: 12,
          brand: 'Mafleva',
          image: 'http://localhost:5000/uploads/test-shirt.jpg',
          images: [{ url: 'http://localhost:5000/uploads/test-shirt.jpg' }]
        },
        {
          id: 'uploaded-clothing-2',
          name: 'Custom Tee',
          category: 'clothing',
          subCategory: 'men',
          price: 90,
          rating: 4.6,
          numReviews: 7,
          brand: 'Mafleva',
          image: 'http://localhost:5000/uploads/test-tee.jpg',
          images: [{ url: 'http://localhost:5000/uploads/test-tee.jpg' }]
        }
      ]
    })
  });

  render(
    <HelmetProvider>
      <MemoryRouter>
        <Clothing />
      </MemoryRouter>
    </HelmetProvider>
  );

  expect(await screen.findByText(/custom shirt/i)).toBeInTheDocument();
  expect(screen.getByText(/custom tee/i)).toBeInTheDocument();
  expect(screen.queryByText(/men's collection/i)).not.toBeInTheDocument();

  mockedFetch.mockRestore();
});

test('renders one product image and shows stock count without repeating by stock quantity', async () => {
  const mockedFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
    json: async () => ({
      products: [
        {
          id: 'stocked-lotion',
          name: 'Stocked Lotion',
          category: 'beauty',
          subCategory: 'skincare',
          price: 120,
          discountPrice: 100,
          stock: 3,
          rating: 4.7,
          numReviews: 17,
          brand: 'Mafleva',
          image: 'http://localhost:5000/uploads/lotion.jpg',
          images: [{ url: 'http://localhost:5000/uploads/lotion.jpg' }]
        }
      ]
    })
  });

  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/shop?category=beauty']}>
        <Shop onAddToCart={() => {}} selectedCurrency="KES" />
      </MemoryRouter>
    </HelmetProvider>
  );

  expect(await screen.findByText(/stocked lotion/i)).toBeInTheDocument();
  expect(screen.getByText(/stock: 3/i)).toBeInTheDocument();
  expect(screen.getAllByRole('img', { name: /stocked lotion/i })).toHaveLength(1);

  mockedFetch.mockRestore();
});
