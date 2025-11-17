const ProductService = require("./product-service");
const { validate } = require('uuid');

class ProductController {
    async getProducts(req, res, next) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);

            const filters = {
                category: req.query.category,
                minPrice: req.query.minPrice,
                maxPrice: req.query.maxPrice,
                inStock: req.query.inStock,
                onSale: req.query.onSale,
                isFeatured: req.query.isFeatured,
                sort: req.query.sort
            };

            const products = await ProductService.getProducts(limit, page, filters);

            return res.json(products);
        } catch(err) {
            next(err);
        }
    }

    async getProductById(req, res, next) {
        try {
            const id = req.params.id;

            if (!validate(id)) {
                return res.status(400).json({ error: 'Invalid product ID format' });
            }

            const product = await ProductService.getProductById(id);

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            return res.json(product);
        } catch(err) {
            next(err);
        }
    }

    async searchProducts(req, res, next) {
        try {
            const { q: query, page, limit, sort, category, minPrice, maxPrice, inStock } = req.query;

            if (!query || query.trim() === '') {
                return res.status(400).json({ error: 'Search query is required' });
            }

            const pageNum = parseInt(page, 10) || 1;
            const limitNum = Math.min(parseInt(limit, 10) || 10, 50);

            const filters = {
                category,
                minPrice,
                maxPrice,
                inStock,
                sort
            };

            const results = await ProductService.searchProducts(query.trim(), limitNum, pageNum, filters);

            return res.json({
                ...results,
                searchQuery: query
            });
        } catch(err) {
            next(err);
        }
    }

    async getProductsByCategory(req, res, next) {
        try {
            const { category } = req.params;
            const page = parseInt(req.query.page, 10) || 1;
            const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);

            const appliedFilters = this.parseCategoryFilters(req.query);

            const result = await ProductService.getProductsByCategory(category, limit, page, appliedFilters);

            return res.json(result);
        } catch(err) {
            if (err.message === 'Category not found') {
                return res.status(404).json({ error: err.message });
            }
            next(err);
        }
    }

    parseCategoryFilters(query) {
        const filters = {};

        if (query.minPrice) filters.minPrice = query.minPrice;
        if (query.maxPrice) filters.maxPrice = query.maxPrice;

        if (query.brands) {
            filters.brands = Array.isArray(query.brands)
                ? query.brands
                : [query.brands];
        }

        if (query.sort) filters.sort = query.sort;

        filters.specs = {};
        for (const [key, value] of Object.entries(query)) {
            if (key.startsWith('spec_')) {
                const specKey = key.replace('spec_', '');
                filters.specs[specKey] = Array.isArray(value) ? value : [value];
            }
        }

        return filters;
    }

    async createProduct(req, res, next) {
        try {
            const productData = req.body;

            if (!productData.name || !productData.price) {
                return res.status(400).json({
                    error: 'Product name and price are required'
                });
            }

            const product = await ProductService.createProduct(productData);

            return res.status(201).json(product);
        } catch(err) {
            next(err);
        }
    }

    async updateProduct(req, res, next) {
        try {
            const id = req.params.id;
            const productData = req.body;

            if (!validate(id)) {
                return res.status(400).json({ error: 'Invalid product ID format' });
            }

            const updatedProduct = await ProductService.updateProduct(id, productData);

            return res.json(updatedProduct);
        } catch(err) {
            if (err.message === 'Product not found') {
                return res.status(404).json({ error: err.message });
            }
            next(err);
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const id = req.params.id;

            if (!validate(id)) {
                return res.status(400).json({ error: 'Invalid product ID format' });
            }

            const result = await ProductService.deleteProduct(id);

            return res.json(result);
        } catch(err) {
            if (err.message === 'Product not found') {
                return res.status(404).json({ error: err.message });
            }
            next(err);
        }
    }

    async getFeaturedProducts(req, res, next) {
        try {
            const limit = Math.min(parseInt(req.query.limit, 10) || 10, 20);

            const products = await ProductService.getFeaturedProducts(limit);

            return res.json(products);
        } catch(err) {
            next(err);
        }
    }

    async getProductsOnSale(req, res, next) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);

            const products = await ProductService.getProductsOnSale(limit, page);

            return res.json(products);
        } catch(err) {
            next(err);
        }
    }

    async getCategories(req, res, next) {
        try {
            const categories = await ProductService.getCategories();

            return res.json(categories);
        } catch(err) {
            next(err);
        }
    }
}

module.exports = new ProductController();