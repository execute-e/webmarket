const Router = require('express');
const ProductController = require('./product-controller');
const productRouter = new Router();

productRouter.get('/products', ProductController.getProducts);
productRouter.get('/products/featured', ProductController.getFeaturedProducts);
productRouter.get('/products/sale', ProductController.getProductsOnSale);
productRouter.get('/products/categories', ProductController.getCategories);
productRouter.get('/products/category/:category', ProductController.getProductsByCategory);
productRouter.get('/products/search', ProductController.searchProducts);
productRouter.get('/products/:id', ProductController.getProductById);

productRouter.post('/products', ProductController.createProduct);
productRouter.put('/products/:id', ProductController.updateProduct);
productRouter.delete('/products/:id', ProductController.deleteProduct);

module.exports = productRouter;