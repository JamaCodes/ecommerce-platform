require('dotenv').config(); // Load environment variables
const express = require('express');
const { Pool } = require('pg');
const redis = require('redis');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redisClient.connect();

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function fetchProductsFromDatabase() {
  try {
    const { rows } = await pool.query('SELECT * FROM products');
    return rows;
  } catch (error) {
    console.error('Error retrieving products from the database:', error);
    throw error;
  }
}

app.get('/', (req, res) => {
  res.send('Hello from the e-commerce server!');
});

app.get('/products', async (req, res) => {
  try {
    const cachedProducts = await redisClient.get('products');
    if (cachedProducts) {
      res.json(JSON.parse(cachedProducts));
    } else {
      const products = await fetchProductsFromDatabase();
      await redisClient.set('products', JSON.stringify(products));
      res.json(products);
    }
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/products/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const { rows } = await pool.query('SELECT * FROM Products WHERE ProductID = $1', [productId]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error('Error retrieving product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/products', async (req, res) => {
  const { name, description, price, stockQuantity } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO products (name, description, price, stockquantity) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, price, stockQuantity]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});