const express = require('express');
const { getCart, addToCart, updateCartItem, removeFromCart } = require('../controllers/cartController');

const router = express.Router();

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove', removeFromCart);

module.exports = router;
