const express = require('express');
const router = express.Router();
const { getRoutes } = require('../controller/trafficController');

router.get('/route', getRoutes); // Change POST to GET

module.exports = router;