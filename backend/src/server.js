const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const uploadDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const dataDir = path.join(__dirname, '..', 'data');
const productsDataPath = path.join(dataDir, 'products.json');
fs.mkdirSync(dataDir, { recursive: true });

const CATEGORY_DEFAULT_SUBCATEGORY = {
  beauty: 'skincare',
  clothing: 'women',
  perfumes: 'unisex',
  health: 'wellness'
};

const CATEGORY_ALIASES = {
  beauty: 'beauty',
  beauti: 'beauty',
  skincare: 'beauty',
  cosmetic: 'beauty',
  cosmetics: 'beauty',
  clothing: 'clothing',
  cloth: 'clothing',
  wear: 'clothing',
  fashion: 'clothing',
  perfume: 'perfumes',
  perfumes: 'perfumes',
  fragrance: 'perfumes',
  fragrances: 'perfumes',
  scent: 'perfumes',
  scents: 'perfumes',
  health: 'health',
  wellness: 'health',
  care: 'health'
};

const SUBCATEGORY_ALIASES = {
  beauty: {
    habit: 'herbal',
    herbals: 'herbal',
    herbs: 'herbal',
    skin: 'skincare',
    'skin care': 'skincare',
    hair: 'haircare',
    'hair care': 'haircare'
  },
  clothing: {
    man: 'men',
    male: 'men',
    mens: 'men',
    woman: 'women',
    female: 'women',
    womens: 'women',
    kid: 'kids',
    child: 'kids',
    children: 'kids'
  },
  perfumes: {
    man: 'men',
    mens: 'men',
    woman: 'women',
    womens: 'women',
    refill: 'refillable'
  },
  health: {
    herbals: 'herbal',
    supplement: 'supplements'
  }
};

const normalizeCategory = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  return CATEGORY_ALIASES[normalized] || (CATEGORY_DEFAULT_SUBCATEGORY[normalized] ? normalized : 'beauty');
};

const normalizeSubCategory = (value, category) => {
  const normalizedCategory = normalizeCategory(category);
  const normalizedValue = String(value || '').trim().toLowerCase();
  const categoryAliases = SUBCATEGORY_ALIASES[normalizedCategory] || {};
  if (categoryAliases[normalizedValue]) {
    return categoryAliases[normalizedValue];
  }

  if (normalizedValue) {
    return normalizedValue;
  }

  return CATEGORY_DEFAULT_SUBCATEGORY[normalizedCategory] || 'skincare';
};

const toRelativeUploadPath = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  const match = value.match(/\/uploads\/[^"]+$/);
  return match ? match[0] : value;
};

const normalizeStoredProductPaths = (product) => {
  const nextProduct = { ...product };
  nextProduct.category = normalizeCategory(nextProduct.category);
  nextProduct.subCategory = normalizeSubCategory(nextProduct.subCategory, nextProduct.category);

  const firstImageUrl = Array.isArray(nextProduct.images)
    ? nextProduct.images.find((image) => image && typeof image === 'object' && image.url)?.url
    : '';

  if (nextProduct.image) {
    nextProduct.image = toRelativeUploadPath(nextProduct.image);
  } else if (firstImageUrl) {
    nextProduct.image = toRelativeUploadPath(firstImageUrl);
  }

  if (Array.isArray(nextProduct.images)) {
    nextProduct.images = nextProduct.images.map((image) => {
      if (!image || typeof image !== 'object') {
        return image;
      }

      return {
        ...image,
        url: toRelativeUploadPath(image.url)
      };
    });
  } else if (nextProduct.image) {
    nextProduct.images = [{ url: nextProduct.image }];
  }

  return nextProduct;
};

const readProductsFromDisk = () => {
  try {
    if (!fs.existsSync(productsDataPath)) {
      return [];
    }

    const raw = fs.readFileSync(productsDataPath, 'utf8');
    const parsed = JSON.parse(raw || '[]');
    if (!Array.isArray(parsed)) {
      return [];
    }

    const normalized = parsed.map(normalizeStoredProductPaths);
    if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
      writeProductsToDisk(normalized);
    }

    return normalized;
  } catch (error) {
    return [];
  }
};

const writeProductsToDisk = (nextProducts) => {
  fs.writeFileSync(productsDataPath, JSON.stringify(nextProducts, null, 2));
};

app.enable('trust proxy');

// Middleware
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(compression());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '-').toLowerCase();
    const extension = path.extname(safeName) || '.jpg';
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 8);
    cb(null, `${timestamp}-${random}${extension}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error('Only image uploads are allowed.'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

const findProductIndexById = (id) => {
  const productId = String(id);
  return products.findIndex((product) => String(product.id) === productId);
};

const normalizeUploadedProduct = (body, uploadedFile, req) => {
  const normalizedCategory = normalizeCategory(body.category);
  const normalizedSubCategory = normalizeSubCategory(body.subCategory, normalizedCategory);
  const imageUrl = uploadedFile
    ? `/uploads/${uploadedFile.filename}`
    : toRelativeUploadPath(body.image || body.imageUrl || '/images/logo.jpeg');

  const payload = {
    ...body,
    name: body.name || 'New Product',
    category: normalizedCategory,
    subCategory: normalizedSubCategory,
    price: Number(body.price || 0),
    discountPrice: Number(body.discountPrice ?? body.price ?? 0),
    stock: Number(body.stock || 0),
    rating: Number(body.rating || 4.8),
    brand: body.brand || 'Mafleva',
    description: body.description || body.name || 'Mafleva product',
    image: imageUrl,
    images: uploadedFile ? [{ url: imageUrl }] : (Array.isArray(body.images) ? body.images : [{ url: imageUrl }])
  };

  if (!uploadedFile && body.images && typeof body.images === 'string') {
    try {
      payload.images = JSON.parse(body.images);
    } catch (err) {
      payload.images = [{ url: imageUrl }];
    }
  }

  return payload;
};

// ============================================
// DATA: Products
// ============================================

const defaultProducts = [
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
    images: [{ url: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.30.jpeg' }],
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
    images: [{ url: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.31.jpeg' }],
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
    images: [{ url: '/images/WhatsApp%20Image%202026-08-12%20at%2018.53.34%20(1).jpeg' }],
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
    images: [{ url: '/images/oils.jpeg' }],
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
    images: [{ url: '/perfumes/1f943a1d5fc12debdd2dfc91cf717cf9.jpg' }],
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
    images: [{ url: '/perfumes/0a39becdd6041d93bb9b9b5645501342.jpg' }],
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
    images: [{ url: '/perfumes/6262dda8914ce0fe8f83107ac06b1be2.jpg' }],
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
    images: [{ url: '/perfumes/aebf343bbc78ebd41c49ab993a51ceb3.jpg' }],
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
    images: [{ url: '/wear/732d3d01a39c6e2cc6278e7b7ca7fd20.jpg' }],
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
    images: [{ url: '/wear/45591080c617ba19d510476947307a2e.jpg' }],
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
    images: [{ url: '/wear/62a50cc5b187807962bc6d67691c97d8.jpg' }],
    sizes: ['2T', '3T', '4T', '5T'],
    colors: ['Blue', 'Red', 'Yellow', 'Green'],
    material: '100% Cotton'
  }
];

let products = readProductsFromDisk();
if (products.length === 0) {
  products = [...defaultProducts];
}

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

// GET low stock alerts
app.get('/api/inventory/alerts', (req, res) => {
  const threshold = Number(req.query.threshold || 10);
  const lowStockProducts = products.filter((product) => Number(product.stock || 0) <= threshold);

  res.json({
    threshold,
    count: lowStockProducts.length,
    products: lowStockProducts
  });
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => String(p.id) === String(req.params.id));
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// POST - Create new product
app.post('/api/products', upload.single('image'), (req, res) => {
  try {
    const newProduct = normalizeUploadedProduct(req.body, req.file, req);
    newProduct.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    newProduct.numReviews = Number(newProduct.numReviews || 0);
    products.push(newProduct);
    writeProductsToDisk(products);

    res.status(201).json({
      message: 'Product created successfully!',
      product: newProduct
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Could not create product.' });
  }
});

// PUT - Update product
app.put('/api/products/:id', upload.single('image'), (req, res) => {
  const index = findProductIndexById(req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  try {
    const updated = normalizeUploadedProduct(
      { ...products[index], ...req.body },
      req.file || null,
      req
    );
    products[index] = { ...products[index], ...updated };
    writeProductsToDisk(products);
    res.json({
      message: 'Product updated successfully!',
      product: products[index]
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Could not update product.' });
  }
});

// DELETE - Delete product
app.delete('/api/products/:id', (req, res) => {
  const index = findProductIndexById(req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }
  products.splice(index, 1);
  writeProductsToDisk(products);
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

app.get('/api/analytics/summary', (req, res) => {
  const revenueByCategory = products.reduce((accumulator, product) => {
    const category = product.category || 'uncategorized';
    const value = Number(product.discountPrice ?? product.price ?? 0) * Number(product.stock ?? 0);
    accumulator[category] = (accumulator[category] || 0) + value;
    return accumulator;
  }, {});

  const lowStockItems = products
    .filter((product) => Number(product.stock || 0) < 10)
    .map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      stock: product.stock,
      status: product.stock === 0 ? 'Out of stock' : 'Low stock'
    }));

  res.json({
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    totalUsers: users.length,
    lowStockItems,
    revenueByCategory,
    orderStatuses: orders.reduce((accumulator, order) => {
      const status = order.status || 'Unknown';
      accumulator[status] = (accumulator[status] || 0) + 1;
      return accumulator;
    }, {})
  });
});

// ============================================
// START SERVER
// ============================================

const logServerStarted = (port) => {
  console.log('========================================');
  console.log('Mafleva International Server');
  console.log('========================================');
  console.log('Server running on http://localhost:' + port);
  console.log('Health: http://localhost:' + port + '/health');
  console.log('Products: http://localhost:' + port + '/api/products');
  console.log('Orders: http://localhost:' + port + '/api/orders');
  console.log('Users: http://localhost:' + port + '/api/users');
  console.log('========================================');
  console.log('Total Products: ' + products.length);
  console.log('Total Orders: ' + orders.length);
  console.log('Total Users: ' + users.length);
  console.log('========================================');
};

const startServer = (preferredPort) => {
  const port = Number(preferredPort);
  const server = app.listen(port, () => {
    logServerStarted(port);
  });

  server.on('error', (error) => {
    if (error && error.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is busy. Trying port ${port + 1}...`);
      startServer(port + 1);
      return;
    }

    throw error;
  });
};

startServer(PORT);
