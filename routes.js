const express = require('express');
const userRoutes = require('./routes/user-routes');
const thoughtRoutes = require('./routes/thought-routes');

const router = express.Router();

router.use('/api/users', userRoutes);
router.use('/api/thoughts', thoughtRoutes);

module.exports = router;
