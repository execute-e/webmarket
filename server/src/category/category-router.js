const Router = require('express');
const CategoryController = require('./category-controller');
const categoryRouter = new Router();

categoryRouter.get('/categories', CategoryController.getCategories);
categoryRouter.get('/categories/:categorySlug/products', CategoryController.getCategoryProducts);

module.exports = categoryRouter;