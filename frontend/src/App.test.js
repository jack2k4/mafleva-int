import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

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

  expect(await screen.findByRole('heading', { name: /mafleva product gallery/i })).toBeInTheDocument();
});

test('shows a floating WhatsApp action and allows channel-specific contact sending', async () => {
  window.history.pushState({}, '', '/contact');

  render(<App />);

  const whatsappBubble = await screen.findByRole('link', { name: /chat on whatsapp/i });
  expect(whatsappBubble).toHaveAttribute('href', expect.stringContaining('wa.me'));

  const emailChoice = screen.getByLabelText(/send via email/i);
  const whatsappChoice = screen.getByLabelText(/send via whatsapp/i);

  expect(emailChoice).toBeInTheDocument();
  expect(whatsappChoice).toBeInTheDocument();

  fireEvent.click(whatsappChoice);
  fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: 'Jane Doe' } });
  fireEvent.change(screen.getByLabelText(/your email address/i), { target: { value: 'jane@example.com' } });
  fireEvent.change(screen.getByLabelText(/your message/i), { target: { value: 'Hello Mafleva' } });
  fireEvent.click(screen.getByRole('button', { name: /send message/i }));

  expect(whatsappChoice).toBeChecked();
});
