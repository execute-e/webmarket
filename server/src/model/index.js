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
        validate: {
            isEmail: true
        }
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
        references: {
            model: 'users',
            key: 'id'
        }
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

User.hasMany(Token, { foreignKey: 'userId', onDelete: 'CASCADE' });
Token.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

async function createDatabaseIfNotExists() {
    try {
        await adminSequelize.authenticate();
        console.log('Подключились к служебной БД "postgres"');

        const [results] = await adminSequelize.query(`
            SELECT 1 FROM pg_database WHERE datname = $1
        `, { bind: [process.env.DB_NAME] });

        if (results.length === 0) {
            console.log(`База данных "${process.env.DB_NAME}" не найдена — создаём...`);
            await adminSequelize.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
            console.log(`База "${process.env.DB_NAME}" успешно создана!`);
        } else {
            console.log(`База данных "${process.env.DB_NAME}" уже существует`);
        }
    } catch (error) {
        console.error('Ошибка при создании базы данных:', error.message);
        throw error;
    } finally {
        await adminSequelize.close();
    }
}

async function initializeDatabase() {
    try {
        await createDatabaseIfNotExists();

        await sequelize.authenticate();
        console.log('PostgreSQL: подключение к рабочей БД установлено');

        await sequelize.sync({ alter: true });
        console.log('Таблицы синхронизированы (users, tokens)');

    } catch (error) {
        console.error('Ошибка инициализации базы данных:', error.message);
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
            console.log(`🗑Таблица "${table}" удалена`);
        }

        console.log('База данных полностью очищена!');
    } catch (error) {
        console.error('Ошибка при очистке базы:', error.message);
        throw error;
    }
}

async function closeDatabase() {
    try {
        await sequelize.close();
        console.log('Соединение с базой данных закрыто');
    } catch (error) {
        console.error('Ошибка при закрытии соединения:', error.message);
    }
}

module.exports = {
    sequelize,
    User,
    Token,
    initializeDatabase,
    closeDatabase,
    clearDatabase
};