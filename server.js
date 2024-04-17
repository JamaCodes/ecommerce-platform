require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const redis = require('redis');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');


const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redisClient.connect()

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3001'
};
app.use(cors(corsOptions));
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});




app.post('/webhook', async (req, res) => {
  const payload = req.body;
  const signature = req.headers['stripe-signature'];
  const endpointSecret = "whsec_b2f88d5c616fd4bfade64a47c276500b80731dd483c87f5eda11268bcfe79407";

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      // Update your database or perform any necessary actions
      console.log('Payment succeeded:', paymentIntent.id);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.sendStatus(400);
  }
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

app.get('/', (req, res) => {
  res.send('Hello from Express!');
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