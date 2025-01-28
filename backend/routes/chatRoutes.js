const express = require('express');


const router = express.Router();

router.post('/', (() => console.log('request received')))


module.exports = router;