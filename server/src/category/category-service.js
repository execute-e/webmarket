const { Category, CategoryFilter, Product, ProductSpec } = require('../model');

class CategoryService {
    async getCategories() {
        return await Category.findAll({
            order: [['name', 'ASC']]
        });
    }

    async getCategoryBySlug(slug) {
        return await Category.findOne({
            where: {slug},
            include: [{
                model: CategoryFilter,
                as: 'filters',
                order: [['order', 'ASC']]
            }]
        });
    }

    async getCategoryFilters(categoryId) {
        return await CategoryFilter.findAll({
            where: {categoryId},
            order: [['order', 'ASC']]
        });
    }

    async getFilterValues(categoryId, filterKey) {
        const filter = await CategoryFilter.findOne({
            where: {categoryId, filterKey}
        });

        if (!filter) return [];

        if (filter.values && filter.values.length > 0) {
            return filter.values;
        }

        return await this.getDynamicFilterValues(categoryId, filterKey);
    }

    async getDynamicFilterValues(categoryId, filterKey) {
        if (filterKey.startsWith('spec.')) {
            const specKey = filterKey.replace('spec.', '');

            const specs = await ProductSpec.findAll({
                include: [{
                    model: Product,
                    where: {categoryId},
                    attributes: []
                }],
                where: {key: specKey},
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('value')), 'value']
                ],
                raw: true
            });

            return specs.map(spec => spec.value).filter(Boolean);
        }

        return await this.getProductFieldValues(categoryId, filterKey);
    }

    async getProductFieldValues(categoryId, field) {
        const products = await Product.findAll({
            where: {categoryId},
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col(field)), 'value']
            ],
            raw: true
        });

        return products.map(p => p.value).filter(Boolean);
    }

    async initializeDefaultCategories() {
        const categories = [
            {
                name: 'Смартфоны',
                slug: 'smartphones',
                description: 'Мобильные телефоны и смартфоны',
                filters: [
                    {
                        filterKey: 'brand',
                        filterName: 'Бренд',
                        filterType: 'checkbox',
                        order: 1
                    },
                    {
                        filterKey: 'spec.memory',
                        filterName: 'Встроенная память',
                        filterType: 'checkbox',
                        values: ['512 ГБ', '256 ГБ', '128 ГБ', '64 ГБ', '32 ГБ'],
                        order: 2
                    },
                    {
                        filterKey: 'spec.ram',
                        filterName: 'Оперативная память',
                        filterType: 'checkbox',
                        values: ['1 ГБ', '2 ГБ', '4 ГБ', '6 ГБ', '8 ГБ', '12 ГБ', '16 ГБ'],
                        order: 3
                    },
                    {
                        filterKey: 'spec.cores',
                        filterName: 'Количество ядер',
                        filterType: 'checkbox',
                        values: ['4', '6', '8', '10', '12'],
                        order: 4
                    },
                    {
                        filterKey: 'price',
                        filterName: 'Цена',
                        filterType: 'range',
                        order: 0
                    }
                ]
            },
            {
                name: 'Ноутбуки',
                slug: 'laptops',
                description: 'Ноутбуки и ультрабуки',
                filters: [
                    {
                        filterKey: 'brand',
                        filterName: 'Бренд',
                        filterType: 'checkbox',
                        order: 1
                    },
                    {
                        filterKey: 'spec.screen_size',
                        filterName: 'Диагональ экрана',
                        filterType: 'checkbox',
                        values: ['13"', '14"', '15"', '16"', '17"'],
                        order: 2
                    },
                    {
                        filterKey: 'spec.processor',
                        filterName: 'Процессор',
                        filterType: 'checkbox',
                        order: 3
                    },
                    {
                        filterKey: 'spec.ram',
                        filterName: 'Оперативная память',
                        filterType: 'checkbox',
                        values: ['8 ГБ', '16 ГБ', '32 ГБ', '64 ГБ'],
                        order: 4
                    },
                    {
                        filterKey: 'price',
                        filterName: 'Цена',
                        filterType: 'range',
                        order: 0
                    }
                ]
            },
            {
                name: 'Наушники',
                slug: 'headphones',
                description: 'Наушники и гарнитуры',
                filters: [
                    {
                        filterKey: 'brand',
                        filterName: 'Бренд',
                        filterType: 'checkbox',
                        order: 1
                    },
                    {
                        filterKey: 'spec.type',
                        filterName: 'Тип наушников',
                        filterType: 'checkbox',
                        values: ['Вкладыши', 'Накладные', 'Полноразмерные', 'TWS'],
                        order: 2
                    },
                    {
                        filterKey: 'spec.connection',
                        filterName: 'Тип подключения',
                        filterType: 'checkbox',
                        values: ['Проводные', 'Беспроводные'],
                        order: 3
                    },
                    {
                        filterKey: 'price',
                        filterName: 'Цена',
                        filterType: 'range',
                        order: 0
                    }
                ]
            }
        ];
    }
}
module.exports = new CategoryService();