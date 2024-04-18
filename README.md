# E-commerce Platform with Next.js, Express, PostgreSQL, Redis, and Stripe Integration

This project is a simple e-commerce platform built using Next.js for the frontend, Express for the backend, PostgreSQL as the primary database, Redis for caching, and Stripe for payment processing. The application allows users to browse products, add them to the cart, and proceed to checkout using Stripe.

## Features

- Product listing page with images, descriptions, and prices
- Add products to the cart
- Cart functionality with total amount calculation
- Stripe integration for secure payment processing
- Dockerized environment for easy setup and deployment

## Technologies Used

- Next.js (frontend)
- Express (backend)
- PostgreSQL (primary database)
- Redis (caching)
- Stripe (payment processing)
- Docker (containerization)

## Getting Started

### Prerequisites

- Docker
- Node.js
- Stripe account with publishable and secret keys

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/ecommerce-platform.git
   ```

2. Navigate to the project directory:

   ```
   cd ecommerce-platform
   ```

3. Replace a `.env` file in the root directory and add your Stripe keys:

   ```
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```


4. Build and start the Docker containers:

   ```
   npm run docker:up
   ```

5. Access the application in your browser at `http://localhost:3001`.

## Project Structure

- `client/ecommerce`: Next.js frontend application
- `server.js`: Express backend server
- `docker-compose.yml`: Docker Compose configuration file
- `init.sql`: SQL script to initialize the PostgreSQL database

## Usage

1. Open the application in your browser at `http://localhost:3001`.
2. Browse the available products on the homepage.
3. Click the "Add to Cart" button to add products to the cart.
4. Click the "Checkout" button to proceed to the Stripe Checkout page.
5. Complete the payment process using test credit card details.
6. Upon successful payment, you will be redirected to the success page.

## Redis Caching (To be implemented)

Redis caching can be used to improve the performance of the application by caching frequently accessed data. In this project, Redis is set up as a Docker service, but the caching functionality is not yet implemented. You can extend the project to utilize Redis for caching product data or other relevant information.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.



- [Next.js](https://nextjs.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [Stripe](https://stripe.com/)
- [Docker](https://www.docker.com/)
