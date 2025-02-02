const express = require('express');
const { getOpenaiResponseFromPrompt, getTargetCv } = require('../controllers/openaiChatController.js');


const router = express.Router();

router.post('/', getOpenaiResponseFromPrompt);
router.post('/targetcv', getTargetCv);


module.exports = router;