import express from 'express';
import { getUtilities } from '../controller/utilityController.js';

const router = express.Router();

router.get('/utilities', getUtilities);

export default router;
