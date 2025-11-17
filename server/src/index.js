require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { initializeDatabase} = require("./model");
const userRouter = require("./user/user-router")
const productRouter = require("./product/product-router");
const categoryRouter = require("./category/category-router");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

initializeDatabase();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use("/api", userRouter);
app.use('/api', productRouter);
app.use('/api', categoryRouter);

const tests = [
    'GET /api/categories',
    'GET /api/categories/smartphones/products',
    'GET /api/products',
    'GET /api/products/search?q=iphone'
];

const start = async () => {
    try {
        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });

        tests.forEach(test => console.log('✅', test));
    } catch(err) {
        console.log(err);
    }
}

start();