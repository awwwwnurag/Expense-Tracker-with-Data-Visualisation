const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session'); // Required for Passport sessions
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

// Load Passport config
require('./config/passport');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // Body parser for JSON

// Express session middleware (needed for Passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 