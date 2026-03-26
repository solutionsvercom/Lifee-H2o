const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// 🔥 Catch hidden errors
process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
    console.error("❌ Unhandled Rejection:", err);
});

const app = express();

// ✅ Try loading routes safely
let emailRoutes;
try {
    emailRoutes = require('./routes/email');
    console.log("✅ Email routes loaded");
} catch (err) {
    console.error("❌ Error loading email routes:", err);
}

app.use(compression());

// Response timing + cache headers for GETs
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        console.log(`${req.method} ${req.path} ${Date.now() - start}ms`);
    });
    if (req.method === 'GET') {
        res.set('Cache-Control', 'public, max-age=300');
    }
    next();
});

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        error: 'Too many requests, please try again later.',
    },
});

// CORS
app.use(
    cors({
        origin: [
            'http://localhost:3000',
            'http://localhost:5173',
            /^http:\/\/localhost:\d+$/,
            /^http:\/\/127\.0\.0\.1:\d+$/,
        ],
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

app.use(express.json({ limit: '25mb' }));
app.use('/api', limiter);

// ✅ Use routes only if loaded
if (emailRoutes) {
    app.use('/api/email', emailRoutes);
}

app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Backend is working!',
        smtp: process.env.SMTP_USER ? 'Configured' : 'Not configured',
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'LIFEE Backend Running' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    if (err && err.type === 'entity.too.large') {
        return res.status(413).json({
            success: false,
            error: 'Uploaded image is too large. Please use a smaller image.',
        });
    }
    console.error("🔥 Server Error:", err.stack);
    res.status(500).json({ success: false, error: 'Server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 LIFEE Backend running on http://localhost:${PORT}`);
});
