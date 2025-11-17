const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  addressId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'addresses',
      key: 'id'
    }
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.ENUM('COD', 'ONLINE'),
    allowNull: false,
    defaultValue: 'COD'
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
    allowNull: false,
    defaultValue: 'PENDING'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'orders',
  timestamps: true
});

module.exports = Order;
