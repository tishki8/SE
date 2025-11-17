# E-commerce Backend API

Node.js + Express + MySQL + Sequelize backend for Indian e-commerce platform.

## Folder Structure

```
server/
├── src/
│   ├── config/
│   │   ├── database.js       # MySQL connection config
│   │   └── migrate.js        # Database migration script
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── addressController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   ├── auth.js           # JWT authentication middleware
│   │   └── errorHandler.js   # Error handling middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── CartItem.js
│   │   ├── Address.js
│   │   ├── Order.js
│   │   ├── OrderItem.js
│   │   └── index.js          # Model associations
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── addressRoutes.js
│   │   └── orderRoutes.js
│   └── server.js             # Main server file
├── .env                       # Environment variables
├── .env.example              # Example environment variables
├── package.json
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Edit the `.env` file with your MySQL credentials:

```
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=ecommerce_db
DB_USER=root
DB_PASSWORD=your_mysql_password

JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
```

### 3. Create MySQL Database

Create a new MySQL database:

```sql
CREATE DATABASE ecommerce_db;
```

### 4. Run Database Migration

This will create all tables with proper relationships:

```bash
npm run db:migrate
```

### 5. Start the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user

### Products
- `GET /products` - Get all products (with pagination, search, filters)
- `GET /products/:id` - Get product by ID

### Cart (Protected)
- `GET /cart` - Get user cart
- `POST /cart/add` - Add item to cart
- `PUT /cart/update` - Update cart item quantity
- `DELETE /cart/remove/:itemId` - Remove item from cart

### Addresses (Protected)
- `GET /addresses` - Get all user addresses
- `POST /addresses` - Create new address
- `PUT /addresses/:id` - Update address
- `DELETE /addresses/:id` - Delete address

### Orders (Protected)
- `POST /orders` - Create new order (COD/ONLINE payment)
- `GET /orders` - Get all user orders
- `GET /orders/:id` - Get order by ID

## Authentication

Protected routes require JWT token in Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Payment Simulation

Both COD and ONLINE payment methods are simulated:
- COD: Order created with PENDING payment status
- ONLINE: Order created with COMPLETED payment status

## Database Schema

### Users
- id, name, email, password (hashed), phone

### Products
- id, name, brand, category, subcategory, description, price, discountPrice, image, stock, rating, reviewCount

### Carts & CartItems
- Cart: id, userId
- CartItem: id, cartId, productId, quantity, price

### Addresses
- id, userId, fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault

### Orders & OrderItems
- Order: id, userId, addressId, totalAmount, paymentMethod, paymentStatus, orderStatus, orderDate, deliveryDate
- OrderItem: id, orderId, productId, quantity, price

## Notes

- Product table is empty by default (ready for Flipkart dataset import)
- Passwords are automatically hashed using bcrypt
- JWT tokens expire in 7 days (configurable)
- All protected routes validate JWT token
- Cart is automatically created when user signs up
- Stock is automatically reduced when order is placed
