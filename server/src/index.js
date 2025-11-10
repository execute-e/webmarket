require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { initializeDatabase} = require("./model");

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

const start = async () => {
    try {
        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    } catch(err) {
        console.log(err);
    }
}

start();