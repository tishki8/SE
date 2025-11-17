const { Sequelize } = require('sequelize');
require('dotenv').config();

// Fallbacks so it still works even if .env is missing or broken
const DB_NAME = process.env.DB_NAME || 'ecommerce_db';       // or 'ecommerce' if that's your DB name
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'NewPassword123!';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3306;

console.log('Using DB config:', {
  DB_NAME,
  DB_USER,
  DB_HOST,
  DB_PORT,
});

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Database connected successfully');
  } catch (error) {
    console.error('Unable to connect to database:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
