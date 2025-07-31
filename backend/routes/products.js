const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Product routes
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/search', productController.searchProducts);
router.get('/categories', productController.getCategories);
router.get('/brands', productController.getBrands);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/:id', productController.getProduct);

// Admin routes (you can add middleware for admin authentication later)
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router; 