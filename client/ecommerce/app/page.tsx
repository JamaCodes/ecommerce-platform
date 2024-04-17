'use client';

import { Box, Button, Grid, Heading, Image, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Product {
  productid: number;
  name: string;
  description: string;
  price: number;
  stockquantity: number;
  createdat: string;
  updatedat: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/products', {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const handleCheckout = async () => {
    try {
      const response = await axios.post('http://localhost:3000/create-payment-intent', {
        amount: calculateTotalAmount(),
        currency: 'usd',
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });
      const { clientSecret } = response.data;
      // Redirect to Stripe Checkout 
      // Stripe Checkout integration 
    } catch (error) {
      console.error('Error creating payment intent:', error);
    }
  };

  const calculateTotalAmount = () => {
    return cart.reduce((total, product) => total + product.price, 0) * 100; // Amount in cents
  };

  useEffect(() => {
    fetchProducts();
    console.log('Cart:', cart);
  }, []);

  return (
    <Box>
      <Heading as="h1" mb={8}>
        Sticker Shop
      </Heading>
      <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={8}>
        {products.map((product) => (
          <Box key={product.productid} borderWidth={1} borderRadius="lg" p={4}>
            <Image src={`/images/${product.productid}.jpg`} alt={product.name} mb={4} />
            <Heading as="h3" size="md" mb={2}>
              {product.name}
            </Heading>
            <Text mb={2}>{product.description}</Text>
            <Text fontWeight="bold" mb={4}>
              Price: ${product.price}
            </Text>
            <Text mb={4}>Stock Quantity: {product.stockquantity}</Text>
            <Button colorScheme="blue" onClick={() => addToCart(product)}>
              Add to Cart
            </Button>
          </Box>
        ))}
      </Grid>
      <Box mt={8}>
        <Heading as="h2" size="lg" mb={4}>
          Cart
        </Heading>
        {cart.map((product) => (
          <Text key={product.productid} mb={2}>
            {product.name} - ${product.price}
          </Text>
        ))}
        <Text fontWeight="bold" mb={4}>
          Total: ${calculateTotalAmount() / 100}
        </Text>
        <Button colorScheme="green" onClick={handleCheckout}>
          Checkout
        </Button>
      </Box>
    </Box>
  );
}