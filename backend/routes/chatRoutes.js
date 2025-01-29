const express = require('express');


const router = express.Router();

router.post('/', ((req, res) => console.log('request received', req)))


module.exports = router;