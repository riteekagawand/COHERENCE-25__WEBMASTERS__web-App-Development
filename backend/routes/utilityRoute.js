const express = require('express');
const router = express.Router();
const { getUtilities } = require('../controller/utilityController');

router.get('/', getUtilities);

module.exports = router;