const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

require('dotenv').config();

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://ntou:securepassword123@cluster0.phhfy.mongodb.net/ntou-project?retryWrites=true&w=majority';
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define MongoDB Schemas and Models
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
});
const CartItemSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  quantity: Number,
});

const Product = mongoose.model('Product', ProductSchema);
const CartItem = mongoose.model('CartItem', CartItemSchema);

/* -------------------------------
   PRODUCTS ENDPOINTS
-------------------------------- */
// Get all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

// Get a single product by ID
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
});

/* -------------------------------
   CART ENDPOINTS
-------------------------------- */
// Get the current cart
app.get('/cart', async (req, res) => {
  try {
    const cart = await CartItem.find().populate('productId');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
});

// Add an item to the cart
app.post('/cart', async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({ message: 'Invalid product ID or quantity.' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const existingCartItem = await CartItem.findOne({ productId });
    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
    } else {
      await CartItem.create({ productId, quantity });
    }

    res.json({ message: 'Product added to cart successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error });
  }
});

// Remove an item from the cart
app.delete('/cart/:productId', async (req, res) => {
  try {
    const result = await CartItem.findOneAndDelete({ productId: req.params.productId });
    if (!result) {
      return res.status(404).json({ message: 'Product not found in cart.' });
    }
    res.json({ message: 'Product removed from cart.' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart', error });
  }
});

// Clear the entire cart
app.delete('/cart', async (req, res) => {
  try {
    await CartItem.deleteMany({});
    res.json({ message: 'Cart cleared successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error });
  }
});

/* -------------------------------
   SERVER START
-------------------------------- */
app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
