const { Order, OrderItem, Cart, CartItem, Product, Address } = require('../models');
const { sequelize } = require('../config/database');

const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { addressId, paymentMethod = 'COD' } = req.body;

    if (!addressId) {
      return res.status(400).json({ message: 'Address ID is required' });
    }

    if (!['COD', 'ONLINE'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    const address = await Address.findOne({
      where: { id: addressId, userId }
    });

    if (!address) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Address not found' });
    }

    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ]
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Cart is empty' });
    }

    for (const item of cart.items) {
      if (item.product.stockQuantity < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          message: `Insufficient stock for ${item.product.name}`
        });
      }
    }

    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + parseFloat(item.price) * item.quantity;
    }, 0);

    // Simulate payment success - always set to PAID
    const status = 'PAID';

    const order = await Order.create(
      {
        userId,
        addressId,
        totalAmount: totalAmount.toFixed(2),
        paymentMethod,
        status
      },
      { transaction }
    );

    for (const item of cart.items) {
      const subtotal = parseFloat(item.price) * item.quantity;
      await OrderItem.create(
        {
          orderId: order.id,
          productId: item.productId,
          productName: item.product.name,
          price: item.price,
          quantity: item.quantity,
          subtotal: subtotal.toFixed(2)
        },
        { transaction }
      );

      await Product.update(
        { stockQuantity: sequelize.literal(`stockQuantity - ${item.quantity}`) },
        { where: { id: item.productId }, transaction }
      );
    }

    await CartItem.destroy({
      where: { cartId: cart.id },
      transaction
    });

    await transaction.commit();

    const createdOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'items'
        },
        {
          model: Address,
          as: 'address'
        }
      ]
    });

    res.status(201).json({
      message: 'Order placed successfully',
      order: createdOrder
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error creating order' });
  }
};

const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: 'items'
        },
        {
          model: Address,
          as: 'address'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const order = await Order.findOne({
      where: { id, userId },
      include: [
        {
          model: OrderItem,
          as: 'items'
        },
        {
          model: Address,
          as: 'address'
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error fetching order' });
  }
};

module.exports = { createOrder, getOrders, getOrderById };
