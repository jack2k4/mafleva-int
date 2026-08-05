const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to GlamStore API!',
        status: 'running'
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/products', (req, res) => {
    const products = [
        {
            id: 1,
            name: 'Luxury Face Cream',
            price: 45.99,
            category: 'beauty',
            description: 'Premium moisturizing face cream'
        },
        {
            id: 2,
            name: 'Designer Perfume',
            price: 89.99,
            category: 'perfumes',
            description: 'Elegant fragrance with vanilla and rose'
        },
        {
            id: 3,
            name: 'Summer Dress',
            price: 65.99,
            category: 'clothing',
            description: 'Light and comfortable summer dress'
        }
    ];
    res.json(products);
});

// Start server
app.listen(PORT, () => {
    console.log('=================================');
    console.log('GlamStore Server is running!');
    console.log('http://localhost:' + PORT);
    console.log('Health: http://localhost:' + PORT + '/health');
    console.log('Products: http://localhost:' + PORT + '/api/products');
    console.log('=================================');
});
