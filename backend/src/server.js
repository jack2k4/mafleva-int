const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// DATA: Products
// ============================================

let products = [
  // ========== BEAUTY - SKINCARE ==========
  {
    id: 1,
    name: 'Luxury Face Cream',
    price: 45.99,
    discountPrice: 39.99,
    category: 'beauty',
    subCategory: 'skincare',
    brand: 'GlowLab',
    rating: 4.8,
    numReviews: 127,
    stock: 50,
    description: 'Premium moisturizing face cream with natural ingredients for glowing skin.',
    images: [{ url: 'https://via.placeholder.com/300x300/ff6b6b/ffffff?text=Face+Cream' }],
    ingredients: ['Shea Butter', 'Vitamin E', 'Aloe Vera', 'Hyaluronic Acid']
  },
  {
    id: 2,
    name: 'Organic Vitamin C Serum',
    price: 34.99,
    discountPrice: 29.99,
    category: 'beauty',
    subCategory: 'skincare',
    brand: 'PureNature',
    rating: 4.7,
    numReviews: 156,
    stock: 60,
    description: 'Vitamin C serum for brightening and evening skin tone.',
    images: [{ url: 'https://via.placeholder.com/300x300/fdcb6e/ffffff?text=Vitamin+C' }],
    ingredients: ['Vitamin C', 'Hyaluronic Acid', 'Vitamin E']
  },
  // ========== BEAUTY - HERBAL ==========
  {
    id: 101,
    name: 'Herbal Face Wash',
    price: 24.99,
    discountPrice: 19.99,
    category: 'beauty',
    subCategory: 'herbal',
    brand: 'HerbalGlow',
    rating: 4.6,
    numReviews: 89,
    stock: 45,
    description: 'Gentle herbal face wash with natural ingredients for daily cleansing.',
    images: [{ url: 'https://via.placeholder.com/300x300/00b894/ffffff?text=Herbal+Face+Wash' }],
    ingredients: ['Neem', 'Turmeric', 'Aloe Vera', 'Rose Water']
  },
  // ========== BEAUTY - OILS ==========
  {
    id: 201,
    name: 'Argan Oil',
    price: 39.99,
    discountPrice: 34.99,
    category: 'beauty',
    subCategory: 'oils',
    brand: 'PureOils',
    rating: 4.9,
    numReviews: 156,
    stock: 55,
    description: 'Pure Moroccan Argan Oil for hair and skin nourishment.',
    images: [{ url: 'https://via.placeholder.com/300x300/fdcb6e/ffffff?text=Argan+Oil' }],
    ingredients: ['100% Pure Argan Oil']
  },
  // ========== PERFUMES - MEN ==========
  {
    id: 401,
    name: 'Men Classic Eau de Toilette',
    price: 79.99,
    discountPrice: 69.99,
    category: 'perfumes',
    subCategory: 'men',
    brand: 'Luxury Scents',
    rating: 4.8,
    numReviews: 89,
    stock: 30,
    description: 'Classic fragrance for men with woody and spicy notes.',
    images: [{ url: 'https://via.placeholder.com/300x300/2d3436/ffffff?text=Men+Perfume' }],
    fragranceNotes: ['Cedarwood', 'Bergamot', 'Sandalwood', 'Patchouli'],
    volume: '100ml'
  },
  // ========== PERFUMES - WOMEN ==========
  {
    id: 501,
    name: 'Women Floral Dream',
    price: 89.99,
    discountPrice: 79.99,
    category: 'perfumes',
    subCategory: 'women',
    brand: 'Luxury Scents',
    rating: 4.9,
    numReviews: 156,
    stock: 35,
    description: 'Delicate floral fragrance with notes of rose, jasmine, and vanilla.',
    images: [{ url: 'https://via.placeholder.com/300x300/fd79a8/ffffff?text=Women+Perfume' }],
    fragranceNotes: ['Rose', 'Jasmine', 'Vanilla', 'Musk'],
    volume: '100ml'
  },
  // ========== PERFUMES - UNISEX ==========
  {
    id: 601,
    name: 'Unisex Oud and Amber',
    price: 129.99,
    discountPrice: 109.99,
    category: 'perfumes',
    subCategory: 'unisex',
    brand: 'ArtisanScents',
    rating: 4.8,
    numReviews: 78,
    stock: 25,
    description: 'Unique unisex fragrance blending Oud with warm Amber notes.',
    images: [{ url: 'https://via.placeholder.com/300x300/fdcb6e/ffffff?text=Unisex+Oud' }],
    fragranceNotes: ['Oud', 'Amber', 'Sandalwood', 'Spices'],
    volume: '100ml'
  },
  // ========== PERFUMES - REFILLABLE ==========
  {
    id: 701,
    name: 'Refillable Luxury Perfume',
    price: 159.99,
    discountPrice: 139.99,
    category: 'perfumes',
    subCategory: 'refillable',
    brand: 'EcoLuxury',
    rating: 4.9,
    numReviews: 45,
    stock: 20,
    description: 'Premium refillable perfume with eco-friendly packaging.',
    images: [{ url: 'https://via.placeholder.com/300x300/00b894/ffffff?text=Refillable+Perfume' }],
    fragranceNotes: ['Rose', 'Oud', 'Bergamot', 'Amber'],
    volume: '100ml + Refill'
  },
  // ========== CLOTHING - WOMEN ==========
  {
    id: 4,
    name: 'Floral Summer Dress',
    price: 65.99,
    discountPrice: 49.99,
    category: 'clothing',
    subCategory: 'women',
    brand: 'Fashionista',
    rating: 4.6,
    numReviews: 203,
    stock: 40,
    description: 'Light and comfortable floral summer dress perfect for warm days.',
    images: [{ url: 'https://via.placeholder.com/300x300/ff6b6b/ffffff?text=Summer+Dress' }],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Red Floral', 'Blue Floral', 'Yellow Floral'],
    material: '100% Cotton'
  },
  // ========== CLOTHING - MEN ==========
  {
    id: 8,
    name: 'Men Leather Jacket',
    price: 129.99,
    discountPrice: 99.99,
    category: 'clothing',
    subCategory: 'men',
    brand: 'UrbanWear',
    rating: 4.5,
    numReviews: 78,
    stock: 25,
    description: 'Premium genuine leather jacket for a rugged, stylish look.',
    images: [{ url: 'https://via.placeholder.com/300x300/2d3436/ffffff?text=Leather+Jacket' }],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Brown'],
    material: 'Genuine Leather'
  },
  // ========== CLOTHING - KIDS ==========
  {
    id: 12,
    name: 'Kids T-Shirt Set',
    price: 29.99,
    discountPrice: 24.99,
    category: 'clothing',
    subCategory: 'kids',
    brand: 'LittleTrends',
    rating: 4.7,
    numReviews: 156,
    stock: 70,
    description: 'Set of 3 colorful t-shirts for kids. Soft and comfortable.',
    images: [{ url: 'https://via.placeholder.com/300x300/fd79a8/ffffff?text=Kids+T-Shirt' }],
    sizes: ['2T', '3T', '4T', '5T'],
    colors: ['Blue', 'Red', 'Yellow', 'Green'],
    material: '100% Cotton'
  }
];

let orders = [
  {
    id: 1,
    orderNumber: 'ORD-001',
    customer: 'John Doe',
    email: 'john@email.com',
    items: [
      { name: 'Luxury Face Cream', quantity: 2, price: 45.99 }
    ],
    total: 91.98,
    status: 'Processing',
    date: '2024-01-20',
    shippingAddress: '123 Main St, Nairobi'
  },
  {
    id: 2,
    orderNumber: 'ORD-002',
    customer: 'Jane Smith',
    email: 'jane@email.com',
    items: [
      { name: 'Women Floral Dream', quantity: 1, price: 89.99 }
    ],
    total: 89.99,
    status: 'Delivered',
    date: '2024-01-19',
    shippingAddress: '456 Park Ave, Nairobi'
  }
];

let users = [
  { id: 1, name: 'John Doe', email: 'john@email.com', role: 'customer', status: 'active', joined: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@email.com', role: 'customer', status: 'active', joined: '2024-01-10' },
  { id: 3, name: 'Admin User', email: 'admin@mafleva.com', role: 'admin', status: 'active', joined: '2024-01-01' }
];

// ============================================
// API ROUTES
// ============================================

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Mafleva International Limited API!',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      product: '/api/products/:id',
      orders: '/api/orders',
      users: '/api/users',
      health: '/health'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    server: 'Mafleva International - Backend API'
  });
});

// ============================================
// PRODUCTS CRUD
// ============================================

// GET all products with filtering
app.get('/api/products', (req, res) => {
  const { category, subCategory, search } = req.query;
  let filtered = [...products];

  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  if (subCategory) {
    filtered = filtered.filter(p => p.subCategory === subCategory);
  }
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.brand?.toLowerCase().includes(searchLower)
    );
  }

  res.json({
    products: filtered,
    count: filtered.length,
    total: products.length
  });
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// POST - Create new product
app.post('/api/products', (req, res) => {
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    ...req.body,
    rating: req.body.rating || 0,
    numReviews: 0,
    stock: req.body.stock || 0,
    images: req.body.images || [{ url: 'https://via.placeholder.com/300x300' }]
  };
  products.push(newProduct);
  res.status(201).json({ 
    message: 'Product created successfully!',
    product: newProduct 
  });
});

// PUT - Update product
app.put('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }
  products[index] = { ...products[index], ...req.body };
  res.json({ 
    message: 'Product updated successfully!',
    product: products[index] 
  });
});

// DELETE - Delete product
app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }
  products.splice(index, 1);
  res.json({ message: 'Product deleted successfully!' });
});

// ============================================
// ORDERS CRUD
// ============================================

// GET all orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// GET single order
app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json(order);
});

// POST - Create new order
app.post('/api/orders', (req, res) => {
  const newOrder = {
    id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
    orderNumber: 'ORD-' + String(orders.length + 1).padStart(3, '0'),
    ...req.body,
    date: new Date().toISOString().split('T')[0],
    status: 'Pending'
  };
  orders.push(newOrder);
  res.status(201).json({ 
    message: 'Order created successfully!',
    order: newOrder 
  });
});

// PUT - Update order status
app.put('/api/orders/:id', (req, res) => {
  const index = orders.findIndex(o => o.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }
  orders[index] = { ...orders[index], ...req.body };
  res.json({ 
    message: 'Order updated successfully!',
    order: orders[index] 
  });
});

// DELETE - Delete order
app.delete('/api/orders/:id', (req, res) => {
  const index = orders.findIndex(o => o.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }
  orders.splice(index, 1);
  res.json({ message: 'Order deleted successfully!' });
});

// ============================================
// USERS CRUD
// ============================================

// GET all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// GET single user
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

// POST - Create new user
app.post('/api/users', (req, res) => {
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    ...req.body,
    joined: new Date().toISOString().split('T')[0],
    status: 'active'
  };
  users.push(newUser);
  res.status(201).json({ 
    message: 'User created successfully!',
    user: newUser 
  });
});

// PUT - Update user
app.put('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  users[index] = { ...users[index], ...req.body };
  res.json({ 
    message: 'User updated successfully!',
    user: users[index] 
  });
});

// DELETE - Delete user
app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  users.splice(index, 1);
  res.json({ message: 'User deleted successfully!' });
});

// ============================================
// STATS
// ============================================

app.get('/api/stats', (req, res) => {
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalUsers = users.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
  const lowStockItems = products.filter(p => p.stock < 10).length;

  res.json({
    totalProducts,
    totalOrders,
    totalRevenue,
    totalUsers,
    pendingOrders,
    lowStockItems
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log('========================================');
  console.log('Mafleva International Server');
  console.log('========================================');
  console.log('Server running on http://localhost:' + PORT);
  console.log('Health: http://localhost:' + PORT + '/health');
  console.log('Products: http://localhost:' + PORT + '/api/products');
  console.log('Orders: http://localhost:' + PORT + '/api/orders');
  console.log('Users: http://localhost:' + PORT + '/api/users');
  console.log('========================================');
  console.log('Total Products: ' + products.length);
  console.log('Total Orders: ' + orders.length);
  console.log('Total Users: ' + users.length);
  console.log('========================================');
});
