require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const rateLimit  = require('express-rate-limit');
const path       = require('path');
const connectDB  = require('./config/db');

connectDB();

const app = express();

// Ensure uploads directory exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('[*] Created missing uploads directory');
}

// ── Middleware ──
app.use(cors({ origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });
app.use('/api/', limiter);


// ── Routes ──
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/authority',  require('./routes/authority'));

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: Date.now() }));

// ── Start ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
