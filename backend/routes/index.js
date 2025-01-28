const express = require('express');
const chatRoutes = require('./chatRoutes.js');

const router = express.Router();

router.use('/chat', chatRoutes);


module.exports = router;