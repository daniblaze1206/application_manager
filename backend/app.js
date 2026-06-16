const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./src/configs/db');

const authRouter = require('./src/routes/authRouter');
const appRouter = require('./src/routes/appRouter');
const authMiddleware = require('./src/middlewares/auth');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use('/api/auth', authRouter);
app.use('/api/application', authMiddleware, appRouter);

module.exports = app;