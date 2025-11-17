# E-Commerce Full-Stack Application

A modern, Flipkart-like e-commerce website built with Node.js, Express, MySQL, React, and Material UI.

## Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **MySQL** - Database
- **Sequelize** - ORM
- **JWT** + **bcrypt** - Authentication & password hashing

### Frontend
- **React** - UI library
- **React Router DOM** - Routing
- **Material UI (MUI)** - UI components and styling
- **Axios** - HTTP client

## Project Structure

```
SE/
├── server/              # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/      # Database configuration
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Auth & error handling
│   │   ├── models/      # Sequelize models
│   │   ├── routes/      # API routes
│   │   └── server.js    # Entry point
│   └── package.json
├── client/              # Frontend (React)
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── context/     # React context (Auth)
│   │   ├── pages/      # Page components
│   │   ├── utils/       # Utilities (API client)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file in `/server` directory:**
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=ecommerce_db
   DB_PORT=3306
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   ```

4. **Create MySQL database:**
   ```sql
   CREATE DATABASE ecommerce_db;
   ```

5. **Run migrations to create tables:**
   ```bash
   npm run db:migrate
   ```
   Or start the server (it will sync models automatically):
   ```bash
   npm run dev
   ```

6. **Start the backend server:**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products (with query params: search, category, page, limit)
- `GET /api/products/:id` - Get product by ID

### Cart (Protected)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add product to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove` - Remove item from cart

### Addresses (Protected)
- `GET /api/addresses` - Get user's addresses
- `POST /api/addresses` - Create new address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

### Orders (Protected)
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID

## Features

### User Features
- User registration and login
- Product browsing with search and filters
- Shopping cart management
- Address management
- Order placement and tracking
- Order history

### Admin Features
- Product management (via API)

## Database Models

- **User** - User accounts
- **Product** - Product catalog
- **Cart** - User shopping carts
- **CartItem** - Items in cart
- **Address** - Shipping addresses
- **Order** - Orders
- **OrderItem** - Items in orders

## Notes

- The product table is empty by default. You can import your dataset later.
- Payment simulation: All orders are automatically set to "PAID" status (no real payment gateway).
- JWT tokens are stored in localStorage on the frontend.
- Protected routes require authentication.

## Development

- Backend uses `nodemon` for auto-reload during development
- Frontend uses Vite for fast HMR (Hot Module Replacement)
- CORS is enabled for frontend-backend communication

## Production Build

### Backend
```bash
cd server
npm start
```

### Frontend
```bash
cd client
npm run build
npm run preview
```

## Troubleshooting

1. **Database connection error**: Check your MySQL credentials in `.env`
2. **Port already in use**: Change PORT in `.env` or kill the process using the port
3. **CORS errors**: Ensure backend CORS is configured correctly
4. **JWT errors**: Check JWT_SECRET in `.env`

## License

ISC
