const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const adminSequelize = new Sequelize('postgres', process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
});

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false
    }
);

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'users',
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

const Token = sequelize.define('Token', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    refreshToken: {
        type: DataTypes.TEXT,
        unique: true,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'tokens',
    timestamps: false
});

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'categories'
});

const CategoryFilter = sequelize.define('CategoryFilter', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'categories', key: 'id' }
    },
    filterKey: {
        type: DataTypes.STRING,
        allowNull: false
    },
    filterName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    filterType: {
        type: DataTypes.ENUM('checkbox', 'range', 'select'),
        defaultValue: 'checkbox'
    },
    values: {
        type: DataTypes.JSONB,
        defaultValue: []
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'category_filters'
});

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    discountPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    inStock: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    sku: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    weight: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true
    },
    dimensions: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rating: {
        type: DataTypes.DECIMAL(2, 1),
        defaultValue: 0,
        validate: {
            min: 0,
            max: 5
        }
    },
    reviewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    categoryId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'categories', key: 'id' }
    }
}, {
    tableName: 'products',
    timestamps: true,
    paranoid: true
});

const ProductColor = sequelize.define('ProductColor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'products', key: 'id' }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hexCode: {
        type: DataTypes.STRING(7),
        allowNull: true,
        validate: {
            is: /^#[0-9A-F]{6}$/i
        }
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'product_colors',
    timestamps: false
});

const ProductSpec = sequelize.define('ProductSpec', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'products', key: 'id' }
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'product_specs',
    timestamps: false
});

function setupAssociations() {
    User.hasMany(Token, { foreignKey: 'userId', onDelete: 'CASCADE' });
    Token.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

    Category.hasMany(Product, { foreignKey: 'categoryId' });
    Product.belongsTo(Category, { foreignKey: 'categoryId' });

    Category.hasMany(CategoryFilter, { foreignKey: 'categoryId', as: 'filters' });
    CategoryFilter.belongsTo(Category, { foreignKey: 'categoryId' });

    Product.hasMany(ProductColor, { foreignKey: 'productId', onDelete: 'CASCADE' });
    ProductColor.belongsTo(Product, { foreignKey: 'productId', onDelete: 'CASCADE' });

    Product.hasMany(ProductSpec, { foreignKey: 'productId', onDelete: 'CASCADE' });
    ProductSpec.belongsTo(Product, { foreignKey: 'productId', onDelete: 'CASCADE' });
}

setupAssociations();

async function createDatabaseIfNotExists() {
    try {
        await adminSequelize.authenticate();
        console.log('Подключились к служебной БД "postgres"');

        const [results] = await adminSequelize.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            { bind: [process.env.DB_NAME] }
        );

        if (results.length === 0) {
            console.log(`База данных "${process.env.DB_NAME}" не найдена — создаём...`);
            await adminSequelize.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
            console.log(`База "${process.env.DB_NAME}" успешно создана!`);
        } else {
            console.log(`База данных "${process.env.DB_NAME}" уже существует`);
        }
    } catch (error) {
        console.error('Ошибка при создании БД:', error.message);
        throw error;
    } finally {
        await adminSequelize.close();
    }
}

async function initializeDatabase() {
    try {
        await createDatabaseIfNotExists();

        await sequelize.authenticate();
        console.log('Подключение к рабочей БД установлено');

        await sequelize.sync({ alter: true });
        console.log('Таблицы синхронизированы: users, tokens, products, product_colors, product_specs, categories, category_filters');

        const CategoryService = require('../category/category-service');
        await CategoryService.initializeDefaultCategories();
        console.log('Категории инициализированы');

    } catch (error) {
        console.error('Ошибка инициализации БД:', error.message);
        process.exit(1);
    }
}

async function clearDatabase() {
    try {
        console.log('Начинаем очистку базы данных...');

        const [tables] = await sequelize.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
              AND table_type = 'BASE TABLE'
        `);

        const tableNames = tables
            .map(row => row.table_name)
            .filter(name => !name.includes('sequelize'));

        if (tableNames.length === 0) {
            console.log('Таблицы не найдены — база уже пустая');
            return;
        }

        for (const table of tableNames) {
            await sequelize.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
            console.log(`🗑 Таблица "${table}" удалена`);
        }

        console.log('База данных полностью очищена!');
    } catch (error) {
        console.error('Ошибка при очистке:', error.message);
        throw error;
    }
}

async function closeDatabase() {
    try {
        await sequelize.close();
        console.log('Соединение с базой данных закрыто');
    } catch (error) {
        console.error('Ошибка при закрытии:', error.message);
    }
}

module.exports = {
    sequelize,
    adminSequelize,
    User,
    Token,
    Category,
    CategoryFilter,
    Product,
    ProductColor,
    ProductSpec,
    initializeDatabase,
    closeDatabase,
    clearDatabase
};