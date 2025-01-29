const express = require('express');
const { getOpenaiResponseFromPrompt } = require('../controllers/openaiChatController.js');


const router = express.Router();

router.post('/', getOpenaiResponseFromPrompt);


module.exports = router;