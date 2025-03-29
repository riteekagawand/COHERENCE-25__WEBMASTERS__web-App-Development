import express from 'express';
import { getRoutes } from '../controller/trafficController.js';

const router = express.Router();

router.get('/route', getRoutes); // Change POST to GET

export default router;
