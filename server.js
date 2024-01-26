const express = require('express');
const mongoose = require('mongoose');
const thoughtRoutes = require('./routes/thought-routes');
const userRoutes = require('./routes/user-routes');
const connection = require('./config/connection.js');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/thoughts', thoughtRoutes);

// Default route for invalid endpoints
app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
