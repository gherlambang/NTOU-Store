const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Load Product Data from products.json
const productsFilePath = path.join(__dirname, 'data', 'products.json');
let products = [];

try {
  const fileContent = fs.readFileSync(productsFilePath, 'utf-8');
  products = JSON.parse(fileContent);
} catch (error) {
  console.error('Error reading products.json:', error);
}

// In-Memory Cart Storage
let cart = [];

/* -------------------------------
   PRODUCTS ENDPOINTS
-------------------------------- */
// Get all products
app.get('/products', (req, res) => {
  res.json(products);
});

// Get a single product by ID
app.get('/products/:id', (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

/* -------------------------------
   CART ENDPOINTS
-------------------------------- */
// Get the current cart
app.get('/cart', (req, res) => {
  res.json(cart);
});

// Add an item to the cart
app.post('/cart', (req, res) => {
  const { productId, quantity } = req.body;

  // Validate input
  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({ message: 'Invalid product ID or quantity.' });
  }

  // Check if the product exists
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  // Check if product already exists in cart
  const existingCartItem = cart.find((item) => item.productId === productId);
  if (existingCartItem) {
    existingCartItem.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  res.json({ message: 'Product added to cart successfully.', cart });
});

// Remove an item from the cart
app.delete('/cart/:productId', (req, res) => {
  const { productId } = req.params;

  const initialLength = cart.length;
  cart = cart.filter((item) => item.productId !== productId);

  if (cart.length === initialLength) {
    return res.status(404).json({ message: 'Product not found in cart.' });
  }

  res.json({ message: 'Product removed from cart.', cart });
});

// Clear the entire cart
app.delete('/cart', (req, res) => {
  cart = [];
  res.json({ message: 'Cart cleared successfully.', cart });
});

/* -------------------------------
   SERVER START
-------------------------------- */
app.listen(port, '0.0.0.0', () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
