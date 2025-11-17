const { Product, ProductColor, ProductSpec, Category, CategoryFilter, sequelize } = require('./../model/index');
const { Op } = require('sequelize');

class ProductService {
    async getProducts(limit, page, filters = {}) {
        const offset = (page - 1) * limit;
        const where = this.buildWhereClause(filters);

        const result = await Product.findAndCountAll({
            limit,
            offset,
            distinct: true,
            where,
            include: [
                {
                    model: ProductColor,
                    as: 'colors',
                    attributes: ['name', 'hexCode', 'isAvailable']
                },
                {
                    model: ProductSpec,
                    as: 'specs',
                    attributes: ['key', 'value']
                },
                {
                    model: Category,
                    attributes: ['id', 'name', 'slug']
                }
            ],
            order: this.buildOrderClause(filters.sort)
        });

        return {
            items: result.rows,
            pagination: {
                page,
                limit,
                total: result.count,
                totalPages: Math.ceil(result.count / limit)
            }
        };
    }

    async getProductById(id) {
        const product = await Product.findByPk(id, {
            include: [
                {
                    model: ProductColor,
                    as: 'colors',
                    attributes: ['name', 'hexCode', 'isAvailable']
                },
                {
                    model: ProductSpec,
                    as: 'specs',
                    attributes: ['key', 'value']
                },
                {
                    model: Category,
                    attributes: ['id', 'name', 'slug']
                }
            ]
        });

        return product;
    }

    async searchProducts(query, limit, page, filters = {}) {
        const offset = (page - 1) * limit;
        const searchWhere = this.buildSearchWhereClause(query);
        const filterWhere = this.buildWhereClause(filters);

        const where = {
            [Op.and]: [searchWhere, filterWhere]
        };

        const result = await Product.findAndCountAll({
            limit,
            offset,
            distinct: true,
            where,
            include: [
                {
                    model: ProductColor,
                    as: 'colors',
                    attributes: ['name', 'hexCode', 'isAvailable']
                },
                {
                    model: ProductSpec,
                    as: 'specs',
                    attributes: ['key', 'value']
                },
                {
                    model: Category,
                    attributes: ['id', 'name', 'slug']
                }
            ],
            order: this.buildOrderClause(filters.sort)
        });

        return {
            items: result.rows,
            pagination: {
                page,
                limit,
                total: result.count,
                totalPages: Math.ceil(result.count / limit)
            }
        };
    }

    async getProductsByCategory(categorySlug, limit, page, appliedFilters = {}) {
        const offset = (page - 1) * limit;

        const category = await Category.findOne({
            where: { slug: categorySlug },
            include: [{
                model: CategoryFilter,
                as: 'filters',
                order: [['order', 'ASC']]
            }]
        });

        if (!category) {
            throw new Error('Category not found');
        }

        const where = {
            categoryId: category.id,
            ...this.buildCategoryFiltersWhere(category.id, appliedFilters)
        };

        const result = await Product.findAndCountAll({
            limit,
            offset,
            distinct: true,
            where,
            include: [
                {
                    model: ProductColor,
                    as: 'colors',
                    attributes: ['name', 'hexCode', 'isAvailable']
                },
                {
                    model: ProductSpec,
                    as: 'specs',
                    attributes: ['key', 'value']
                }
            ],
            order: this.buildOrderClause(appliedFilters.sort)
        });

        const availableFilters = await this.getAvailableFilters(category.id, appliedFilters);

        return {
            items: result.rows,
            pagination: {
                page,
                limit,
                total: result.count,
                totalPages: Math.ceil(result.count / limit)
            },
            category: {
                id: category.id,
                name: category.name,
                slug: category.slug,
                description: category.description
            },
            availableFilters
        };
    }

    async getAvailableFilters(categoryId, appliedFilters) {
        const filters = await CategoryFilter.findAll({
            where: { categoryId },
            order: [['order', 'ASC']]
        });

        const availableFilters = {};

        for (const filter of filters) {
            const values = await this.getFilterValues(categoryId, filter.filterKey, appliedFilters);

            availableFilters[filter.filterKey] = {
                name: filter.filterName,
                type: filter.filterType,
                values: values
            };
        }

        return availableFilters;
    }

    async getFilterValues(categoryId, filterKey, appliedFilters) {
        const filterConfig = await CategoryFilter.findOne({
            where: { categoryId, filterKey }
        });

        if (filterConfig.values && filterConfig.values.length > 0) {
            const valuesWithCount = [];

            for (const value of filterConfig.values) {
                const count = await this.getProductsCountWithFilter(categoryId, filterKey, value, appliedFilters);
                valuesWithCount.push({
                    value,
                    count,
                    label: value
                });
            }

            return valuesWithCount;
        }

        return await this.getDynamicFilterValues(categoryId, filterKey, appliedFilters);
    }

    async getDynamicFilterValues(categoryId, filterKey, appliedFilters) {
        let query = 'SELECT DISTINCT ';

        if (filterKey === 'brand') {
            query += 'brand as value FROM products WHERE "categoryId" = :categoryId';
        } else if (filterKey.startsWith('spec.')) {
            const specKey = filterKey.replace('spec.', '');
            query = `SELECT DISTINCT ps.value 
                     FROM product_specs ps 
                     JOIN products p ON ps."productId" = p.id 
                     WHERE p."categoryId" = :categoryId AND ps.key = :specKey`;
        }

        const [results] = await sequelize.query(query, {
            replacements: {
                categoryId,
                specKey: filterKey.replace('spec.', '')
            },
            type: sequelize.QueryTypes.SELECT
        });

        const valuesWithCount = [];
        for (const result of results) {
            const count = await this.getProductsCountWithFilter(categoryId, filterKey, result.value, appliedFilters);
            valuesWithCount.push({
                value: result.value,
                count,
                label: result.value
            });
        }

        return valuesWithCount;
    }

    async getProductsCountWithFilter(categoryId, filterKey, filterValue, appliedFilters) {
        let where = { categoryId };

        where = { ...where, ...this.buildSingleFilterWhere(filterKey, filterValue, appliedFilters) };

        return await Product.count({ where });
    }

    buildSingleFilterWhere(filterKey, filterValue, appliedFilters) {
        const where = {};

        if (filterKey === 'brand') {
            where.brand = filterValue;
        } else if (filterKey.startsWith('spec.')) {
            const specKey = filterKey.replace('spec.', '');
        }

        if (appliedFilters.brands && appliedFilters.brands.length > 0) {
            where.brand = where.brand
                ? { [Op.and]: [where.brand, { [Op.in]: appliedFilters.brands }] }
                : { [Op.in]: appliedFilters.brands };
        }

        if (appliedFilters.minPrice || appliedFilters.maxPrice) {
            where.price = {};
            if (appliedFilters.minPrice) where.price[Op.gte] = parseFloat(appliedFilters.minPrice);
            if (appliedFilters.maxPrice) where.price[Op.lte] = parseFloat(appliedFilters.maxPrice);
        }

        return where;
    }

    buildCategoryFiltersWhere(categoryId, filters) {
        const where = {};

        if (filters.minPrice || filters.maxPrice) {
            where.price = {};
            if (filters.minPrice) where.price[Op.gte] = parseFloat(filters.minPrice);
            if (filters.maxPrice) where.price[Op.lte] = parseFloat(filters.maxPrice);
        }

        if (filters.brands && filters.brands.length > 0) {
            where.brand = { [Op.in]: filters.brands };
        }

        if (filters.specs && Object.keys(filters.specs).length > 0) {
            where[Op.and] = where[Op.and] || [];

            for (const [specKey, specValues] of Object.entries(filters.specs)) {
                if (specValues && specValues.length > 0) {
                    where[Op.and].push(
                        sequelize.literal(`EXISTS (
                            SELECT 1 FROM product_specs 
                            WHERE product_specs."productId" = "Product".id 
                            AND product_specs.key = '${specKey}' 
                            AND product_specs.value IN ('${specValues.join("','")}')
                        )`)
                    );
                }
            }
        }

        return where;
    }

    async createProduct(productData) {
        const transaction = await sequelize.transaction();

        try {
            const { colors, specs, ...productMainData } = productData;

            const product = await Product.create(productMainData, { transaction });

            if (colors && colors.length > 0) {
                const productColors = colors.map(color => ({
                    ...color,
                    productId: product.id
                }));
                await ProductColor.bulkCreate(productColors, { transaction });
            }

            if (specs && specs.length > 0) {
                const productSpecs = specs.map(spec => ({
                    ...spec,
                    productId: product.id
                }));
                await ProductSpec.bulkCreate(productSpecs, { transaction });
            }

            await transaction.commit();

            return await this.getProductById(product.id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async updateProduct(id, productData) {
        const transaction = await sequelize.transaction();

        try {
            const { colors, specs, ...productMainData } = productData;

            const product = await Product.findByPk(id, { transaction });
            if (!product) {
                throw new Error('Product not found');
            }

            await product.update(productMainData, { transaction });

            if (colors) {
                await ProductColor.destroy({ where: { productId: id }, transaction });
                if (colors.length > 0) {
                    const productColors = colors.map(color => ({
                        ...color,
                        productId: id
                    }));
                    await ProductColor.bulkCreate(productColors, { transaction });
                }
            }

            if (specs) {
                await ProductSpec.destroy({ where: { productId: id }, transaction });
                if (specs.length > 0) {
                    const productSpecs = specs.map(spec => ({
                        ...spec,
                        productId: id
                    }));
                    await ProductSpec.bulkCreate(productSpecs, { transaction });
                }
            }

            await transaction.commit();

            return await this.getProductById(id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async deleteProduct(id) {
        const product = await Product.findByPk(id);
        if (!product) {
            throw new Error('Product not found');
        }

        await product.destroy();
        return { message: 'Product deleted successfully' };
    }

    async getFeaturedProducts(limit = 10) {
        return await Product.findAll({
            limit,
            where: {
                isFeatured: true,
                inStock: true
            },
            include: [
                {
                    model: ProductColor,
                    as: 'colors',
                    attributes: ['name', 'hexCode', 'isAvailable']
                },
                {
                    model: Category,
                    attributes: ['id', 'name', 'slug']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
    }

    async getProductsOnSale(limit, page) {
        return await this.getProducts(limit, page, {
            onSale: true
        });
    }

    async getCategories() {
        return await Category.findAll({
            attributes: ['id', 'name', 'slug', 'description', 'imageUrl'],
            order: [['name', 'ASC']]
        });
    }

    buildWhereClause(filters) {
        const where = {};

        if (filters.category) {
            where.category = {
                [Op.iLike]: `%${filters.category}%`
            };
        }

        if (filters.minPrice || filters.maxPrice) {
            where.price = {};
            if (filters.minPrice) {
                where.price[Op.gte] = parseFloat(filters.minPrice);
            }
            if (filters.maxPrice) {
                where.price[Op.lte] = parseFloat(filters.maxPrice);
            }
        }

        if (filters.inStock !== undefined) {
            where.inStock = filters.inStock === 'true';
        }

        if (filters.onSale === 'true') {
            where.discountPrice = {
                [Op.not]: null,
                [Op.lt]: sequelize.col('price')
            };
        }

        if (filters.isFeatured !== undefined) {
            where.isFeatured = filters.isFeatured === 'true';
        }

        return where;
    }

    buildSearchWhereClause(query) {
        return {
            [Op.or]: [
                { name: { [Op.iLike]: `%${query}%` } },
                { description: { [Op.iLike]: `%${query}%` } },
                { '$specs.value$': { [Op.iLike]: `%${query}%` } }
            ]
        };
    }

    buildOrderClause(sort) {
        const orderMap = {
            'price_asc': [['price', 'ASC']],
            'price_desc': [['price', 'DESC']],
            'name_asc': [['name', 'ASC']],
            'name_desc': [['name', 'DESC']],
            'newest': [['createdAt', 'DESC']],
            'oldest': [['createdAt', 'ASC']],
            'discount': [[sequelize.literal('(price - COALESCE("discountPrice", price))'), 'DESC']]
        };

        return orderMap[sort] || [['createdAt', 'DESC']];
    }
}

module.exports = new ProductService();