const { Cart, CartItem, Product } = require('../models');

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({
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

    if (!cart) {
      cart = await Cart.create({ userId });
      // Fetch the newly created cart with includes
      cart = await Cart.findOne({
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
    }

    const totalAmount = (cart.items || []).reduce((sum, item) => {
      return sum + parseFloat(item.price) * item.quantity;
    }, 0);

    res.status(200).json({
      cart,
      totalAmount: totalAmount.toFixed(2)
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error fetching cart' });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    const existingItem = await CartItem.findOne({
      where: { cartId: cart.id, productId }
    });

    // Calculate total quantity that will be in cart after this operation
    const totalQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    if (product.stockQuantity < totalQuantity) {
      return res.status(400).json({ 
        message: `Insufficient stock. Available: ${product.stockQuantity}, Requested: ${totalQuantity}` 
      });
    }

    const price = product.discountPrice || product.price;

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = price;
      await existingItem.save();
    } else {
      await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
        price
      });
    }

    const updatedCart = await Cart.findOne({
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

    res.status(200).json({
      message: 'Product added to cart',
      cart: updatedCart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error adding to cart' });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Valid product ID and quantity are required' });
    }

    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItem = await CartItem.findOne({
      where: { productId, cartId: cart.id },
      include: [{ model: Product, as: 'product' }]
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (cartItem.product.stockQuantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    const updatedCart = await Cart.findOne({
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

    res.status(200).json({
      message: 'Cart item updated',
      cart: updatedCart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error updating cart' });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItem = await CartItem.findOne({
      where: { productId, cartId: cart.id }
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await cartItem.destroy();

    const updatedCart = await Cart.findOne({
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

    res.status(200).json({
      message: 'Item removed from cart',
      cart: updatedCart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error removing from cart' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
