const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.JWT_SECRET || (isProduction ? '' : 'local-only-jwt-secret-change-before-deploy');
const ADMIN_EMAIL = String(process.env.ADMIN_EMAIL || (isProduction ? '' : 'admin@mafleva.com')).toLowerCase();
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';
const ADMIN_PASSWORD_FALLBACK = process.env.ADMIN_PASSWORD || (isProduction ? '' : 'local-only-admin-password');
const TOKEN_EXPIRY = process.env.ADMIN_TOKEN_EXPIRY || '12h';
const FRONTEND_URL = String(process.env.FRONTEND_URL || process.env.RENDER_EXTERNAL_URL || '').replace(/\/+$/, '');
const corsOrigins = String(process.env.CORS_ORIGINS || process.env.RENDER_EXTERNAL_URL || (isProduction ? '' : 'http://localhost:3000'))
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const uploadDir = path.join(__dirname, '..', 'uploads');
const dataDir = path.join(__dirname, '..', 'data');
const productsDataPath = path.join(dataDir, 'products.json');
const testimonialsDataPath = path.join(dataDir, 'testimonials.json');
if (!isProduction) {
  fs.mkdirSync(uploadDir, { recursive: true });
  fs.mkdirSync(dataDir, { recursive: true });
}

const requiredProductionSettings = {
  JWT_SECRET: JWT_SECRET.length >= 32,
  ADMIN_EMAIL: Boolean(ADMIN_EMAIL),
  ADMIN_PASSWORD_HASH: /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(ADMIN_PASSWORD_HASH),
  MONGODB_URI: /^mongodb(?:\+srv)?:\/\//.test(process.env.MONGODB_URI || ''),
  CORS_ORIGINS: corsOrigins.length > 0 && corsOrigins.every((origin) => {
    try {
      return new URL(origin).protocol === 'https:' && new URL(origin).origin === origin;
    } catch (error) {
      return false;
    }
  }),
  CLOUDINARY_CLOUD_NAME: Boolean(process.env.CLOUDINARY_CLOUD_NAME),
  CLOUDINARY_API_KEY: Boolean(process.env.CLOUDINARY_API_KEY),
  CLOUDINARY_API_SECRET: Boolean(process.env.CLOUDINARY_API_SECRET),
  FLW_SECRET_KEY: Boolean(process.env.FLW_SECRET_KEY),
  FLW_WEBHOOK_SECRET_HASH: (process.env.FLW_WEBHOOK_SECRET_HASH || '').length >= 32,
  FRONTEND_URL: /^https:\/\//.test(FRONTEND_URL),
  SMTP_HOST: Boolean(process.env.SMTP_HOST),
  SMTP_PORT: Number(process.env.SMTP_PORT) > 0,
  SMTP_USER: Boolean(process.env.SMTP_USER),
  SMTP_PASS: Boolean(process.env.SMTP_PASS),
  FULFILLMENT_EMAIL: Boolean(process.env.FULFILLMENT_EMAIL)
};
if (isProduction) {
  const missingSettings = Object.entries(requiredProductionSettings)
    .filter(([, configured]) => !configured)
    .map(([name]) => name);
  if (missingSettings.length) {
    throw new Error(`Missing or invalid production configuration: ${missingSettings.join(', ')}`);
  }
}

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

const mailer = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  ? nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  })
  : null;

const EXCHANGE_RATES = { USD: 1, KES: 129.5, GBP: 0.79, EUR: 0.92, NGN: 1520, ZAR: 18.2, UGX: 3890, TZS: 2590, GHS: 15.8, RWF: 1340 };
const ZERO_DECIMAL_CURRENCIES = new Set(['KES', 'NGN', 'UGX', 'TZS', 'RWF']);

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
  if (isProduction) return;
  fs.writeFileSync(productsDataPath, JSON.stringify(nextProducts, null, 2));
};

const readTestimonialsFromDisk = () => {
  try {
    if (!fs.existsSync(testimonialsDataPath)) {
      return [];
    }

    const raw = fs.readFileSync(testimonialsDataPath, 'utf8');
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const writeTestimonialsToDisk = (nextTestimonials) => {
  if (isProduction) return;
  fs.writeFileSync(testimonialsDataPath, JSON.stringify(nextTestimonials, null, 2));
};

const SENTIMENT_LEXICON = {
  love: 3,
  amazing: 3,
  excellent: 3,
  outstanding: 3,
  perfect: 3,
  fantastic: 3,
  recommend: 2,
  quality: 2,
  happy: 2,
  satisfied: 2,
  great: 2,
  beautiful: 2,
  good: 1,
  fast: 1,
  clean: 1,
  nice: 1,
  bad: -2,
  poor: -2,
  disappointing: -3,
  disappointed: -3,
  awful: -3,
  terrible: -3,
  worst: -3,
  late: -1,
  broken: -3,
  damaged: -2,
  fake: -3,
  refund: -2,
  complaint: -2,
  problem: -2,
  slow: -1,
  hate: -3
};

const INTENSIFIERS = new Set(['very', 'really', 'super', 'extremely', 'highly']);
const NEGATIONS = new Set(['not', 'never', 'no', "don't", "didn't", "isn't", "wasn't", "can't"]);

const extractRatingFromText = (text) => {
  const normalized = String(text || '').toLowerCase();
  const fractionMatch = normalized.match(/(\d(?:\.\d)?)\s*\/\s*5/);
  if (fractionMatch) return Number(fractionMatch[1]);

  const starsMatch = normalized.match(/([1-5])\s*stars?/);
  if (starsMatch) return Number(starsMatch[1]);

  const starChars = (String(text || '').match(/★/g) || []).length;
  if (starChars > 0) return Math.min(starChars, 5);

  return null;
};

const scoreSentiment = (text) => {
  const tokens = String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  let score = 0;
  let matchedTerms = 0;

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    const base = SENTIMENT_LEXICON[token] || 0;
    if (!base) continue;

    matchedTerms += 1;

    const previous = tokens[i - 1] || '';
    const previousTwo = tokens[i - 2] || '';
    const hasIntensifier = INTENSIFIERS.has(previous);
    const hasNegation = NEGATIONS.has(previous) || NEGATIONS.has(previousTwo);

    let contribution = base;
    if (hasIntensifier) contribution *= 1.4;
    if (hasNegation) contribution *= -1;

    score += contribution;
  }

  const normalizedScore = Math.max(-1, Math.min(1, score / 8));
  const confidence = Math.min(0.99, Math.max(0.5, Math.abs(normalizedScore) + Math.min(0.3, matchedTerms * 0.05)));
  const rating = extractRatingFromText(text);

  return {
    score: Number(normalizedScore.toFixed(3)),
    confidence: Number(confidence.toFixed(3)),
    rating
  };
};

const evaluateTestimonialModeration = (text) => {
  const sentiment = scoreSentiment(text);
  const ratingBoost = sentiment.rating !== null ? (sentiment.rating - 3) * 0.15 : 0;
  const combinedScore = sentiment.score + ratingBoost;
  const accepted = combinedScore >= 0.2 && sentiment.confidence >= 0.55 && (sentiment.rating === null || sentiment.rating >= 4);

  return {
    accepted,
    model: 'mafleva-sentiment-v1',
    score: Number(combinedScore.toFixed(3)),
    confidence: sentiment.confidence,
    rating: sentiment.rating,
    reason: accepted
      ? 'Positive sentiment detected with sufficient confidence.'
      : 'Sentiment score did not meet positive moderation threshold.'
  };
};

const resolvedAdminPasswordHash = ADMIN_PASSWORD_HASH || bcrypt.hashSync(ADMIN_PASSWORD_FALLBACK, 10);

const createAdminToken = (email) => (
  jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
);

const authenticateAdmin = (req, res, next) => {
  const authHeader = String(req.headers.authorization || '');
  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ message: 'Authorization token is required.' });
  }

  const token = authHeader.slice(7).trim();
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload || payload.role !== 'admin') {
      return res.status(403).json({ message: 'Admin role is required.' });
    }
    req.admin = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const getCustomerFromRequest = (req) => {
  const authHeader = String(req.headers.authorization || '');
  const cookie = String(req.headers.cookie || '').split(';').map((part) => part.trim())
    .find((part) => part.startsWith('mafleva_customer='));
  const token = authHeader.toLowerCase().startsWith('bearer ')
    ? authHeader.slice(7).trim()
    : cookie?.slice('mafleva_customer='.length);
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload.role === 'customer'
      ? users.find((user) => String(user.id) === String(payload.sub) && user.role === 'customer' && user.status !== 'inactive') || null
      : null;
  } catch (error) {
    return null;
  }
};

const setCustomerSessionCookie = (res, token, clear = false) => {
  const attributes = [
    `mafleva_customer=${clear ? '' : token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${clear ? 0 : 604800}`
  ];
  if (isProduction) attributes.push('Secure');
  res.append('Set-Cookie', attributes.join('; '));
};

const authenticateCustomer = (req, res, next) => {
  const customer = getCustomerFromRequest(req);
  if (!customer) {
    return res.status(401).json({ message: 'Sign in to continue.' });
  }
  req.customer = customer;
  return next();
};

const publicCustomer = (customer) => ({
  id: customer.id,
  fullName: customer.fullName || customer.name,
  email: customer.email,
  joinedAt: customer.joinedAt || customer.joined
});

const createCustomerToken = (customer) => jwt.sign(
  { email: customer.email, role: 'customer' },
  JWT_SECRET,
  { subject: String(customer.id), expiresIn: '7d' }
);

app.enable('trust proxy');

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('CORS origin denied'));
  },
  credentials: true
}));
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

const cloudinaryStorage = {
  _handleFile(req, file, cb) {
    const stream = cloudinary.uploader.upload_stream({
      folder: 'mafleva/products',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif']
    }, (error, result) => {
      if (error) return cb(error);
      cb(null, {
        path: result.secure_url,
        filename: result.public_id,
        public_id: result.public_id,
        size: result.bytes
      });
    });
    file.stream.pipe(stream);
  },
  _removeFile(req, file, cb) {
    cloudinary.uploader.destroy(file.public_id, (error) => cb(error));
  }
};

const upload = multer({
  storage: isProduction
    ? cloudinaryStorage
    : storage,
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
    ? (uploadedFile.path || `/uploads/${uploadedFile.filename}`)
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

let testimonials = isProduction ? [] : readTestimonialsFromDisk();

let orders = [];
let users = [];

const AppState = mongoose.model('AppState', new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
}, { collection: 'app_state', versionKey: false }));

let persistenceQueue = Promise.resolve();
const persistServerState = () => {
  if (!isProduction) return Promise.resolve();
  const state = { products, testimonials, orders, users };
  persistenceQueue = persistenceQueue.catch(() => {}).then(() => Promise.all(
    Object.entries(state).map(([key, value]) => AppState.updateOne(
      { key },
      { $set: { value } },
      { upsert: true }
    ))
  ));
  return persistenceQueue;
};

const loadServerState = async () => {
  if (!isProduction) return;
  await mongoose.connect(process.env.MONGODB_URI);
  const savedState = await AppState.find({ key: { $in: ['products', 'testimonials', 'orders', 'users'] } }).lean();
  const stateByKey = new Map(savedState.map(({ key, value }) => [key, value]));
  if (Array.isArray(stateByKey.get('products'))) products = stateByKey.get('products');
  if (Array.isArray(stateByKey.get('testimonials'))) testimonials = stateByKey.get('testimonials');
  if (Array.isArray(stateByKey.get('orders'))) orders = stateByKey.get('orders');
  if (Array.isArray(stateByKey.get('users'))) users = stateByKey.get('users');
  if (savedState.length === 0) await persistServerState();
};

// Persist successful write requests before sending their response to the client.
app.use((req, res, next) => {
  if (!isProduction || !['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return next();
  const sendJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode >= 400) return sendJson(body);
    persistServerState().then(() => sendJson(body)).catch((error) => {
      console.error('Could not persist application state:', error.message);
      if (!res.headersSent) res.status(500);
      sendJson({ message: 'Could not save changes. Please try again.' });
    });
    return res;
  };
  next();
});

// ============================================
// API ROUTES
// ============================================

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Mafleva International Limited API!',
    version: '1.0.0',
    endpoints: {
      adminLogin: '/api/admin/login',
      products: '/api/products',
      product: '/api/products/:id',
      testimonials: '/api/testimonials',
      orders: '/api/orders',
      users: '/api/users',
      health: '/health'
    }
  });
});

app.post('/api/admin/login', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const emailMatches = email === ADMIN_EMAIL;
  const passwordMatches = bcrypt.compareSync(password, resolvedAdminPasswordHash);

  if (!emailMatches || !passwordMatches) {
    return res.status(401).json({ message: 'Invalid admin credentials.' });
  }

  const token = createAdminToken(email);
  return res.json({
    message: 'Login successful.',
    token,
    admin: { email, role: 'admin' }
  });
});

app.get('/api/admin/me', authenticateAdmin, (req, res) => {
  return res.json({ admin: { email: req.admin.email, role: 'admin' } });
});

app.post('/api/customers/register', (req, res) => {
  const fullName = String(req.body?.fullName || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (fullName.length < 2 || fullName.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Enter a valid name and email address.' });
  }
  if (password.length < 12) {
    return res.status(400).json({ message: 'Use a password with at least 12 characters.' });
  }
  if (users.some((user) => user.email === email)) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }
  const customer = {
    id: crypto.randomUUID(),
    fullName,
    email,
    passwordHash: bcrypt.hashSync(password, 12),
    role: 'customer',
    status: 'active',
    joinedAt: new Date().toISOString()
  };
  users.push(customer);
  setCustomerSessionCookie(res, createCustomerToken(customer));
  return res.status(201).json({
    customer: publicCustomer(customer)
  });
});

app.post('/api/customers/login', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const customer = users.find((user) => user.email === email && user.role === 'customer');
  const matches = customer?.passwordHash && bcrypt.compareSync(password, customer.passwordHash);
  if (!matches || customer.status === 'inactive') {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }
  setCustomerSessionCookie(res, createCustomerToken(customer));
  return res.json({ customer: publicCustomer(customer) });
});

app.post('/api/customers/logout', (req, res) => {
  setCustomerSessionCookie(res, '', true);
  return res.json({ ok: true });
});

app.get('/api/customers/me', authenticateCustomer, (req, res) => {
  return res.json({ customer: publicCustomer(req.customer) });
});

app.get('/api/customers/orders', authenticateCustomer, (req, res) => {
  const customerOrders = orders
    .filter((order) => String(order.customerId || '') === String(req.customer.id))
    .map(({ tx_ref, paymentLink, ...order }) => order);
  return res.json({ orders: customerOrders });
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

const initiateFlutterwavePayment = async (payload) => {
  const response = await fetch('https://api.flutterwave.com/v3/payments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  const result = await response.json();
  if (!response.ok || result.status !== 'success' || !result.data?.link) {
    throw new Error(result.message || 'Payment provider could not create a checkout session.');
  }
  return result.data.link;
};

const verifyFlutterwavePayment = async (transactionId) => {
  const response = await fetch(`https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`, {
    headers: { Authorization: `Bearer ${process.env.FLW_SECRET_KEY}` }
  });
  const result = await response.json();
  if (!response.ok || result.status !== 'success' || !result.data) {
    throw new Error('Payment provider could not verify this transaction.');
  }
  return result.data;
};

const sendOrderEmail = async (order, recipient, subject) => {
  if (!mailer || !recipient) return;
  const lines = order.items.map((item) => `${item.quantity} × ${item.name}`).join('\n');
  const text = [
    `Order ${order.orderNumber}`,
    `Status: ${order.status}`,
    `Total: ${order.currency} ${Number(order.total).toFixed(2)}`,
    '',
    lines,
    '',
    `Delivery address: ${order.shippingAddress}`
  ].join('\n');
  await mailer.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: recipient,
    subject,
    text
  });
};

const finalizePaidOrder = async (transactionId, expectedReference) => {
  const order = orders.find((item) => item.tx_ref === expectedReference);
  if (!order) throw new Error('Order reference was not found.');
  const transaction = await verifyFlutterwavePayment(transactionId);
  const amount = Number(transaction.amount);
  if (
    transaction.status !== 'successful' ||
    transaction.tx_ref !== order.tx_ref ||
    transaction.currency !== order.currency ||
    !Number.isFinite(amount) || amount < Number(order.total)
  ) {
    throw new Error('The payment details do not match this order.');
  }
  if (order.paymentStatus === 'successful') return order;

  let stockAvailable = true;
  for (const item of order.items) {
    const product = products.find((entry) => String(entry.id) === String(item.productId));
    if (!product || Number(product.stock ?? 0) < Number(item.quantity)) stockAvailable = false;
  }
  if (stockAvailable) {
    for (const item of order.items) {
      const product = products.find((entry) => String(entry.id) === String(item.productId));
      product.stock = Number(product.stock ?? 0) - Number(item.quantity);
    }
    writeProductsToDisk(products);
    order.fulfillmentStatus = 'processing';
    order.status = 'Processing';
  } else {
    order.fulfillmentStatus = 'stock-review';
    order.status = 'Paid - stock review';
  }
  order.paymentStatus = 'successful';
  order.paymentTransactionId = String(transaction.id);
  order.paidAt = new Date().toISOString();
  const emailResults = await Promise.allSettled([
    sendOrderEmail(order, order.customerEmail, `Mafleva order ${order.orderNumber} confirmed`),
    sendOrderEmail(order, process.env.FULFILLMENT_EMAIL, `New paid order ${order.orderNumber}`)
  ]);
  order.fulfillmentEmailSent = emailResults.every((result) => result.status === 'fulfilled');
  emailResults.filter((result) => result.status === 'rejected').forEach((result) => {
    console.error('Order email delivery failed:', result.reason?.message || result.reason);
  });
  return order;
};

app.post('/api/checkout', async (req, res) => {
  if (!process.env.FLW_SECRET_KEY) {
    return res.status(503).json({ message: 'Online checkout is not configured yet.' });
  }
  const { customer = {}, items = [], currency = 'KES', country = 'KE', shippingAddress } = req.body || {};
  const email = String(customer.email || '').trim().toLowerCase();
  const fullName = String(customer.fullName || '').trim();
  const phone = String(customer.phone || '').trim();
  const address = String(shippingAddress || '').trim();
  const selectedCurrency = String(currency).toUpperCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !fullName || !phone || !address) {
    return res.status(400).json({ message: 'Enter your name, a valid email, phone number, and delivery address.' });
  }
  if (!EXCHANGE_RATES[selectedCurrency]) {
    return res.status(400).json({ message: 'Checkout is not available for the selected currency. Choose KES, USD, GBP, EUR, NGN, ZAR, UGX, TZS, GHS, or RWF.' });
  }
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return res.status(400).json({ message: 'Your cart is empty or contains too many items.' });
  }

  const requestedItems = new Map();
  for (const entry of items) {
    const productId = String(entry.productId ?? entry.id ?? '');
    const quantity = Number(entry.quantity);
    if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return res.status(400).json({ message: 'The cart contains an invalid item or quantity.' });
    }
    requestedItems.set(productId, (requestedItems.get(productId) || 0) + quantity);
  }

  const orderItems = [];
  let subtotalUsd = 0;
  for (const [productId, quantity] of requestedItems.entries()) {
    const product = products.find((entry) => String(entry.id) === productId);
    if (!product) return res.status(400).json({ message: 'A product in your cart is no longer available.' });
    if (quantity > Number(product.stock ?? 0)) {
      return res.status(409).json({ message: `${product.name} does not have enough stock for this order.` });
    }
    const unitPriceUsd = Number(product.discountPrice ?? product.price ?? 0);
    if (!Number.isFinite(unitPriceUsd) || unitPriceUsd <= 0) {
      return res.status(400).json({ message: 'A product in your cart has an invalid price.' });
    }
    subtotalUsd += unitPriceUsd * quantity;
    orderItems.push({
      productId,
      name: product.name,
      quantity,
      price: unitPriceUsd * EXCHANGE_RATES[selectedCurrency],
      unitPriceUsd
    });
  }

  const shippingUsd = String(country).toUpperCase() === 'KE' ? 0 : 12;
  const exactTotal = (subtotalUsd + shippingUsd) * EXCHANGE_RATES[selectedCurrency];
  const total = ZERO_DECIMAL_CURRENCIES.has(selectedCurrency)
    ? Math.round(exactTotal)
    : Math.round(exactTotal * 100) / 100;
  const txRef = `MF-${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
  const linkedCustomer = getCustomerFromRequest(req);
  const appOrigin = FRONTEND_URL || corsOrigins[0] || 'http://localhost:3000';
  let paymentLink;
  try {
    paymentLink = await initiateFlutterwavePayment({
      tx_ref: txRef,
      amount: total,
      currency: selectedCurrency,
      redirect_url: `${appOrigin}/payment/return`,
      payment_options: selectedCurrency === 'KES' ? 'card, mpesa' : 'card',
      customer: { email, name: fullName, phonenumber: phone },
      meta: { customer_country: String(country).toUpperCase() },
      customizations: { title: 'Mafleva International', description: 'Order payment' }
    });
  } catch (error) {
    console.error('Payment checkout creation failed:', error.message || error);
    return res.status(502).json({ message: 'We could not start checkout. Please try again.' });
  }

  const order = {
    id: Date.now(),
    orderNumber: `MF-${Date.now().toString(36).toUpperCase()}`,
    tx_ref: txRef,
    customerId: linkedCustomer?.id || null,
    customerName: fullName,
    customerEmail: email,
    customerPhone: phone,
    shippingAddress: address,
    country: String(country).toUpperCase(),
    currency: selectedCurrency,
    items: orderItems,
    subtotal: Math.round(subtotalUsd * EXCHANGE_RATES[selectedCurrency] * 100) / 100,
    shipping: Math.round(shippingUsd * EXCHANGE_RATES[selectedCurrency] * 100) / 100,
    total,
    paymentStatus: 'pending',
    paymentLink,
    fulfillmentStatus: 'unpaid',
    status: 'Awaiting Payment',
    date: new Date().toISOString()
  };
  orders.push(order);
  return res.status(201).json({ orderNumber: order.orderNumber, checkoutUrl: paymentLink });
});

app.post('/api/payments/verify', async (req, res) => {
  const txRef = String(req.body?.tx_ref || '');
  const transactionId = String(req.body?.transaction_id || '');
  if (!txRef || !/^\d{1,24}$/.test(transactionId)) {
    return res.status(400).json({ message: 'Payment reference is invalid.' });
  }
  try {
    const order = await finalizePaidOrder(transactionId, txRef);
    return res.json({ orderNumber: order.orderNumber, paymentStatus: order.paymentStatus, fulfillmentStatus: order.fulfillmentStatus });
  } catch (error) {
    return res.status(409).json({ message: error.message || 'Payment is not confirmed yet.' });
  }
});

app.post('/api/payments/flutterwave/webhook', async (req, res) => {
  const expected = Buffer.from(process.env.FLW_WEBHOOK_SECRET_HASH || '');
  const received = Buffer.from(String(req.headers['verif-hash'] || ''));
  if (!expected.length || expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
    return res.status(401).json({ message: 'Invalid webhook signature.' });
  }
  const event = req.body || {};
  if (event.event !== 'charge.completed' || !event.data?.id || !event.data?.tx_ref) {
    return res.status(200).json({ received: true });
  }
  try {
    await finalizePaidOrder(String(event.data.id), String(event.data.tx_ref));
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Payment webhook processing failed:', error.message || error);
    return res.status(500).json({ message: 'Webhook processing failed.' });
  }
});

// ============================================
// PRODUCTS CRUD
// ============================================

// ============================================
// TESTIMONIALS MODERATION
// ============================================

app.get('/api/testimonials', (req, res) => {
  const status = String(req.query.status || 'approved').toLowerCase();
  const allowedStatuses = new Set(['approved', 'pending', 'rejected', 'all']);
  const targetStatus = allowedStatuses.has(status) ? status : 'approved';

  if (targetStatus !== 'approved') {
    return authenticateAdmin(req, res, () => {
      const filtered = targetStatus === 'all'
        ? testimonials
        : testimonials.filter((item) => String(item.status || '').toLowerCase() === targetStatus);

      return res.json({ testimonials: filtered, count: filtered.length, total: testimonials.length });
    });
  }

  const filtered = testimonials.filter((item) => String(item.status || '').toLowerCase() === 'approved');
  return res.json({ testimonials: filtered, count: filtered.length, total: testimonials.length });
});

app.post('/api/testimonials/intake', (req, res) => {
  const { text, source, name, role, avatar } = req.body || {};
  const cleanText = String(text || '').trim();

  if (!cleanText) {
    return res.status(400).json({ message: 'Testimonial text is required.' });
  }

  const existing = testimonials.find(
    (item) => String(item.comment || '').toLowerCase() === cleanText.toLowerCase()
  );

  if (existing) {
    return res.status(200).json({
      message: 'Testimonial already exists.',
      testimonial: existing,
      moderation: existing.moderation || null
    });
  }

  const moderation = evaluateTestimonialModeration(cleanText);
  const now = new Date().toISOString();
  const newTestimonial = {
    id: Date.now(),
    name: String(name || 'Social Customer'),
    role: String(role || `${source || 'Social media'} follower`),
    avatar: String(avatar || 'https://ui-avatars.com/api/?name=Social+Customer&background=2d3436&color=fff&size=60'),
    rating: moderation.rating ? Math.max(1, Math.min(5, Math.round(moderation.rating))) : 4,
    comment: cleanText,
    date: now.slice(0, 10),
    source: String(source || 'Social media'),
    status: moderation.accepted ? 'pending' : 'rejected',
    moderation,
    createdAt: now,
    updatedAt: now
  };

  testimonials.unshift(newTestimonial);
  writeTestimonialsToDisk(testimonials);

  return res.status(201).json({
    message: moderation.accepted
      ? 'Positive testimonial submitted for admin approval.'
      : 'Testimonial rejected by sentiment moderation.',
    testimonial: newTestimonial,
    moderation
  });
});

app.get('/api/testimonials/admin/check', authenticateAdmin, (req, res) => {
  return res.json({ ok: true });
});

app.put('/api/testimonials/:id/status', authenticateAdmin, (req, res) => {
  const nextStatus = String(req.body?.status || '').toLowerCase();
  if (!['approved', 'pending', 'rejected'].includes(nextStatus)) {
    return res.status(400).json({ message: 'Invalid status. Use approved, pending or rejected.' });
  }

  const index = testimonials.findIndex((item) => String(item.id) === String(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Testimonial not found.' });
  }

  testimonials[index] = {
    ...testimonials[index],
    status: nextStatus,
    updatedAt: new Date().toISOString()
  };
  writeTestimonialsToDisk(testimonials);

  return res.json({ message: 'Testimonial status updated.', testimonial: testimonials[index] });
});

app.delete('/api/testimonials/:id', authenticateAdmin, (req, res) => {
  const index = testimonials.findIndex((item) => String(item.id) === String(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Testimonial not found.' });
  }

  const removed = testimonials[index];
  testimonials.splice(index, 1);
  writeTestimonialsToDisk(testimonials);

  return res.json({ message: 'Testimonial removed.', testimonial: removed });
});

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
app.get('/api/inventory/alerts', authenticateAdmin, (req, res) => {
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
app.post('/api/products', authenticateAdmin, upload.single('image'), (req, res) => {
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
app.put('/api/products/:id', authenticateAdmin, upload.single('image'), (req, res) => {
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
app.delete('/api/products/:id', authenticateAdmin, (req, res) => {
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
app.get('/api/orders', authenticateAdmin, (req, res) => {
  res.json(orders);
});

// GET single order
app.get('/api/orders/:id', authenticateAdmin, (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json(order);
});

// POST - Create new order
app.post('/api/orders', authenticateAdmin, (req, res) => {
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
app.put('/api/orders/:id', authenticateAdmin, (req, res) => {
  const index = orders.findIndex(o => o.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }
  const { status, fulfillmentStatus, trackingNumber } = req.body || {};
  if (status && orders[index].paymentStatus !== 'successful') {
    return res.status(409).json({ message: 'Unpaid orders cannot enter fulfillment.' });
  }
  const allowedFulfillmentStatuses = new Set(['Processing', 'Packed', 'Shipped', 'Delivered', 'Paid - stock review']);
  if (status && !allowedFulfillmentStatuses.has(String(status))) {
    return res.status(400).json({ message: 'Choose a valid order fulfillment status.' });
  }
  const previousStatus = orders[index].status;
  orders[index] = {
    ...orders[index],
    ...(status ? { status: String(status) } : {}),
    ...(fulfillmentStatus ? { fulfillmentStatus: String(fulfillmentStatus) } : {}),
    ...(trackingNumber ? { trackingNumber: String(trackingNumber).trim() } : {})
  };
  if (status && status !== previousStatus) {
    sendOrderEmail(
      orders[index],
      orders[index].customerEmail,
      `Mafleva order ${orders[index].orderNumber} update: ${orders[index].status}`
    ).catch((error) => console.error('Fulfillment email delivery failed:', error.message || error));
  }
  res.json({ 
    message: 'Order updated successfully!',
    order: orders[index] 
  });
});

// DELETE - Delete order
app.delete('/api/orders/:id', authenticateAdmin, (req, res) => {
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
app.get('/api/users', authenticateAdmin, (req, res) => {
  res.json(users.map(({ passwordHash, ...user }) => user));
});

// GET single user
app.get('/api/users/:id', authenticateAdmin, (req, res) => {
  const user = users.find(u => String(u.id) === String(req.params.id));
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const { passwordHash, ...safeUser } = user;
  res.json(safeUser);
});

// POST - Create new user
app.post('/api/users', authenticateAdmin, (req, res) => {
  const { password, passwordHash, ...safeInput } = req.body || {};
  const newUser = {
    id: crypto.randomUUID(),
    ...safeInput,
    joined: new Date().toISOString().split('T')[0],
    status: 'active'
  };
  users.push(newUser);
  res.status(201).json({ 
    message: 'User created successfully!',
    user: (({ passwordHash, ...safeUser }) => safeUser)(newUser)
  });
});

// PUT - Update user
app.put('/api/users/:id', authenticateAdmin, (req, res) => {
  const index = users.findIndex(u => String(u.id) === String(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  const { name, fullName, email, status, role } = req.body || {};
  users[index] = {
    ...users[index],
    ...(name ? { name: String(name).trim() } : {}),
    ...(fullName ? { fullName: String(fullName).trim() } : {}),
    ...(email ? { email: String(email).trim().toLowerCase() } : {}),
    ...(status && ['active', 'inactive'].includes(String(status)) ? { status: String(status) } : {}),
    ...(role && ['admin', 'customer'].includes(String(role)) ? { role: String(role) } : {})
  };
  res.json({ 
    message: 'User updated successfully!',
    user: (({ passwordHash, ...safeUser }) => safeUser)(users[index])
  });
});

// DELETE - Delete user
app.delete('/api/users/:id', authenticateAdmin, (req, res) => {
  const index = users.findIndex(u => String(u.id) === String(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  users.splice(index, 1);
  res.json({ message: 'User deleted successfully!' });
});

// ============================================
// STATS
// ============================================

app.get('/api/stats', authenticateAdmin, (req, res) => {
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

app.get('/api/analytics/summary', authenticateAdmin, (req, res) => {
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

const frontendBuildDir = path.join(__dirname, '..', '..', 'frontend', 'build');
if (isProduction && fs.existsSync(frontendBuildDir)) {
  app.use(express.static(frontendBuildDir, { maxAge: '1y', index: false }));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api/') || req.path === '/health') return next();
    return res.sendFile(path.join(frontendBuildDir, 'index.html'));
  });
}

// ============================================
// START SERVER
// ============================================

const logServerStarted = (port) => {
  console.log('========================================');
  console.log('Mafleva International Server');
  console.log('========================================');
  console.log('Server listening on port ' + port);
  console.log('Health endpoint: /health');
  console.log('Products endpoint: /api/products');
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
      console.error(`Port ${port} is already in use.`);
      console.error('Backend startup aborted to avoid frontend/backend port mismatch.');
      console.error(`Free port ${port} or set PORT explicitly, then restart the backend.`);
      process.exit(1);
      return;
    }

    console.error('Backend failed to start:', error.message || error);
    process.exit(1);
  });
};

loadServerState()
  .then(() => startServer(PORT))
  .catch((error) => {
    console.error('Backend startup failed:', error.message || error);
    process.exit(1);
  });
