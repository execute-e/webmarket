const CategoryService = require('./category-service');
const ProductService = require('../product/product-service');

class CategoryController {
    async getCategories(req, res, next) {
        try {
            const categories = await CategoryService.getCategories();
            return res.json(categories);
        } catch(err) {
            next(err);
        }
    }

    async getCategoryProducts(req, res, next) {
        try {
            const { categorySlug } = req.params;
            const page = parseInt(req.query.page, 10) || 1;
            const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);

            const appliedFilters = this.parseFilters(req.query);

            const result = await ProductService.getProductsByCategory(
                categorySlug, limit, page, appliedFilters
            );

            return res.json(result);
        } catch(err) {
            if (err.message === 'Category not found') {
                return res.status(404).json({ error: err.message });
            }
            next(err);
        }
    }

    parseFilters(query) {
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
}

module.exports = new CategoryController();